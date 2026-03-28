/**
 * Scene3D — collection of self-contained 3D animated objects
 * Each export is a standalone <Canvas> component, sized to fit inline.
 *
 * Objects:
 *  FloatingLaptop   — wireframe laptop, floats + rotates (Hero / About)
 *  CodeCube         — rotating cube with glowing edges (Tracks)
 *  BlockchainNodes  — connected node graph spinning (Prizes / Timeline)
 *  DNAHelix         — double helix strand (FAQ / Register)
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PI2 = Math.PI * 2;
function rand(a, b) { return Math.random() * (b - a) + a; }

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING LAPTOP
───────────────────────────────────────────────────────────────────────────── */
function LaptopMesh() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.4;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.12;
    group.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#a855f7', transparent: true, opacity: 0.85 }), []);
  const screenMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#06b6d4', transparent: true, opacity: 0.18, side: THREE.DoubleSide }), []);
  const bodyMat   = useMemo(() => new THREE.MeshBasicMaterial({ color: '#1e1040', transparent: true, opacity: 0.7,  side: THREE.DoubleSide }), []);

  // Base: box 1.4 × 0.08 × 0.9
  const baseGeo   = useMemo(() => new THREE.BoxGeometry(1.4, 0.08, 0.9), []);
  const baseEdge  = useMemo(() => new THREE.EdgesGeometry(baseGeo), [baseGeo]);
  // Lid: box 1.4 × 0.04 × 0.9, hinged at back
  const lidGeo    = useMemo(() => new THREE.BoxGeometry(1.4, 0.04, 0.9), []);
  const lidEdge   = useMemo(() => new THREE.EdgesGeometry(lidGeo), [lidGeo]);
  // Screen fill
  const screenGeo = useMemo(() => new THREE.PlaneGeometry(1.28, 0.82), []);

  return (
    <group ref={group}>
      {/* Base */}
      <mesh geometry={baseGeo} material={bodyMat} position={[0, 0, 0]} />
      <lineSegments geometry={baseEdge} material={edgeMat} position={[0, 0, 0]} />

      {/* Lid — tilted ~110° from base */}
      <group position={[0, 0.04, -0.45]} rotation={[-1.92, 0, 0]}>
        <mesh geometry={lidGeo} material={bodyMat} position={[0, 0, 0.45]} />
        <lineSegments geometry={lidEdge} material={edgeMat} position={[0, 0, 0.45]} />
        {/* Screen glow */}
        <mesh geometry={screenGeo} material={screenMat} position={[0, 0.025, 0.45]} />
        {/* Screen lines (code) */}
        {[0.25, 0.1, -0.05, -0.2].map((y, i) => (
          <mesh key={i} position={[rand(-0.3, 0.1), y, 0.46]}>
            <planeGeometry args={[rand(0.3, 0.9), 0.025]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#a855f7' : '#22d3ee'} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* Keyboard dots */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[-0.5 + (i % 6) * 0.2, 0.045, -0.1 + Math.floor(i / 6) * 0.2]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshBasicMaterial color="#2d1b69" />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingLaptop({ size = 200 }) {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0.6, 2.4], fov: 45 }}
        gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}>
        <LaptopMesh />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CODE CUBE
───────────────────────────────────────────────────────────────────────────── */
function CubeMesh() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.x = t * 0.35;
    group.current.rotation.y = t * 0.55;
    group.current.rotation.z = t * 0.15;
    group.current.position.y = Math.sin(t * 0.7) * 0.07;
  });

  const geo      = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const edges    = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  const faceMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: '#0a0520', transparent: true, opacity: 0.6, side: THREE.DoubleSide }), []);
  const edgeMat  = useMemo(() => new THREE.LineBasicMaterial({ color: '#8b5cf6', transparent: true, opacity: 1 }), []);

  // Inner smaller cube
  const geo2     = useMemo(() => new THREE.BoxGeometry(0.55, 0.55, 0.55), []);
  const edges2   = useMemo(() => new THREE.EdgesGeometry(geo2), [geo2]);
  const edgeMat2 = useMemo(() => new THREE.LineBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.8 }), []);

  return (
    <group ref={group}>
      <mesh geometry={geo} material={faceMat} />
      <lineSegments geometry={edges} material={edgeMat} />
      {/* Inner cube rotates opposite */}
      <group rotation={[0.5, 0.5, 0]}>
        <lineSegments geometry={edges2} material={edgeMat2} />
      </group>
      {/* Corner glow spheres */}
      {[[-0.5,-0.5,-0.5],[0.5,-0.5,-0.5],[-0.5,0.5,-0.5],[0.5,0.5,-0.5],
        [-0.5,-0.5,0.5],[0.5,-0.5,0.5],[-0.5,0.5,0.5],[0.5,0.5,0.5]].map(([x,y,z],i) => (
        <mesh key={i} position={[x,y,z]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#a855f7' : '#06b6d4'} />
        </mesh>
      ))}
    </group>
  );
}

