import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Seed data ────────────────────────────────────────────────────────────────
const FIRST = ['Alex','Jordan','Sam','Taylor','Morgan','Casey','Riley','Quinn',
  'Avery','Blake','Drew','Emery','Finley','Harper','Hayden','Jamie','Kendall',
  'Logan','Peyton','Reese','Rowan','Sage','Skyler','Sydney','Tatum','Zara',
  'Lena','Niko','Priya','Arjun','Mei','Yuki','Omar','Fatima','Luca','Sofia'];
const LAST  = ['Chen','Patel','Kim','Singh','Müller','Okafor','Rossi','Tanaka',
  'Nguyen','Garcia','Smith','Johnson','Williams','Brown','Jones','Davis','Wilson',
  'Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin'];
const TEAMS = ['NeuralNinjas','ByteBusters','QuantumLeap','CodeCraft','DataDynamos',
  'HackHeroes','NeonCoders','CyberSprint','AlgoAces','PixelPirates','CloudChasers',
  'DevDragons','BitBrigade','SyntaxSorcerers','LogicLords'];
const TRACKS = ['AI/ML','Web3','Healthcare','Sustainability'];
const GRAD_PAIRS = [
  ['#a855f7','#06b6d4'],['#ec4899','#f59e0b'],['#3b82f6','#10b981'],
  ['#f97316','#ef4444'],['#8b5cf6','#ec4899'],['#06b6d4','#3b82f6'],
  ['#10b981','#a855f7'],['#f59e0b','#06b6d4'],
];

let _uid = 1000;
function makeParticipant(overrides = {}) {
  const first = FIRST[Math.floor(Math.random() * FIRST.length)];
  const last  = LAST[Math.floor(Math.random() * LAST.length)];
  const grad  = GRAD_PAIRS[Math.floor(Math.random() * GRAD_PAIRS.length)];
  return {
    id:     ++_uid,
    name:   `${first} ${last}`,
    team:   TEAMS[Math.floor(Math.random() * TEAMS.length)],
    track:  TRACKS[Math.floor(Math.random() * TRACKS.length)],
    score:  Math.floor(Math.random() * 4000) + 500,
    grad,
    joinedAt: Date.now(),
    isNew: true,
    ...overrides,
  };
}

const SEED_COUNT = 24;
function loadOrSeed() {
  try {
    const raw = localStorage.getItem('hackorbit_participants');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return Array.from({ length: SEED_COUNT }, () => makeParticipant({ isNew: false }));
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, grad, size = 40 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, fontWeight: 700, color: '#fff',
        flexShrink: 0,
        boxShadow: `0 0 10px ${grad[0]}55`,
      }}
    >
      {initials}
    </div>
  );
}

// ── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="text-xs text-white/40 font-mono w-6 text-center">#{rank}</span>;
}

// ── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ score, max, grad }) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${grad[0]}, ${grad[1]})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-white/40 font-mono w-10 text-right">{score}</span>
    </div>
  );
}

// ── Participant row ───────────────────────────────────────────────────────────
function ParticipantRow({ p, rank, maxScore, isNew }) {
  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, x: -30, scale: 0.95 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.015, boxShadow: `0 0 20px ${p.grad[0]}33` }}
      className="glass rounded-xl px-4 py-3 flex items-center gap-3 cursor-default"
      style={{ borderColor: isNew ? p.grad[0] + '60' : undefined }}
    >
      {/* Rank */}
      <div className="w-8 flex justify-center flex-shrink-0">
        <RankBadge rank={rank} />
      </div>

      {/* Avatar */}
      <Avatar name={p.name} grad={p.grad} size={38} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{p.name}</span>
          {isNew && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `linear-gradient(90deg,${p.grad[0]},${p.grad[1]})`, color: '#fff' }}
            >
              JUST JOINED
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-white/50 truncate">{p.team}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs" style={{ color: p.grad[0] }}>{p.track}</span>
        </div>
        <ScoreBar score={p.score} max={maxScore} grad={p.grad} />
      </div>
    </motion.div>
  );
}

