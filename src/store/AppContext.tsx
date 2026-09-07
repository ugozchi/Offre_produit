// ============================================
// Store — Local data management with Context
// ============================================

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product, Category, ConfigBlock, Option, Simulation, CostSummary, RoleHourlyRates } from '../types';
import {
  promogamingProduct,
  promogamingCategories,
  promogamingBlocks,
  promogamingOptions,
} from '../data/promogaming';
import { v4 as uuidv4 } from 'uuid';
import {
  isSupabaseConfigured,
  fetchStateFromSupabase,
  seedSupabaseIfEmpty,
  subscribeToSupabase,
  dbUpsertProduct,
  dbDeleteProduct,
  dbUpsertCategory,
  dbDeleteCategory,
  dbUpsertBlock,
  dbDeleteBlock,
  dbUpsertOption,
  dbDeleteOption,
  dbUpsertSimulation,
  dbDeleteSimulation,
  dbUpsertRates,
} from '../lib/supabase';

// ---- State ----
interface AppState {
  products: Product[];
  categories: Category[];
  blocks: ConfigBlock[];
  options: Option[];
  simulations: Simulation[];
  rates: RoleHourlyRates;
}

const defaultRates: RoleHourlyRates = {
  devHourlyRate: 60,
  salesHourlyRate: 45,
  designHourlyRate: 50,
  csmHourlyRate: 40,
  baHourlyRate: 55,
};

// ---- Actions ----
type Action =
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BLOCK'; payload: Omit<ConfigBlock, 'id'> }
  | { type: 'UPDATE_BLOCK'; payload: ConfigBlock }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'ADD_OPTION'; payload: Omit<Option, 'id'> }
  | { type: 'UPDATE_OPTION'; payload: Option }
  | { type: 'DELETE_OPTION'; payload: string }
  | { type: 'ADD_SIMULATION'; payload: Omit<Simulation, 'id' | 'createdAt'> }
  | { type: 'DELETE_SIMULATION'; payload: string }
  | { type: 'UPDATE_RATES'; payload: RoleHourlyRates }
  | { type: 'LOAD_STATE'; payload: AppState };

// ---- LocalStorage helpers ----
const STORAGE_KEY = 'offre_produit_data';

function loadFromStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.rates) parsed.rates = defaultRates;
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage', e);
  }
  return null;
}

function saveToStorage(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save to localStorage', e);
  }
}

// ---- Initial State ----
function getInitialState(): AppState {
  const stored = loadFromStorage();
  if (stored && stored.products.length > 0) return stored;
  return {
    products: [promogamingProduct],
    categories: promogamingCategories,
    blocks: promogamingBlocks,
    options: promogamingOptions,
    simulations: [],
    rates: defaultRates,
  };
}

// ---- Reducer ----
function appReducer(state: AppState, action: Action): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newProduct: Product = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newState = {
        ...state,
        products: [...state.products, newProduct],
      };
      dbUpsertProduct(newProduct);
      break;
    }
    case 'UPDATE_PRODUCT': {
      const updatedProduct: Product = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      newState = {
        ...state,
        products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
      };
      dbUpsertProduct(updatedProduct);
      break;
    }
    case 'DELETE_PRODUCT': {
      const catIds = state.categories.filter((c) => c.productId === action.payload).map((c) => c.id);
      const blockIds = state.blocks.filter((b) => catIds.includes(b.categoryId)).map((b) => b.id);
      newState = {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        categories: state.categories.filter((c) => c.productId !== action.payload),
        blocks: state.blocks.filter((b) => !catIds.includes(b.categoryId)),
        options: state.options.filter((o) => !blockIds.includes(o.blockId)),
        simulations: state.simulations.filter((s) => s.productId !== action.payload),
      };
      dbDeleteProduct(action.payload);
      break;
    }
    case 'ADD_CATEGORY': {
      const newCategory: Category = { ...action.payload, id: uuidv4() };
      newState = {
        ...state,
        categories: [...state.categories, newCategory],
      };
      dbUpsertCategory(newCategory);
      break;
    }
    case 'UPDATE_CATEGORY': {
      newState = {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
      dbUpsertCategory(action.payload);
      break;
    }
    case 'DELETE_CATEGORY': {
      const blkIds = state.blocks.filter((b) => b.categoryId === action.payload).map((b) => b.id);
      newState = {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
        blocks: state.blocks.filter((b) => b.categoryId !== action.payload),
        options: state.options.filter((o) => !blkIds.includes(o.blockId)),
      };
      dbDeleteCategory(action.payload);
      break;
    }
    case 'ADD_BLOCK': {
      const newBlock: ConfigBlock = { ...action.payload, id: uuidv4() };
      newState = {
        ...state,
        blocks: [...state.blocks, newBlock],
      };
      dbUpsertBlock(newBlock);
      break;
    }
    case 'UPDATE_BLOCK': {
      newState = {
        ...state,
        blocks: state.blocks.map((b) => (b.id === action.payload.id ? action.payload : b)),
      };
      dbUpsertBlock(action.payload);
      break;
    }
    case 'DELETE_BLOCK': {
      newState = {
        ...state,
        blocks: state.blocks.filter((b) => b.id !== action.payload),
        options: state.options.filter((o) => o.blockId !== action.payload),
      };
      dbDeleteBlock(action.payload);
      break;
    }
    case 'ADD_OPTION': {
      const newOption: Option = { ...action.payload, id: uuidv4() };
      newState = {
        ...state,
        options: [...state.options, newOption],
      };
      dbUpsertOption(newOption);
      break;
    }
    case 'UPDATE_OPTION': {
      newState = {
        ...state,
        options: state.options.map((o) => (o.id === action.payload.id ? action.payload : o)),
      };
      dbUpsertOption(action.payload);
      break;
    }
    case 'DELETE_OPTION': {
      newState = {
        ...state,
        options: state.options.filter((o) => o.id !== action.payload),
      };
      dbDeleteOption(action.payload);
      break;
    }
    case 'ADD_SIMULATION': {
      const newSim: Simulation = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      newState = {
        ...state,
        simulations: [...state.simulations, newSim],
      };
      dbUpsertSimulation(newSim);
      break;
    }
    case 'DELETE_SIMULATION': {
      newState = {
        ...state,
        simulations: state.simulations.filter((s) => s.id !== action.payload),
      };
      dbDeleteSimulation(action.payload);
      break;
    }
    case 'UPDATE_RATES': {
      newState = {
        ...state,
        rates: action.payload,
      };
      dbUpsertRates(action.payload);
      break;
    }
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  saveToStorage(newState);
  return newState;
}

