// ============================================
// ProductView — Arborescence interactive
// ============================================

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import type { ConfigBlock, Option, Complexity } from '../types';

export default function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, dispatch, getProductCategories, getCategoryBlocks, getBlockOptions } = useAppStore();

  const product = state.products.find((p) => p.id === productId);
  const categories = useMemo(
    () => (productId ? getProductCategories(productId) : []),
    [productId, getProductCategories]
  );

  // Drawer state
  const [selectedBlock, setSelectedBlock] = useState<ConfigBlock | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBlock, setEditBlock] = useState<ConfigBlock | null>(null);
  const [editingOption, setEditingOption] = useState<Option | null>(null);

  // Add block modal
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [addBlockCatId, setAddBlockCatId] = useState('');
  const [newBlockName, setNewBlockName] = useState('');

  // Add option state
  const [showAddOption, setShowAddOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');

  // Add category modal
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#F5A623');

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

  const handleBlockClick = (block: ConfigBlock) => {
    setSelectedBlock(block);
    setEditBlock({ ...block });
    setIsEditing(false);
    setEditingOption(null);
    setShowAddOption(false);
  };

  const handleSaveBlock = () => {
    if (editBlock) {
      dispatch({ type: 'UPDATE_BLOCK', payload: editBlock });
      setSelectedBlock(editBlock);
      setIsEditing(false);
    }
  };

  const handleSaveOption = (option: Option) => {
    dispatch({ type: 'UPDATE_OPTION', payload: option });
    setEditingOption(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Supprimer ce bloc et toutes ses options ?')) {
      dispatch({ type: 'DELETE_BLOCK', payload: blockId });
      setSelectedBlock(null);
    }
  };

  const handleAddBlock = () => {
    if (!newBlockName.trim() || !addBlockCatId) return;
    const maxOrder = state.blocks
      .filter((b) => b.categoryId === addBlockCatId)
      .reduce((max, b) => Math.max(max, b.sortOrder), 0);
    dispatch({
      type: 'ADD_BLOCK',
      payload: {
        categoryId: addBlockCatId,
        name: newBlockName,
        description: '',
        devTimeHours: 0,
        salesTimeHours: 0,
        designTimeHours: 0,
        csmTimeHours: 0,
        baTimeHours: 0,
        infraCostMonthly: 0,
        complexity: 'simple' as Complexity,
        dependencies: [],
        notes: '',
        sortOrder: maxOrder + 1,
      },
    });
    setNewBlockName('');
    setShowAddBlock(false);
  };

  const handleAddOption = () => {
    if (!newOptionName.trim() || !selectedBlock) return;
    const maxOrder = state.options
      .filter((o) => o.blockId === selectedBlock.id)
      .reduce((max, o) => Math.max(max, o.sortOrder), 0);
    dispatch({
      type: 'ADD_OPTION',
      payload: {
        blockId: selectedBlock.id,
        name: newOptionName,
        devTimeHours: 0,
        salesTimeHours: 0,
        designTimeHours: 0,
        csmTimeHours: 0,
        baTimeHours: 0,
        infraCostMonthly: 0,
        productionCost: 0,
        isDefault: false,
        sortOrder: maxOrder + 1,
      },
    });
    setNewOptionName('');
    setShowAddOption(false);
  };

  const handleDeleteOption = (optionId: string) => {
    dispatch({ type: 'DELETE_OPTION', payload: optionId });
  };

  const handleAddCategory = () => {
    if (!newCatName.trim() || !productId) return;
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.sortOrder), 0);
    dispatch({
      type: 'ADD_CATEGORY',
      payload: {
        productId,
        name: newCatName,
        color: newCatColor,
        sortOrder: maxOrder + 1,
      },
    });
    setNewCatName('');
    setShowAddCategory(false);
  };

  const getDependencyName = (depId: string) => {
    const block = state.blocks.find((b) => b.id === depId);
    return block ? block.name : depId;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.icon} {product.name}</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>{product.icon}</span> {product.name}
          </h1>
          <p className="page-subtitle">{product.description}</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary" onClick={() => setShowAddCategory(true)}>
            + Catégorie
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/simulator/${productId}`)}
          >
            🧮 Simulateur
          </button>
        </div>
      </div>

      {/* Categories + Blocks */}
      {categories.map((category) => {
        const blocks = getCategoryBlocks(category.id);
        return (
          <div key={category.id} className="category-section animate-fade-in">
            <div className="category-header">
              <div
                className="category-color-bar"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="category-title">{category.name}</h3>
              <span className="category-count">{blocks.length} blocs</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setAddBlockCatId(category.id);
                  setShowAddBlock(true);
                }}
              >
                + Bloc
              </button>
            </div>
            <div className="blocks-grid stagger-children">
              {blocks.map((block) => {
                const options = getBlockOptions(block.id);
                const hasCost =
                  block.devTimeHours > 0 || block.infraCostMonthly > 0;

                return (
                  <div
                    key={block.id}
                    className={`glass-card block-card interactive ${
                      selectedBlock?.id === block.id ? 'selected' : ''
                    }`}
                    onClick={() => handleBlockClick(block)}
                    style={
                      {
                        '--block-color': category.color,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: category.color,
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                        opacity: selectedBlock?.id === block.id ? 1 : 0.5,
                        transition: 'opacity var(--transition-fast)',
                      }}
                    />
                    <div className="block-card-name">{block.name}</div>
                    <div className="block-card-meta">
                      <span className={`badge badge-${block.complexity}`}>
                        {block.complexity}
                      </span>
                      <div className="flex items-center gap-sm">
                        {hasCost && (
                          <span className="block-card-cost-indicator">
                            💰
                          </span>
                        )}
                        <span className="block-card-options-count">
                          {options.length} opt.
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <div className="empty-state-title">Aucune catégorie</div>
          <div className="empty-state-desc">
            Ajoutez des catégories pour organiser vos blocs de configuration.
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddCategory(true)}>
            + Ajouter une catégorie
          </button>
        </div>
      )}

      {/* ==== DRAWER ==== */}
      <div
        className={`drawer-overlay ${selectedBlock ? 'open' : ''}`}
        onClick={() => setSelectedBlock(null)}
      />
      <div className={`drawer ${selectedBlock ? 'open' : ''}`}>
        {selectedBlock && editBlock && (
          <>
            <div className="drawer-header">
              <div>
                <h3>{isEditing ? 'Modifier le bloc' : selectedBlock.name}</h3>
                <span className={`badge badge-${selectedBlock.complexity}`}>
                  {selectedBlock.complexity}
                </span>
              </div>
              <div className="flex gap-sm">
                {!isEditing && (
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setIsEditing(true)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                )}
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => setSelectedBlock(null)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="drawer-body">
              {isEditing ? (
                /* ---- Edit Mode ---- */
                <div className="flex flex-col gap-md">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      className="form-input"
                      value={editBlock.name}
                      onChange={(e) =>
                        setEditBlock({ ...editBlock, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input form-textarea"
                      value={editBlock.description}
                      onChange={(e) =>
                        setEditBlock({
                          ...editBlock,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="info-grid">
                    <div className="form-group">
                      <label className="form-label">Dev (h)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.5"
                        value={editBlock.devTimeHours}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            devTimeHours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sales (h)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.5"
                        value={editBlock.salesTimeHours}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            salesTimeHours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Design (h)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.5"
                        value={editBlock.designTimeHours}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            designTimeHours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CSM (h)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.5"
                        value={editBlock.csmTimeHours}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            csmTimeHours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BA (h)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.5"
                        value={editBlock.baTimeHours}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            baTimeHours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Infra (€/mois)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="10"
                        value={editBlock.infraCostMonthly}
                        onChange={(e) =>
                          setEditBlock({
                            ...editBlock,
                            infraCostMonthly: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Complexité</label>
                    <select
                      className="form-input form-select"
                      value={editBlock.complexity}
                      onChange={(e) =>
                        setEditBlock({
                          ...editBlock,
                          complexity: e.target.value as Complexity,
                        })
                      }
                    >
                      <option value="simple">Simple</option>
                      <option value="moyen">Moyen</option>
                      <option value="complexe">Complexe</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dépendances (blocs requis)</label>
                    <div
                      style={{
                        maxHeight: '150px',
                        overflowY: 'auto',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-xs)',
                      }}
                    >
                      {state.blocks
                        .filter((b) => b.id !== editBlock.id)
                        .map((b) => {
                          const isChecked = editBlock.dependencies.includes(b.id);
                          return (
                            <label
                              key={b.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditBlock({
                                      ...editBlock,
                                      dependencies: [...editBlock.dependencies, b.id],
                                    });
                                  } else {
                                    setEditBlock({
                                      ...editBlock,
                                      dependencies: editBlock.dependencies.filter(
                                        (id) => id !== b.id
                                      ),
                                    });
                                  }
                                }}
                              />
                              <span>{b.name}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-input form-textarea"
                      value={editBlock.notes}
                      onChange={(e) =>
                        setEditBlock({ ...editBlock, notes: e.target.value })
                      }
                      placeholder="Notes, contraintes spécifiques..."
                    />
                  </div>
                </div>
              ) : (
                /* ---- View Mode ---- */
                <>
                  {/* Description */}
                  <p style={{ marginBottom: 'var(--space-lg)' }}>
                    {selectedBlock.description || (
                      <span style={{ fontStyle: 'italic', color: 'var(--text-tertiary)' }}>
                        Aucune description. Cliquez sur ✏️ pour en ajouter.
                      </span>
                    )}
                  </p>

                  {/* Cost Info */}
                  <div className="info-grid" style={{ marginBottom: 'var(--space-lg)' }}>
                    <div className="info-item">
                      <span className="info-item-label">👨‍💻 Dev</span>
                      <span className="info-item-value cost">
                        {selectedBlock.devTimeHours > 0
                          ? `${selectedBlock.devTimeHours} h`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">💼 Sales</span>
                      <span className="info-item-value cost">
                        {selectedBlock.salesTimeHours > 0
                          ? `${selectedBlock.salesTimeHours} h`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">🎨 Design</span>
                      <span className="info-item-value cost">
                        {selectedBlock.designTimeHours > 0
                          ? `${selectedBlock.designTimeHours} h`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">🤝 CSM</span>
                      <span className="info-item-value cost">
                        {selectedBlock.csmTimeHours > 0
                          ? `${selectedBlock.csmTimeHours} h`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">📈 BA</span>
                      <span className="info-item-value cost">
                        {selectedBlock.baTimeHours > 0
                          ? `${selectedBlock.baTimeHours} h`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">🖥️ Infra</span>
                      <span className="info-item-value cost">
                        {selectedBlock.infraCostMonthly > 0
                          ? `${selectedBlock.infraCostMonthly} €/m`
                          : '—'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">📊 Complexité</span>
                      <span className="info-item-value">
                        <span className={`badge badge-${selectedBlock.complexity}`}>
                          {selectedBlock.complexity}
                        </span>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-item-label">🔗 Dépendances</span>
                      <span className="info-item-value">
                        {selectedBlock.dependencies.length > 0
                          ? selectedBlock.dependencies.map((depId) => (
                              <span
                                key={depId}
                                className="dependency-tag"
                                onClick={() => {
                                  const dep = state.blocks.find(
                                    (b) => b.id === depId
                                  );
                                  if (dep) handleBlockClick(dep);
                                }}
                              >
                                {getDependencyName(depId)}
                              </span>
                            ))
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedBlock.notes && (
                    <>
                      <hr className="section-separator" />
                      <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <div className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
                          📝 Notes
                        </div>
                        <p style={{ fontSize: '0.875rem' }}>{selectedBlock.notes}</p>
                      </div>
                    </>
                  )}

                  <hr className="section-separator" />

                  {/* Options */}
                  <div>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 'var(--space-md)' }}
                    >
                      <div className="form-label">⚙️ Options</div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowAddOption(true)}
                      >
                        + Ajouter
                      </button>
                    </div>

                    {showAddOption && (
                      <div
                        className="flex gap-sm items-center"
                        style={{ marginBottom: 'var(--space-md)' }}
                      >
                        <input
                          className="form-input"
                          placeholder="Nom de l'option..."
                          value={newOptionName}
                          onChange={(e) => setNewOptionName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                          autoFocus
                          style={{ flex: 1 }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleAddOption}>
                          ✓
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setShowAddOption(false);
                            setNewOptionName('');
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <div className="options-list">
                      {getBlockOptions(selectedBlock.id).map((option) => (
                        <div key={option.id} className="option-item">
                          {editingOption?.id === option.id ? (
                            /* Edit option inline */
                            <div className="flex flex-col gap-sm" style={{ width: '100%' }}>
                              <input
                                className="form-input"
                                value={editingOption.name}
                                onChange={(e) =>
                                  setEditingOption({
                                    ...editingOption,
                                    name: e.target.value,
                                  })
                                }
                              />
                              <div className="info-grid">
                                <div className="form-group">
                                  <label className="form-label text-xs">Dev (j)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingOption.devTimeHours}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        devTimeHours: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">Sales (j)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingOption.salesTimeHours}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        salesTimeHours: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">Design (j)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingOption.designTimeHours}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        designTimeHours: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">CSM (j)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingOption.csmTimeHours}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        csmTimeHours: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">BA (j)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={editingOption.baTimeHours}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        baTimeHours: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">Infra (€/m)</label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={editingOption.infraCostMonthly}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        infraCostMonthly:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label text-xs">
                                    Prod (€)
                                  </label>
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    step="10"
                                    value={editingOption.productionCost}
                                    onChange={(e) =>
                                      setEditingOption({
                                        ...editingOption,
                                        productionCost:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="flex gap-sm justify-end">
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setEditingOption(null)}
                                >
                                  Annuler
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleSaveOption(editingOption)}
                                >
                                  Sauvegarder
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* View option */
                            <>
                              <div>
                                <div className="option-name">{option.name}</div>
                                {(option.devTimeHours > 0 ||
                                  option.salesTimeHours > 0 ||
                                  option.designTimeHours > 0 ||
                                  option.csmTimeHours > 0 ||
                                  option.baTimeHours > 0 ||
                                  option.infraCostMonthly > 0 ||
                                  option.productionCost > 0) && (
                                  <div className="option-cost">
                                    {option.devTimeHours > 0 && `${option.devTimeHours}h dev`}
                                    {option.salesTimeHours > 0 && ` • ${option.salesTimeHours}h sales`}
                                    {option.designTimeHours > 0 && ` • ${option.designTimeHours}h design`}
                                    {option.csmTimeHours > 0 && ` • ${option.csmTimeHours}h csm`}
                                    {option.baTimeHours > 0 && ` • ${option.baTimeHours}h ba`}
                                    {option.infraCostMonthly > 0 && ` • ${option.infraCostMonthly}€/m`}
                                    {option.productionCost > 0 && ` • ${option.productionCost}€ prod`}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-xs">
                                <button
                                  className="btn btn-ghost btn-icon btn-sm"
                                  onClick={() => setEditingOption({ ...option })}
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm"
                                  onClick={() => handleDeleteOption(option.id)}
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {getBlockOptions(selectedBlock.id).length === 0 && (
                        <p className="text-sm text-secondary" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
                          Aucune option. Cliquez sur "+ Ajouter" pour en créer.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="drawer-footer">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBlock(selectedBlock.id)}
                  >
                    🗑️ Supprimer le bloc
                  </button>
                  <div style={{ flex: 1 }} />
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditBlock({ ...selectedBlock });
                    }}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveBlock}>
                    Sauvegarder
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedBlock(null)}
                >
                  Fermer
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==== Add Block Modal ==== */}
      <div
        className={`modal-overlay ${showAddBlock ? 'open' : ''}`}
        onClick={() => setShowAddBlock(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Nouveau Bloc</h3>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowAddBlock(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nom du bloc</label>
              <input
                className="form-input"
                placeholder="Ex: Type de Bannière, Module vidéo..."
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddBlock()}
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddBlock(false)}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleAddBlock}>
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* ==== Add Category Modal ==== */}
      <div
        className={`modal-overlay ${showAddCategory ? 'open' : ''}`}
        onClick={() => setShowAddCategory(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Nouvelle Catégorie</h3>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowAddCategory(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nom de la catégorie</label>
              <input
                className="form-input"
                placeholder="Ex: Paramétrages Communs..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Couleur</label>
              <div className="flex gap-sm items-center">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  style={{
                    width: 40,
                    height: 40,
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
                <span className="text-sm text-secondary">{newCatColor}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddCategory(false)}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleAddCategory}>
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
