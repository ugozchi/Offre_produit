// ============================================
// Offre Produit — Types & Interfaces
// ============================================

export type Complexity = 'simple' | 'moyen' | 'complexe';

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  productId: string;
  name: string;
  color: string;
  sortOrder: number;
}

export interface ConfigBlock {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  devTimeHours: number;
  salesTimeHours: number;
  designTimeHours: number;
  csmTimeHours: number;
  baTimeHours: number;
  infraCostMonthly: number;
  complexity: Complexity;
  dependencies: string[];
  notes: string;
  sortOrder: number;
}

export interface Option {
  id: string;
  blockId: string;
  name: string;
  devTimeHours: number;
  salesTimeHours: number;
  designTimeHours: number;
  csmTimeHours: number;
  baTimeHours: number;
  infraCostMonthly: number;
  productionCost: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface Simulation {
  id: string;
  productId: string;
  name: string;
  selectedOptionIds: string[];
  totalDevHours: number;
  totalSalesHours: number;
  totalDesignHours: number;
  totalCsmHours: number;
  totalBaHours: number;
  totalInfraCost: number;
  totalProductionCost: number;
  createdAt: string;
}

export interface RoleHourlyRates {
  devHourlyRate: number;
  salesHourlyRate: number;
  designHourlyRate: number;
  csmHourlyRate: number;
  baHourlyRate: number;
}

// Backwards compatibility alias
export type RoleRates = RoleHourlyRates;

export interface CostSummary {
  totalDevHours: number;
  totalSalesHours: number;
  totalDesignHours: number;
  totalCsmHours: number;
  totalBaHours: number;
  devCostTotal: number;
  salesCostTotal: number;
  designCostTotal: number;
  csmCostTotal: number;
  baCostTotal: number;
  totalInfraCost: number;
  totalProductionCost: number;
  totalCost: number;
}

export interface BlockWithOptions extends ConfigBlock {
  options: Option[];
}

export interface CategoryWithBlocks extends Category {
  blocks: BlockWithOptions[];
}

export interface ProductWithCategories extends Product {
  categories: CategoryWithBlocks[];
}
