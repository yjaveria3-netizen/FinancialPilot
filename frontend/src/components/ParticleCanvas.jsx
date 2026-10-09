import { useEffect, useRef } from 'react';

export default function ParticleCanvas({ className = '', count = null }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let spores = [];

    const isMobile = window.innerWidth < 768;
    const defaultCount = isMobile ? 45 : 95;
    const particleCount = count ?? defaultCount;

    class Spore {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * (canvas.width || window.innerWidth);
        this.y = initial
          ? Math.random() * (canvas.height || 800)
          : (canvas.height || 800) + Math.random() * 10;
        // Subtle, crisp dot size (0.6px to 1.5px)
        this.size = Math.random() * 0.9 + 0.6;
        // Slow, graceful upward drift (0.05px to 0.16px per frame)
        this.speedY = -(Math.random() * 0.11 + 0.05);
        this.wobble = Math.random() * 0.9;
        this.wobbleSpeed = Math.random() * 0.01 + 0.004;
        this.opacity = Math.random() * 0.55 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.wobbleSpeed) * this.wobble;

        if (this.y < -10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const newWidth = parent.offsetWidth || window.innerWidth;
      const newHeight = parent.offsetHeight || 800;

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        const oldHeight = canvas.height;
        canvas.width = newWidth;
        canvas.height = newHeight;

        // If height significantly increased, spread some spores across newly revealed area
        if (oldHeight && newHeight > oldHeight + 100 && spores.length) {
          spores.forEach((s) => {
            if (Math.random() > 0.5) {
              s.y = oldHeight + Math.random() * (newHeight - oldHeight);
            }
          });
        }
      }
    };

    setSize();
    window.addEventListener('resize', setSize);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        setSize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    spores = Array.from({ length: particleCount }, () => new Spore());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spores.forEach((s) => {
        s.update();
        s.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 block ${className}`}
      style={{
        pointerEvents: 'none',
      }}
    />
  );
}
