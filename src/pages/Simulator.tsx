// ============================================
// Simulator — Configurateur + Chiffrage
// ============================================

import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import { analyzeSimulationDependencies } from '../lib/dependencyEngine';

export default function Simulator() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const {
    state,
    dispatch,
    getProductCategories,
    getCategoryBlocks,
    getBlockOptions,
    calculateCost,
  } = useAppStore();

  const product = state.products.find((p) => p.id === productId);
  const categories = useMemo(
    () => (productId ? getProductCategories(productId) : []),
    [productId, getProductCategories]
  );

  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [simulationName, setSimulationName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const costs = useMemo(
    () => calculateCost(selectedOptionIds),
    [selectedOptionIds, calculateCost]
  );

  // Compute dependency issues and missing suggested options
  const dependencyAnalysis = useMemo(
    () => analyzeSimulationDependencies(selectedOptionIds, state.blocks, state.options),
    [selectedOptionIds, state.blocks, state.options]
  );

  const handleAutoResolveDependencies = () => {
    if (dependencyAnalysis.suggestedMissingOptionIds.length === 0) return;
    setSelectedOptionIds((prev) => [
      ...new Set([...prev, ...dependencyAnalysis.suggestedMissingOptionIds]),
    ]);
  };

  // Determine which blocks have selected options
  const activeBlockIds = useMemo(() => {
    return [
      ...new Set(
        state.options
          .filter((o) => selectedOptionIds.includes(o.id))
          .map((o) => o.blockId)
      ),
    ];
  }, [selectedOptionIds, state.options]);

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

  const toggleOption = (optionId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const [showRatesModal, setShowRatesModal] = useState(false);
  const [ratesForm, setRatesForm] = useState(
    state.rates || {
      devHourlyRate: 60,
      salesHourlyRate: 45,
      designHourlyRate: 50,
      csmHourlyRate: 40,
      baHourlyRate: 55,
    }
  );

  const handleSave = () => {
    if (!simulationName.trim() || !productId) return;
    dispatch({
      type: 'ADD_SIMULATION',
      payload: {
        productId,
        name: simulationName,
        selectedOptionIds,
        totalDevHours: costs.totalDevHours,
        totalSalesHours: costs.totalSalesHours,
        totalDesignHours: costs.totalDesignHours,
        totalCsmHours: costs.totalCsmHours,
        totalBaHours: costs.totalBaHours,
        totalInfraCost: costs.totalInfraCost,
        totalProductionCost: costs.totalProductionCost,
      },
    });
    setShowSaveModal(false);
    setSimulationName('');
    navigate(`/simulations/${productId}`);
  };

  const handleSaveRates = () => {
    dispatch({ type: 'UPDATE_RATES', payload: ratesForm });
    setShowRatesModal(false);
  };

  const handleClearAll = () => {
    setSelectedOptionIds([]);
  };

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
        <span className="breadcrumb-current">Simulateur</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>🧮</span> Simulateur de coûts
          </h1>
          <p className="page-subtitle">
            Sélectionnez les options pour calculer le coût total de votre
            configuration (base horaire)
          </p>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary" onClick={() => {
            setRatesForm(state.rates);
            setShowRatesModal(true);
          }}>
            ⚙️ Salaires Horaires
          </button>
          {selectedOptionIds.length > 0 && (
            <button className="btn btn-ghost" onClick={handleClearAll}>
              Tout désélectionner
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => setShowSaveModal(true)}
            disabled={selectedOptionIds.length === 0}
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>

      {/* Dependency Warning & Auto-Resolution Banner */}
      {dependencyAnalysis.issues.length > 0 && (
        <div
          className="glass-card animate-slide-up"
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            marginBottom: 'var(--space-lg)',
            borderColor: '#f87171',
            background: 'rgba(248, 113, 113, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
          }}
        >
          <div className="flex items-center gap-md">
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <div className="font-semibold text-sm" style={{ color: '#f87171' }}>
                {dependencyAnalysis.issues.length} bloc(s) ont des prérequis manquants
              </div>
              <div className="text-xs text-secondary">
                {dependencyAnalysis.issues
                  .map((i) => `${i.blockName} nécessite (${i.missingPrereqNames.join(', ')})`)
                  .join(' • ')}
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAutoResolveDependencies}
            style={{
              background: 'linear-gradient(135deg, #f87171 0%, #fbbf24 100%)',
              color: '#0a0a0f',
            }}
          >
            ⚡ Auto-sélectionner les prérequis (+{dependencyAnalysis.totalMissingHours}h)
          </button>
        </div>
      )}

      {/* Layout : blocks + cost panel */}
      <div className="simulator-layout">
        {/* Left: Blocks */}
        <div className="simulator-blocks">
          {categories.map((category) => {
            const blocks = getCategoryBlocks(category.id);
            if (blocks.length === 0) return null;

            return (
              <div key={category.id} className="simulator-category">
                <div className="category-header">
                  <div
                    className="category-color-bar"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="category-title">{category.name}</h3>
                </div>

                {blocks.map((block) => {
                  const options = getBlockOptions(block.id);
                  const isActive = activeBlockIds.includes(block.id);

                  return (
                    <div
                      key={block.id}
                      className={`glass-card simulator-block ${
                        isActive ? 'selected' : ''
                      }`}
                    >
                      <div className="simulator-block-header">
                        <div className="flex items-center gap-sm">
                          <span className="simulator-block-name">
                            {block.name}
                          </span>
                          <span
                            className={`badge badge-${block.complexity}`}
                          >
                            {block.complexity}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-xs text-accent">
                            {block.devTimeHours > 0 && `${block.devTimeHours}h dev`}
                            {block.infraCostMonthly > 0 &&
                              ` • ${block.infraCostMonthly}€/m`}
                          </span>
                        )}
                      </div>
                      <div className="simulator-options">
                        {options.map((option) => {
                          const isSelected = selectedOptionIds.includes(
                            option.id
                          );
                          return (
                            <button
                              key={option.id}
                              className={`simulator-option ${
                                isSelected ? 'selected' : ''
                              }`}
                              onClick={() => toggleOption(option.id)}
                            >
                              <div className="simulator-option-checkbox">
                                {isSelected && (
                                  <span style={{ fontSize: '10px', color: '#0a0a0f' }}>
                                    ✓
                                  </span>
                                )}
                              </div>
                              {option.name}
                            </button>
                          );
                        })}
                        {options.length === 0 && (
                          <span className="text-xs text-secondary">
                            Pas d'options configurées
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right: Cost Summary */}
        <div className="cost-summary">
          <div className="cost-summary-title">
            💰 Récapitulatif des coûts
          </div>

          <div className="cost-row">
            <span className="cost-row-label">Options sélectionnées</span>
            <span className="cost-row-value">{selectedOptionIds.length}</span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">Blocs activés</span>
            <span className="cost-row-value">{activeBlockIds.length}</span>
          </div>

          <hr className="section-separator" />

          {/* Role Costs */}
          <div className="cost-row">
            <span className="cost-row-label">👨‍💻 Dev ({costs.totalDevHours}h @ {state.rates?.devHourlyRate ?? 60}€/h)</span>
            <span className="cost-row-value">
              {costs.devCostTotal > 0 ? `${costs.devCostTotal.toLocaleString('fr-FR')} €` : '—'}
            </span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">💼 Sales ({costs.totalSalesHours}h @ {state.rates?.salesHourlyRate ?? 45}€/h)</span>
            <span className="cost-row-value">
              {costs.salesCostTotal > 0 ? `${costs.salesCostTotal.toLocaleString('fr-FR')} €` : '—'}
            </span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">🎨 Design ({costs.totalDesignHours}h @ {state.rates?.designHourlyRate ?? 50}€/h)</span>
            <span className="cost-row-value">
              {costs.designCostTotal > 0 ? `${costs.designCostTotal.toLocaleString('fr-FR')} €` : '—'}
            </span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">🤝 CSM ({costs.totalCsmHours}h @ {state.rates?.csmHourlyRate ?? 40}€/h)</span>
            <span className="cost-row-value">
              {costs.csmCostTotal > 0 ? `${costs.csmCostTotal.toLocaleString('fr-FR')} €` : '—'}
            </span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">📈 BA ({costs.totalBaHours}h @ {state.rates?.baHourlyRate ?? 55}€/h)</span>
            <span className="cost-row-value">
              {costs.baCostTotal > 0 ? `${costs.baCostTotal.toLocaleString('fr-FR')} €` : '—'}
            </span>
          </div>

          <hr className="section-separator" />

          <div className="cost-row">
            <span className="cost-row-label">🖥️ Infra (mensuel)</span>
            <span className="cost-row-value">
              {costs.totalInfraCost > 0
                ? `${costs.totalInfraCost.toLocaleString('fr-FR')} €/mois`
                : '—'}
            </span>
          </div>
          <div className="cost-row">
            <span className="cost-row-label">🏭 Production</span>
            <span className="cost-row-value">
              {costs.totalProductionCost > 0
                ? `${costs.totalProductionCost.toLocaleString('fr-FR')} €`
                : '—'}
            </span>
          </div>

          <div className="cost-total">
            <div className="cost-row" style={{ border: 'none' }}>
              <span className="cost-row-label font-semibold">Coût total estimé</span>
              <span className="cost-total-value">
                {costs.totalCost.toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>

          {selectedOptionIds.length === 0 && (
            <p
              className="text-xs text-secondary"
              style={{
                textAlign: 'center',
                marginTop: 'var(--space-md)',
                fontStyle: 'italic',
              }}
            >
              Sélectionnez des options pour voir le chiffrage en temps réel.
            </p>
          )}
        </div>
      </div>

      {/* Rates Modal */}
      <div
        className={`modal-overlay ${showRatesModal ? 'open' : ''}`}
        onClick={() => setShowRatesModal(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚙️ Coûts & Salaires Horaires (Interne)</h3>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowRatesModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <p className="text-xs text-secondary">
              Définissez les coûts/salaires horaires internes (€/heure) pour chaque rôle afin de calculer automatiquement le coût d'une configuration.
            </p>
            <div className="form-group">
              <label className="form-label">👨‍💻 Coût Horaire Développeur (€/h)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="5"
                value={ratesForm.devHourlyRate}
                onChange={(e) =>
                  setRatesForm({ ...ratesForm, devHourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">💼 Coût Horaire Sales (€/h)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="5"
                value={ratesForm.salesHourlyRate}
                onChange={(e) =>
                  setRatesForm({ ...ratesForm, salesHourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">🎨 Coût Horaire Designer (€/h)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="5"
                value={ratesForm.designHourlyRate}
                onChange={(e) =>
                  setRatesForm({ ...ratesForm, designHourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">🤝 Coût Horaire CSM (€/h)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="5"
                value={ratesForm.csmHourlyRate}
                onChange={(e) =>
                  setRatesForm({ ...ratesForm, csmHourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">📈 Coût Horaire Business Analyst (€/h)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="5"
                value={ratesForm.baHourlyRate}
                onChange={(e) =>
                  setRatesForm({ ...ratesForm, baHourlyRate: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowRatesModal(false)}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSaveRates}>
              Enregistrer les salaires
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <div
        className={`modal-overlay ${showSaveModal ? 'open' : ''}`}
        onClick={() => setShowSaveModal(false)}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Sauvegarder la simulation</h3>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowSaveModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nom de la simulation</label>
              <input
                className="form-input"
                placeholder="Ex: Config standard Q4 2026..."
                value={simulationName}
                onChange={(e) => setSimulationName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
            </div>
            <div
              className="glass-card"
              style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)' }}
            >
              <div className="text-xs text-secondary" style={{ marginBottom: 'var(--space-sm)' }}>
                Résumé
              </div>
              <div className="flex justify-between text-sm">
                <span>{selectedOptionIds.length} options</span>
                <span className="text-accent font-semibold">
                  {costs.totalCost.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaveModal(false)}
            >
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              💾 Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
