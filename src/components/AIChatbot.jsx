import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faqData from '../data/faq';

// ── Extended knowledge base ───────────────────────────────────────────────────
const KB = [
  ...faqData,
  { id: 101, question: 'When does the hackathon start?',        answer: 'HackOrbit 2026 hacking begins on May 1, 2026 at 00:00 UTC. Registration opens April 1, 2026.' },
  { id: 102, question: 'Where is the hackathon held?',          answer: 'HackOrbit 2026 is a fully online/virtual hackathon. Participants join from anywhere in the world.' },
  { id: 103, question: 'What tracks are available?',            answer: 'There are 4 tracks: AI/ML, Web3 & Blockchain, Healthcare Tech, and Sustainability. Choose the one that fits your project idea.' },
  { id: 104, question: 'How long is the hackathon?',            answer: 'The hacking window is 48 hours — from May 1 to May 3, 2026.' },
  { id: 105, question: 'Who created HackOrbit?',                answer: 'HackOrbit 2026 was created by Srijan Keshri and Saurabh Jain. You can reach Srijan on Instagram @srijan_k26 or LinkedIn.' },
  { id: 106, question: 'What is the prize money?',              answer: '1st place wins $5,000, 2nd place wins $2,500, and 3rd place wins $1,000. Additional track prizes may be announced.' },
  { id: 107, question: 'Can I participate solo?',               answer: 'Yes! Solo participation is allowed. Teams can have 1 to 4 members.' },
  { id: 108, question: 'What is the submission deadline?',      answer: 'The submission deadline is May 3, 2026. You need to submit a GitHub repo, demo video, and project description.' },
  { id: 109, question: 'Hello',                                 answer: 'Hey there! 👋 I\'m the HackOrbit AI assistant. Ask me anything about the hackathon — registration, prizes, tracks, or rules!' },
  { id: 110, question: 'Hi',                                    answer: 'Hi! 🚀 Welcome to HackOrbit 2026. How can I help you today?' },
  { id: 111, question: 'What is HackOrbit?',                    answer: 'HackOrbit 2026 is a premier global hackathon where developers, designers, and innovators build projects in 48 hours across 4 exciting tracks. Build. Innovate. Dominate.' },
];

const SUGGESTIONS = [
  'How do I register?',
  'What are the prizes?',
  'What tracks are available?',
  'Who created HackOrbit?',
];

// ── Keyword matcher ───────────────────────────────────────────────────────────
function findAnswer(query) {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Score each KB entry
  const scored = KB.map(item => {
    const qWords = q.split(/\s+/);
    const haystack = (item.question + ' ' + item.answer).toLowerCase();
    const score = qWords.reduce((acc, w) => acc + (haystack.includes(w) ? w.length : 0), 0);
    return { ...item, score };
  }).filter(i => i.score > 0).sort((a, b) => b.score - a.score);

  return scored[0]?.answer ?? null;
}

// ── Typing animation hook ─────────────────────────────────────────────────────
function useTypingText(text, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(ref.current); setDone(true); }
    }, 1000 / speed);
    return () => clearInterval(ref.current);
  }, [text, speed]);

  return { displayed, done };
}

// ── Speech synthesis ──────────────────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 1.05;
  utt.pitch = 1.1;
  // Prefer a natural-sounding voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => /google|natural|samantha|karen/i.test(v.name));
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

// ── Message bubble ────────────────────────────────────────────────────────────
function BotMessage({ text, isLatest }) {
  const { displayed } = useTypingText(isLatest ? text : null, 30);
  const shown = isLatest ? displayed : text;

  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: 'linear-gradient(135deg,#a855f7,#06b6d4)' }}>
        AI
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-white/90 leading-relaxed">
        {shown}
        {isLatest && shown.length < text.length && (
          <span className="inline-block w-1 h-4 bg-neon-cyan ml-0.5 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end">
      <div className="bg-gradient-to-r from-[#8b5cf6]/30 to-[#06b6d4]/30 border border-[#8b5cf6]/30
                      rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-[80%]">
        {text}
      </div>
    </div>
  );
}

