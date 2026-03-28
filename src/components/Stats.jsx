import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Participants', target: 2000, suffix: '+' },
  { label: 'Teams', target: 500, suffix: '+' },
  { label: 'Cities', target: 50, suffix: '+' },
];

const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

export default function Stats() {
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 2000;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(t);

            setCounts(stats.map(s => Math.round(eased * s.target)));

            if (t < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="py-24 px-4">
      <h2 className="neon-text text-4xl font-bold text-center mb-16">By The Numbers</h2>
      <div className="flex flex-wrap justify-center gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-2xl px-10 py-8 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-6xl font-black font-display neon-text">
              {counts[i]}{stat.suffix}
            </div>
            <div className="text-white/60 text-lg mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
