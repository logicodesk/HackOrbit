import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRACKS = ['AI/ML', 'Web3 & Blockchain', 'Healthcare Tech', 'Sustainability'];

const TEAM_SIZES = ['1', '2', '3', '4'];

function validateStep(step, formData) {
  const errors = {};

  if (step === 1) {
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.phone?.trim()) errors.phone = 'Phone is required';
  }

  if (step === 2) {
    if (!formData.teamName?.trim()) errors.teamName = 'Team name is required';
    if (!formData.teamSize) errors.teamSize = 'Team size is required';
    if (!formData.track) errors.track = 'Track selection is required';
  }

  return errors;
}

const inputClass =
  'glass rounded-xl px-4 py-3 w-full text-white bg-transparent outline-none border border-white/10 focus:border-neon-purple/50 transition-colors';

const labelClass = 'text-white/70 text-sm mb-1 block';

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    teamName: '', teamSize: '', track: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [spotsLeft, setSpotsLeft] = useState(247);

  // Spots Left counter
  useEffect(() => {
    function scheduleDecrement() {
      const delay = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
      return setTimeout(() => {
        setSpotsLeft((prev) => Math.max(0, prev - (Math.floor(Math.random() * 3) + 1)));
        timerRef = scheduleDecrement();
      }, delay);
    }
    let timerRef = scheduleDecrement();
    return () => clearTimeout(timerRef);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleNext() {
    const errs = validateStep(step, formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setDirection(-1);
    setStep((s) => s - 1);
  }

  function handleSubmit() {
    const ref = 'HO2026-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const payload = { ...formData, ref, timestamp: Date.now() };
    localStorage.setItem('hackorbit_registration', JSON.stringify(payload));
    setRefNumber(ref);
    setSubmitted(true);
  }

  return (
    <section id="register" className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="neon-text text-4xl font-bold text-center mb-2">Register Now</h2>

        {/* Spots Left */}
        {!submitted && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-white/60">{spotsLeft} spots remaining</span>
          </div>
        )}

        {/* Success screen */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="neon-text text-3xl font-bold mb-4">Registration Complete!</h3>
              <div className="glass rounded-2xl p-6 mb-4 inline-block">
                <p className="text-white/70 text-sm mb-1">Your reference number</p>
                <p className="text-white font-mono text-xl font-semibold">{refNumber}</p>
              </div>
              <p className="text-white/60 text-sm">
                Thank you for registering for HackOrbit 2026. See you on March 1st!
              </p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-10">
                {[1, 2, 3].map((n, i) => (
                  <div key={n} className="flex items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step === n
                          ? 'bg-gradient-to-br from-neon-purple to-neon-cyan text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                          : step > n
                          ? 'bg-neon-purple/40 text-white/80'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {n}
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-16 h-0.5 mx-1 transition-all duration-300 ${
                          step > n ? 'bg-neon-purple/60' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step content */}
              <div className="glass rounded-2xl p-8 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {step === 1 && (
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Personal Information</h3>
                        <Field label="Full Name" error={errors.name}>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Jane Doe"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Email Address" error={errors.email}>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jane@example.com"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Phone Number" error={errors.phone}>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 555 000 0000"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Team Information</h3>
                        <Field label="Team Name" error={errors.teamName}>
                          <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                            placeholder="Team Nebula"
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Team Size" error={errors.teamSize}>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="" disabled className="bg-dark-surface">Select size</option>
                            {TEAM_SIZES.map((s) => (
                              <option key={s} value={s} className="bg-dark-surface">{s}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Track" error={errors.track}>
                          <select
                            name="track"
                            value={formData.track}
                            onChange={handleChange}
                            className={inputClass}
                          >
                            <option value="" disabled className="bg-dark-surface">Select a track</option>
                            {TRACKS.map((t) => (
                              <option key={t} value={t} className="bg-dark-surface">{t}</option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Review Your Details</h3>
                        <div className="glass rounded-xl p-6 space-y-3">
                          {[
                            ['Name', formData.name],
                            ['Email', formData.email],
                            ['Phone', formData.phone],
                            ['Team Name', formData.teamName],
                            ['Team Size', formData.teamSize],
                            ['Track', formData.track],
                          ].map(([label, value]) => (
                            <div key={label} className="flex justify-between items-center">
                              <span className="text-white/50 text-sm">{label}</span>
                              <span className="text-white text-sm font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <div>
                    {step > 1 && (
                      <button onClick={handleBack} className="btn-ghost">
                        Back
                      </button>
                    )}
                  </div>
                  <div>
                    {step < 3 ? (
                      <button onClick={handleNext} className="btn-neon">
                        Next
                      </button>
                    ) : (
                      <button onClick={handleSubmit} className="btn-neon">
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
