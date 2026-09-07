// ============================================
// Dependency Engine — Graph & Path Utilities
// ============================================

import type { ConfigBlock, Option } from '../types';

export interface MissingDependencyIssue {
  blockId: string;
  blockName: string;
  missingPrereqIds: string[];
  missingPrereqNames: string[];
}

export interface ImpactMetrics {
  directDependentsCount: number;
  totalDependentsCount: number;
  criticalPathHours: number;
  impactScore: number; // 0 to 100%
}

/**
 * Returns all upstream required blocks (direct and transitive) for a given block ID.
 */
export function getUpstreamBlockIds(
  blockId: string,
  blocks: ConfigBlock[],
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(blockId)) return [];
  visited.add(blockId);

  const block = blocks.find((b) => b.id === blockId);
  if (!block || !block.dependencies || block.dependencies.length === 0) {
    return [];
  }

  const result = new Set<string>();
  for (const depId of block.dependencies) {
    result.add(depId);
    const transitive = getUpstreamBlockIds(depId, blocks, visited);
    transitive.forEach((id) => result.add(id));
  }

  return Array.from(result);
}

/**
 * Returns all downstream dependent blocks (blocks that directly or transitively rely on blockId).
 */
export function getDownstreamBlockIds(
  blockId: string,
  blocks: ConfigBlock[],
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(blockId)) return [];
  visited.add(blockId);

  const result = new Set<string>();
  for (const b of blocks) {
    if (b.dependencies && b.dependencies.includes(blockId)) {
      result.add(b.id);
      const transitive = getDownstreamBlockIds(b.id, blocks, visited);
      transitive.forEach((id) => result.add(id));
    }
  }

  return Array.from(result);
}

/**
 * Calculates impact metrics for a block within a product.
 */
export function getBlockImpactMetrics(
  blockId: string,
  blocks: ConfigBlock[]
): ImpactMetrics {
  const directDependents = blocks.filter(
    (b) => b.dependencies && b.dependencies.includes(blockId)
  );
  const totalDependents = getDownstreamBlockIds(blockId, blocks);

  const block = blocks.find((b) => b.id === blockId);
  const blockTotalHours = block
    ? (block.devTimeHours || 0) +
      (block.salesTimeHours || 0) +
      (block.designTimeHours || 0) +
      (block.csmTimeHours || 0) +
      (block.baTimeHours || 0)
    : 0;

  const totalProductBlocks = Math.max(1, blocks.length - 1);
  const impactScore = Math.round(
    (totalDependents.length / totalProductBlocks) * 100
  );

  return {
    directDependentsCount: directDependents.length,
    totalDependentsCount: totalDependents.length,
    criticalPathHours: blockTotalHours,
    impactScore,
  };
}

/**
 * Validates selected options against block dependencies.
 * Returns missing prerequisites and suggested option IDs to resolve them.
 */
export function analyzeSimulationDependencies(
  selectedOptionIds: string[],
  blocks: ConfigBlock[],
  options: Option[]
): {
  issues: MissingDependencyIssue[];
  suggestedMissingOptionIds: string[];
  totalMissingHours: number;
} {
  // Find which blocks are active based on selected options
  const activeBlockIds = new Set(
    options
      .filter((o) => selectedOptionIds.includes(o.id))
      .map((o) => o.blockId)
  );

  const issues: MissingDependencyIssue[] = [];
  const requiredMissingBlockIds = new Set<string>();

  activeBlockIds.forEach((blockId) => {
    const upstreamIds = getUpstreamBlockIds(blockId, blocks);
    const missing = upstreamIds.filter((id) => !activeBlockIds.has(id));

    if (missing.length > 0) {
      const block = blocks.find((b) => b.id === blockId);
      const missingNames = missing.map((mId) => {
        const mBlock = blocks.find((b) => b.id === mId);
        return mBlock ? mBlock.name : mId;
      });

      issues.push({
        blockId,
        blockName: block ? block.name : blockId,
        missingPrereqIds: missing,
        missingPrereqNames: missingNames,
      });

      missing.forEach((mId) => requiredMissingBlockIds.add(mId));
    }
  });

  // Pick default or first available option for each missing block
  const suggestedMissingOptionIds: string[] = [];
  let totalMissingHours = 0;

  requiredMissingBlockIds.forEach((missingBlockId) => {
    const blockOptions = options.filter((o) => o.blockId === missingBlockId);
    if (blockOptions.length > 0) {
      // Pick default option or first option
      const chosen =
        blockOptions.find((o) => o.isDefault) || blockOptions[0];
      suggestedMissingOptionIds.push(chosen.id);

      const block = blocks.find((b) => b.id === missingBlockId);
      if (block) {
        totalMissingHours +=
          (block.devTimeHours || 0) +
          (block.salesTimeHours || 0) +
          (block.designTimeHours || 0) +
          (block.csmTimeHours || 0) +
          (block.baTimeHours || 0);
      }
      totalMissingHours +=
        (chosen.devTimeHours || 0) +
        (chosen.salesTimeHours || 0) +
        (chosen.designTimeHours || 0) +
        (chosen.csmTimeHours || 0) +
        (chosen.baTimeHours || 0);
    }
  });

  return {
    issues,
    suggestedMissingOptionIds,
    totalMissingHours,
  };
}
