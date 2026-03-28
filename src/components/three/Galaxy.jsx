import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Shared state refs passed down from Galaxy ───────────────────────────────
// mouseRef   : { x, y }  normalised -0.5 → 0.5
// scrollRef  : { speed, warp }  warp 0→1
// clickRef   : { x, y, t } world-space ripple origin + timestamp

// ─── Star layer config ───────────────────────────────────────────────────────
const LAYERS = [
  { count: 2800, spread: 6,   size: 0.006, speed: 0.00025, color: '#c8d8ff', opacity: 0.85, parallax: 0.08 },
  { count: 1200, spread: 4,   size: 0.010, speed: 0.0006,  color: '#b87fff', opacity: 0.90, parallax: 0.18 },
  { count:  500, spread: 2.5, size: 0.018, speed: 0.0012,  color: '#22d3ee', opacity: 1.00, parallax: 0.32 },
];

// ─── Shooting star pool ──────────────────────────────────────────────────────
const SHOOT_COUNT = 6;

// ─── Utility ─────────────────────────────────────────────────────────────────
function rand(min, max) { return Math.random() * (max - min) + min; }

// ─── Single star layer ───────────────────────────────────────────────────────
function StarLayer({ cfg, mouseRef, scrollRef, clickRef, layerIndex }) {
  const ref = useRef();
  const matRef = useRef();

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(cfg.count * 3);
    for (let i = 0; i < cfg.count; i++) {
      pos[i * 3]     = rand(-cfg.spread, cfg.spread);
      pos[i * 3 + 1] = rand(-cfg.spread, cfg.spread);
      pos[i * 3 + 2] = rand(-cfg.spread, cfg.spread);
    }
    return { positions: pos, originalPositions: pos.slice() };
  }, [cfg.count, cfg.spread]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size: cfg.size,
      color: cfg.color,
      transparent: true,
      opacity: cfg.opacity,
      sizeAttenuation: true,
      depthWrite: false,
    }), [cfg]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;
    const scroll = scrollRef.current;
    const click = clickRef.current;

    // Slow cinematic rotation
    ref.current.rotation.y += cfg.speed;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.015;

    // Mouse parallax — each layer at different depth
    ref.current.position.x += (mouse.x * cfg.parallax - ref.current.position.x) * 0.04;
    ref.current.position.y += (mouse.y * cfg.parallax - ref.current.position.y) * 0.04;

    // Warp speed — stretch stars along Z on fast scroll
    const warp = scroll.warp;
    if (warp > 0.01) {
      const posAttr = ref.current.geometry.attributes.position;
      for (let i = 0; i < cfg.count; i++) {
        posAttr.array[i * 3 + 2] -= warp * cfg.speed * 80;
        // wrap around when too close
        if (posAttr.array[i * 3 + 2] < -cfg.spread) {
          posAttr.array[i * 3 + 2] = cfg.spread;
        }
      }
      posAttr.needsUpdate = true;
      // Increase size during warp
      matRef.current.size = cfg.size * (1 + warp * 3);
    } else {
      matRef.current.size = cfg.size;
    }

    // Click ripple — push stars away from click point
    if (click.t > 0) {
      const age = t - click.t;
      if (age < 1.2) {
        const posAttr = ref.current.geometry.attributes.position;
        const radius = age * 2.5;
        const strength = Math.max(0, 1 - age / 1.2) * 0.04;
        for (let i = 0; i < cfg.count; i++) {
          const dx = posAttr.array[i * 3]     - click.x;
          const dy = posAttr.array[i * 3 + 1] - click.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - radius) < 0.4) {
            posAttr.array[i * 3]     += (dx / (dist + 0.001)) * strength;
            posAttr.array[i * 3 + 1] += (dy / (dist + 0.001)) * strength;
          }
        }
        posAttr.needsUpdate = true;
      }
    }

    // Subtle opacity pulse for foreground layer
    if (layerIndex === 2) {
      matRef.current.opacity = cfg.opacity * (0.85 + Math.sin(t * 1.2) * 0.15);
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <primitive object={material} ref={matRef} attach="material" />
    </points>
  );
}

