import { createClient } from '@supabase/supabase-js';
import type { Product, Category, ConfigBlock, Option, Simulation, RoleHourlyRates } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface FullAppState {
  products: Product[];
  categories: Category[];
  blocks: ConfigBlock[];
  options: Option[];
  simulations: Simulation[];
  rates: RoleHourlyRates;
}

// ---- Fetch full state from Supabase ----
export async function fetchStateFromSupabase(): Promise<FullAppState | null> {
  if (!supabase) return null;

  try {
    const [productsRes, catRes, blocksRes, optionsRes, simRes, ratesRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('config_blocks').select('*'),
      supabase.from('options').select('*'),
      supabase.from('simulations').select('*'),
      supabase.from('role_rates').select('*').maybeSingle(),
    ]);

    if (productsRes.error) {
      console.warn('[Supabase] Error fetching products:', productsRes.error);
      return null;
    }

    const products: Product[] = (productsRes.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      icon: p.icon || '📦',
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString(),
    }));

    const categories: Category[] = (catRes.data || []).map((c) => ({
      id: c.id,
      productId: c.product_id,
      name: c.name,
      color: c.color || '#3B82F6',
      sortOrder: c.sort_order ?? 0,
    }));

    const blocks: ConfigBlock[] = (blocksRes.data || []).map((b) => ({
      id: b.id,
      categoryId: b.category_id,
      name: b.name,
      description: b.description || '',
      devTimeHours: Number(b.dev_time_hours || 0),
      salesTimeHours: Number(b.sales_time_hours || 0),
      designTimeHours: Number(b.design_time_hours || 0),
      csmTimeHours: Number(b.csm_time_hours || 0),
      baTimeHours: Number(b.ba_time_hours || 0),
      infraCostMonthly: Number(b.infra_cost_monthly || 0),
      complexity: b.complexity || 'simple',
      dependencies: Array.isArray(b.dependencies) ? b.dependencies : [],
      notes: b.notes || '',
      sortOrder: b.sort_order ?? 0,
    }));

    const options: Option[] = (optionsRes.data || []).map((o) => ({
      id: o.id,
      blockId: o.block_id,
      name: o.name,
      devTimeHours: Number(o.dev_time_hours || 0),
      salesTimeHours: Number(o.sales_time_hours || 0),
      designTimeHours: Number(o.design_time_hours || 0),
      csmTimeHours: Number(o.csm_time_hours || 0),
      baTimeHours: Number(o.ba_time_hours || 0),
      infraCostMonthly: Number(o.infra_cost_monthly || 0),
      productionCost: Number(o.production_cost || 0),
      isDefault: Boolean(o.is_default),
      sortOrder: o.sort_order ?? 0,
    }));

    const simulations: Simulation[] = (simRes.data || []).map((s) => ({
      id: s.id,
      productId: s.product_id,
      name: s.name,
      selectedOptionIds: Array.isArray(s.selected_option_ids) ? s.selected_option_ids : [],
      totalDevHours: Number(s.total_dev_hours || 0),
      totalSalesHours: Number(s.total_sales_hours || 0),
      totalDesignHours: Number(s.total_design_hours || 0),
      totalCsmHours: Number(s.total_csm_hours || 0),
      totalBaHours: Number(s.total_ba_hours || 0),
      totalInfraCost: Number(s.total_infra_cost || 0),
      totalProductionCost: Number(s.total_production_cost || 0),
      createdAt: s.created_at || new Date().toISOString(),
    }));

    const ratesData = ratesRes.data;
    const rates: RoleHourlyRates = ratesData
      ? {
          devHourlyRate: Number(ratesData.dev_hourly_rate ?? 60),
          salesHourlyRate: Number(ratesData.sales_hourly_rate ?? 45),
          designHourlyRate: Number(ratesData.design_hourly_rate ?? 50),
          csmHourlyRate: Number(ratesData.csm_hourly_rate ?? 40),
          baHourlyRate: Number(ratesData.ba_hourly_rate ?? 55),
        }
      : {
          devHourlyRate: 60,
          salesHourlyRate: 45,
          designHourlyRate: 50,
          csmHourlyRate: 40,
          baHourlyRate: 55,
        };

    return { products, categories, blocks, options, simulations, rates };
  } catch (err) {
    console.error('[Supabase] Failed to fetch state:', err);
    return null;
  }
}