export function CodeCube({ size = 180 }) {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}>
        <CubeMesh />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BLOCKCHAIN NODES
───────────────────────────────────────────────────────────────────────────── */
const NODE_POSITIONS = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * PI2;
  const r = i % 2 === 0 ? 0.9 : 0.45;
  return [Math.cos(angle) * r, Math.sin(angle) * r * 0.5, (Math.random() - 0.5) * 0.4];
});

function BlockchainMesh() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.3;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
  });

  const nodeMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: '#a855f7' }), []);
  const nodeMat2 = useMemo(() => new THREE.MeshBasicMaterial({ color: '#22d3ee' }), []);
  const nodeGeo  = useMemo(() => new THREE.OctahedronGeometry(0.07, 0), []);

  // Build line segments between nodes
  const lineGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i < NODE_POSITIONS.length; i++) {
      for (let j = i + 1; j < NODE_POSITIONS.length; j++) {
        const [ax,ay,az] = NODE_POSITIONS[i];
        const [bx,by,bz] = NODE_POSITIONS[j];
        const dist = Math.sqrt((bx-ax)**2+(by-ay)**2+(bz-az)**2);
        if (dist < 1.1) { pts.push(ax,ay,az, bx,by,bz); }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: '#8b5cf6', transparent: true, opacity: 0.45,
  }), []);

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo} material={lineMat} />
      {NODE_POSITIONS.map(([x,y,z], i) => (
        <mesh key={i} geometry={nodeGeo} material={i % 3 === 0 ? nodeMat2 : nodeMat}
          position={[x,y,z]} rotation={[i,i*0.5,0]} />
      ))}
      {/* Central hub */}
      <mesh position={[0,0,0]}>
        <icosahedronGeometry args={[0.14, 0]} />
        <meshBasicMaterial color="#ec4899" wireframe />
      </mesh>
    </group>
  );
}

export function BlockchainNodes({ size = 180 }) {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}>
        <BlockchainMesh />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DNA HELIX
