import { motion } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';

const milestones = [
  { date: 'Apr 1, 2026',  title: 'Registration Opens',  desc: 'Sign up and form your team. Early bird spots fill fast.',                          status: 'past'     },
  { date: 'Apr 15, 2026', title: 'Team Formation',       desc: 'Finalize your team of up to 4 members and select your track.',                     status: 'past'     },
  { date: 'May 1, 2026',  title: 'Hacking Begins',       desc: 'The 48-hour build sprint kicks off. May the best team win.',                       status: 'current'  },
  { date: 'May 3, 2026',  title: 'Submission Deadline',  desc: 'Submit your project, demo video, and GitHub repo.',                                status: 'upcoming' },
  { date: 'May 10, 2026', title: 'Winners Announced',    desc: 'Top teams present live. Prizes awarded to the best builders.',                     status: 'upcoming' },
];

const cardBorder = {
  past:     'border border-white/15',
  current:  'border border-neon-cyan shadow-[0_0_24px_rgba(6,182,212,0.35)]',
  upcoming: 'border border-white/8',
};
const titleColor = {
  past: 'text-white/50', current: 'text-neon-cyan', upcoming: 'text-white/75',
};
const dotColor = {
  past:     'bg-white/40',
  current:  'bg-neon-cyan shadow-[0_0_10px_#06b6d4]',
  upcoming: 'bg-white/15 border border-white/25',
};

// ── SVG zigzag connecting measured dot positions ──────────────────────────────
function ZigzagConnector({ anchors, containerWidth }) {
  if (anchors.length < 2) return null;

  const pad  = 10;
  const minY = Math.min(...anchors.map(a => a.y));
  const maxY = Math.max(...anchors.map(a => a.y));
  const svgH = maxY - minY + pad * 2;

  // Build path through each anchor point (already alternates left/right because
  // odd milestones are on the right, even on the left — natural zigzag)
  const d = anchors
    .map((a, i) => `${i === 0 ? 'M' : 'L'} ${a.x} ${a.y - minY + pad}`)
    .join(' ');

  return (
    <svg
      style={{
        position: 'absolute', left: 0, top: minY - pad,
        width: containerWidth, height: svgH,
        pointerEvents: 'none', overflow: 'visible', zIndex: 0,
      }}
      viewBox={`0 0 ${containerWidth} ${svgH}`}
    >
      <defs>
        <linearGradient id="zzGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a855f7" />
          <stop offset="50%"  stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
        </linearGradient>
        <filter id="zzGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Glow halo */}
      <motion.path d={d} fill="none" stroke="#a855f7" strokeWidth="7"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.18"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} />

      {/* Main dashed neon line */}
      <motion.path d={d} fill="none" stroke="url(#zzGrad)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} />

      {/* Travelling pulse — one dot per segment */}
      {anchors.map((a, i) => {
        if (i >= anchors.length - 1) return null;
        const nx = anchors[i + 1].x;
        const ny = anchors[i + 1].y - minY + pad;
        const cy0 = a.y - minY + pad;
        return (
          <motion.circle key={i} r="5" fill="#a855f7" filter="url(#zzGlow)"
            animate={{ cx: [a.x, nx], cy: [cy0, ny] }}
            transition={{
              duration: 1.1, ease: 'easeInOut',
              delay: i * 1.3 + 2.4,
              repeat: Infinity,
              repeatDelay: (milestones.length - 1) * 1.3 + 1,
            }}
          />
        );
      })}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Timeline() {
  const containerRef = useRef(null);
  const dotRefs      = useRef([]);
  const [anchors, setAnchors] = useState([]);
  const [contW,   setContW]   = useState(0);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    setContW(cRect.width);
    const pts = dotRefs.current
      .map(el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - cRect.left, y: r.top + r.height / 2 - cRect.top };
      })
      .filter(Boolean);
    setAnchors(pts);
  }, []);

  useEffect(() => {
    const t = setTimeout(measure, 150);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  return (
    <section id="timeline" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-16">Event Timeline</h2>

        <div className="relative" ref={containerRef}>
          {anchors.length > 1 && (
            <ZigzagConnector anchors={anchors} containerWidth={contW} />
          )}

          <div className="flex flex-col gap-14">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className="relative flex items-center">

                  {/* Left card slot */}
                  <div className="w-5/12 flex justify-end pr-6">
                    {isLeft ? (
                      <motion.div
                        className={`glass rounded-xl p-5 w-full ${cardBorder[m.status]}`}
                        initial={{ opacity: 0, x: -36 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      >
                        <p className="text-xs text-white/35 mb-1">{m.date}</p>
                        <h3 className={`font-bold text-sm ${titleColor[m.status]}`}>
                          {m.title}
                          {m.status === 'current' && (
                            <span className="ml-2 text-[10px] bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full">LIVE</span>
                          )}
                        </h3>
                        <p className="text-white/55 text-xs mt-1 leading-relaxed">{m.desc}</p>
                      </motion.div>
                    ) : <div />}
                  </div>

                  {/* Centre dot — anchor for zigzag */}
                  <div className="w-2/12 flex justify-center z-10">
                    <motion.div
                      ref={el => { dotRefs.current[i] = el; }}
                      className={`w-4 h-4 rounded-full flex-shrink-0 ${dotColor[m.status]}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      onAnimationComplete={measure}
                    />
                  </div>

                  {/* Right card slot */}
                  <div className="w-5/12 flex justify-start pl-6">
                    {!isLeft ? (
                      <motion.div
                        className={`glass rounded-xl p-5 w-full ${cardBorder[m.status]}`}
                        initial={{ opacity: 0, x: 36 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      >
                        <p className="text-xs text-white/35 mb-1">{m.date}</p>
                        <h3 className={`font-bold text-sm ${titleColor[m.status]}`}>
                          {m.title}
                          {m.status === 'current' && (
                            <span className="ml-2 text-[10px] bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full">LIVE</span>
                          )}
                        </h3>
                        <p className="text-white/55 text-xs mt-1 leading-relaxed">{m.desc}</p>
                      </motion.div>
                    ) : <div />}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
