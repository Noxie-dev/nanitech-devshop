import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import Dashboard from './components/Dashboard';
import { useAnalytics } from './hooks/useAnalytics';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Lazy load heavy components
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AuthDemo = lazy(() => import('./pages/AuthDemo'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  useAnalytics();
  return (
    <div className="min-h-screen bg-[#0C0F16] text-[#EAEAEA] overflow-x-hidden">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={
            <Suspense fallback={
              <div className="min-h-screen bg-[#0C0F16] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5FF] mx-auto mb-4"></div>
                  <p className="text-[#EAEAEA]">Loading Services...</p>
                </div>
              </div>
            }>
              <ServicesPage />
            </Suspense>
          } />
          <Route path="/auth-demo" element={
            <Suspense fallback={
              <div className="min-h-screen bg-[#0C0F16] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5FF] mx-auto mb-4"></div>
                  <p className="text-[#EAEAEA]">Loading Auth Demo...</p>
                </div>
              </div>
            }>
              <AuthDemo />
            </Suspense>
          } />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

