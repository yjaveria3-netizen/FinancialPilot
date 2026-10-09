import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CfoChatDrawer from './CfoChatDrawer';
import CosmicBackground from './CosmicBackground';

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen text-text font-primary flex flex-col relative overflow-x-hidden selection:bg-primary selection:text-white">
      {/* ── 1. Global Cosmic Background (Spore Dots & Middle Purple Shadows on All Pages) ── */}
      <CosmicBackground />

      {/* ── 2. Top Header ── */}
      <Header />

      {/* ── 3. Main Page Content ── */}
      <main className="flex-1 relative z-10 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>

      {/* ── 6. Floating AI CFO Chat Bubble & Slide-Out Right Drawer (On All Pages) ── */}
      <CfoChatDrawer />
    </div>
  );
}
