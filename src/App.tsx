// ============================================
// App — Root component with routing
// ============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductView from './pages/ProductView';
import DependencyGraphView from './pages/DependencyGraphView';
import Simulator from './pages/Simulator';
import SimulationRecap from './pages/SimulationRecap';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product/:productId" element={<ProductView />} />
            <Route path="/graph/:productId" element={<DependencyGraphView />} />
            <Route path="/simulator/:productId" element={<Simulator />} />
            <Route path="/simulations/:productId" element={<SimulationRecap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
