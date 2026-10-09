import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setSize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : 800;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const isMobile = window.innerWidth < 768;
    // Tastefully balanced particle count (95 desktop, 45 mobile)
    const particleCount = isMobile ? 45 : 95;

    class Spore {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 10;
        // Subtle, crisp dot size (0.6px to 1.5px — very slightly larger)
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

    const spores = Array.from({ length: particleCount }, () => new Spore());

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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
      style={{
        pointerEvents: 'none',
      }}
    />
  );
}
