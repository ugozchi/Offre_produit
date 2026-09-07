# Offre Produit — Walkthrough

L'application est opérationnelle ! Voici un tour des 4 pages principales.

---

## 1. 📊 Dashboard

![Dashboard — Index des produits](/Users/ugozanchi/.gemini/antigravity-ide/brain/8d187efa-3248-48b0-8bbc-77eb846a66ff/dashboard.png)

- **4 stats** en haut : Produits, Blocs de configuration, Options, Simulations
- **Carte PROMOGAMING** pré-remplie avec 5 catégories, 42 blocs, 88 options
- **Bouton "Nouveau Produit"** pour ajouter d'autres offres

---

## 2. 🧩 Arborescence Interactive

![Arborescence — Vue produit](/Users/ugozanchi/.gemini/antigravity-ide/brain/8d187efa-3248-48b0-8bbc-77eb846a66ff/product_view.png)

- **5 catégories** organisées avec barres de couleur : Paramétrages Communs, Ad-hoc, Ciblage/Audience, Type de Dotation, Emplacement(s)
- Chaque **bloc** affiche sa complexité (badge Simple/Moyen/Complexe) et le nombre d'options
- **Clique sur un bloc** pour ouvrir le drawer de détails

---

## 3. 📋 Drawer de Détails (bloc cliqué)

![Drawer — Détails du bloc Type de Bannière(s)](/Users/ugozanchi/.gemini/antigravity-ide/brain/8d187efa-3248-48b0-8bbc-77eb846a66ff/block_drawer.png)

- **Infos complètes** : description, temps de dev, coût infra, complexité, dépendances
- **Liste des options** avec boutons d'édition et suppression
- **Mode édition** (bouton ✏️) pour modifier les coûts, la complexité, les notes

---

## 4. 🧮 Simulateur de Coûts

![Simulateur — Configurateur avec calcul temps réel](/Users/ugozanchi/.gemini/antigravity-ide/brain/8d187efa-3248-48b0-8bbc-77eb846a66ff/simulator.png)

- **Sélection d'options** par bloc avec checkboxes
- **Panneau de coûts** à droite en temps réel : temps de dev, coût dev estimé (500€/jour), infra mensuel, production
- **Sauvegarde** de la simulation pour comparaison

---

## 🎥 Vidéo de démonstration

![Démo complète de l'application](/Users/ugozanchi/.gemini/antigravity-ide/brain/8d187efa-3248-48b0-8bbc-77eb846a66ff/full_app_test_1788428722212.webp)

---

## Fichiers créés

| Fichier | Rôle |
|---------|------|
| [index.html](file:///Users/ugozanchi/Documents/Code/Offre_produit/index.html) | HTML racine avec SEO |
| [index.css](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/index.css) | Design system complet (dark mode, glassmorphism) |
| [types/index.ts](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/types/index.ts) | Modèle de données TypeScript |
| [data/promogaming.ts](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/data/promogaming.ts) | Données seed PROMOGAMING (42 blocs, 88 options) |
| [store/AppContext.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/store/AppContext.tsx) | Store React Context + localStorage |
| [App.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/App.tsx) | Routing principal |
| [components/Layout.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/components/Layout.tsx) | Layout sidebar + header |
| [pages/Dashboard.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/pages/Dashboard.tsx) | Index des produits |
| [pages/ProductView.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/pages/ProductView.tsx) | Arborescence interactive + drawer |
| [pages/Simulator.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/pages/Simulator.tsx) | Simulateur de coûts |
| [pages/SimulationRecap.tsx](file:///Users/ugozanchi/Documents/Code/Offre_produit/src/pages/SimulationRecap.tsx) | Récapitulatif des simulations |

## Prochaines étapes

> [!NOTE]
> Les données sont actuellement **persistées en localStorage**. Pour l'aspect collaboratif avec Supabase, il faudra :
> 1. Créer un projet Supabase (gratuit)
> 2. Me fournir l'URL + clé anon
> 3. Je migrerai le store local vers Supabase avec auth + realtime

L'app tourne sur **http://localhost:5173/** — tu peux commencer à renseigner les coûts de tes blocs dès maintenant !
