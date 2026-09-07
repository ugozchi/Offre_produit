// ============================================
// PROMOGAMING — Données initiales (seed)
// Basé sur le diagramme Figma
// ============================================

import type { Product, Category, ConfigBlock, Option } from '../types';

// ---- PRODUCT ----
export const promogamingProduct: Product = {
  id: 'prod-promogaming',
  name: 'PROMOGAMING',
  description: 'Diagramme exhaustif des possibilités de configuration d\'une opération de promogaming.',
  icon: '🎮',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ---- CATEGORIES ----
export const promogamingCategories: Category[] = [
  {
    id: 'cat-params-communs',
    productId: 'prod-promogaming',
    name: 'Paramétrages Communs',
    color: '#F5A623',
    sortOrder: 1,
  },
  {
    id: 'cat-params-adhoc',
    productId: 'prod-promogaming',
    name: 'Paramétrages Ad-hoc',
    color: '#F5D76E',
    sortOrder: 2,
  },
  {
    id: 'cat-ciblage',
    productId: 'prod-promogaming',
    name: 'Ciblage / Audience',
    color: '#E8DCC8',
    sortOrder: 3,
  },
  {
    id: 'cat-dotation',
    productId: 'prod-promogaming',
    name: 'Type de Dotation',
    color: '#F5A623',
    sortOrder: 4,
  },
  {
    id: 'cat-emplacement',
    productId: 'prod-promogaming',
    name: 'Emplacement(s)',
    color: '#D4C5A9',
    sortOrder: 5,
  },
];

// ---- CONFIG BLOCKS ----
export const promogamingBlocks: ConfigBlock[] = [
  // ==============================
  // Paramétrages Communs
  // ==============================
  {
    id: 'blk-banniere',
    categoryId: 'cat-params-communs',
    name: 'Type de Bannière(s)',
    description: 'Configuration du type de bannière promotionnelle affiché aux utilisateurs.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 1,
  },
  {
    id: 'blk-perso',
    categoryId: 'cat-params-communs',
    name: 'Personnalisation',
    description: 'Options de personnalisation visuelle de l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 2,
  },
  {
    id: 'blk-marques',
    categoryId: 'cat-params-communs',
    name: 'Marque(s)',
    description: 'Sélection des marques associées à l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 3,
  },
  {
    id: 'blk-jeux',
    categoryId: 'cat-params-communs',
    name: 'Jeu(x)',
    description: 'Configuration des jeux disponibles dans l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 4,
  },
  {
    id: 'blk-distribution',
    categoryId: 'cat-params-communs',
    name: 'Distribution des Gains',
    description: 'Paramétrage de la distribution des gains aux participants.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: ['blk-jeux'],
    notes: '',
    sortOrder: 5,
  },
  {
    id: 'blk-conditions',
    categoryId: 'cat-params-communs',
    name: 'Conditions d\'éligibilité',
    description: 'Définition des conditions requises pour participer.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 6,
  },
  {
    id: 'blk-liste-eligibilite',
    categoryId: 'cat-params-communs',
    name: 'Liste d\'éligibilité produit',
    description: 'Liste des produits éligibles à l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 7,
  },
  {
    id: 'blk-canal',
    categoryId: 'cat-params-communs',
    name: 'Canal',
    description: 'Canal de diffusion de l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 8,
  },
  {
    id: 'blk-devices',
    categoryId: 'cat-params-communs',
    name: 'Device(s)',
    description: 'Appareils ciblés pour l\'affichage.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 9,
  },
  {
    id: 'blk-seuil',
    categoryId: 'cat-params-communs',
    name: 'Seuil',
    description: 'Paramétrage des seuils de déclenchement.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 10,
  },
  {
    id: 'blk-connection',
    categoryId: 'cat-params-communs',
    name: 'Connection Shopper',
    description: 'Gestion de la connexion du shopper.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 11,
  },
  {
    id: 'blk-carte-fidelite-commun',
    categoryId: 'cat-params-communs',
    name: 'Carte de Fidélité',
    description: 'Intégration avec le programme de fidélité.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: ['blk-connection'],
    notes: '',
    sortOrder: 12,
  },
  {
    id: 'blk-urls',
    categoryId: 'cat-params-communs',
    name: 'URLs',
    description: 'Configuration des URLs de l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 13,
  },
  {
    id: 'blk-sms',
    categoryId: 'cat-params-communs',
    name: 'SMS',
    description: 'Configuration des notifications SMS.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 14,
  },

  // ==============================
  // Paramétrages Ad-hoc
  // ==============================
  {
    id: 'blk-temps-fort',
    categoryId: 'cat-params-adhoc',
    name: 'Temps fort',
    description: 'Configuration des temps forts de l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 1,
  },
  {
    id: 'blk-vague',
    categoryId: 'cat-params-adhoc',
    name: 'Vague',
    description: 'Gestion des vagues d\'opérations.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 2,
  },
  {
    id: 'blk-module-video',
    categoryId: 'cat-params-adhoc',
    name: 'Module vidéo',
    description: 'Intégration de modules vidéo dans l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 3,
  },
  {
    id: 'blk-multi-mails',
    categoryId: 'cat-params-adhoc',
    name: 'Configuration Multi-Mails',
    description: 'Paramétrage des envois multi-mails.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 4,
  },

  // ==============================
  // Ciblage / Audience
  // ==============================
  {
    id: 'blk-frequence',
    categoryId: 'cat-ciblage',
    name: 'Fréquence',
    description: 'Paramétrage de la fréquence d\'exposition.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 1,
  },
  {
    id: 'blk-segmentation',
    categoryId: 'cat-ciblage',
    name: 'Segmentation',
    description: 'Configuration de la segmentation audience.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 2,
  },
  {
    id: 'blk-audience-shopper',
    categoryId: 'cat-ciblage',
    name: 'Audience Shopper',
    description: 'Ciblage basé sur les profils shopper.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 3,
  },
  {
    id: 'blk-portee',
    categoryId: 'cat-ciblage',
    name: 'Portée',
    description: 'Configuration de la portée de l\'opération.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 4,
  },
  {
    id: 'blk-carte-fidelite-ciblage',
    categoryId: 'cat-ciblage',
    name: 'Carte de fidélité',
    description: 'Ciblage basé sur la carte de fidélité.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 5,
  },

  // ==============================
  // Type de Dotation
  // ==============================
  {
    id: 'blk-bon-reduction',
    categoryId: 'cat-dotation',
    name: 'Bon de réduction',
    description: 'Dotation sous forme de bon de réduction.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 1,
  },
  {
    id: 'blk-cagnottage',
    categoryId: 'cat-dotation',
    name: 'Cagnottage',
    description: 'Dotation sous forme de cagnottage fidélité.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 2,
  },
  {
    id: 'blk-dotation-physique',
    categoryId: 'cat-dotation',
    name: 'Dotation Physique',
    description: 'Dotation sous forme de produit physique.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 3,
  },
  {
    id: 'blk-dotation-digitale',
    categoryId: 'cat-dotation',
    name: 'Dotation Digitale',
    description: 'Dotation sous forme digitale (codes, vouchers).',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 4,
  },
  {
    id: 'blk-remboursement',
    categoryId: 'cat-dotation',
    name: 'Remboursement',
    description: 'Dotation sous forme de remboursement.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 5,
  },
  {
    id: 'blk-dotation-pendante',
    categoryId: 'cat-dotation',
    name: 'Dotation Pendante',
    description: 'Dotation en attente de validation/réclamation.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 6,
  },

  // ==============================
  // Emplacement(s)
  // ==============================
  {
    id: 'blk-addtobasket',
    categoryId: 'cat-emplacement',
    name: 'AddToBasket',
    description: 'Affichage lors de l\'ajout au panier.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 1,
  },
  {
    id: 'blk-lastcall',
    categoryId: 'cat-emplacement',
    name: 'LastCall',
    description: 'Affichage en dernière chance avant validation.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 2,
  },
  {
    id: 'blk-homepage',
    categoryId: 'cat-emplacement',
    name: 'Homepage',
    description: 'Affichage sur la page d\'accueil.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 3,
  },
  {
    id: 'blk-page-categorie',
    categoryId: 'cat-emplacement',
    name: 'Page Catégorie / ...',
    description: 'Affichage sur les pages catégorie.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 4,
  },
  {
    id: 'blk-page-search',
    categoryId: 'cat-emplacement',
    name: 'Page Search',
    description: 'Affichage sur la page de recherche.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 5,
  },
  {
    id: 'blk-page-promo',
    categoryId: 'cat-emplacement',
    name: 'Page Promo',
    description: 'Affichage sur la page promotions.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 6,
  },
  {
    id: 'blk-page-panier',
    categoryId: 'cat-emplacement',
    name: 'Page Panier',
    description: 'Affichage dans le panier.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 7,
  },
  {
    id: 'blk-product-list',
    categoryId: 'cat-emplacement',
    name: 'Product List Page',
    description: 'Affichage sur la page liste de produits.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 8,
  },
  {
    id: 'blk-page-fidelite',
    categoryId: 'cat-emplacement',
    name: 'Page Fidélité',
    description: 'Affichage sur la page fidélité.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 9,
  },
  {
    id: 'blk-shop-in-shop',
    categoryId: 'cat-emplacement',
    name: 'Page Shop-in-Shop',
    description: 'Affichage dans un shop-in-shop.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'moyen',
    dependencies: [],
    notes: '',
    sortOrder: 10,
  },
  {
    id: 'blk-page-hub',
    categoryId: 'cat-emplacement',
    name: 'Page HUB',
    description: 'Affichage sur le hub de navigation.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 11,
  },
  {
    id: 'blk-page-help',
    categoryId: 'cat-emplacement',
    name: 'Page Help',
    description: 'Affichage sur la page d\'aide.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'simple',
    dependencies: [],
    notes: '',
    sortOrder: 12,
  },
  {
    id: 'blk-app-fidelite',
    categoryId: 'cat-emplacement',
    name: 'App Fidélité',
    description: 'Affichage dans l\'application fidélité mobile.',
    devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0,
    infraCostMonthly: 0,
    complexity: 'complexe',
    dependencies: [],
    notes: '',
    sortOrder: 13,
  },
];

// ---- OPTIONS ----
export const promogamingOptions: Option[] = [
  // Type de Bannière(s)
  { id: 'opt-ban-achat', blockId: 'blk-banniere', name: 'Achat', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-ban-categorie', blockId: 'blk-banniere', name: 'Catégorie', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-ban-marque', blockId: 'blk-banniere', name: 'Marque', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },
  { id: 'opt-ban-promo', blockId: 'blk-banniere', name: 'Promo', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 4 },
  { id: 'opt-ban-module', blockId: 'blk-banniere', name: 'Module', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 5 },
  { id: 'opt-ban-reactivation', blockId: 'blk-banniere', name: 'Réactivation', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 6 },
  { id: 'opt-ban-sur-promo', blockId: 'blk-banniere', name: 'Sur PA Promotions', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 7 },

  // Personnalisation
  { id: 'opt-perso-header', blockId: 'blk-perso', name: 'Header', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-perso-marque', blockId: 'blk-perso', name: 'Marque Perso', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-perso-liste', blockId: 'blk-perso', name: 'Liste Produit Std', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Marque(s)
  { id: 'opt-marq-mono', blockId: 'blk-marques', name: 'Mono Marque', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-marq-multi', blockId: 'blk-marques', name: 'Multi Marques', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Jeu(x)
  { id: 'opt-jeux-instant', blockId: 'blk-jeux', name: 'Instant Gagnant', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-jeux-tirage', blockId: 'blk-jeux', name: 'Tirage au Sort', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-jeux-100-gagnant', blockId: 'blk-jeux', name: '100% Gagnant', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Distribution des Gains
  { id: 'opt-dist-aleatoire', blockId: 'blk-distribution', name: 'Aléatoire', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-dist-sequentiel', blockId: 'blk-distribution', name: 'Séquentiel', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-dist-capitalise', blockId: 'blk-distribution', name: 'Capitalisé', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Conditions d'éligibilité
  { id: 'opt-cond-montant', blockId: 'blk-conditions', name: 'Montant Min', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-cond-qte', blockId: 'blk-conditions', name: 'Quantité Min', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-cond-produit', blockId: 'blk-conditions', name: 'Produit Spécifique', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Liste d'éligibilité produit
  { id: 'opt-elig-marque', blockId: 'blk-liste-eligibilite', name: 'Par Marque', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-elig-ean', blockId: 'blk-liste-eligibilite', name: 'Par EAN', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-elig-categorie', blockId: 'blk-liste-eligibilite', name: 'Par Catégorie', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Canal
  { id: 'opt-canal-site', blockId: 'blk-canal', name: 'Site Web', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-canal-drive', blockId: 'blk-canal', name: 'Drive', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-canal-app', blockId: 'blk-canal', name: 'Application', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Device(s)
  { id: 'opt-dev-desktop', blockId: 'blk-devices', name: 'Desktop', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-dev-mobile', blockId: 'blk-devices', name: 'Mobile', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-dev-tablette', blockId: 'blk-devices', name: 'Tablette', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Seuil
  { id: 'opt-seuil-montant', blockId: 'blk-seuil', name: 'Montant', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-seuil-qte', blockId: 'blk-seuil', name: 'Quantité', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Connection Shopper
  { id: 'opt-conn-connecte', blockId: 'blk-connection', name: 'Connecté', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-conn-anonyme', blockId: 'blk-connection', name: 'Anonyme', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Carte de Fidélité (commun)
  { id: 'opt-fid-comm-oui', blockId: 'blk-carte-fidelite-commun', name: 'Oui', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-fid-comm-non', blockId: 'blk-carte-fidelite-commun', name: 'Non', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // URLs
  { id: 'opt-url-custom', blockId: 'blk-urls', name: 'URL Personnalisée', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-url-auto', blockId: 'blk-urls', name: 'URL Auto-générée', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // SMS
  { id: 'opt-sms-oui', blockId: 'blk-sms', name: 'Avec SMS', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-sms-non', blockId: 'blk-sms', name: 'Sans SMS', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Temps fort
  { id: 'opt-tf-ephemeral', blockId: 'blk-temps-fort', name: 'Éphéméride / Marketing', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-tf-saisonnier', blockId: 'blk-temps-fort', name: 'Saisonnier', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-tf-evenement', blockId: 'blk-temps-fort', name: 'Événementiel', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Vague
  { id: 'opt-vague-filtrée', blockId: 'blk-vague', name: 'Filtrée', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-vague-exclusive', blockId: 'blk-vague', name: 'Exclusive', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-vague-partenaire', blockId: 'blk-vague', name: 'Partenaire', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Module vidéo
  { id: 'opt-video-auto', blockId: 'blk-module-video', name: 'Auto', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-video-clic', blockId: 'blk-module-video', name: 'Sur Clic', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-video-non', blockId: 'blk-module-video', name: 'Non', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Configuration Multi-Mails
  { id: 'opt-mail-oui', blockId: 'blk-multi-mails', name: 'Oui', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-mail-non', blockId: 'blk-multi-mails', name: 'Non', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Fréquence
  { id: 'opt-freq-illimitee', blockId: 'blk-frequence', name: 'Illimitée', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-freq-quotidienne', blockId: 'blk-frequence', name: 'Quotidienne', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-freq-hebdo', blockId: 'blk-frequence', name: 'Hebdomadaire', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },
  { id: 'opt-freq-unique', blockId: 'blk-frequence', name: 'Unique', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 4 },

  // Segmentation
  { id: 'opt-seg-critere', blockId: 'blk-segmentation', name: 'Critère(s)', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-seg-progresif', blockId: 'blk-segmentation', name: '> à x segments', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-seg-aucune', blockId: 'blk-segmentation', name: 'Aucune', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Audience Shopper
  { id: 'opt-aud-actu-minimum-social', blockId: 'blk-audience-shopper', name: 'Actu Minimum Social', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-aud-sans-minimum', blockId: 'blk-audience-shopper', name: 'Sans Minimum Social', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-aud-produit-niche', blockId: 'blk-audience-shopper', name: 'Produit Niche', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },
  { id: 'opt-aud-tout-le-monde', blockId: 'blk-audience-shopper', name: 'Tout le monde', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 4 },
  { id: 'opt-aud-canvas', blockId: 'blk-audience-shopper', name: 'Canvas', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 5 },
  { id: 'opt-aud-audience', blockId: 'blk-audience-shopper', name: 'Audience', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 6 },

  // Portée
  { id: 'opt-portee-nationale', blockId: 'blk-portee', name: 'Nationale', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-portee-locale', blockId: 'blk-portee', name: 'Locale', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Carte de fidélité (ciblage)
  { id: 'opt-fid-oui', blockId: 'blk-carte-fidelite-ciblage', name: 'Oui', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-fid-non', blockId: 'blk-carte-fidelite-ciblage', name: 'Non', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Bon de réduction
  { id: 'opt-bdr-classique', blockId: 'blk-bon-reduction', name: 'Classique', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-bdr-simple', blockId: 'blk-bon-reduction', name: 'Simple', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-bdr-pourcentage', blockId: 'blk-bon-reduction', name: 'Pourcentage', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Cagnottage
  { id: 'opt-cag-direct', blockId: 'blk-cagnottage', name: 'Direct', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-cag-differe', blockId: 'blk-cagnottage', name: 'Différé', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Dotation Physique
  { id: 'opt-dphy-produit', blockId: 'blk-dotation-physique', name: 'Produit Coffret', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-dphy-ticket', blockId: 'blk-dotation-physique', name: 'Activité / Ticket', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Dotation Digitale
  { id: 'opt-ddig-codepromo', blockId: 'blk-dotation-digitale', name: 'Code Promo', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-ddig-voucher', blockId: 'blk-dotation-digitale', name: 'Voucher', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
  { id: 'opt-ddig-emailing', blockId: 'blk-dotation-digitale', name: 'Emailing', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 3 },

  // Remboursement
  { id: 'opt-remb-total', blockId: 'blk-remboursement', name: 'Total', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-remb-partiel', blockId: 'blk-remboursement', name: 'Partiel', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Dotation Pendante
  { id: 'opt-dpend-email', blockId: 'blk-dotation-pendante', name: 'Par Email', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-dpend-inapp', blockId: 'blk-dotation-pendante', name: 'In-App', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  // Emplacements (options simples pour sélection oui/non déjà gérée par le bloc)
  { id: 'opt-empl-atb-settings', blockId: 'blk-addtobasket', name: 'Paramètres spécifiques', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-empl-atb-style', blockId: 'blk-addtobasket', name: 'Style personnalisé', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  { id: 'opt-empl-lc-settings', blockId: 'blk-lastcall', name: 'Paramètres spécifiques', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-empl-lc-style', blockId: 'blk-lastcall', name: 'Style personnalisé', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },

  { id: 'opt-empl-hp-settings', blockId: 'blk-homepage', name: 'Paramètres spécifiques', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 1 },
  { id: 'opt-empl-hp-style', blockId: 'blk-homepage', name: 'Style personnalisé', devTimeHours: 0, salesTimeHours: 0, designTimeHours: 0, csmTimeHours: 0, baTimeHours: 0, infraCostMonthly: 0, productionCost: 0, isDefault: false, sortOrder: 2 },
];