// ── Main chatbot ──────────────────────────────────────────────────────────────
export default function AIChatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [input, setInput]         = useState('');
  const [messages, setMessages]   = useState([
    { id: 0, role: 'bot', text: 'Hey! 👋 I\'m your HackOrbit AI assistant. Ask me anything about the hackathon!' },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const recognRef  = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // Init speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-submit after voice
      setTimeout(() => handleSend(transcript), 200);
    };
    r.onerror = () => setIsListening(false);
    r.onend   = () => setIsListening(false);
    recognRef.current = r;
  }, []);

  const handleSend = useCallback((overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text };
    const answer  = findAnswer(text) ?? "I don't have an answer for that yet — try browsing the FAQ below! 🔍";
    const botMsg  = { id: Date.now() + 1, role: 'bot', text: answer, isLatest: true };

    setMessages(prev => [
      ...prev.map(m => ({ ...m, isLatest: false })),
      userMsg,
      botMsg,
    ]);

    // Speak the answer
    setIsSpeaking(true);
    speak(answer);
    const utt = new SpeechSynthesisUtterance(answer);
    utt.onend = () => setIsSpeaking(false);
  }, [input]);

  const toggleListen = () => {
    if (!recognRef.current) return;
    if (isListening) {
      recognRef.current.stop();
      setIsListening(false);
    } else {
      recognRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <motion.button
        onClick={() => setIsOpen(p => !p)}
        data-cursor-hover
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center
                   bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4]
                   shadow-[0_0_24px_rgba(139,92,246,0.6)] hover:shadow-[0_0_36px_rgba(139,92,246,0.9)]
                   transition-shadow duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-[60] w-[340px] sm:w-[380px] flex flex-col
                       glass rounded-2xl overflow-hidden
                       shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.2)]"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10
                            bg-gradient-to-r from-[#8b5cf6]/20 to-[#06b6d4]/10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#a855f7,#06b6d4)' }}>
                AI
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">HackOrbit Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400">
                    {isSpeaking ? 'Speaking…' : isListening ? 'Listening…' : 'Online'}
                  </span>
                </div>
              </div>
              {isSpeaking && (
                <button onClick={stopSpeaking} aria-label="Stop speaking"
                  className="text-white/40 hover:text-white text-xs px-2 py-1 glass rounded-lg">
                  🔇 Stop
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3
                            scrollbar-thin scrollbar-thumb-neon-purple/30 scrollbar-track-transparent">
              {messages.map((msg) =>
                msg.role === 'user'
                  ? <UserMessage key={msg.id} text={msg.text} />
                  : <BotMessage  key={msg.id} text={msg.text} isLatest={!!msg.isLatest} />
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[11px] px-2.5 py-1 glass rounded-full text-white/50
                             hover:text-white hover:border-neon-purple/40 transition-colors duration-150"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="px-3 pb-3 pt-1 border-t border-white/10 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything…"
                className="flex-1 glass rounded-xl px-3 py-2.5 text-sm text-white bg-transparent
                           outline-none border border-white/10 focus:border-neon-purple/50
                           placeholder:text-white/25 transition-colors"
              />
              {/* Voice button */}
              <motion.button
                onClick={toggleListen}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                data-cursor-hover
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                            transition-all duration-200
                            ${isListening
                              ? 'bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                              : 'glass hover:border-neon-purple/50'
                            }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={isListening ? 'white' : 'rgba(255,255,255,0.6)'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </motion.button>
              {/* Send button */}
              <motion.button
                onClick={() => handleSend()}
                aria-label="Send message"
                data-cursor-hover
                whileTap={{ scale: 0.9 }}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                           bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4]
                           disabled:opacity-30 transition-opacity duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
