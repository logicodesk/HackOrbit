import useScrollProgress from '../hooks/useScrollProgress';

const staticStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 100,
  height: '3px',
  background: 'linear-gradient(to right, #a855f7, #06b6d4)',
  boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
};

export default function ScrollProgress() {
  const fraction = useScrollProgress();

  return (
    <div
      style={{
        ...staticStyles,
        width: fraction * 100 + '%',
      }}
    />
  );
}
