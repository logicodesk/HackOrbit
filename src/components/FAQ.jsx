import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faq from '../data/faq';

const DNAHelix = lazy(() =>
  import('./three/Scene3D').then(m => ({ default: m.DNAHelix }))
);

export default function FAQ() {
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const filtered = faq.filter(
    (item) =>
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>

        {/* 3D DNA helix — represents healthcare + knowledge */}
        <div className="flex justify-center mb-4">
          <Suspense fallback={<div className="w-[160px] h-[160px]" />}>
            <DNAHelix size={160} />
          </Suspense>
        </div>

        <input
          type="text"
          placeholder="Search questions..."
          className="glass rounded-xl px-4 py-3 w-full text-white bg-transparent outline-none border border-white/10 focus:border-neon-purple/50 mb-8"
          onChange={(e) => setQuery(e.target.value)}
        />

        {filtered.length === 0 ? (
          <p className="text-white/40 text-center py-8">No results found</p>
        ) : (
          filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="glass rounded-xl mb-3 overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-white font-medium hover:text-neon-purple transition-colors"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    ▾
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-4 text-white/60 text-sm leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
