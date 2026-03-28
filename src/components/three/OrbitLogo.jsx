import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Orbit ring ────────────────────────────────────────────────────────────────
function OrbitRing({ radius, tilt, speed, color, thickness = 0.012 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed;
  });
  const geo = useMemo(() => new THREE.TorusGeometry(radius, thickness, 8, 80), [radius, thickness]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.7,
  }), [color]);
  return (
    <mesh ref={ref} geometry={geo} material={mat}
      rotation={[tilt, 0, 0]} />
  );
}

// ── Orbiting satellite dot ────────────────────────────────────────────────────
function Satellite({ radius, tilt, speed, color, size = 0.045, offset = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t) * radius * Math.cos(tilt),
        Math.sin(t) * radius * Math.sin(tilt),
      );
    }
  });
  const geo = useMemo(() => new THREE.SphereGeometry(size, 12, 12), [size]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color }), [color]);
  return <mesh ref={ref} geometry={geo} material={mat} />;
}

// ── Core planet ───────────────────────────────────────────────────────────────
function Planet() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.4;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  // Wireframe icosahedron for a "tech" look
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.38, 1), []);
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#a855f7', wireframe: true, transparent: true, opacity: 0.55,
  }), []);
  const solidMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#0f0520', transparent: true, opacity: 0.92,
  }), []);

  return (
    <group ref={ref}>
      <mesh geometry={geo} material={solidMat} />
      <mesh geometry={geo} material={wireMat} />
    </group>
  );
}

// ── Particle halo ─────────────────────────────────────────────────────────────
function Halo() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const r = 0.55 + Math.random() * 0.55;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.018, color: '#22d3ee', transparent: true, opacity: 0.6, sizeAttenuation: true,
  }), []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle float
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <Planet />
      <Halo />

      {/* Three orbit rings at different tilts */}
      <OrbitRing radius={0.62} tilt={Math.PI / 2}    speed={0.5}  color="#a855f7" thickness={0.010} />
      <OrbitRing radius={0.78} tilt={Math.PI / 3.5}  speed={-0.3} color="#06b6d4" thickness={0.008} />
      <OrbitRing radius={0.92} tilt={Math.PI / 6}    speed={0.2}  color="#8b5cf6" thickness={0.006} />

      {/* Satellites on each ring */}
      <Satellite radius={0.62} tilt={Math.PI / 2}   speed={0.5}  color="#c084fc" size={0.042} offset={0} />
      <Satellite radius={0.78} tilt={Math.PI / 3.5} speed={-0.3} color="#22d3ee" size={0.032} offset={2} />
      <Satellite radius={0.92} tilt={Math.PI / 6}   speed={0.2}  color="#a5f3fc" size={0.025} offset={4} />
    </group>
  );
}

// ── Exported component ────────────────────────────────────────────────────────
export default function OrbitLogo({ size = 220 }) {
  return (
    <div
      style={{ width: size, height: size, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
