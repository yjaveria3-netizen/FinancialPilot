import { useState, useEffect } from 'react';
import { getCreditScore } from '../api/client';
import { IconAiSparkle } from '../components/Icons';
import ElectricCreditGauge from '../components/ElectricCreditGauge';
import ElectricProgressBar from '../components/ElectricProgressBar';
import { useLanguage } from '../context/LanguageContext';

export default function CreditScorePage() {
  const { t, translateGeminiContent } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCreditScore()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const tips = data?.ai_advice
    ? data.ai_advice
        .split(/\n+/)
        .map((t) => t.replace(/^\d+\.\s*/, '').trim())
        .filter((t) => t.length > 10)
    : [];

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-border text-xs text-primary mb-3 font-semibold">
          {t('score_engine', 'Bankability & Underwriting Engine')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
          {t('credit_readiness', 'Credit Readiness')}{' '}
          <span className="text-primary font-normal">{t('score_engine_tool', 'Score')}</span>
        </h1>
        <p className="text-sm text-text-dark mt-1">
          {t(
            'underwriting_desc',
            'Lender bankability score computed from consistency, margins, and payment behavior'
          )}
        </p>
      </div>

      {error && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 text-secondary text-sm">
          Error loading score: {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gauge Card (1 col) — Clean organic floating card */}
          <div className="rounded-4xl card-electric p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-xs uppercase tracking-wider text-text-dark font-semibold mb-6 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_#DA7B93] animate-pulse" />
                {t('composite_score', 'Composite Readiness Score')}
              </div>

              {/* Circular Gauge with Electric Current */}
              <div className="my-2">
                <ElectricCreditGauge
                  score={data?.score}
                  grade={data?.grade}
                  size="size-48"
                  idPrefix="page-credit"
                />
              </div>

              <p className="text-xs text-text-dark mt-6 max-w-xs leading-relaxed">
                {t(
                  'underwriting_desc',
                  'Based on historical cash consistency, operating profit margins, invoice turn, and cost control.'
                )}
              </p>
            </div>
          </div>

          {/* Factor Breakdown (2 cols) */}
          <div className="lg:col-span-2 rounded-4xl card-electric p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-lg font-bold font-secondary text-white mb-1 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_#DA7B93] animate-pulse" />
                  {t('score_factors_title', 'Score Factor Breakdown')}
                </h3>
                <p className="text-xs text-text-dark">
                  {t(
                    'score_factors_desc',
                    'The four core underwriting pillars measured by Financial Pilot'
                  )}
                </p>
              </div>

              <div className="space-y-5">
                {data?.breakdown?.map((item, idx) => (
                  <ElectricProgressBar
                    key={item.factor}
                    factorKey={item.factor}
                    label={item.factor}
                    score={item.score}
                    maxScore={item.max_score}
                    explanation={item.explanation}
                    delayIndex={idx}
                    compact={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Advice Card */}
      {!loading && data && (
        <div className="rounded-4xl card-electric p-8 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              <IconAiSparkle className="size-4 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-bold font-secondary text-white">
                {t('gemini_insights_title', 'Gemini AI 90-Day Credit Improvement Roadmap')}
              </h4>
              <p className="text-xs text-text-dark">
                {t('gemini_insights_desc', 'Specific actions you can execute to elevate your score to Grade A')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.length > 0 ? (
              tips.slice(0, 3).map((tip, i) => (
                <div key={i} className="bg-dark/40 rounded-3xl p-6 border border-border/40 flex flex-col gap-3">
                  <div className="size-7 rounded-full bg-primary/20 text-primary text-xs font-bold font-mono flex items-center justify-center">
                    0{i + 1}
                  </div>
                  <p className="text-sm text-text-dark leading-relaxed">{translateGeminiContent(tip)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-dark">{translateGeminiContent(data.ai_advice) || t('ai_connecting', 'AI advice unavailable.')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