// ---- Context ----
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Computed helpers
  getProductCategories: (productId: string) => Category[];
  getCategoryBlocks: (categoryId: string) => ConfigBlock[];
  getBlockOptions: (blockId: string) => Option[];
  calculateCost: (optionIds: string[]) => CostSummary;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Load initial data and subscribe to Supabase Realtime changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    fetchStateFromSupabase().then((remoteState) => {
      if (!isMounted) return;
      if (remoteState && remoteState.products.length > 0) {
        dispatch({ type: 'LOAD_STATE', payload: remoteState });
      } else {
        seedSupabaseIfEmpty(state);
      }
    });

    const unsubscribe = subscribeToSupabase((remoteState) => {
      if (isMounted && remoteState) {
        dispatch({ type: 'LOAD_STATE', payload: remoteState });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const getProductCategories = useCallback(
    (productId: string) =>
      state.categories
        .filter((c) => c.productId === productId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.categories]
  );

  const getCategoryBlocks = useCallback(
    (categoryId: string) =>
      state.blocks
        .filter((b) => b.categoryId === categoryId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.blocks]
  );

  const getBlockOptions = useCallback(
    (blockId: string) =>
      state.options
        .filter((o) => o.blockId === blockId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.options]
  );

  const calculateCost = useCallback(
    (optionIds: string[]): CostSummary => {
      const selectedOptions = state.options.filter((o) => optionIds.includes(o.id));
      const blockIds = [...new Set(selectedOptions.map((o) => o.blockId))];
      const blocks = state.blocks.filter((b) => blockIds.includes(b.id));

      const totalDevHours =
        blocks.reduce((sum, b) => sum + (b.devTimeHours || 0), 0) +
        selectedOptions.reduce((sum, o) => sum + (o.devTimeHours || 0), 0);

      const totalSalesHours =
        blocks.reduce((sum, b) => sum + (b.salesTimeHours || 0), 0) +
        selectedOptions.reduce((sum, o) => sum + (o.salesTimeHours || 0), 0);

      const totalDesignHours =
        blocks.reduce((sum, b) => sum + (b.designTimeHours || 0), 0) +
        selectedOptions.reduce((sum, o) => sum + (o.designTimeHours || 0), 0);

      const totalCsmHours =
        blocks.reduce((sum, b) => sum + (b.csmTimeHours || 0), 0) +
        selectedOptions.reduce((sum, o) => sum + (o.csmTimeHours || 0), 0);

      const totalBaHours =
        blocks.reduce((sum, b) => sum + (b.baTimeHours || 0), 0) +
        selectedOptions.reduce((sum, o) => sum + (o.baTimeHours || 0), 0);

      const totalInfraCost =
        blocks.reduce((sum, b) => sum + b.infraCostMonthly, 0) +
        selectedOptions.reduce((sum, o) => sum + o.infraCostMonthly, 0);

      const totalProductionCost = selectedOptions.reduce(
        (sum, o) => sum + o.productionCost,
        0
      );

      const devCostTotal = totalDevHours * (state.rates?.devHourlyRate ?? 60);
      const salesCostTotal = totalSalesHours * (state.rates?.salesHourlyRate ?? 45);
      const designCostTotal = totalDesignHours * (state.rates?.designHourlyRate ?? 50);
      const csmCostTotal = totalCsmHours * (state.rates?.csmHourlyRate ?? 40);
      const baCostTotal = totalBaHours * (state.rates?.baHourlyRate ?? 55);

      const totalCost =
        devCostTotal +
        salesCostTotal +
        designCostTotal +
        csmCostTotal +
        baCostTotal +
        totalInfraCost +
        totalProductionCost;

      return {
        totalDevHours,
        totalSalesHours,
        totalDesignHours,
        totalCsmHours,
        totalBaHours,
        devCostTotal,
        salesCostTotal,
        designCostTotal,
        csmCostTotal,
        baCostTotal,
        totalInfraCost,
        totalProductionCost,
        totalCost,
      };
    },
    [state.options, state.blocks, state.rates]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getProductCategories,
        getCategoryBlocks,
        getBlockOptions,
        calculateCost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
