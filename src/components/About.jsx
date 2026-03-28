import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

const FloatingLaptop = lazy(() =>
  import('./three/Scene3D').then(m => ({ default: m.FloatingLaptop }))
);
const BlockchainNodes = lazy(() =>
  import('./three/Scene3D').then(m => ({ default: m.BlockchainNodes }))
);

const features = [
  {
    icon: '🌍',
    title: 'Global Community',
    description: 'Connect with 2,000+ developers, designers, and innovators from 50+ countries.',
  },
  {
    icon: '🏆',
    title: 'Win Big',
    description: 'Compete for $10,000+ in prizes, mentorship, and exclusive sponsor opportunities.',
  },
  {
    icon: '🧠',
    title: 'Expert Mentors',
    description: 'Get guidance from industry leaders at top tech companies throughout the event.',
  },
  {
    icon: '⚡',
    title: '48 Hours',
    description: 'Build, iterate, and ship a complete project in just 48 intense, exciting hours.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-4">About HackOrbit</h2>
        <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
          HackOrbit 2026 is the premier global hackathon bringing together the brightest minds to
          build, innovate, and compete on the world stage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column — 3D laptop + 48H text */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Suspense fallback={<div className="w-[200px] h-[200px]" />}>
              <FloatingLaptop size={200} />
            </Suspense>
            <div
              className="text-[5rem] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.5))',
              }}
            >
              48H
            </div>
          </div>

          {/* Right column — 2x2 feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass rounded-xl p-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 text-center">
          {['2,000+ Participants', '500+ Teams', '50+ Countries'].map((stat, i) => (
            <span key={stat} className="flex items-center gap-3">
              <span className="neon-text text-xl font-bold">{stat}</span>
              {i < 2 && <span className="text-white/30 text-xl">|</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
