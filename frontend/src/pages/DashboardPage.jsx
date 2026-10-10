import DashboardMetrics from '../components/DashboardMetrics';
import ParticleCanvas from '../components/ParticleCanvas';

export default function DashboardPage() {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 min-h-screen">
      {/* ── Moving Celestial Spore Dots in Dashboard ── */}
      <ParticleCanvas count={130} />

      <div className="relative z-10">
        <DashboardMetrics />
      </div>
    </div>
  );
}