// ─── Shooting stars ──────────────────────────────────────────────────────────
function ShootingStars() {
  const groupRef = useRef();

  // Each shooting star: position, velocity, life, maxLife, trail length
  const stars = useMemo(() => Array.from({ length: SHOOT_COUNT }, () => ({
    active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1,
  })), []);

  const trailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // 2 points per star (head + tail)
    const pos = new Float32Array(SHOOT_COUNT * 2 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  const trailMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.8,
    vertexColors: false,
    depthWrite: false,
  }), []);

  // Spawn timer
  const nextSpawn = useRef(rand(1, 3));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const posAttr = trailGeo.attributes.position;

    // Spawn new shooting stars
    if (t > nextSpawn.current) {
      const idle = stars.find(s => !s.active);
      if (idle) {
        idle.active = true;
        idle.x = rand(-3, 3);
        idle.y = rand(0.5, 2.5);
        const angle = rand(-0.6, -0.3);
        const speed = rand(0.06, 0.12);
        idle.vx = Math.cos(angle) * speed;
        idle.vy = Math.sin(angle) * speed;
        idle.life = 0;
        idle.maxLife = rand(0.6, 1.2);
      }
      nextSpawn.current = t + rand(0.8, 2.5);
    }

    // Update each star
    stars.forEach((s, i) => {
      const base = i * 2 * 3;
      if (!s.active) {
        // hide by collapsing to origin
        for (let k = 0; k < 6; k++) posAttr.array[base + k] = 0;
        return;
      }
      s.life += 0.016;
      if (s.life >= s.maxLife) { s.active = false; return; }

      s.x += s.vx;
      s.y += s.vy;

      const trailLen = 0.35;
      // head
      posAttr.array[base]     = s.x;
      posAttr.array[base + 1] = s.y;
      posAttr.array[base + 2] = 0;
      // tail
      posAttr.array[base + 3] = s.x - s.vx * trailLen / s.vx;
      posAttr.array[base + 4] = s.y - s.vy * trailLen / Math.abs(s.vy || 0.001);
      posAttr.array[base + 5] = 0;
    });

    posAttr.needsUpdate = true;
    trailMat.opacity = 0.75;
  });

  // Build line segments (pairs of points)
  const lineSegments = useMemo(() => {
    const indices = [];
    for (let i = 0; i < SHOOT_COUNT; i++) {
      indices.push(i * 2, i * 2 + 1);
    }
    trailGeo.setIndex(indices);
    return null;
  }, [trailGeo]);

  return (
    <group ref={groupRef}>
      <lineSegments geometry={trailGeo} material={trailMat} />
    </group>
  );
}

// ─── Nebula cloud (soft glowing particle clusters) ───────────────────────────
function Nebula() {
  const ref = useRef();
  const COUNT = 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    // Three clusters at different positions
    const clusters = [
      { cx: -2.5, cy: 1.2, cz: -2, spread: 1.2 },
      { cx:  2.8, cy: -0.8, cz: -3, spread: 1.0 },
      { cx:  0.2, cy: 2.0, cz: -4, spread: 1.5 },
    ];
    for (let i = 0; i < COUNT; i++) {
      const c = clusters[i % clusters.length];
      arr[i * 3]     = c.cx + (Math.random() - 0.5) * c.spread * 2;
      arr[i * 3 + 1] = c.cy + (Math.random() - 0.5) * c.spread;
      arr[i * 3 + 2] = c.cz + (Math.random() - 0.5) * c.spread;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const palette = [
      [0.67, 0.33, 0.98], // purple
      [0.13, 0.71, 0.83], // cyan
      [0.93, 0.29, 0.60], // pink
    ];
    for (let i = 0; i < COUNT; i++) {
      const c = palette[i % palette.length];
      arr[i * 3]     = c[0] + (Math.random() - 0.5) * 0.15;
      arr[i * 3 + 1] = c[1] + (Math.random() - 0.5) * 0.15;
      arr[i * 3 + 2] = c[2] + (Math.random() - 0.5) * 0.15;
    }
    return arr;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    sizeAttenuation: true,
    depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.018;
    ref.current.rotation.x = Math.sin(t * 0.012) * 0.04;
    mat.opacity = 0.18 + Math.sin(t * 0.4) * 0.06;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Floating geometric debris ────────────────────────────────────────────────
const DEBRIS_COUNT = 18;
const DEBRIS_DATA = Array.from({ length: DEBRIS_COUNT }, (_, i) => ({
  pos:   [rand(-4, 4), rand(-3, 3), rand(-5, -1)],
  rot:   [rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2)],
  speed: [rand(0.003, 0.012), rand(0.002, 0.010), rand(0.001, 0.008)],
  scale: rand(0.04, 0.14),
  type:  i % 3, // 0=tetra, 1=octa, 2=box
  color: ['#a855f7', '#22d3ee', '#ec4899', '#f59e0b'][i % 4],
}));

function GeometricDebris() {
  const refs = useRef(DEBRIS_DATA.map(() => ({ current: null })));

  const geos = useMemo(() => [
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.BoxGeometry(1, 1, 1),
  ], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((r, i) => {
      if (!r.current) return;
      const d = DEBRIS_DATA[i];
      r.current.rotation.x = d.rot[0] + t * d.speed[0];
      r.current.rotation.y = d.rot[1] + t * d.speed[1];
      r.current.rotation.z = d.rot[2] + t * d.speed[2];
      // Gentle float
      r.current.position.y = d.pos[1] + Math.sin(t * 0.3 + i) * 0.12;
    });
  });

  return (
    <group>
      {DEBRIS_DATA.map((d, i) => {
        const edgeGeo = new THREE.EdgesGeometry(geos[d.type]);
        const mat = new THREE.LineBasicMaterial({
          color: d.color, transparent: true, opacity: 0.45,
        });
        return (
          <group
            key={i}
            ref={el => { refs.current[i] = { current: el }; }}
            position={d.pos}
            scale={[d.scale, d.scale, d.scale]}
          >
            <lineSegments geometry={edgeGeo} material={mat} />
          </group>
        );
      })}
    </group>
  );
}

