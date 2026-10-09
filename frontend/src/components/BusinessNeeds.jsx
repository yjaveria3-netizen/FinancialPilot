import { useState, useEffect } from 'react';

export default function BusinessNeeds() {
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
      title: 'VISIBILITY',
      image: '/images/brands-group-1.png',
      content:
        "Know exactly where your cash is coming from and going — in real time, not at month-end when it's too late to act.",
    },
    {
      number: '02',
      title: 'FORECASTING',
      image: '/images/brands-group-2.png',
      content:
        'See 30, 60, and 90 days into the future so you can plan payroll, negotiate supplier terms, and avoid cash crunches.',
    },
    {
      number: '03',
      title: 'CREDIT HEALTH',
      image: '/images/brands-group-3.png',
      content:
        "Build and monitor a strong business credit profile so you're always ready when a loan or credit line arrives.",
    },
    {
      number: '04',
      title: 'COMPLIANCE',
      image: '/images/brands-group-4.png',
      content:
        'Stay ahead of taxes, detect anomalies before they become audits, and keep your books clean with automated monitoring.',
    },
    {
      number: '05',
      title: 'INTELLIGENCE',
      image: '/images/brands-group-5.png',
      content:
        'Turn raw financial data into strategic decisions with an AI co-pilot that speaks plain English, not accounting jargon.',
    },
  ];

  return (
    <section className="section py-20 relative isolate overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-container">
          {/* Section Intro */}
          <div className="section-intro text-center mb-16">
            <h2 className="title hasHighlight text-3xl sm:text-4xl lg:text-5xl font-bold font-secondary text-white mb-4">
              The 5 Financial Pillars Every <strong className="text-primary font-normal">Business Needs</strong>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-base">
              Structured modules designed to solve the cash visibility gap for modern growing businesses.
            </p>
          </div>

          {/* Stepped Funnel Cards Stack */}
          <div className="section-content">
            <div className="flex flex-col gap-y-3 px-4">
              {items.map((item, index) => {
                const marginInline = isDesktop ? `${index * 38}px` : '0px';

                return (
                  <div
                    key={item.number}
                    className="p-8 xl:px-36 xl:py-4 relative transition-all duration-300"
                    style={{ marginInline }}
                    data-bn-card={item.number}
                  >
                    <div className="flex items-center flex-col lg:flex-row lg:justify-between gap-6">
                      {/* Left: Brand Icon Cluster */}
                      <img
                        src={item.image}
                        alt={`${item.title} icon`}
                        className="max-h-28 w-[142px] object-contain max-lg:order-1"
                        width={142}
                        height={142}
                      />

                      {/* Center: Outline Stroke Number with Title Overlay */}
                      <div className="relative grid place-items-center max-lg:order-0">
                        <div className="text-[5rem] lg:text-[100px] font-extrabold t-stroke text-transparent leading-none select-none">
                          {item.number}
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold absolute text-white tracking-wider">
                          {item.title}
                        </h3>
                      </div>

                      {/* Right: Description (High contrast text-slate-200) */}
                      <p className="lg:w-1/3 text-sm text-slate-200 leading-relaxed max-lg:my-4 max-lg:order-3 max-lg:text-center lg:text-left">
                        {item.content}
                      </p>
                    </div>

                    {/* 3D Perspective Card Background */}
                    <div className="absolute inset-0 size-full -z-10 pointer-events-none">
                      <div
                        className="border border-border size-full rounded-t-4xl rounded-b-4xl bg-primary/5 corner-squircle"
                        style={{ transform: 'perspective(100px) rotateX(-2deg)' }}
                      />
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
