import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeCube = lazy(() => import('./three/Scene3D').then(m => ({ default: m.CodeCube })));
const BlockchainNodes = lazy(() => import('./three/Scene3D').then(m => ({ default: m.BlockchainNodes })));

const tracks = [
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI / ML',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Advanced',
    diffColor: 'text-red-400 bg-red-400/10 border-red-400/30',
    description: 'Build intelligent systems using machine learning, NLP, computer vision, or generative AI to solve real-world problems.',
    problemStatements: [
      { id: 'PS-AI-01', title: 'Mental Health Support Bot', desc: 'Build an AI-powered conversational agent that detects emotional distress in text and provides evidence-based coping strategies, crisis resources, and mood tracking.' },
      { id: 'PS-AI-02', title: 'Real-Time Sign Language Translator', desc: 'Develop a computer vision system that translates sign language gestures into text/speech in real time using a webcam, bridging communication for the hearing-impaired.' },
      { id: 'PS-AI-03', title: 'Personalized Learning Engine', desc: 'Create an adaptive learning platform that analyses a student\'s performance patterns and dynamically adjusts content difficulty, pacing, and format to maximise retention.' },
      { id: 'PS-AI-04', title: 'Fake News Detector', desc: 'Design an NLP pipeline that classifies news articles and social media posts as credible or misleading, with explainable confidence scores and source attribution.' },
    ],
    ideas: ['AI mental health chatbot', 'Sign language translator', 'Adaptive learning assistant', 'Fake news classifier'],
  },
  {
    id: 'web3',
    icon: '⛓️',
    title: 'Web3 & Blockchain',
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'Intermediate',
    diffColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    description: 'Decentralized apps, smart contracts, DeFi, NFTs, and the future of the open web — build trustless systems that empower users.',
    problemStatements: [
      { id: 'PS-W3-01', title: 'Tamper-Proof Voting System', desc: 'Build a blockchain-based voting platform where votes are immutably recorded on-chain, results are publicly verifiable, and voter identity is protected via zero-knowledge proofs.' },
      { id: 'PS-W3-02', title: 'Decentralized Credential Wallet', desc: 'Create a self-sovereign identity system where users store academic certificates, work experience, and skills as verifiable on-chain credentials that employers can instantly verify.' },
      { id: 'PS-W3-03', title: 'DeFi Micro-Lending for Unbanked', desc: 'Develop a peer-to-peer lending protocol that enables micro-loans in underserved communities using crypto collateral, on-chain credit scoring, and automated repayment.' },
      { id: 'PS-W3-04', title: 'NFT Event Ticketing Platform', desc: 'Build a ticketing system where event tickets are minted as NFTs, preventing scalping via smart-contract resale caps and enabling royalties back to event organisers.' },
    ],
    ideas: ['Decentralized voting', 'On-chain credential wallet', 'DeFi micro-lending', 'NFT ticketing'],
  },
  {
    id: 'health',
    icon: '🏥',
    title: 'Healthcare Tech',
    color: 'from-green-500 to-teal-500',
    difficulty: 'Intermediate',
    diffColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    description: 'Technology solutions improving patient outcomes, medical access, and health data management for a healthier world.',
    problemStatements: [
      { id: 'PS-HC-01', title: 'Remote Patient Monitoring Dashboard', desc: 'Build an IoT-integrated platform that collects vitals (heart rate, SpO2, glucose) from wearables, alerts caregivers to anomalies, and generates trend reports for doctors.' },
      { id: 'PS-HC-02', title: 'AI Diagnostic Assistant', desc: 'Develop a symptom-checker and preliminary diagnosis tool that uses a trained ML model on medical datasets to suggest possible conditions and recommend specialist referrals.' },
      { id: 'PS-HC-03', title: 'Medicine Adherence Tracker', desc: 'Create a smart medication reminder app with computer-vision pill verification, caregiver notifications, and a gamified streak system to improve chronic-disease adherence rates.' },
      { id: 'PS-HC-04', title: 'Rural Telemedicine Bridge', desc: 'Design a low-bandwidth telemedicine platform optimised for 2G/3G networks that connects rural patients with urban specialists via asynchronous video consultations and AI triage.' },
    ],
    ideas: ['Remote patient monitoring', 'AI diagnostic tool', 'Medicine adherence app', 'Rural telemedicine'],
  },
  {
    id: 'sustain',
    icon: '🌱',
    title: 'Sustainability',
    color: 'from-yellow-500 to-orange-500',
    difficulty: 'Beginner',
    diffColor: 'text-green-400 bg-green-400/10 border-green-400/30',
    description: 'Green tech, climate solutions, and innovations for a sustainable future — build for the planet.',
    problemStatements: [
      { id: 'PS-SU-01', title: 'Personal Carbon Footprint Tracker', desc: 'Build an app that calculates a user\'s daily carbon footprint from travel, diet, and energy usage, provides personalised reduction tips, and lets users offset via verified projects.' },
      { id: 'PS-SU-02', title: 'Smart Energy Grid Optimiser', desc: 'Develop a dashboard that analyses household energy consumption patterns, predicts peak demand, and automatically shifts non-critical loads to off-peak hours to reduce grid strain.' },
      { id: 'PS-SU-03', title: 'Food Waste Reduction Platform', desc: 'Create a community marketplace where restaurants and households list surplus food for free or discounted pickup, with an AI system that predicts waste before it occurs.' },
      { id: 'PS-SU-04', title: 'Plastic Pollution Mapping Tool', desc: 'Build a crowdsourced geo-mapping platform where volunteers report plastic pollution hotspots, enabling NGOs and municipalities to prioritise cleanup operations efficiently.' },
    ],
    ideas: ['Carbon footprint tracker', 'Smart energy optimiser', 'Food waste marketplace', 'Pollution mapping'],
  },
];

