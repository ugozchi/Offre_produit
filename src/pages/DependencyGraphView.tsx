// ============================================
// DependencyGraphView — Interactive SVG Dependency Graph & Analytics
// ============================================

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import type { ConfigBlock } from '../types';
import {
  getUpstreamBlockIds,
  getDownstreamBlockIds,
  getBlockImpactMetrics,
} from '../lib/dependencyEngine';

interface NodePosition {
  block: ConfigBlock;
  x: number;
  y: number;
  width: number;
  height: number;
  categoryColor: string;
}

export default function DependencyGraphView() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, getProductCategories, getCategoryBlocks } = useAppStore();

  const product = state.products.find((p) => p.id === productId);
  const categories = useMemo(
    () => (productId ? getProductCategories(productId) : []),
    [productId, getProductCategories]
  );

  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ConfigBlock | null>(null);

  // Compute node positions categorized in grid/columns
  const { nodes, connections, svgWidth, svgHeight } = useMemo(() => {
    if (!product) {
      return { nodes: [], connections: [], svgWidth: 800, svgHeight: 600 };
    }

    const nodeWidth = 200;
    const nodeHeight = 58;
    const colWidth = 240;
    const rowHeight = 82;
    const startX = 20;
    const startY = 80;

    const computedNodes: NodePosition[] = [];

    categories.forEach((cat, catIdx) => {
      const blocks = getCategoryBlocks(cat.id);
      const colX = startX + catIdx * colWidth;

      blocks.forEach((block, blockIdx) => {
        computedNodes.push({
          block,
          x: colX,
          y: startY + blockIdx * rowHeight,
          width: nodeWidth,
          height: nodeHeight,
          categoryColor: cat.color || '#F5A623',
        });
      });
    });

    // Compute directed connections (arrows)
    const computedConnections: Array<{
      fromId: string;
      toId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }> = [];

    computedNodes.forEach((targetNode) => {
      if (targetNode.block.dependencies && targetNode.block.dependencies.length > 0) {
        targetNode.block.dependencies.forEach((prereqId) => {
          const sourceNode = computedNodes.find((n) => n.block.id === prereqId);
          if (sourceNode) {
            computedConnections.push({
              fromId: sourceNode.block.id,
              toId: targetNode.block.id,
              x1: sourceNode.x + sourceNode.width,
              y1: sourceNode.y + sourceNode.height / 2,
              x2: targetNode.x,
              y2: targetNode.y + targetNode.height / 2,
            });
          }
        });
      }
    });

    const maxColLength = Math.max(
      1,
      ...categories.map((c) => getCategoryBlocks(c.id).length)
    );
    const width = categories.length * colWidth + startX * 2;
    const height = maxColLength * rowHeight + startY + 60;

    return {
      nodes: computedNodes,
      connections: computedConnections,
      svgWidth: width,
      svgHeight: height,
    };
  }, [product, categories, getCategoryBlocks]);

  // Compute upstream/downstream highlights based on hovered/selected block
  const activeFocusId = hoveredBlockId || selectedBlock?.id || null;

  const upstreamSet = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    return new Set(getUpstreamBlockIds(activeFocusId, state.blocks));
  }, [activeFocusId, state.blocks]);

  const downstreamSet = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    return new Set(getDownstreamBlockIds(activeFocusId, state.blocks));
  }, [activeFocusId, state.blocks]);

  if (!product) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Produit non trouvé</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Retour au dashboard
        </button>
      </div>
    );
  }

  const selectedMetrics = selectedBlock
    ? getBlockImpactMetrics(selectedBlock.id, state.blocks)
    : null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={`/product/${productId}`} className="breadcrumb-item">
          {product.icon} {product.name}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Graphe de Dépendances</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>🕸️</span> Graphe de Dépendances
          </h1>
          <p className="page-subtitle">
            Visualisez les relations amont/aval entre les blocs pour analyser le chemin critique et les goulots d'étranglement.
          </p>
        </div>
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/product/${productId}`)}
          >
            🧩 Vue Arborescence
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/simulator/${productId}`)}
          >
            🧮 Simulateur
          </button>
        </div>
      </div>

      {/* Legend & Controls */}
      <div
        className="glass-card flex items-center justify-between"
        style={{
          padding: 'var(--space-md) var(--space-lg)',
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          background: '#ffffff',
          borderColor: 'var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center gap-lg text-xs" style={{ flexWrap: 'wrap' }}>
          <span className="font-bold text-primary">LÉGENDE SURVOL :</span>
          <div className="flex items-center gap-xs">
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#fef2f2', border: '1.5px solid #ef4444' }} />
            <span className="font-semibold" style={{ color: '#991b1b' }}>Prérequis (Amont)</span>
          </div>
          <div className="flex items-center gap-xs">
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#f0fdf4', border: '1.5px solid #22c55e' }} />
            <span className="font-semibold" style={{ color: '#166534' }}>Débloqué (Aval)</span>
          </div>
          <div className="flex items-center gap-xs">
            <span style={{ width: 14, height: 14, borderRadius: 4, background: '#2951a2', border: '1.5px solid #1e40af' }} />
            <span className="font-semibold" style={{ color: '#2951a2' }}>Bloc Sélectionné</span>
          </div>
        </div>
        <div className="text-xs text-secondary font-medium">
          💡 Survolez ou cliquez sur un bloc pour révéler son réseau d'impact.
        </div>
      </div>

      {/* SVG Container */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          padding: 'var(--space-lg)',
          position: 'relative',
          background: '#f4f3f0',
          minHeight: '500px',
          boxSizing: 'border-box',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', margin: '0 auto', maxWidth: 'none' }}
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker
              id="arrow-upstream"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker
              id="arrow-downstream"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
            </marker>
          </defs>

          {/* Render category titles above columns */}
          {categories.map((cat, idx) => {
            const colCenterX = 20 + idx * 240 + 100;
            return (
              <g key={cat.id}>
                <rect
                  x={20 + idx * 240}
                  y={20}
                  width={200}
                  height={38}
                  rx="19"
                  fill="#ffffff"
                  stroke={cat.color || '#2951a2'}
                  strokeWidth="2"
                />
                <text
                  x={colCenterX}
                  y={44}
                  textAnchor="middle"
                  fill="#122b38"
                  fontSize="11.5"
                  fontWeight="800"
                  letterSpacing="0.05em"
                >
                  {cat.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Render connection paths */}
          {connections.map((conn, idx) => {
            const isUpstream =
              activeFocusId &&
              (conn.toId === activeFocusId && upstreamSet.has(conn.fromId));
            const isDownstream =
              activeFocusId &&
              (conn.fromId === activeFocusId && downstreamSet.has(conn.toId));

            let strokeColor = '#cbd5e1';
            let strokeWidth = 1.5;
            let markerId = 'arrow-default';
            let strokeDasharray: string | undefined = '4 4';

            if (isUpstream) {
              strokeColor = '#ef4444';
              strokeWidth = 3;
              markerId = 'arrow-upstream';
              strokeDasharray = undefined;
            } else if (isDownstream) {
              strokeColor = '#22c55e';
              strokeWidth = 3;
              markerId = 'arrow-downstream';
              strokeDasharray = undefined;
            }

            // Curved cubic bezier line
            const dx = (conn.x2 - conn.x1) / 2;
            const pathD = `M ${conn.x1} ${conn.y1} C ${conn.x1 + dx} ${conn.y1}, ${conn.x2 - dx} ${conn.y2}, ${conn.x2} ${conn.y2}`;

            return (
              <path
                key={`${conn.fromId}-${conn.toId}-${idx}`}
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                markerEnd={`url(#${markerId})`}
                style={{ transition: 'stroke 200ms, stroke-width 200ms' }}
              />
            );
          })}

          {/* Render block nodes */}
          {nodes.map((node) => {
            const isSelected = selectedBlock?.id === node.block.id;
            const isHovered = hoveredBlockId === node.block.id;
            const isUpstream = upstreamSet.has(node.block.id);
            const isDownstream = downstreamSet.has(node.block.id);

            let stroke = '#cbd5e1';
            let fill = '#ffffff';
            let titleColor = '#122b38';
            let metaColor = '#64748b';

            if (isSelected) {
              stroke = '#1e40af';
              fill = '#2951a2';
              titleColor = '#ffffff';
              metaColor = '#e0e7ff';
            } else if (isUpstream) {
              stroke = '#ef4444';
              fill = '#fef2f2';
              titleColor = '#991b1b';
              metaColor = '#b91c1c';
            } else if (isDownstream) {
              stroke = '#22c55e';
              fill = '#f0fdf4';
              titleColor = '#166534';
              metaColor = '#15803d';
            } else if (isHovered) {
              stroke = '#2951a2';
              fill = '#f8fafc';
              titleColor = '#2951a2';
              metaColor = '#334155';
            }

            return (
              <g
                key={node.block.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedBlock(node.block)}
                onMouseEnter={() => setHoveredBlockId(node.block.id)}
                onMouseLeave={() => setHoveredBlockId(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Box */}
                <rect
                  width={node.width}
                  height={node.height}
                  rx="8"
                  ry="8"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected || isUpstream || isDownstream ? 2.5 : 1.5}
                  style={{ transition: 'all 200ms' }}
                />

                {/* Left category accent bar */}
                <rect
                  width="5"
                  height={node.height}
                  rx="2.5"
                  fill={node.categoryColor}
                />

                {/* Block Name */}
                <text
                  x="16"
                  y="26"
                  fill={titleColor}
                  fontSize="12"
                  fontWeight="700"
                >
                  {node.block.name.length > 24
                    ? node.block.name.substring(0, 22) + '…'
                    : node.block.name}
                </text>

                {/* Meta details */}
                <text
                  x="16"
                  y="45"
                  fill={metaColor}
                  fontSize="10.5"
                  fontWeight="500"
                >
                  {node.block.devTimeHours > 0 ? `${node.block.devTimeHours}h dev` : '0h'}
                  {node.block.dependencies && node.block.dependencies.length > 0
                    ? ` • ${node.block.dependencies.length} préreq.`
                    : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Impact & Process Analytics Drawer */}
      {selectedBlock && (
        <>
          <div
            className="drawer-overlay"
            onClick={() => setSelectedBlock(null)}
          />
          <div className="drawer-content">
            {selectedMetrics && (
              <>
                <div className="drawer-header">
                  <div>
                    <h3>Analyse d'Impact Processus</h3>
                    <span className="text-xs text-accent font-semibold">
                      {selectedBlock.name}
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setSelectedBlock(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="drawer-body">
                  <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
                    {selectedBlock.description || 'Aucune description renseignée pour ce bloc.'}
                  </p>

                  {/* Impact Score Card */}
                  <div
                    className="glass-card"
                    style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}
                  >
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-xs)' }}>
                      <span className="form-label text-xs">Score d'Impact sur l'Offre</span>
                      <span className="text-accent font-bold">{selectedMetrics.impactScore}%</span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        marginBottom: 'var(--space-sm)',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${selectedMetrics.impactScore}%`,
                          background: 'var(--accent-gradient)',
                          borderRadius: 'var(--radius-full)',
                        }}
                      />
                    </div>
                    <p className="text-xs text-secondary">
                      {selectedMetrics.impactScore > 20
                        ? '⚠️ Bloc Pilier : Une grande partie de votre offre dépend directement ou indirectement de ce bloc.'
                        : 'ℹ️ Bloc périphérique : Son impact sur le reste de la chaîne de production est limité.'}
                    </p>
                  </div>

                  {/* Dependency Metrics Grid */}
                  <div className="info-grid" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="info-item">
                      <span className="info-item-label">🔗 Dépendances Amont</span>
                      <span className="info-item-value cost">
                        {selectedBlock.dependencies?.length || 0} bloc(s) requis
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">⚡ Bloc Aval Débloqués</span>
                      <span className="info-item-value cost">
                        {selectedMetrics.totalDependentsCount} bloc(s) impacté(s)
                      </span>
                    </div>
                  </div>

                  {/* Workload Breakdown */}
                  <div className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
                    ⏱️ Charge Totale Directe du Bloc
                  </div>
                  <div className="options-list" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="option-item">
                      <span className="option-name">👨‍💻 Développement</span>
                      <span className="option-cost">{selectedBlock.devTimeHours || 0} h</span>
                    </div>
                    <div className="option-item">
                      <span className="option-name">💼 Sales</span>
                      <span className="option-cost">{selectedBlock.salesTimeHours || 0} h</span>
                    </div>
                    <div className="option-item">
                      <span className="option-name">🎨 Design</span>
                      <span className="option-cost">{selectedBlock.designTimeHours || 0} h</span>
                    </div>
                    <div className="option-item">
                      <span className="option-name">🤝 CSM</span>
                      <span className="option-cost">{selectedBlock.csmTimeHours || 0} h</span>
                    </div>
                    <div className="option-item">
                      <span className="option-name">📈 Business Analyst</span>
                      <span className="option-cost">{selectedBlock.baTimeHours || 0} h</span>
                    </div>
                  </div>
                </div>

                <div className="drawer-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedBlock(null)}
                  >
                    Fermer
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    ✏️ Modifier dans l'Arborescence
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
