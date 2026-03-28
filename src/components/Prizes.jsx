import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { lazy, Suspense } from 'react';

const Trophy3D = lazy(() =>
  import('./three/Scene3D').then(m => ({ default: m.Trophy3D }))
);

const prizes = [
  {
    rank: '2nd Place',
    tier: 'Silver',
    amount: '$2,500',
    icon: '🥈',
    perks: ['Sponsor swag bag', 'Mentorship session', 'Certificate'],
    gradient: 'from-slate-400 to-slate-300',
    scale: 1,
  },
  {
    rank: '1st Place',
    tier: 'Gold',
    amount: '$5,000',
    icon: '🥇',
    perks: ['Cloud credits ($1000)', 'Mentorship + job referrals', 'Trophy + certificate', 'Featured on website'],
    gradient: 'from-yellow-400 to-amber-300',
    scale: 1.1,
  },
  {
    rank: '3rd Place',
    tier: 'Bronze',
    amount: '$1,000',
    icon: '🥉',
    perks: ['Sponsor swag bag', 'Certificate'],
    gradient: 'from-orange-700 to-orange-500',
    scale: 1,
  },
];

function handleConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#a855f7', '#06b6d4', '#ec4899', '#f59e0b'],
  });
}

export default function Prizes() {
  return (
    <section id="prizes" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-4">Prizes &amp; Rewards</h2>
        <p className="text-white/50 text-center mb-6">Click a prize to celebrate 🎉</p>

        {/* 3D Trophy */}
        <div className="flex justify-center mb-8">
          <Suspense fallback={<div className="w-[180px] h-[180px]" />}>
            <Trophy3D size={180} />
          </Suspense>
        </div>

        <div className="flex flex-wrap justify-center items-end gap-8">
          {prizes.map((card, i) => {
            const isGold = card.tier === 'Gold';
            return (
              <motion.div
                key={card.tier}
                className={`glass rounded-2xl p-8 text-center cursor-pointer group relative overflow-hidden${isGold ? ' scale-110 z-10' : ''}`}
                data-cursor-hover
                style={{ width: '280px' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: card.scale * 1.05 }}
                whileTap={{ scale: card.scale * 0.98 }}
                onClick={handleConfetti}
              >
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                <div className="text-6xl mb-4">{card.icon}</div>

                <h3 className={`text-2xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.tier}
                </h3>

                <p className="text-4xl font-black text-white mt-2">{card.amount}</p>
                <p className="text-white/50 text-sm mb-4">{card.rank}</p>

                <ul className="text-white/70 text-sm space-y-1">
                  {card.perks.map((perk) => (
                    <li key={perk}>✓ {perk}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