const DIFF_BADGE = { Advanced: 'text-red-400 bg-red-400/10 border border-red-400/30', Intermediate: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30', Beginner: 'text-green-400 bg-green-400/10 border border-green-400/30' };

export default function Tracks() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [activeTab, setActiveTab] = useState('problems');
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!selectedTrack) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelectedTrack(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedTrack]);

  useEffect(() => {
    if (selectedTrack) {
      setActiveTab('problems');
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [selectedTrack]);

  return (
    <section id="tracks" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-4">Hackathon Tracks</h2>
        <p className="text-white/60 text-center mb-4">Choose your battlefield</p>

        <div className="flex justify-center items-center gap-8 mb-10 flex-wrap">
          <Suspense fallback={<div className="w-[160px] h-[160px]" />}><CodeCube size={160} /></Suspense>
          <Suspense fallback={<div className="w-[160px] h-[160px]" />}><BlockchainNodes size={160} /></Suspense>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              className="glass rounded-2xl p-6 cursor-pointer"
              data-cursor-hover
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.03, boxShadow: '0 0 30px rgba(168,85,247,0.5)' }}
              onClick={() => setSelectedTrack(track)}
            >
              <div className={`h-1 rounded-full bg-gradient-to-r ${track.color} mb-4`} />
              <div className="text-5xl mb-3">{track.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${DIFF_BADGE[track.difficulty]} mb-3 inline-block`}>
                {track.difficulty}
              </span>
              <p className="text-white/60 text-sm">{track.description}</p>
              <p className="text-white/30 text-xs mt-3">{track.problemStatements.length} problem statements →</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedTrack(null)} />

            <motion.div
              role="dialog" aria-modal="true" aria-label={selectedTrack.title}
              className="glass rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${selectedTrack.color}`} />
              <div className="p-6 pb-4 flex items-start gap-4">
                <span className="text-5xl">{selectedTrack.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-2xl font-black text-white">{selectedTrack.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFF_BADGE[selectedTrack.difficulty]}`}>
                      {selectedTrack.difficulty}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">{selectedTrack.description}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  aria-label="Close modal"
                  onClick={() => setSelectedTrack(null)}
                  className="text-white/40 hover:text-white text-2xl leading-none flex-shrink-0 mt-1"
                >×</button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-6 mb-4">
                {[['problems', '🎯 Problem Statements'], ['ideas', '💡 Sample Ideas']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${activeTab === key
                        ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'glass text-white/50 hover:text-white'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto
                              scrollbar-thin scrollbar-thumb-neon-purple/30 scrollbar-track-transparent">
                <AnimatePresence mode="wait">
                  {activeTab === 'problems' ? (
                    <motion.div key="problems"
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      {selectedTrack.problemStatements.map((ps, i) => (
                        <motion.div
                          key={ps.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="glass rounded-xl p-4 border border-white/8 hover:border-neon-purple/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded
                                            bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                              {ps.id}
                            </span>
                            <h4 className="text-sm font-bold text-white">{ps.title}</h4>
                          </div>
                          <p className="text-white/60 text-xs leading-relaxed">{ps.desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div key="ideas"
                      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                      className="flex flex-col gap-2"
                    >
                      {selectedTrack.ideas.map((idea, i) => (
                        <motion.div
                          key={idea}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-center gap-3 glass rounded-xl px-4 py-3"
                        >
                          <span className="text-neon-purple text-lg">▸</span>
                          <span className="text-white/80 text-sm">{idea}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
