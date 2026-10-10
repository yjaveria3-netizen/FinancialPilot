import { Link } from 'react-router-dom';
import Logo from './Logo';
import ParticleCanvas from './ParticleCanvas';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="section pb-0 relative overflow-hidden border-t border-border/40 mt-20">
      {/* ── Moving Celestial Spore Dots in Footer ── */}
      <ParticleCanvas count={65} />

      <div className="container mx-auto px-4 lg:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Logo & Contact */}
          <div className="text-text">
            <Link to="/">
              <Logo />
            </Link>
            <p className="mt-6 text-sm text-text-dark leading-relaxed">
              {t(
                'footer_tagline',
                'Empowering growing businesses through intelligent financial forecasting and credit readiness co-piloting.'
              )}
            </p>
            <a
              className="link mt-4 inline-block text-sm text-text hover:text-white underline"
              href="mailto:hello@financialpilot.ai"
            >
              hello@financialpilot.ai
            </a>
            <p className="mt-2 text-sm text-text-dark font-mono">(+1) 800-FIN-PILOT</p>
          </div>

          {/* Column 2 - Core Platform */}
          <div>
            <h3 className="footer-label font-secondary font-bold text-white mb-4 text-sm tracking-wide uppercase">
              {t('footer_col_engines', 'Financial Engines')}
            </h3>
            <ul className="space-y-3 text-sm text-text-dark">
              <li>
                <Link to="/cash-flow" className="hover:text-white transition-colors">
                  {t('nav_cash_flow', 'Cash Flow Forecaster')}
                </Link>
              </li>
              <li>
                <Link to="/credit-score" className="hover:text-white transition-colors">
                  {t('nav_credit_score', 'Credit Readiness Score')}
                </Link>
              </li>
              <li>
                <Link to="/anomaly-guard" className="hover:text-white transition-colors">
                  {t('nav_anomaly', 'Anomaly Guard')}
                </Link>
              </li>
              <li>
                <Link to="/tax-assistant" className="hover:text-white transition-colors">
                  {t('nav_tax', 'Tax Assistant')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Operations & Ops AI */}
          <div>
            <h3 className="footer-label font-secondary font-bold text-white mb-4 text-sm tracking-wide uppercase">
              {t('footer_col_ops', 'Operations Suite')}
            </h3>
            <ul className="space-y-3 text-sm text-text-dark">
              <li>
                <Link to="/cfo-chat" className="hover:text-white transition-colors">
                  {t('cfo_title', 'AI CFO Chat')}
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-white transition-colors">
                  {t('nav_inventory', 'Inventory Alerts')}
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('api_docs', 'Backend Swagger API')}
                </a>
              </li>
              <li>
                <span className="text-text-dark/60 font-mono">Pandas Engine (/data)</span>
              </li>
            </ul>
          </div>

          {/* Column 4 - System Status */}
          <div>
            <h3 className="footer-label font-secondary font-bold text-white mb-4 text-sm tracking-wide uppercase">
              {t('footer_col_system', 'System Architecture')}
            </h3>
            <div className="rounded-2xl border border-border bg-light/60 p-4 space-y-2 hover:border-[#DA7B93]/60 hover:shadow-[0_0_20px_rgba(218,123,147,0.25)] transition-all">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-white font-medium">
                  {t('footer_active_status', 'FastAPI Engine: Active')}
                </span>
              </div>
              <p className="text-xs text-text-dark">
                {t('footer_local_csv', 'Local CSV Contract: Synced')}
              </p>
              <p className="text-xs text-text-dark">
                Gemini REST AI Co-Pilot: Connected
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-text-dark gap-4">
          <p>
            Copyright &copy; 2026 <strong className="text-white">Financial Pilot</strong>. {t('footer_rights', 'All Rights Reserved.')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
