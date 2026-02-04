import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductList from './admin/ProductList';
import ProductForm from './admin/ProductForm';
import KitchenLogin from './kitchen/KitchenLogin';
import KitchenLayout from './kitchen/KitchenLayout';
import KitchenDashboard from './kitchen/KitchenDashboard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Fix for background tab throttling: prevents animations from "jumping" 
// when the user returns to the tab after a long period.
gsap.ticker.lagSmoothing(1000, 16);

// Ensure ScrollTrigger positions are recalculated when the tab regains focus.
window.addEventListener('focus', () => {
  ScrollTrigger.refresh();
});

// Security: Disable right-click and developer tool shortcuts globally
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  // Disable F12
  if (e.key === 'F12') {
    e.preventDefault();
  }
  // Disable Ctrl+Shift+I, J, C (Windows/Linux)
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
  }
  // Disable Ctrl+U (View Source)
  if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
  }
  // Mac equivalents (Cmd+Option+I, J, C)
  if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
  }
  // Cmd+Option+U (View Source Mac)
  if (e.metaKey && e.altKey && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
  }
  // Cmd+U (View Source Mac standard)
  if (e.metaKey && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
  }
}, false);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Main public site */}
        <Route path="/" element={<App />} />

        {/* Admin Panel */}
        <Route path="/admin-panel0/login" element={<AdminLogin />} />
        <Route path="/admin-panel0" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
        </Route>

        {/* Kitchen Dashboard */}
        <Route path="/kitchen" element={<KitchenLogin />} />
        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route path="dashboard" element={<KitchenDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);