// ── Stats mini panel ──────────────────────────────────────────────────────────
function StatsPanel({ participants }) {
  const teamCounts = useMemo(() => {
    const map = {};
    participants.forEach(p => { map[p.team] = (map[p.team] || 0) + 1; });
    return map;
  }, [participants]);

  const trendingTeam = useMemo(() => {
    return Object.entries(teamCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  }, [teamCounts]);

  const uniqueTeams = Object.keys(teamCounts).length;

  const stats = [
    { label: 'Participants', value: participants.length, icon: '👥' },
    { label: 'Teams',        value: uniqueTeams,          icon: '🏆' },
    { label: 'Trending',     value: trendingTeam,         icon: '🔥', small: true },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="glass rounded-xl p-3 text-center">
          <div className="text-xl mb-1">{s.icon}</div>
          <div className={`font-black neon-text ${s.small ? 'text-sm' : 'text-2xl'}`}>{s.value}</div>
          <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Participants() {
  const [participants, setParticipants] = useState(() => loadOrSeed());
  const [search, setSearch]             = useState('');
  const [filterTeam, setFilterTeam]     = useState('');
  const [filterTrack, setFilterTrack]   = useState('');
  const [newIds, setNewIds]             = useState(new Set());
  const [tab, setTab]                   = useState('leaderboard'); // 'leaderboard' | 'feed'
  const feedRef = useRef(null);

  // Persist to localStorage whenever participants change
  useEffect(() => {
    localStorage.setItem('hackorbit_participants', JSON.stringify(participants));
  }, [participants]);

  // Auto-add fake participant every 6–12 seconds
  useEffect(() => {
    let timer;
    const schedule = () => {
      const delay = Math.floor(Math.random() * 6000) + 6000;
      timer = setTimeout(() => {
        const p = makeParticipant();
        setParticipants(prev => [p, ...prev].slice(0, 200));
        setNewIds(prev => new Set([...prev, p.id]));
        // Remove "new" badge after 6s
        setTimeout(() => {
          setNewIds(prev => { const n = new Set(prev); n.delete(p.id); return n; });
        }, 6000);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  // Derived data
  const sorted = useMemo(() =>
    [...participants].sort((a, b) => b.score - a.score),
  [participants]);

  const maxScore = useMemo(() => sorted[0]?.score ?? 1, [sorted]);

  const teams = useMemo(() =>
    [...new Set(participants.map(p => p.team))].sort(),
  [participants]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sorted.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)) &&
      (!filterTeam  || p.team  === filterTeam) &&
      (!filterTrack || p.track === filterTrack)
    );
  }, [sorted, search, filterTeam, filterTrack]);

  // Feed = most recent first
  const feed = useMemo(() =>
    [...participants].sort((a, b) => b.joinedAt - a.joinedAt).slice(0, 30),
  [participants]);

  return (
    <section id="participants" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="neon-text text-4xl font-bold mb-2">Live Participants</h2>
          <p className="text-white/50 text-sm">Real-time leaderboard · updates every few seconds</p>
          {/* Live pulse indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </motion.div>

        {/* Stats panel */}
        <StatsPanel participants={participants} />

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {['leaderboard', 'feed'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize
                ${tab === t
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'glass text-white/50 hover:text-white'
                }`}
            >
              {t === 'leaderboard' ? '🏆 Leaderboard' : '⚡ Live Feed'}
            </button>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search name or team…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass rounded-xl px-4 py-2 text-sm text-white bg-transparent outline-none
                       border border-white/10 focus:border-neon-purple/50 flex-1 min-w-[160px]
                       placeholder:text-white/30"
          />
          <select
            value={filterTeam}
            onChange={e => setFilterTeam(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm text-white bg-transparent outline-none
                       border border-white/10 focus:border-neon-purple/50"
          >
            <option value="" className="bg-dark-surface">All Teams</option>
            {teams.map(t => (
              <option key={t} value={t} className="bg-dark-surface">{t}</option>
            ))}
          </select>
          <select
            value={filterTrack}
            onChange={e => setFilterTrack(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm text-white bg-transparent outline-none
                       border border-white/10 focus:border-neon-purple/50"
          >
            <option value="" className="bg-dark-surface">All Tracks</option>
            {TRACKS.map(t => (
              <option key={t} value={t} className="bg-dark-surface">{t}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1
                        scrollbar-thin scrollbar-thumb-neon-purple/40 scrollbar-track-transparent"
          ref={feedRef}
        >
          <AnimatePresence mode="popLayout">
            {tab === 'leaderboard'
              ? filtered.length === 0
                ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-white/30 py-12"
                  >
                    No participants match your search.
                  </motion.p>
                )
                : filtered.map((p, i) => (
                  <ParticipantRow
                    key={p.id}
                    p={p}
                    rank={i + 1}
                    maxScore={maxScore}
                    isNew={newIds.has(p.id)}
                  />
                ))
              : feed.map((p, i) => (
                <ParticipantRow
                  key={p.id}
                  p={p}
                  rank={sorted.findIndex(s => s.id === p.id) + 1}
                  maxScore={maxScore}
                  isNew={newIds.has(p.id)}
                />
              ))
            }
          </AnimatePresence>
        </div>

        {/* Footer count */}
        <p className="text-center text-white/30 text-xs mt-4">
          Showing {tab === 'leaderboard' ? filtered.length : Math.min(feed.length, 30)} of {participants.length} participants
        </p>
      </div>
    </section>
  );
}