// ---- Seed Supabase dataset if database empty ----
export async function seedSupabaseIfEmpty(state: FullAppState) {
  if (!supabase) return;

  try {
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (count !== null && count > 0) return; // Database already populated

    console.log('[Supabase] Seeding database with initial state...');

    if (state.products.length > 0) {
      await supabase.from('products').insert(
        state.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          icon: p.icon,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        }))
      );
    }

    if (state.categories.length > 0) {
      await supabase.from('categories').insert(
        state.categories.map((c) => ({
          id: c.id,
          product_id: c.productId,
          name: c.name,
          color: c.color,
          sort_order: c.sortOrder,
        }))
      );
    }

    if (state.blocks.length > 0) {
      await supabase.from('config_blocks').insert(
        state.blocks.map((b) => ({
          id: b.id,
          category_id: b.categoryId,
          name: b.name,
          description: b.description,
          dev_time_hours: b.devTimeHours,
          sales_time_hours: b.salesTimeHours,
          design_time_hours: b.designTimeHours,
          csm_time_hours: b.csmTimeHours,
          ba_time_hours: b.baTimeHours,
          infra_cost_monthly: b.infraCostMonthly,
          complexity: b.complexity,
          dependencies: b.dependencies,
          notes: b.notes,
          sort_order: b.sortOrder,
        }))
      );
    }

    if (state.options.length > 0) {
      await supabase.from('options').insert(
        state.options.map((o) => ({
          id: o.id,
          block_id: o.blockId,
          name: o.name,
          dev_time_hours: o.devTimeHours,
          sales_time_hours: o.salesTimeHours,
          design_time_hours: o.designTimeHours,
          csm_time_hours: o.csmTimeHours,
          ba_time_hours: o.baTimeHours,
          infra_cost_monthly: o.infraCostMonthly,
          production_cost: o.productionCost,
          is_default: o.isDefault,
          sort_order: o.sortOrder,
        }))
      );
    }

    if (state.rates) {
      await supabase.from('role_rates').upsert({
        id: 'default',
        dev_hourly_rate: state.rates.devHourlyRate,
        sales_hourly_rate: state.rates.salesHourlyRate,
        design_hourly_rate: state.rates.designHourlyRate,
        csm_hourly_rate: state.rates.csmHourlyRate,
        ba_hourly_rate: state.rates.baHourlyRate,
      });
    }

    console.log('[Supabase] Initial seeding done!');
  } catch (err) {
    console.error('[Supabase] Seeding failed:', err);
  }
}

