import { useState, useRef, useEffect } from 'react';
import { IconCfoChat, IconClose } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function CfoChatDrawer() {
  const { t, translateGeminiContent } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your Financial Pilot AI CFO. I continuously monitor your transactions, cash trajectory, and vendor bills. How can I help you today?',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Listen for Cash Crunch Crisis Event to auto-open drawer with survival protocol
  useEffect(() => {
    const handleCrisis = (e) => {
      setIsOpen(true);
      const advice =
        e.detail?.advice ||
        'CRISIS MODE DETECTED: An unexpected $59,000 cash drain and duplicate invoice flags were injected into the ledger. Projected runway is compromised. Recommendation: Halt non-critical disbursements, expedite receivables, and inspect invoice anomalies.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          isEmergency: true,
          text: `🚨 URGENT CFO EMERGENCY ADVISORY:\n\n${advice}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    };

    window.addEventListener('finpilot:crisis', handleCrisis);
    return () => window.removeEventListener('finpilot:crisis', handleCrisis);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickPrompts = [
    'What is our 30-day cash forecast?',
    'How do I improve my credit readiness score?',
    'Are there any pending unpaid invoices?',
    'What is our estimated tax liability?',
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Context-aware AI response simulation
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('cash') || q.includes('forecast')) {
        reply =
          'Based on our 30-day projection, cash starts at ~$42,500 and increases to ~$48,200 with normal variance. Low cash alert threshold is set at $5,000 and is not currently breached. You have $28,400 in receivables pending collection.';
      } else if (q.includes('credit') || q.includes('score')) {
        reply =
          'Your current Credit Readiness Score is 78/100 (Grade B). To reach Grade A (85+), focus on accelerating receivables collections past 85% on-time and maintaining operating profit margins above 25%.';
      } else if (q.includes('invoice') || q.includes('bill')) {
        reply =
          'You currently have 14 pending/unpaid invoices totaling $28,400 across 12 customers. 3 invoices are overdue past Net 30. Recommending sending automated reminder notices to top 3 overdue accounts.';
      } else if (q.includes('tax') || q.includes('liability')) {
        reply =
          'Estimated YTD Net Profit is approximately $58,200. Based on standard 30% combined federal & state tax rate, estimated upcoming tax liability is ~$17,460. Recommend exploring Section 179 equipment deductions before Q4 ends.';
      } else {
        reply = `I have analyzed your query regarding "${query}". All underlying cash reserves and transaction ledgers are currently in healthy standing. What specific metric would you like to explore deeper?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* ── Floating Chat Bubble Button Fixed at Bottom-Right ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group size-14 sm:size-16 rounded-full bg-gradient-to-tr from-[#1B5E50] via-[#2E9C88] to-[#4EE2C9] hover:brightness-115 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-[#80F4E0]/90"
          style={{
            boxShadow: '0 0 35px rgba(78, 226, 201, 0.75), 0 6px 20px rgba(27, 94, 80, 0.6)',
          }}
          aria-label={isOpen ? 'Close AI CFO Chat' : 'Open AI CFO Chat'}
        >
          {/* Subtle Ambient Pulse Ring in Emerald Green */}
          <span className="absolute -inset-1 rounded-full bg-[#4EE2C9]/50 animate-ping opacity-60 pointer-events-none" />

          {/* AI Badge Chip */}
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#190a28] border border-[#4EE2C9] text-[9px] font-extrabold text-[#4EE2C9] shadow-md pointer-events-none">
            AI
          </span>

          {isOpen ? (
            /* Close Icon */
            <IconClose className="size-6 relative z-10 text-white" />
          ) : (
            /* AI CFO Chat Icon */
            <div className="relative z-10 flex flex-col items-center justify-center">
              <IconCfoChat className="size-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            </div>
          )}
        </button>
      </div>

      {/* ── Slide-Out Right Drawer ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md h-full bg-light/95 border-l border-border backdrop-blur-2xl shadow-2xl flex flex-col z-10 animate-slideInRight">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border/80 flex items-center justify-between bg-dark/50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-[#376E6F]/20 border border-[#3FBFA8]/40 flex items-center justify-center">
                  <IconCfoChat className="size-5 text-[#3FBFA8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-secondary text-white flex items-center gap-2">
                    {t('cfo_title', 'AI CFO Assistant')}
                    <span className="size-2 rounded-full bg-[#3FBFA8] animate-pulse" />
                  </h3>
                  <p className="text-[11px] text-text-dark">{t('cfo_sub', 'Real-time financial intelligence')}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-text-dark hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <IconClose className="size-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                      m.isEmergency
                        ? 'bg-rose-950/70 border border-rose-500/60 text-rose-100 rounded-bl-none shadow-xl font-medium'
                        : m.role === 'user'
                        ? 'bg-secondary text-white rounded-br-none shadow-lg shadow-secondary/25'
                        : 'bg-dark/70 border border-border text-text rounded-bl-none shadow-md'
                    }`}
                  >
                    {translateGeminiContent(m.text)}
                  </div>
                  <span className="text-[10px] text-text-dark mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-dark/70 border border-border w-fit text-text-dark text-xs">
                  <span className="size-1.5 rounded-full bg-[#3FBFA8] animate-bounce" />
                  <span className="size-1.5 rounded-full bg-[#3FBFA8] animate-bounce [animation-delay:0.2s]" />
                  <span className="size-1.5 rounded-full bg-[#3FBFA8] animate-bounce [animation-delay:0.4s]" />
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-4 py-2 border-t border-border/40 bg-dark/30">
              <div className="text-[11px] text-text-dark mb-2 font-medium">{t('cfo_suggestions', 'Quick suggestions:')}</div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSend(p)}
                    className="text-[11px] bg-white/5 hover:bg-secondary/20 text-text-dark hover:text-secondary-light border border-border/60 hover:border-secondary/40 rounded-full px-2.5 py-1 transition-all text-left cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-border/80 bg-dark/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('cfo_placeholder', 'Ask your AI CFO a question...')}
                  className="flex-1 bg-light border border-border focus:border-secondary rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-text-dark focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="btn btn-primary btn-sm px-3.5 py-2.5 text-xs shrink-0 disabled:opacity-40 cursor-pointer"
                >
                  {t('cfo_send', 'Send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