───────────────────────────────────────────────────────────────────────────── */
function DNAMesh() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.5;
    group.current.position.y = Math.sin(t * 0.4) * 0.05;
  });

  const STEPS = 28;
  const HEIGHT = 1.8;
  const RADIUS = 0.38;

  const strand1 = useMemo(() => {
    const pts = [];
    for (let i = 0; i < STEPS; i++) {
      const t = i / (STEPS - 1);
      const angle = t * PI2 * 2.5;
      pts.push(Math.cos(angle) * RADIUS, t * HEIGHT - HEIGHT / 2, Math.sin(angle) * RADIUS);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  const strand2 = useMemo(() => {
    const pts = [];
    for (let i = 0; i < STEPS; i++) {
      const t = i / (STEPS - 1);
      const angle = t * PI2 * 2.5 + Math.PI;
      pts.push(Math.cos(angle) * RADIUS, t * HEIGHT - HEIGHT / 2, Math.sin(angle) * RADIUS);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  const mat1 = useMemo(() => new THREE.LineBasicMaterial({ color: '#a855f7', transparent: true, opacity: 0.9 }), []);
  const mat2 = useMemo(() => new THREE.LineBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.9 }), []);
  const rungMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.25 }), []);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.045, 8, 8), []);
  const smat1 = useMemo(() => new THREE.MeshBasicMaterial({ color: '#c084fc' }), []);
  const smat2 = useMemo(() => new THREE.MeshBasicMaterial({ color: '#67e8f9' }), []);

  // Rungs between strands
  const rungs = useMemo(() => {
    const pts = [];
    for (let i = 0; i < STEPS; i += 2) {
      const t = i / (STEPS - 1);
      const a1 = t * PI2 * 2.5;
      const a2 = a1 + Math.PI;
      const y = t * HEIGHT - HEIGHT / 2;
      pts.push(
        Math.cos(a1)*RADIUS, y, Math.sin(a1)*RADIUS,
        Math.cos(a2)*RADIUS, y, Math.sin(a2)*RADIUS,
      );
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return geo;
  }, []);

  // Node positions for spheres
  const nodes1 = useMemo(() => Array.from({ length: STEPS }, (_, i) => {
    const t = i / (STEPS - 1);
    const angle = t * PI2 * 2.5;
    return [Math.cos(angle)*RADIUS, t*HEIGHT - HEIGHT/2, Math.sin(angle)*RADIUS];
  }), []);
  const nodes2 = useMemo(() => Array.from({ length: STEPS }, (_, i) => {
    const t = i / (STEPS - 1);
    const angle = t * PI2 * 2.5 + Math.PI;
    return [Math.cos(angle)*RADIUS, t*HEIGHT - HEIGHT/2, Math.sin(angle)*RADIUS];
  }), []);

  return (
    <group ref={group}>
      <line geometry={strand1} material={mat1} />
      <line geometry={strand2} material={mat2} />
      <lineSegments geometry={rungs} material={rungMat} />
      {nodes1.filter((_,i) => i % 3 === 0).map(([x,y,z],i) => (
        <mesh key={i} geometry={sphereGeo} material={smat1} position={[x,y,z]} />
      ))}
      {nodes2.filter((_,i) => i % 3 === 0).map(([x,y,z],i) => (
        <mesh key={i} geometry={sphereGeo} material={smat2} position={[x,y,z]} />
      ))}
    </group>
  );
}

export function DNAHelix({ size = 180 }) {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 2.4], fov: 50 }}
        gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}>
        <DNAMesh />
      </Canvas>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TROPHY (Prizes section)
───────────────────────────────────────────────────────────────────────────── */
function TrophyMesh() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.6;
    group.current.position.y = Math.sin(t * 0.9) * 0.07;
  });

  const goldMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f59e0b', wireframe: false }), []);
  const edgeMat  = useMemo(() => new THREE.LineBasicMaterial({ color: '#fbbf24', transparent: true, opacity: 0.9 }), []);
  const starMat  = useMemo(() => new THREE.MeshBasicMaterial({ color: '#fde68a' }), []);

  const cupGeo   = useMemo(() => new THREE.CylinderGeometry(0.5, 0.3, 0.8, 8, 1, true), []);
  const cupEdge  = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.5, 0.3, 0.8, 8)), []);
  const baseGeo  = useMemo(() => new THREE.CylinderGeometry(0.35, 0.4, 0.12, 8), []);
  const stemGeo  = useMemo(() => new THREE.CylinderGeometry(0.07, 0.07, 0.35, 8), []);
  const starGeo  = useMemo(() => new THREE.OctahedronGeometry(0.12, 0), []);

  return (
    <group ref={group}>
      {/* Cup */}
      <mesh geometry={cupGeo} material={goldMat} position={[0, 0.3, 0]} />
      <lineSegments geometry={cupEdge} material={edgeMat} position={[0, 0.3, 0]} />
      {/* Stem */}
      <mesh geometry={stemGeo} material={goldMat} position={[0, -0.22, 0]} />
      {/* Base */}
      <mesh geometry={baseGeo} material={goldMat} position={[0, -0.44, 0]} />
      {/* Star on top */}
      <mesh geometry={starGeo} material={starMat} position={[0, 0.82, 0]} rotation={[0.3, 0.5, 0]} />
      {/* Handles */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * 0.55, 0.3, 0]}>
          <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}
    </group>
  );
}

export function Trophy3D({ size = 180 }) {
  return (
    <div style={{ width: size, height: size, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}>
        <TrophyMesh />
      </Canvas>
    </div>
  );
}
