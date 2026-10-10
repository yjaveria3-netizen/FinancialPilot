import HeroBanner from '../components/HeroBanner';
import DashboardMetrics from '../components/DashboardMetrics';
import ValueProps from '../components/ValueProps';
import BusinessNeeds from '../components/BusinessNeeds';
import ParticleCanvas from '../components/ParticleCanvas';

export default function DashboardHome() {
  return (
    <div className="relative overflow-hidden space-y-12 min-h-screen">
      {/* ── Moving Celestial Spore Dots in Dashboard Home ── */}
      <ParticleCanvas count={130} />

      <div className="relative z-10 space-y-12">
        <HeroBanner />
        <DashboardMetrics />
        <ValueProps />
        <BusinessNeeds />
      </div>
    </div>
  );
}
