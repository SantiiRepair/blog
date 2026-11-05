import { useEffect, useRef } from "react";

const PixelSnow = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100;
    const pixelSize = 4;

    class Particle {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = pixelSize;
        this.speed = 1 + Math.random() * 2;
        this.opacity = 0.5 + Math.random() * 0.5;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillRect(
          Math.floor(this.x / pixelSize) * pixelSize,
          Math.floor(this.y / pixelSize) * pixelSize,
          this.size,
          this.size
        );
      }
    }

    // Visitors who ask the OS for reduced motion get the same snow, standing still.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const drawFrame = (move: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        if (move) particle.update();
        particle.draw();
      });
    };

    const animate = () => {
      drawFrame(true);
      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      cancelAnimationFrame(animationFrameId);
      if (reducedMotion.matches) {
        drawFrame(false);
      } else {
        animate();
      }
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      if (reducedMotion.matches) drawFrame(false);
    };

    window.addEventListener("resize", resizeCanvas);
    reducedMotion.addEventListener("change", start);
    resizeCanvas();
    start();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      reducedMotion.removeEventListener("change", start);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default PixelSnow;