// ─── Aurora wave (undulating ribbon) ─────────────────────────────────────────
function Aurora() {
  const ref = useRef();
  const SEGMENTS = 80;
  const WIDTH    = 12;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(SEGMENTS * 2 * 3); // top + bottom row
    const uvs = new Float32Array(SEGMENTS * 2 * 2);
    const idx = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const x = (i / (SEGMENTS - 1) - 0.5) * WIDTH;
      // top vertex
      pos[i * 6]     = x; pos[i * 6 + 1] = 0.4; pos[i * 6 + 2] = 0;
      // bottom vertex
      pos[i * 6 + 3] = x; pos[i * 6 + 4] = -0.4; pos[i * 6 + 5] = 0;
      uvs[i * 4]     = i / (SEGMENTS - 1); uvs[i * 4 + 1] = 1;
      uvs[i * 4 + 2] = i / (SEGMENTS - 1); uvs[i * 4 + 3] = 0;
      if (i < SEGMENTS - 1) {
        const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
        idx.push(a, b, c, b, d, c);
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv',       new THREE.BufferAttribute(uvs, 2));
    g.setIndex(idx);
    return g;
  }, []);

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#a855f7',
    transparent: true,
    opacity: 0.07,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position;

    for (let i = 0; i < SEGMENTS; i++) {
      const x = (i / (SEGMENTS - 1) - 0.5) * WIDTH;
      const wave = Math.sin(x * 0.8 + t * 0.6) * 0.35
                 + Math.sin(x * 0.3 + t * 0.4) * 0.2;
      const wave2 = Math.sin(x * 1.2 + t * 0.9) * 0.15;

      // top row
      pos.array[i * 6 + 1] = 0.5 + wave + wave2;
      pos.array[i * 6 + 2] = Math.sin(x * 0.5 + t * 0.3) * 0.3 - 2;
      // bottom row
      pos.array[i * 6 + 4] = -0.3 + wave * 0.6;
      pos.array[i * 6 + 5] = Math.sin(x * 0.5 + t * 0.3) * 0.3 - 2;
    }
    pos.needsUpdate = true;

    // Colour shift between purple and cyan
    const hue = (Math.sin(t * 0.2) + 1) / 2;
    mat.color.setRGB(
      0.67 * (1 - hue) + 0.13 * hue,
      0.33 * (1 - hue) + 0.71 * hue,
      0.98 * (1 - hue) + 0.83 * hue,
    );
    mat.opacity = 0.05 + Math.sin(t * 0.35) * 0.03;
  });

  return (
    <group position={[0, 1.8, -2.5]}>
      <mesh ref={ref} geometry={geo} material={mat} />
      {/* Second aurora layer offset */}
      <mesh geometry={geo} position={[0, -1.2, -0.5]}
        material={new THREE.MeshBasicMaterial({
          color: '#06b6d4', transparent: true, opacity: 0.04,
          side: THREE.DoubleSide, depthWrite: false,
        })}
      />
    </group>
  );
}
function CameraDrift({ mouseRef, scrollRef }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;
    const warp = scrollRef.current.warp;

    // Slow cinematic drift
    const driftX = Math.sin(t * 0.07) * 0.08;
    const driftY = Math.cos(t * 0.05) * 0.05;

    // Mouse parallax on camera
    const targetX = mouse.x * 0.3 + driftX;
    const targetY = mouse.y * 0.3 + driftY;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;

    // Warp zoom — pull camera forward on fast scroll
    const targetZ = 3 - warp * 1.2;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // Subtle roll
    camera.rotation.z = Math.sin(t * 0.03) * 0.008;
  });
  return null;
}

