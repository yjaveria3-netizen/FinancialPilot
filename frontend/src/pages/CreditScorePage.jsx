import { useState, useEffect } from 'react';
import { getCreditScore } from '../api/client';
import { IconAiSparkle } from '../components/Icons';

export default function CreditScorePage() {
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
          Bankability & Underwriting Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
          Credit Readiness <span className="text-primary font-normal">Score</span>
        </h1>
        <p className="text-sm text-text-dark mt-1">
          Lender bankability score computed from consistency, margins, and payment behavior
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
          {/* Gauge Card (1 col) */}
          <div className="rounded-4xl bg-light border border-border p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-text-dark font-semibold mb-6">
              Composite Readiness Score
            </div>

            {/* Circular Gauge */}
            <div className="relative size-48 flex items-center justify-center my-4">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#202128" strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#937AFF" strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * (data?.score || 0)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-4xl font-bold font-secondary text-white">
                  {data?.score}
                </div>
                <div className="text-sm text-primary font-bold mt-1">
                  Grade {data?.grade}
                </div>
              </div>
            </div>

            <p className="text-xs text-text-dark mt-6 max-w-xs">
              Based on historical cash consistency, operating profit margins, invoice turn, and cost control.
            </p>
          </div>

          {/* Factor Breakdown (2 cols) */}
          <div className="lg:col-span-2 rounded-4xl bg-light border border-border p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-secondary text-white mb-1">
                Score Factor Breakdown
              </h3>
              <p className="text-xs text-text-dark">
                The four core underwriting pillars measured by Financial Pilot
              </p>
            </div>

            <div className="space-y-6">
              {data?.breakdown?.map((item) => {
                const pct = (item.score / item.max_score) * 100;
                return (
                  <div key={item.factor} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-white">{item.factor}</span>
                      <span className="text-primary font-mono font-bold">
                        {item.score} / {item.max_score} pts
                      </span>
                    </div>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-text-dark leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Advice Card */}
      {!loading && data && (
        <div className="rounded-4xl bg-light border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              <IconAiSparkle className="size-4 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-bold font-secondary text-white">
                Gemini AI 90-Day Credit Improvement Roadmap
              </h4>
              <p className="text-xs text-text-dark">
                Specific actions you can execute to elevate your score to Grade A
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.length > 0 ? (
              tips.slice(0, 3).map((tip, i) => (
                <div key={i} className="bg-dark/40 rounded-3xl p-6 border border-border/40 flex flex-col gap-3">
                  <div className="size-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                    0{i + 1}
                  </div>
                  <p className="text-sm text-text-dark leading-relaxed">{tip}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-dark">{data.ai_advice || 'AI advice unavailable.'}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
