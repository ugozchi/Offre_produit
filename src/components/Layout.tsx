// ============================================
// Layout — Sidebar + Header + Content
// ============================================

import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Layout() {
  const { state } = useAppStore();
  const location = useLocation();

  // Detect current product from URL
  const productMatch = location.pathname.match(
    /\/(product|graph|simulator|simulations)\/([^/]+)/
  );
  const currentProductId = productMatch ? productMatch[2] : null;
  const currentProduct = currentProductId
    ? state.products.find((p) => p.id === currentProductId)
    : null;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">⚡</div>
          <span className="sidebar-logo-text">Offre Produit</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navigation</div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">📊</span>
            Tableau de bord
          </NavLink>

          <div className="sidebar-section-title">Produits</div>
          {state.products.map((product) => (
            <NavLink
              key={product.id}
              to={`/product/${product.id}`}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive || currentProductId === product.id ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{product.icon}</span>
              {product.name}
            </NavLink>
          ))}

          {/* Product-specific sub-nav */}
          {currentProduct && (
            <>
              <div className="sidebar-section-title">
                {currentProduct.name}
              </div>
              <NavLink
                to={`/product/${currentProductId}`}
                end
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">🧩</span>
                Arborescence
              </NavLink>
              <NavLink
                to={`/graph/${currentProductId}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">🕸️</span>
                Dépendances
              </NavLink>
              <NavLink
                to={`/simulator/${currentProductId}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">🧮</span>
                Simulateur
              </NavLink>
              <NavLink
                to={`/simulations/${currentProductId}`}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">📋</span>
                Simulations
              </NavLink>
            </>
          )}
        </nav>

        {/* Sidebar footer */}
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.7rem',
            color: 'var(--text-tertiary)',
          }}
        >
          {isSupabaseConfigured ? 'v1.0 — Cloud Sync (Supabase)' : 'v1.0 — Mode local'}
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <header className="app-header">
          <div className="flex items-center gap-md">
            {currentProduct ? (
              <span className="text-sm text-secondary">
                {currentProduct.icon} {currentProduct.name}
              </span>
            ) : (
              <span className="text-sm text-secondary">
                Offre Produit — Configurateur
              </span>
            )}
          </div>
          <div className="flex items-center gap-sm">
            {isSupabaseConfigured ? (
              <span
                className="badge"
                style={{
                  background: 'rgba(74, 222, 128, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                }}
              >
                ● Cloud Sync (Supabase)
              </span>
            ) : (
              <span
                className="badge"
                style={{
                  background: 'rgba(250, 204, 21, 0.15)',
                  color: '#facc15',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                }}
              >
                ● Mode Local
              </span>
            )}
          </div>
        </header>

        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
