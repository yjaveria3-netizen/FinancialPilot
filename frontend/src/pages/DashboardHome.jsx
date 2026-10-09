import HeroBanner from '../components/HeroBanner';
import DashboardMetrics from '../components/DashboardMetrics';
import ValueProps from '../components/ValueProps';
import BusinessNeeds from '../components/BusinessNeeds';

export default function DashboardHome() {
  return (
    <div className="space-y-12">
      <HeroBanner />
      <DashboardMetrics />
      <ValueProps />
      <BusinessNeeds />
    </div>
  );
}
