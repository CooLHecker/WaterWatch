import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
}

/**
 * Fixed, full-viewport ambient rain animation for the marketing homepage.
 * Deep navy gradient with soft falling streaks — a lightweight 2D-canvas
 * stand-in for the brand's "hyperlocal rainfall" concept. Respects
 * prefers-reduced-motion by rendering a single static frame.
 */
export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let raf = 0;

    function seedDrops() {
      const count = Math.min(140, Math.floor((width * height) / 9000));
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: 14 + Math.random() * 24,
        speed: 4 + Math.random() * 6,
        opacity: 0.08 + Math.random() * 0.22,
      }));
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDrops();
    }

    function paintBackground() {
      const gradient = ctx!.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#020a14");
      gradient.addColorStop(1, "#04182b");
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawFrame() {
      paintBackground();
      ctx!.strokeStyle = "#3cd7ff";
      ctx!.lineCap = "round";
      for (const d of drops) {
        ctx!.globalAlpha = d.opacity;
        ctx!.lineWidth = 1.1;
        ctx!.beginPath();
        ctx!.moveTo(d.x, d.y);
        ctx!.lineTo(d.x - d.len * 0.06, d.y + d.len);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function tick() {
      paintBackground();
      ctx!.strokeStyle = "#3cd7ff";
      ctx!.lineCap = "round";
      for (const d of drops) {
        d.y += d.speed;
        d.x -= d.speed * 0.08;
        if (d.y > height + d.len) {
          d.y = -d.len;
          d.x = Math.random() * width;
        }
        ctx!.globalAlpha = d.opacity;
        ctx!.lineWidth = 1.1;
        ctx!.beginPath();
        ctx!.moveTo(d.x, d.y);
        ctx!.lineTo(d.x - d.len * 0.08, d.y + d.len);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    resize();
    if (reduceMotion) {
      drawFrame();
    } else {
      tick();
    }

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
