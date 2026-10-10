import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="section py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="rounded-4xl bg-light border border-border p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl hover:border-secondary/60 hover:shadow-[0_0_35px_rgba(63,191,168,0.35)] transition-all duration-300">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-secondary text-white mb-6 max-w-2xl mx-auto leading-tight">
            {t('cta_heading_1', 'Ready to Stop Flying Blind on Your')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-normal">
              {t('cta_heading_2', 'Business Finances?')}
            </span>
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            {t(
              'cta_subheading',
              'Join forward-thinking business owners who use Financial Pilot to project cash flow, build lender credit readiness, and navigate runway with confidence.'
            )}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/dashboard" className="btn btn-primary">
              {t('cta_launch_btn', 'Launch Live Dashboard')}
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {t('cta_api_docs', 'Explore Backend API')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
