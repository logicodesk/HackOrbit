import { useState, useEffect } from 'react';

export default function useScrollProgress() {
  const [fraction, setFraction] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setFraction(0);
        return;
      }
      const raw = window.scrollY / scrollable;
      setFraction(Math.min(1, Math.max(0, raw)));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return fraction;
}
