/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Architecture from './pages/Architecture';
import Security from './pages/Security';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

const DashboardRouter = lazy(() => import('./router/DashboardRouter'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages with marketing layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/security" element={<Security />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard (protected, own layout) */}
        <Route path="/dashboard/*" element={
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-prism-bg">
              <div className="w-8 h-8 border-2 border-prism-accent/30 border-t-prism-accent rounded-full animate-spin" />
            </div>
          }>
            <DashboardRouter />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
}


