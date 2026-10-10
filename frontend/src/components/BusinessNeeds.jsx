import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function BusinessNeeds() {
  const { t } = useLanguage();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    {
      number: '01',
      title: t('bn_p1_title', 'VISIBILITY'),
      image: '/images/brands-group-1.png',
      content: t(
        'bn_p1_desc',
        "Know exactly where your cash is coming from and going — in real time, not at month-end when it's too late to act."
      ),
    },
    {
      number: '02',
      title: t('bn_p2_title', 'FORECASTING'),
      image: '/images/brands-group-2.png',
      content: t(
        'bn_p2_desc',
        'See 30, 60, and 90 days into the future so you can plan payroll, negotiate supplier terms, and avoid cash crunches.'
      ),
    },
    {
      number: '03',
      title: t('bn_p3_title', 'CREDIT HEALTH'),
      image: '/images/brands-group-3.png',
      content: t(
        'bn_p3_desc',
        "Build and monitor a strong business credit profile so you're always ready when a loan or credit line arrives."
      ),
    },
    {
      number: '04',
      title: t('bn_p4_title', 'COMPLIANCE'),
      image: '/images/brands-group-4.png',
      content: t(
        'bn_p4_desc',
        'Stay ahead of taxes, detect anomalies before they become audits, and keep your books clean with automated monitoring.'
      ),
    },
    {
      number: '05',
      title: t('bn_p5_title', 'INTELLIGENCE'),
      image: '/images/brands-group-5.png',
      content: t(
        'bn_p5_desc',
        'Turn raw financial data into strategic decisions with an AI co-pilot that speaks plain English, not accounting jargon.'
      ),
    },
  ];

  return (
    <section className="section py-20 relative isolate overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-container">
          {/* Section Intro */}
          <div className="section-intro text-center mb-16">
            <h2 className="title hasHighlight text-3xl sm:text-4xl lg:text-5xl font-bold font-secondary text-white mb-4">
              {t('bn_heading_1', 'The 5 Financial Pillars Every')}{' '}
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-normal">
                {t('bn_heading_2', 'Business Needs')}
              </strong>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base">
              {t(
                'bn_subheading',
                'Structured modules designed to solve the cash visibility gap for modern growing businesses.'
              )}
            </p>
          </div>

          {/* Stepped Funnel Cards Stack */}
          <div className="section-content">
            <div className="flex flex-col gap-y-4 px-2 sm:px-4">
              {items.map((item, index) => {
                const marginInline = isDesktop ? `${index * 16}px` : '0px';

                return (
                  <div
                    key={item.number}
                    className="p-6 md:p-8 lg:px-14 xl:px-16 py-6 relative card-electric rounded-3xl transition-all duration-300 group"
                    style={{ marginInline }}
                    data-bn-card={item.number}
                  >
                    <div className="flex items-center flex-col md:flex-row md:justify-between gap-6 relative z-10">
                      {/* Left: Brand Icon Cluster */}
                      <div className="shrink-0 max-md:order-1 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={`${item.title} icon`}
                          className="max-h-24 w-[110px] md:w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                          width={130}
                          height={100}
                        />
                      </div>

                      {/* Center: Outline Stroke Number with Title Overlay */}
                      <div className="relative grid place-items-center max-md:order-0 select-none">
                        <div className="text-[3.5rem] sm:text-[4.5rem] lg:text-[72px] font-extrabold t-stroke text-transparent leading-none font-mono">
                          {item.number}
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold absolute text-white tracking-wider uppercase">
                          {item.title}
                        </h3>
                      </div>

                      {/* Right: Description */}
                      <p className="md:w-2/5 lg:w-1/3 text-xs sm:text-sm text-text-light/90 leading-relaxed max-md:my-2 max-md:text-center text-left">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
