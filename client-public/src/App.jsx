import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';

import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LiveChatWidget from './components/LiveChatWidget';
import AuthModal from './components/AuthModal';
import ReviewModal from './components/ReviewModal';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ReviewsPage from './pages/ReviewsPage';
import FactoryStoryPage from './pages/FactoryStoryPage';
import PortExportPage from './pages/PortExportPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import CheckoutPage from './pages/CheckoutPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [theme, setTheme] = useState(() => localStorage.getItem('accio_theme') || 'light');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('accio_theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProductsList(data.products);
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Route matching
  let pageComponent = null;

  if (currentPath === '/' || currentPath === '') {
    pageComponent = <HomePage navigate={navigate} onOpenReviewModal={() => setIsReviewModalOpen(true)} />;
  } else if (currentPath === '/products') {
    pageComponent = <ProductsPage navigate={navigate} />;
  } else if (currentPath.startsWith('/products/')) {
    const slug = currentPath.replace('/products/', '');
    pageComponent = <ProductDetailPage productSlug={slug} navigate={navigate} onOpenReviewModal={() => setIsReviewModalOpen(true)} />;
  } else if (currentPath === '/reviews') {
    pageComponent = <ReviewsPage onOpenReviewModal={() => setIsReviewModalOpen(true)} />;
  } else if (currentPath === '/factory-story') {
    pageComponent = <FactoryStoryPage navigate={navigate} />;
  } else if (currentPath === '/port-export') {
    pageComponent = <PortExportPage navigate={navigate} />;
  } else if (currentPath.startsWith('/track')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '';
    pageComponent = <OrderTrackingPage initialTracking={id} />;
  } else if (currentPath === '/checkout') {
    pageComponent = <CheckoutPage navigate={navigate} />;
  } else {
    pageComponent = <HomePage navigate={navigate} onOpenReviewModal={() => setIsReviewModalOpen(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        currentPath={currentPath}
        navigate={navigate}
      />

      <main style={{ flex: 1 }}>
        {pageComponent}
      </main>

      <Footer navigate={navigate} />

      <CartDrawer onProceedCheckout={() => navigate('/checkout')} />
      <LiveChatWidget />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        products={productsList}
        onReviewSubmitted={() => {
          if (currentPath === '/reviews' || currentPath === '/') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
