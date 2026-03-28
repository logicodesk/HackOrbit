import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function pad(n) { return String(n).padStart(2, '0'); }

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Event target: May 1, 2026 00:00:00 UTC
const EVENT_DATE = new Date('2026-05-01T00:00:00Z');

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = pad(now.getHours());
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const day   = DAYS[now.getDay()];
  const date  = `${DAYS[now.getDay()].slice(0,3)}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  // Countdown
  const diff = EVENT_DATE - now;
  const cd = diff > 0 ? {
    d:  Math.floor(diff / 86400000),
    h:  pad(Math.floor((diff % 86400000) / 3600000)),
    m:  pad(Math.floor((diff % 3600000)  / 60000)),
    s:  pad(Math.floor((diff % 60000)    / 1000)),
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 text-center select-none"
    >
      {/* Live dot */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-green-400 font-semibold tracking-widest uppercase">Live Clock</span>
      </div>

      {/* Main time */}
      <div className="flex items-center justify-center gap-1 font-mono">
        <span className="text-5xl font-black neon-text tabular-nums">{h}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
          className="text-4xl font-black text-neon-purple pb-1"
        >:</motion.span>
        <span className="text-5xl font-black neon-text tabular-nums">{m}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
          className="text-4xl font-black text-neon-purple pb-1"
        >:</motion.span>
        <span className="text-5xl font-black text-white/60 tabular-nums">{s}</span>
      </div>

      {/* Date */}
      <p className="text-white/40 text-sm mt-2">{date}</p>

      {/* Countdown to event */}
      {cd ? (
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
            ⏳ Countdown to Hacking Begins
          </p>
          <div className="flex justify-center gap-3">
            {[['Days', cd.d], ['Hrs', cd.h], ['Min', cd.m], ['Sec', cd.s]].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center">
                <motion.span
                  key={val}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black font-mono neon-text tabular-nums"
                >
                  {pad(val)}
                </motion.span>
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="neon-text font-bold text-lg">🚀 Event is Live!</p>
        </div>
      )}
    </motion.div>
  );
}
