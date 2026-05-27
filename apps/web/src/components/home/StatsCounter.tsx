// §6.1 섹션 5 — HOME 누적 수치 카운트업 (v1.3.13)
// 사용자 결정 #4 — IntersectionObserver 진입 시 0 → value 1.6s ease-out cubic.
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/types/sanity";

interface Props {
  stats: Stat[];
}

const formatNumber = (n: number) =>
  new Intl.NumberFormat("ko-KR").format(n);

export default function StatsCounter({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8"
    >
      {stats.slice(0, 3).map((stat) => (
        <StatItem key={stat._id} stat={stat} started={started} />
      ))}
    </div>
  );
}

function StatItem({ stat, started }: { stat: Stat; started: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(stat.value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, stat.value]);

  return (
    <div className="text-center md:text-left">
      <p
        className="font-serif leading-none tracking-[-0.02em] text-foreground whitespace-nowrap"
        style={{ fontSize: "clamp(24px, 3vw, 48px)" }}
      >
        {formatNumber(display)}
        <span className="text-accent">{stat.suffix ?? "+"}</span>
      </p>
      <p className="mt-3 text-sm text-muted">{stat.label.ko}</p>
    </div>
  );
}