// ---- Sync helper for state mutations ----
export async function syncStateToSupabase(state: FullAppState) {
  if (!supabase) return;

  try {
    // 1. Upsert products
    for (const p of state.products) {
      await supabase.from('products').upsert({
        id: p.id,
        name: p.name,
        description: p.description,
        icon: p.icon,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      });
    }

    // Delete removed products
    const prodIds = state.products.map((p) => p.id);
    if (prodIds.length > 0) {
      const { data: dbProds } = await supabase.from('products').select('id');
      if (dbProds) {
        const toDelete = dbProds.filter((p) => !prodIds.includes(p.id)).map((p) => p.id);
        if (toDelete.length > 0) {
          await supabase.from('products').delete().in('id', toDelete);
        }
      }
    }

    // 2. Upsert categories
    for (const c of state.categories) {
      await supabase.from('categories').upsert({
        id: c.id,
        product_id: c.productId,
        name: c.name,
        color: c.color,
        sort_order: c.sortOrder,
      });
    }

    // Delete removed categories
    const catIds = state.categories.map((c) => c.id);
    if (catIds.length > 0) {
      const { data: dbCats } = await supabase.from('categories').select('id');
      if (dbCats) {
        const toDelete = dbCats.filter((c) => !catIds.includes(c.id)).map((c) => c.id);
        if (toDelete.length > 0) {
          await supabase.from('categories').delete().in('id', toDelete);
        }
      }
    }

    // 3. Upsert blocks
    for (const b of state.blocks) {
      await supabase.from('config_blocks').upsert({
        id: b.id,
        category_id: b.categoryId,
        name: b.name,
        description: b.description,
        dev_time_hours: b.devTimeHours,
        sales_time_hours: b.salesTimeHours,
        design_time_hours: b.designTimeHours,
        csm_time_hours: b.csmTimeHours,
        ba_time_hours: b.baTimeHours,
        infra_cost_monthly: b.infraCostMonthly,
        complexity: b.complexity,
        dependencies: b.dependencies,
        notes: b.notes,
        sort_order: b.sortOrder,
      });
    }

    // Delete removed blocks
    const blockIds = state.blocks.map((b) => b.id);
    if (blockIds.length > 0) {
      const { data: dbBlocks } = await supabase.from('config_blocks').select('id');
      if (dbBlocks) {
        const toDelete = dbBlocks.filter((b) => !blockIds.includes(b.id)).map((b) => b.id);
        if (toDelete.length > 0) {
          await supabase.from('config_blocks').delete().in('id', toDelete);
        }
      }
    }

    // 4. Upsert options
    for (const o of state.options) {
      await supabase.from('options').upsert({
        id: o.id,
        block_id: o.blockId,
        name: o.name,
        dev_time_hours: o.devTimeHours,
        sales_time_hours: o.salesTimeHours,
        design_time_hours: o.designTimeHours,
        csm_time_hours: o.csmTimeHours,
        ba_time_hours: o.baTimeHours,
        infra_cost_monthly: o.infraCostMonthly,
        production_cost: o.productionCost,
        is_default: o.isDefault,
        sort_order: o.sortOrder,
      });
    }

    // Delete removed options
    const optionIds = state.options.map((o) => o.id);
    if (optionIds.length > 0) {
      const { data: dbOptions } = await supabase.from('options').select('id');
      if (dbOptions) {
        const toDelete = dbOptions.filter((o) => !optionIds.includes(o.id)).map((o) => o.id);
        if (toDelete.length > 0) {
          await supabase.from('options').delete().in('id', toDelete);
        }
      }
    }

    // 5. Upsert simulations
    for (const s of state.simulations) {
      await supabase.from('simulations').upsert({
        id: s.id,
        product_id: s.productId,
        name: s.name,
        selected_option_ids: s.selectedOptionIds,
        total_dev_hours: s.totalDevHours,
        total_sales_hours: s.totalSalesHours,
        total_design_hours: s.totalDesignHours,
        total_csm_hours: s.totalCsmHours,
        total_ba_hours: s.totalBaHours,
        total_infra_cost: s.totalInfraCost,
        total_production_cost: s.totalProductionCost,
        created_at: s.createdAt,
      });
    }

    // Delete removed simulations
    const simIds = state.simulations.map((s) => s.id);
    const { data: dbSims } = await supabase.from('simulations').select('id');
    if (dbSims) {
      const toDelete = dbSims.filter((s) => !simIds.includes(s.id)).map((s) => s.id);
      if (toDelete.length > 0) {
        await supabase.from('simulations').delete().in('id', toDelete);
      }
    }

    // 6. Upsert rates
    if (state.rates) {
      await supabase.from('role_rates').upsert({
        id: 'default',
        dev_hourly_rate: state.rates.devHourlyRate,
        sales_hourly_rate: state.rates.salesHourlyRate,
        design_hourly_rate: state.rates.designHourlyRate,
        csm_hourly_rate: state.rates.csmHourlyRate,
        ba_hourly_rate: state.rates.baHourlyRate,
      });
    }
  } catch (err) {
    console.error('[Supabase] Sync failed:', err);
  }
}

// ---- Realtime subscription ----
export function subscribeToSupabase(onStateChange: (newState: FullAppState) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('app-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      fetchStateFromSupabase().then((remoteState) => {
        if (remoteState) {
          onStateChange(remoteState);
        }
      });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
