// ============================================
// Dashboard — Index des produits
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';

export default function Dashboard() {
  const { state, dispatch, getProductCategories } = useAppStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    icon: '📦',
  });

  const handleCreateProduct = () => {
    if (!newProduct.name.trim()) return;
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setNewProduct({ name: '', description: '', icon: '📦' });
    setShowModal(false);
  };

  const handleDeleteProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (confirm('Supprimer ce produit et toutes ses données ?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  // Calculate stats
  const totalBlocks = state.blocks.length;
  const totalOptions = state.options.length;
  const totalSimulations = state.simulations.length;

  const emojiOptions = ['📦', '🎮', '🛒', '🎯', '🚀', '💎', '🎪', '📊', '🔧', '⚡', '🌟', '🎁'];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>📊</span> Tableau de bord
          </h1>
          <p className="page-subtitle">
            Vue d'ensemble de vos offres produit
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span>+</span> Nouveau Produit
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
        className="stagger-children"
      >
        <div className="glass-card stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{state.products.length}</div>
          <div className="stat-label">Produits</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon">🧩</div>
          <div className="stat-value">{totalBlocks}</div>
          <div className="stat-label">Blocs de configuration</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-value">{totalOptions}</div>
          <div className="stat-label">Options disponibles</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon">🧮</div>
          <div className="stat-value">{totalSimulations}</div>
          <div className="stat-label">Simulations sauvegardées</div>
        </div>
      </div>

      {/* Products Grid */}
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Vos Produits</h2>
      <div className="products-grid stagger-children">
        {state.products.map((product) => {
          const categories = getProductCategories(product.id);
          const blockCount = categories.reduce(
            (sum, cat) =>
              sum +
              state.blocks.filter((b) => b.categoryId === cat.id).length,
            0
          );
          const simCount = state.simulations.filter(
            (s) => s.productId === product.id
          ).length;

          return (
            <div
              key={product.id}
              className="glass-card product-card interactive"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <button
                className="btn btn-ghost btn-icon"
                style={{
                  position: 'absolute',
                  top: 'var(--space-md)',
                  right: 'var(--space-md)',
                  fontSize: '0.9rem',
                }}
                onClick={(e) => handleDeleteProduct(e, product.id)}
                title="Supprimer"
              >
                🗑️
              </button>
              <div className="product-card-icon">{product.icon}</div>
              <div className="product-card-name">{product.name}</div>
              <div className="product-card-desc">{product.description}</div>
              <div className="product-card-stats">
                <div className="product-card-stat">
                  <div className="product-card-stat-value">{categories.length}</div>
                  <div className="product-card-stat-label">Catégories</div>
                </div>
                <div className="product-card-stat">
                  <div className="product-card-stat-value">{blockCount}</div>
                  <div className="product-card-stat-label">Blocs</div>
                </div>
                <div className="product-card-stat">
                  <div className="product-card-stat-value">{simCount}</div>
                  <div className="product-card-stat-label">Simulations</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* New Product Card */}
        <div
          className="glass-card new-product-card"
          onClick={() => setShowModal(true)}
        >
          <div className="new-product-card-icon">+</div>
          <div className="new-product-card-text">Ajouter un produit</div>
        </div>
      </div>

      {/* Create Product Modal */}
      <div className={`modal-overlay ${showModal ? 'open' : ''}`} onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Nouveau Produit</h3>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Icône</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    className={`btn btn-ghost btn-icon ${
                      newProduct.icon === emoji ? 'btn-primary' : ''
                    }`}
                    style={{ fontSize: '1.5rem' }}
                    onClick={() => setNewProduct({ ...newProduct, icon: emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nom du produit</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ex: PROMOGAMING, LOYALTY BOOST..."
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProduct()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Description de l'offre produit..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Annuler
            </button>
            <button className="btn btn-primary" onClick={handleCreateProduct}>
              Créer le produit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
