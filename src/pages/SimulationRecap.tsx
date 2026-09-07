// ============================================
// SimulationRecap — Simulations sauvegardées
// ============================================

import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';

export default function SimulationRecap() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppStore();

  const product = state.products.find((p) => p.id === productId);

  const simulations = useMemo(
    () =>
      state.simulations
        .filter((s) => s.productId === productId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [state.simulations, productId]
  );

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

  const handleDelete = (simId: string) => {
    if (confirm('Supprimer cette simulation ?')) {
      dispatch({ type: 'DELETE_SIMULATION', payload: simId });
    }
  };

  const getOptionNames = (optionIds: string[]) => {
    return optionIds
      .map((id) => {
        const option = state.options.find((o) => o.id === id);
        return option?.name;
      })
      .filter(Boolean);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <span className="breadcrumb-current">Simulations</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>📊</span> Simulations
          </h1>
          <p className="page-subtitle">
            {simulations.length} simulation(s) sauvegardée(s) pour {product.name}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/simulator/${productId}`)}
        >
          🧮 Nouvelle simulation
        </button>
      </div>

      {simulations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Aucune simulation</div>
          <div className="empty-state-desc">
            Créez une simulation dans le simulateur pour estimer les coûts de
            vos configurations.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/simulator/${productId}`)}
          >
            🧮 Créer une simulation
          </button>
        </div>
      ) : (
        <div className="simulations-list stagger-children">
          {simulations.map((sim) => {
            const devCost = (sim.totalDevHours || 0) * (state.rates?.devHourlyRate ?? 60);
            const salesCost = (sim.totalSalesHours || 0) * (state.rates?.salesHourlyRate ?? 45);
            const designCost = (sim.totalDesignHours || 0) * (state.rates?.designHourlyRate ?? 50);
            const csmCost = (sim.totalCsmHours || 0) * (state.rates?.csmHourlyRate ?? 40);
            const baCost = (sim.totalBaHours || 0) * (state.rates?.baHourlyRate ?? 55);

            const grandTotal =
              devCost +
              salesCost +
              designCost +
              csmCost +
              baCost +
              (sim.totalInfraCost || 0) +
              (sim.totalProductionCost || 0);

            const optionNames = getOptionNames(sim.selectedOptionIds);

            return (
              <div key={sim.id} className="glass-card simulation-card">
                <div className="simulation-card-header">
                  <div>
                    <div className="simulation-card-name">{sim.name}</div>
                    <div className="simulation-card-date">
                      {formatDate(sim.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(sim.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>

                <div className="simulation-card-costs" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalDevHours > 0 ? `${sim.totalDevHours}h` : '—'}
                    </div>
                    <div className="simulation-cost-label">Dev</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalSalesHours > 0 ? `${sim.totalSalesHours}h` : '—'}
                    </div>
                    <div className="simulation-cost-label">Sales</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalDesignHours > 0 ? `${sim.totalDesignHours}h` : '—'}
                    </div>
                    <div className="simulation-cost-label">Design</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalCsmHours > 0 ? `${sim.totalCsmHours}h` : '—'}
                    </div>
                    <div className="simulation-cost-label">CSM</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalBaHours > 0 ? `${sim.totalBaHours}h` : '—'}
                    </div>
                    <div className="simulation-cost-label">BA</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalInfraCost > 0
                        ? `${sim.totalInfraCost.toLocaleString('fr-FR')}€`
                        : '—'}
                    </div>
                    <div className="simulation-cost-label">Infra / m</div>
                  </div>
                  <div className="simulation-cost-item">
                    <div className="simulation-cost-value">
                      {sim.totalProductionCost > 0
                        ? `${sim.totalProductionCost.toLocaleString('fr-FR')}€`
                        : '—'}
                    </div>
                    <div className="simulation-cost-label">Prod</div>
                  </div>
                </div>

                <hr className="section-separator" />

                <div style={{ marginBottom: 'var(--space-sm)' }}>
                  <span className="form-label">
                    Total estimé :{' '}
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {grandTotal.toLocaleString('fr-FR')} €
                    </span>
                  </span>
                </div>

                <div>
                  <span className="form-label" style={{ marginBottom: 'var(--space-sm)', display: 'block' }}>
                    {sim.selectedOptionIds.length} options sélectionnées
                  </span>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                    {optionNames.map((name, i) => (
                      <span key={i} className="option-tag">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
