import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import CfoChatDrawer from './CfoChatDrawer';
import CosmicBackground from './CosmicBackground';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen text-text font-primary flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* ── 1. Global Cosmic Background (Spore Dots & Middle Purple Shadows on All Pages) ── */}
      <CosmicBackground />

      {/* ── 2. Collapsible Left Sidebar (Active in all App & Dashboard routes) ── */}
      {!isLandingPage && (
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      {/* ── 3. Top Header ── */}
      <Header />

      {/* ── 4. Main Page Content ── */}
      <main
        className={`flex-1 relative z-10 transition-all duration-300 ${
          !isLandingPage ? (sidebarCollapsed ? 'pl-20' : 'pl-72') : ''
        }`}
      >
        <Outlet />
      </main>

      {/* ── 5. Footer (On Landing Page) ── */}
      {isLandingPage && <Footer />}

      {/* ── 6. Floating AI CFO Chat Bubble & Slide-Out Right Drawer (On All Pages) ── */}
      <CfoChatDrawer />
    </div>
  );
}
