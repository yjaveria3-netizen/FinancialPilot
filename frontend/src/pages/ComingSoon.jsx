import { Link } from 'react-router-dom';
import { IconScenarioPlanner } from '../components/Icons';

export default function ComingSoon({
  title = 'Feature',
  icon = null,
  assignee = 'Financial Pilot Core Suite',
}) {
  return (
    <div className="container mx-auto px-4 lg:px-8 pt-40 pb-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="size-20 rounded-3xl bg-light border border-border flex items-center justify-center text-primary shadow-xl">
        {icon || <IconScenarioPlanner className="size-10 text-primary" />}
      </div>
      <div>
        <h2 className="text-3xl font-bold font-secondary text-white">{title}</h2>
        <p className="text-text-dark mt-2 max-w-md mx-auto text-sm">
          This financial intelligence engine is actively running algorithmic models in the background.
        </p>
      </div>

      <div className="bg-light border border-border rounded-3xl p-6 max-w-md text-left w-full space-y-3">
        <div className="text-xs font-semibold text-primary uppercase tracking-wider">
          Engine Specification
        </div>
        <code className="text-xs text-text-dark block leading-relaxed font-mono bg-dark/50 p-4 rounded-2xl border border-border/50">
          • Engine: {title}<br />
          • Category: {assignee}<br />
          • Data source: /backend/data/*.csv<br />
          • API endpoint: FastAPI async engine
        </code>
      </div>

      <Link to="/dashboard" className="btn btn-outline btn-sm">
        ← Return to Morning Dashboard
      </Link>
    </div>
  );
}
