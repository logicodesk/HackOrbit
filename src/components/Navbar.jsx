import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Tracks', id: 'tracks' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Prizes', id: 'prizes' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Register', id: 'register' },
];

// ── Ripple hook ──────────────────────────────────────────────────────────────
function useRipple() {
  return useCallback((e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      border-radius:50%;background:rgba(139,92,246,0.35);
      transform:scale(0);animation:ripple-burst 600ms ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 620);
  }, []);
}

// ── Magnetic nav item ────────────────────────────────────────────────────────
function MagneticNavItem({ label, id, isActive, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="relative"
    >
      <a
        href={`#${id}`}
        onClick={(e) => onClick(e, id)}
        data-nav-id={id}
        className={`
          relative text-base font-semibold px-1 py-1 block transition-all duration-200
          hover:scale-105
          ${isActive
            ? 'text-white drop-shadow-[0_0_8px_#8b5cf6]'
            : 'text-white/60 hover:text-white hover:drop-shadow-[0_0_6px_#8b5cf6]'
          }
        `}
      >
        {label}
      </a>
    </motion.li>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('hackorbit_theme');
    return stored ? stored !== 'light' : true;
  });

  // underline tracker refs
  const navListRef = useRef(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, opacity: 0 });
  const ripple = useRipple();

  // ── Apply initial theme ──
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // ── Scroll detection ──
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);
      setIsScrolled(sy > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Active section via IntersectionObserver ──
  useEffect(() => {
    const observers = [];
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Underline tracker: follow active link ──
  useEffect(() => {
    if (!navListRef.current) return;
    const activeEl = navListRef.current.querySelector(`[data-nav-id="${activeSection}"]`);
    if (!activeEl) return;
    const listRect = navListRef.current.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    setUnderline({
      left: elRect.left - listRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeSection]);

  // ── Dark mode toggle ──
  const toggleDark = (e) => {
    ripple(e);
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('hackorbit_theme', next ? 'dark' : 'light');
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // ── Scroll shrink: height + blur intensity ──
  const navHeight = isScrolled ? 'h-14' : 'h-18';
  const bgBlur = isScrolled
    ? 'backdrop-blur-xl bg-black/50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
    : 'backdrop-blur-md bg-black/20 border-b border-white/5';

  return (
    <>
      {/* Inject ripple keyframe once */}
      <style>{`
        @keyframes ripple-burst {
          to { transform: scale(3); opacity: 0; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${bgBlur}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${navHeight}`}>

            {/* ── Logo ── */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
              className="flex flex-col leading-none group select-none"
            >
              <motion.span
                className="font-display font-bold text-2xl bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] bg-clip-text text-transparent"
                whileHover={{ filter: 'drop-shadow(0 0 12px #8b5cf6)' }}
                transition={{ duration: 0.2 }}
              >
                HackOrbit
              </motion.span>
              <span className="text-[11px] text-white/40 font-sans tracking-widest uppercase">2026</span>
            </a>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:block relative">
              <ul ref={navListRef} className="flex items-center gap-2">
                {NAV_LINKS.map(({ label, id }) => (
                  <MagneticNavItem
                    key={id}
                    label={label}
                    id={id}
                    isActive={activeSection === id}
                    onClick={handleNavClick}
                  />
                ))}
              </ul>

              {/* Sliding underline tracker */}
              <motion.span
                className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] shadow-[0_0_8px_#8b5cf6]"
                animate={{
                  left: underline.left,
                  width: underline.width,
                  opacity: underline.opacity,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            </div>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-2">

              {/* CTA Register button (desktop) */}
              <motion.a
                href="#register"
                onClick={(e) => handleNavClick(e, 'register')}
                data-cursor-hover
                className="hidden md:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold
                           bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-white
                           shadow-[0_0_16px_rgba(139,92,246,0.5)]
                           hover:shadow-[0_0_24px_rgba(139,92,246,0.8)] transition-shadow duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Register
              </motion.a>

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDark}
                aria-label="Toggle dark mode"
                data-cursor-hover
                className="w-9 h-9 flex items-center justify-center rounded-full text-white/60
                           hover:text-white hover:bg-white/10 transition-colors duration-200
                           hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.svg
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Hamburger (mobile) */}
              <motion.button
                onClick={() => setIsMenuOpen((p) => !p)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5
                           rounded-full hover:bg-white/10 transition-colors duration-200"
                whileTap={{ scale: 0.9 }}
              >
                <motion.span
                  animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block w-5 h-0.5 bg-white origin-center"
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-5 h-0.5 bg-white origin-center"
                />
                <motion.span
                  animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block w-5 h-0.5 bg-white origin-center"
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden backdrop-blur-xl bg-black/70 border-t border-white/10"
            >
              <ul className="flex flex-col px-4 py-3 gap-1">
                {NAV_LINKS.map(({ label, id }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={(e) => handleNavClick(e, id)}
                      className={`
                        flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${activeSection === id
                          ? 'text-white bg-[#8b5cf6]/20 shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {activeSection === id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6]" />
                      )}
                      {label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.04 }}
                  className="pt-2"
                >
                  <a
                    href="#register"
                    onClick={(e) => handleNavClick(e, 'register')}
                    className="block w-full text-center py-3 rounded-xl text-sm font-semibold
                               bg-gradient-to-r from-[#8b5cf6] to-[#22d3ee] text-white
                               shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                  >
                    Register Now
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
