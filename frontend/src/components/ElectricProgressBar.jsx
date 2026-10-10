import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const FACTOR_THEMES = {
  revenue_consistency: {
    label: 'Revenue Consistency',
    gradient: 'from-[#F2A3B5] via-[#DA7B93] to-[#8B4D63]',
    glowColor: 'rgba(218, 123, 147, 0.5)',
    sparkColor: '#DA7B93',
    badgeText: 'text-secondary-light'
  },
  profit_margin: {
    label: 'Profit Margin',
    gradient: 'from-[#4E8B8C] via-[#376E6F] to-[#254F50]',
    glowColor: 'rgba(55, 110, 111, 0.5)',
    sparkColor: '#4E8B8C',
    badgeText: 'text-secondary-light'
  },
  payment_behavior: {
    label: 'Payment Behavior',
    gradient: 'from-[#DA7B93] via-[#8E5A70] to-[#376E6F]',
    glowColor: 'rgba(218, 123, 147, 0.45)',
    sparkColor: '#DA7B93',
    badgeText: 'text-secondary-light'
  },
  expense_control: {
    label: 'Expense Control',
    gradient: 'from-[#376E6F] via-[#4E8B8C] to-[#DA7B93]',
    glowColor: 'rgba(55, 110, 111, 0.45)',
    sparkColor: '#4E8B8C',
    badgeText: 'text-secondary-light'
  }
};

const DEFAULT_THEME = {
  gradient: 'from-[#F2A3B5] via-[#DA7B93] to-[#376E6F]',
  glowColor: 'rgba(218, 123, 147, 0.5)',
  sparkColor: '#DA7B93',
  badgeText: 'text-secondary-light'
};

export default function ElectricProgressBar({
  factorKey = '',
  label = '',
  score = 0,
  maxScore = 25,
  explanation = '',
  delayIndex = 0,
  compact = false
}) {
  const { t } = useLanguage();
  const normalizedKey = (factorKey || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_');

  const theme = FACTOR_THEMES[normalizedKey] || DEFAULT_THEME;
  const baseLabel =
    label ||
    theme.label ||
    factorKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Translate label into Urdu/Chinese while preserving English fallback
  const displayLabel = t(normalizedKey, baseLabel);

  const numScore = Number(score) || 0;
  const numMax = Number(maxScore) || 25;
  const pct = Math.min(100, Math.max(0, (numScore / numMax) * 100));

  return (
    <div className="space-y-1.5 group select-none transition-all duration-200">
      {/* Label and Score Numerals */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-white/90 group-hover:text-white transition-colors flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full inline-block transition-transform duration-200 group-hover:scale-125"
            style={{
              backgroundColor: theme.sparkColor,
              boxShadow: `0 0 6px ${theme.sparkColor}`
            }}
          />
          {displayLabel}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-mono font-bold text-xs bg-white/5 px-2 py-0.5 rounded-md border border-white/10 shadow-sm group-hover:border-secondary/40 group-hover:bg-secondary/10 transition-colors">
            {numScore} / {numMax}
            {!compact && <span className="text-text-dark font-normal ml-1">{t('pts', 'pts')}</span>}
          </span>
        </div>
      </div>

      {/* Recessed Track Container matching #15070D deep foundation */}
      <div
        className={`w-full bg-[#15070D] rounded-full overflow-hidden p-[1px] border border-white/5 relative ${
          compact ? 'h-2' : 'h-2.5'
        } shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-secondary/30`}
      >
        {/* Animated Gradient Bar with Electric Glow */}
        <div
          className={`h-full rounded-full relative transition-all duration-700 bg-gradient-to-r ${theme.gradient}`}
          style={{
            width: `${pct}%`,
            boxShadow: `0 0 10px ${theme.glowColor}`
          }}
        />
      </div>

      {/* Optional Explanation Text */}
      {explanation && !compact && (
        <p className="text-xs text-text-dark leading-relaxed pt-0.5">
          {explanation}
        </p>
      )}
    </div>
  );
}
