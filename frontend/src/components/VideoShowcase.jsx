import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoShowcase() {
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Silky smooth GSAP 3D Scroll Tilt Animation - pronounced perspective matching hero showcase
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop & Tablet: Pronounced 35-degree 3D tilt, laid down under buttons
      mm.add('(min-width: 768px)', () => {
        gsap.set(el, {
          transformPerspective: 1000,
          rotationX: 35,
          scale: 0.9,
          y: -35,
          transformOrigin: '50% 60%',
          willChange: 'transform',
        });

        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1.2,
            markers: false,
          },
          rotationX: 5,
          scale: 1,
          y: 0,
          ease: 'power2.out',
        });
      });

      // Mobile: Balanced 26-degree tilt for smaller viewports
      mm.add('(max-width: 767px)', () => {
        gsap.set(el, {
          transformPerspective: 800,
          rotationX: 26,
          scale: 0.94,
          y: -15,
          transformOrigin: '50% 60%',
          willChange: 'transform',
        });

        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 25%',
            scrub: 1,
            markers: false,
          },
          rotationX: 4,
          scale: 1,
          y: 0,
          ease: 'power2.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (videoRef.current.paused) {
        videoRef.current.play();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      data-gsap-video-showcase
      className="relative w-full max-w-[1040px] xl:max-w-[1100px] aspect-video mx-auto rounded-3xl lg:rounded-4xl overflow-hidden border border-white/15 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(147,122,255,0.25)] bg-dark/70 group transition-colors duration-300 hover:border-primary/50"
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(35deg) scale(0.9) translateY(-35px)',
        transformOrigin: '50% 60%',
      }}
    >
      {/* Top subtle specular edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
      <video
        ref={videoRef}
        id="videoPlayer"
        className="w-full h-full object-cover block"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
      >
        <source src="/showcase.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sound toggle overlay — visible when muted, fades when unmuted */}
      <button
        id="soundToggle"
        onClick={toggleSound}
        type="button"
        className={`absolute inset-0 grid place-items-center shadow-lg group/btn cursor-pointer transition-all duration-300 ${
          isMuted ? 'bg-dark/40 opacity-100' : 'bg-transparent opacity-0 hover:opacity-100 hover:bg-dark/40'
        }`}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        <div
          id="mutedIcon"
          className="transition-all duration-300 group-hover/btn:scale-125 bg-white/90 hover:bg-white rounded-full size-20 sm:size-24 grid place-items-center relative shadow-2xl"
        >
          {/* Spinning ring */}
          <div
            className="inset-0 scale-90 transition-transform duration-300 size-full absolute rounded-full border-2 border-solid border-t-transparent border-b-transparent border-primary animate-spin"
            style={{ animationDuration: '3s' }}
          />

          {/* Play/Unmute SVG icon */}
          <svg
            width="36"
            height="36"
            className="size-9 ml-1"
            fill="none"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.9108 9.50547C23.3603 10.897 25.2851 11.9905 26.6564 12.9922C28.037 14.0008 29.0582 15.0549 29.4239 16.4448C29.6921 17.4639 29.6921 18.5361 29.4239 19.5552C29.0582 20.9451 28.037 21.9991 26.6564 23.0077C25.2851 24.0094 23.3603 25.1029 20.9109 26.4945C18.5448 27.8386 16.5495 28.9722 15.0348 29.6166C13.508 30.2659 12.1159 30.5952 10.763 30.2118C9.76878 29.9299 8.86412 29.3952 8.13534 28.6599C7.14629 27.6621 6.74927 26.2828 6.56144 24.6231C6.37497 22.9753 6.37499 20.8185 6.375 18.0751V17.9248C6.37499 15.1815 6.37497 13.0246 6.56144 11.3769C6.74927 9.71712 7.14629 8.33789 8.13534 7.34C8.86412 6.60473 9.76878 6.06996 10.763 5.78822C12.1159 5.40485 13.508 5.73401 15.0348 6.38345C16.5495 7.02771 18.5448 8.16123 20.9108 9.50547Z"
              fill="url(#vs_gradient_jsx)"
            />
            <defs>
              <linearGradient
                id="vs_gradient_jsx"
                x1="18"
                y1="30.3751"
                x2="18"
                y2="5.62488"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="var(--color-primary-light, #4D36D0)" />
                <stop offset="1" stopColor="var(--color-primary, #937AFF)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </button>
    </div>
  );
}
