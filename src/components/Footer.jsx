import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/srijan_k26',
    color: '#e1306c',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/srijan-keshri-258740393',
    color: '#0a66c2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    color: '#a855f7',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    color: '#06b6d4',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const CONTACT = [
  {
    label: 'Instagram',
    value: '@srijan_k26',
    href: 'https://www.instagram.com/srijan_k26',
    icon: '📸',
  },
  {
    label: 'LinkedIn',
    value: 'Srijan Keshri',
    href: 'https://www.linkedin.com/in/srijan-keshri-258740393',
    icon: '💼',
  },
  {
    label: 'Phone',
    value: '+91 97524 46961',
    href: 'tel:+919752446961',
    icon: '📞',
  },
  {
    label: 'Phone',
    value: '+91 98130 59546',
    href: 'tel:+919813059546',
    icon: '📱',
  },
];

export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 py-14 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center leading-none gap-1">
          <span className="font-display font-bold text-2xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            HackOrbit
          </span>
          <span className="text-xs text-white/40 font-sans tracking-widest uppercase">2026</span>
        </div>

        {/* Tagline */}
        <p className="text-white/40 text-sm">Build. Innovate. Dominate.</p>

        {/* Social icon row */}
        <div className="flex gap-3">
          {SOCIAL_LINKS.map(({ label, href, icon, color }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              whileHover={{ scale: 1.15, boxShadow: `0 0 16px ${color}66` }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60
                         hover:text-white transition-colors duration-200"
              style={{ '--hover-color': color }}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        {/* Creator contact card */}
        <div className="w-full max-w-lg">
          <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-4">
            Created by
          </p>
          <div className="glass rounded-2xl p-6">
            {/* Creator name */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}
              >
                SK
              </div>
              <div>
                <p className="font-semibold text-white">Srijan Keshri</p>
                <p className="text-xs text-white/40">Creator &amp; Organizer · HackOrbit 2026</p>
              </div>
            </div>

            {/* Contact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTACT.map(({ label, value, href, icon }) => (
                <motion.a
                  key={value}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  data-cursor-hover
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5
                             border border-white/8 hover:border-neon-purple/40
                             transition-colors duration-200 group"
                >
                  <span className="text-xl">{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                      {value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-white/30 text-xs">© 2026 HackOrbit. All rights reserved.</p>
          <p className="text-white/20 text-xs">Made with ❤️ by Srijan Keshri and Saurabh Jain</p>
        </div>
      </div>
    </footer>
  );
}
