import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'

const OrbitLogo = lazy(() => import('./three/OrbitLogo'))

const WORDS = ['Build.', 'Innovate.', 'Dominate.']

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [parallaxX, setParallaxX] = useState(0)
  const [parallaxY, setParallaxY] = useState(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  // Typing animation — cycle words every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Mouse parallax with rAF lerp
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX - window.innerWidth / 2) * 0.02,
        y: (e.clientY - window.innerHeight / 2) * 0.02,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      setParallaxX((prev) => prev + (mouseRef.current.x - prev) * 0.08)
      setParallaxY((prev) => prev + (mouseRef.current.y - prev) * 0.08)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        {/* 3D Orbit Logo */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Suspense fallback={<div className="w-[220px] h-[220px]" />}>
            <OrbitLogo size={220} />
          </Suspense>
        </motion.div>

        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="glass neon-border inline-block px-4 py-2 rounded-full text-sm font-medium text-white/80">
            🚀 Applications Open
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            <span className="text-white">HackOrbit 2026 — </span>
            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              {WORDS[wordIndex]}
            </span>
            <span className="cursor-blink text-neon-cyan">|</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-white/60 max-w-xl"
        >
          48 hours. 4 tracks. Unlimited possibilities.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
          <a href="#register" className="btn-neon" data-cursor-hover>
            Register Now
          </a>
          <a href="#tracks" className="btn-ghost" data-cursor-hover>
            Explore Tracks
          </a>
        </motion.div>

        {/* Spots Left */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-white/50 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          247 spots left
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