// ─── Scene root ──────────────────────────────────────────────────────────────
function Scene({ mouseRef, scrollRef, clickRef }) {
  return (
    <>
      <CameraDrift mouseRef={mouseRef} scrollRef={scrollRef} />
      {/* New background effects */}
      <Nebula />
      <Aurora />
      <GeometricDebris />
      {/* Star layers */}
      {LAYERS.map((cfg, i) => (
        <StarLayer
          key={i}
          cfg={cfg}
          mouseRef={mouseRef}
          scrollRef={scrollRef}
          clickRef={clickRef}
          layerIndex={i}
        />
      ))}
      <ShootingStars />
    </>
  );
}

// ─── Galaxy wrapper (keeps CSS overlay layers) ───────────────────────────────
export default function Galaxy() {
  const mouseRef  = useRef({ x: 0, y: 0 });
  const scrollRef = useRef({ speed: 0, warp: 0, lastY: 0, lastT: 0 });
  const clickRef  = useRef({ x: 0, y: 0, t: -99 });
  const gridRef   = useRef(null);

  // Mouse tracking + grid parallax
  useEffect(() => {
    const onMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = -(e.clientY / window.innerHeight - 0.5);
      mouseRef.current = { x: nx, y: ny };
      if (gridRef.current) {
        gridRef.current.style.transform = `translate(${nx * -14}px, ${ny * -14}px)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Scroll warp detection
  useEffect(() => {
    let warpTimeout;
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - scrollRef.current.lastY);
      const dt = Math.max(1, now - scrollRef.current.lastT);
      const speed = dy / dt;                        // px/ms
      const warp = Math.min(1, speed / 3);          // normalise: 3px/ms = full warp
      scrollRef.current = { speed, warp, lastY: window.scrollY, lastT: now };

      clearTimeout(warpTimeout);
      warpTimeout = setTimeout(() => {
        scrollRef.current.warp = 0;
      }, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(warpTimeout); };
  }, []);

  // Click ripple — convert screen coords to rough world coords
  useEffect(() => {
    const onClick = (e) => {
      // Skip if clicking on UI elements
      if (e.target !== document.body && e.target.tagName !== 'CANVAS') return;
      const nx = (e.clientX / window.innerWidth  - 0.5) * 6;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 6;
      // We can't easily get clock.getElapsedTime() here, so we use a sentinel
      // The Scene reads this and compares against clock.getElapsedTime()
      clickRef.current = { x: nx, y: ny, t: performance.now() / 1000 };
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  // Sync clickRef.t to R3F clock time (offset correction)
  // We store performance.now()/1000 and R3F clock starts at 0, so we need an offset.
  // Simplest fix: reset t to -99 after 1.5s so it doesn't keep firing.
  useEffect(() => {
    const id = setInterval(() => {
      if (clickRef.current.t > 0 &&
          performance.now() / 1000 - clickRef.current.t > 1.5) {
        clickRef.current.t = -99;
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>

      {/* LAYER 1 — R3F multi-layer starfield (hidden in light mode) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 1 }} className="dark:opacity-100 opacity-0 transition-opacity duration-500">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 75 }}
          style={{ background: '#030712' }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
        >
          <Scene mouseRef={mouseRef} scrollRef={scrollRef} clickRef={clickRef} />
        </Canvas>
      </div>

      {/* LAYER 2 — Cinematic gradient overlay (dark only) */}
      <div className="dark:block hidden" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(3,0,12,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(2,5,20,0.55) 100%)',
      }} />

      {/* LAYER 2b — Nebula colour bleed (CSS radial glows) */}
      <div className="dark:block hidden" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 35% at 15% 30%, rgba(168,85,247,0.10) 0%, transparent 70%),
          radial-gradient(ellipse 45% 30% at 85% 20%, rgba(6,182,212,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 40% 25% at 50% 75%, rgba(236,72,153,0.07) 0%, transparent 70%)
        `,
      }} />

      {/* LAYER 3 — HUD grid (parallax) */}
      <div ref={gridRef} className="bg-layer-grid" style={{
        position: 'absolute', inset: '-5%', width: '110%', height: '110%',
        pointerEvents: 'none', willChange: 'transform',
        transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
      }} />

      {/* LAYER 4 — Vignette */}
      <div className="bg-layer-vignette" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* LAYER 5 — Film grain */}
      <div className="bg-layer-noise" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    </div>
  );
}
