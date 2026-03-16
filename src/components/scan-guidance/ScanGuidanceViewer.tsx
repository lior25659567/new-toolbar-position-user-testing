import React, {
  Suspense, useRef, useMemo, useState,
  useCallback, useEffect, useLayoutEffect,
} from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { PLYLoader } from 'three-stdlib';
import * as THREE from 'three';
import upperJawModel from '@/assets/3d-models/upper-jaw.ply?url';
import RevealMaterial from './RevealMaterial';
import ScanningBoundary from './ScanningBoundary';
import { useScanProgress } from './useScanProgress';
import { useGuidanceEngine } from './useGuidanceEngine';
import { useDemoMode } from './useDemoMode';
import GuidanceOverlay from './GuidanceOverlay';
import type { ScanPhase, ScanStage, GuidanceState, ModelBounds } from './types';

// ─── Group rotation targets per stage ────────────────────────────────────────
// The model's Y axis is the jaw's vertical; rotating it shows different surfaces.
const STAGE_ROT_Y: Record<ScanStage, number> = {
  occlusal:  0,     // top-down bite surface view
  buccal:   -0.95,  // tilted to show cheek (outer) surface
  lingual:   0.95,  // tilted to show tongue (inner) surface
};

// ─── Inner scene (must be inside Canvas) ─────────────────────────────────────

interface SceneProps {
  onGuidanceUpdate: (g: GuidanceState) => void;
  onReset?: boolean;
  /** Ref to current demo NDC position. When non-null, auto-paints the model. */
  demoScanNDCRef: React.RefObject<{ x: number; y: number } | null>;
  /** Ref to current demo stage for model auto-rotation. */
  demoStageRef: React.RefObject<ScanStage | null>;
}

function Scene({ onGuidanceUpdate, onReset, demoScanNDCRef, demoStageRef }: SceneProps) {
  const geometry = useLoader(PLYLoader, upperJawModel);
  const meshRef  = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, pointer, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const [phase, setPhase]       = useState<ScanPhase>('idle');
  const [mouseDown, setMouseDown] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const currentRegionRef = useRef<string | undefined>(undefined);

  const { coverageTexture, paintAt, getCoverage, getRegionCoverage, reset } = useScanProgress();
  const { evaluate, resetEngine } = useGuidanceEngine();

  // ── Geometry setup ────────────────────────────────────────────────────────
  const { bounds, enhancedGeo } = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();

    const pos = geo.attributes.position;
    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }

    const hasColors = geo.attributes.color !== undefined;
    const col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      let r: number, g: number, b: number;
      if (hasColors) {
        r = geo.attributes.color.getX(i);
        g = geo.attributes.color.getY(i);
        b = geo.attributes.color.getZ(i);
        const avg = (r + g + b) / 3;
        r = ((r - avg) * 1.4 + avg) * 1.35 * 0.65;
        g = ((g - avg) * 1.4 + avg) * 1.35 * 0.65;
        b = ((b - avg) * 1.4 + avg) * 1.35 * 0.65;
      } else { r = 0.9; g = 0.85; b = 0.8; }
      col[i * 3]     = Math.min(1, Math.max(0, r));
      col[i * 3 + 1] = Math.min(1, Math.max(0, g));
      col[i * 3 + 2] = Math.min(1, Math.max(0, b));
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return { bounds: { minX, maxX, minZ, maxZ } as ModelBounds, enhancedGeo: geo };
  }, [geometry]);

  // Set initial group rotation imperatively (avoids JSX prop re-render conflicts)
  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(Math.PI * 0.6, 0, Math.PI);
    }
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (onReset) {
      reset(); resetEngine();
      setPhase('idle'); setStartTime(null);
      currentRegionRef.current = undefined;
    }
  }, [onReset, reset, resetEngine]);

  // ── Mouse events ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;
    const dn = (e: MouseEvent) => { if (e.button === 0) setMouseDown(true); };
    const up = (e: MouseEvent) => { if (e.button === 0) setMouseDown(false); };
    canvas.addEventListener('mousedown', dn);
    canvas.addEventListener('mouseup',   up);
    window.addEventListener('mouseup',   up);
    return () => {
      canvas.removeEventListener('mousedown', dn);
      canvas.removeEventListener('mouseup',   up);
      window.removeEventListener('mouseup',   up);
    };
  }, [gl.domElement]);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame(() => {
    const mesh  = meshRef.current;
    const group = groupRef.current;

    // ── Model rotation — lerp toward stage target (demo) or back to 0 (real)
    if (group) {
      const stage = demoStageRef.current;
      const targetY = stage ? STAGE_ROT_Y[stage] : 0;
      // Keep X and Z at their base values; only animate Y
      group.rotation.x = Math.PI * 0.6;
      group.rotation.z = Math.PI;
      group.rotation.y += (targetY - group.rotation.y) * 0.04;
    }

    if (!mesh) return;

    // ── Demo auto-paint: use a large (scanner-sized) brush at the NDC position
    const demoNDC = demoScanNDCRef.current;
    if (demoNDC) {
      // Map NDC → model local space (approximate UV-based mapping)
      const u = (demoNDC.x + 1) / 2;
      const v = (1 - demoNDC.y) / 2;
      const lx = bounds.minX + Math.min(1, Math.max(0, u)) * (bounds.maxX - bounds.minX);
      const lz = bounds.minZ + Math.min(1, Math.max(0, v)) * (bounds.maxZ - bounds.minZ);

      // Paint the center point with large brush (represents scanner viewport)
      paintAt(lx, lz, bounds, true);

      // Also paint two neighboring strip positions to better fill the frame's width
      const stripW = (bounds.maxX - bounds.minX) * 0.08;
      paintAt(lx - stripW, lz, bounds, true);
      paintAt(lx + stripW, lz, bounds, true);

      return; // skip user-scan logic while demo is running
    }

    // ── Normal user scanning ──────────────────────────────────────────────
    const coverage = getCoverage();
    let currentPhase: ScanPhase = phase;

    if (coverage >= 0.95) {
      currentPhase = 'complete';
    } else if (mouseDown) {
      if (phase === 'idle' && startTime === null) setStartTime(Date.now());
      currentPhase = 'scanning';

      raycaster.current.setFromCamera(pointer, camera);
      const hits = raycaster.current.intersectObject(mesh, false);
      if (hits.length > 0) {
        const local = mesh.worldToLocal(hits[0].point.clone());
        paintAt(local.x, local.z, bounds, false);
        const nx = (local.x - bounds.minX) / (bounds.maxX - bounds.minX);
        const nz = (local.z - bounds.minZ) / (bounds.maxZ - bounds.minZ);
        if      (nx < 0.5 && nz < 0.5) currentRegionRef.current = 'upper-left';
        else if (nx >= 0.5 && nz < 0.5) currentRegionRef.current = 'upper-right';
        else if (nx < 0.5)              currentRegionRef.current = 'lower-left';
        else                            currentRegionRef.current = 'lower-right';
      }
    } else if (startTime !== null) {
      currentPhase = 'paused';
    }

    if (currentPhase !== phase) setPhase(currentPhase);

    const guidance = evaluate(currentPhase, coverage, getRegionCoverage, currentRegionRef.current);
    onGuidanceUpdate({ ...guidance, coveragePercent: coverage });
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]}   intensity={0.8}  castShadow color="#f5f0e8" />
      <directionalLight position={[-5, 5, -5]}  intensity={0.35} color="#e8eef5" />
      <directionalLight position={[0, -3, 5]}   intensity={0.25} />
      <directionalLight position={[0, 5, -5]}   intensity={0.2}  />
      <pointLight       position={[0, 10, 0]}   intensity={0.2}  color="#fff5e6" />
      <pointLight       position={[3, 0, 3]}    intensity={0.15} color="#e6f0ff" />
      <Environment preset="apartment" background={false} />

      <Center>
        {/* group rotation is set imperatively in useFrame */}
        <group ref={groupRef}>
          <mesh ref={meshRef} geometry={enhancedGeo} scale={0.035}>
            <RevealMaterial coverageTexture={coverageTexture} bounds={bounds} />
          </mesh>
        </group>
      </Center>

      <ScanningBoundary meshRef={meshRef} isScanning={mouseDown} />

      <OrbitControls
        enablePan={true} enableZoom={true} enableRotate={true}
        mouseButtons={{ LEFT: undefined as any, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
        rotateSpeed={1.5} zoomSpeed={1.2} panSpeed={1.2}
        enableDamping={true} dampingFactor={0.08}
        minDistance={0.5} maxDistance={10}
        minPolarAngle={0.1} maxPolarAngle={Math.PI - 0.1}
        screenSpacePanning={true} target={[0, 0, 0]} makeDefault
      />
    </>
  );
}

function LoadingSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#009ACE" wireframe />
    </mesh>
  );
}

// ─── Exported Viewer ─────────────────────────────────────────────────────────

interface ScanGuidanceViewerProps {
  resetTrigger: number;
  demoTrigger: number;
}

export default function ScanGuidanceViewer({ resetTrigger, demoTrigger }: ScanGuidanceViewerProps) {
  const [guidance, setGuidance] = useState<GuidanceState>({
    phase: 'idle', direction: null, hint: '', coveragePercent: 0,
    activeRegion: null, regions: [],
    stage: 'occlusal', activeEdge: null, stageAdvanced: false,
  });
  const [elapsed, setElapsed] = useState(0);
  const [pointerNDC, setPointerNDC]     = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive]   = useState(false);

  const containerRef    = useRef<HTMLDivElement>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Demo mode ─────────────────────────────────────────────────────────────
  const { isPlaying, play, demoGuidance, demoPointerNDC, demoFlashActive } = useDemoMode();

  // Ref read by Scene.useFrame — drives both painting AND model rotation
  const demoScanNDCRef = useRef<{ x: number; y: number } | null>(null);
  const demoStageRef   = useRef<ScanStage | null>(null);

  // Keep refs in sync with demo state (read by Scene at 60fps without re-renders)
  useEffect(() => {
    const scanning = isPlaying && demoGuidance?.phase === 'scanning';
    demoScanNDCRef.current = scanning ? (demoPointerNDC ?? null) : null;
    demoStageRef.current   = isPlaying ? (demoGuidance?.stage ?? null) : null;
  });

  // Start demo after reset has propagated
  useEffect(() => {
    if (demoTrigger <= 0) return;
    const t = setTimeout(() => play(), 200);
    return () => clearTimeout(t);
  }, [demoTrigger, play]);

  // ── Real user guidance ────────────────────────────────────────────────────
  const handleGuidance = useCallback((g: GuidanceState) => {
    if (isPlaying) return;
    setGuidance(g);
    if (g.stageAdvanced) {
      setFlashActive(true);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashActive(false), 600);
    }
  }, [isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlaying) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointerNDC({
      x:  (e.clientX - rect.left) / rect.width  * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    });
  }, [isPlaying]);

  // ── Elapsed timer (real mode) ─────────────────────────────────────────────
  const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) return;
    if (guidance.phase === 'scanning' && !startTimeRef.current) startTimeRef.current = Date.now();
    if (guidance.phase === 'idle') { startTimeRef.current = null; setElapsed(0); }
  }, [guidance.phase, isPlaying]);

  useEffect(() => {
    if (isPlaying || !startTimeRef.current || guidance.phase === 'complete') return;
    const id = setInterval(() => {
      if (startTimeRef.current) setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 200);
    return () => clearInterval(id);
  }, [guidance.phase, isPlaying]);

  useEffect(() => {
    startTimeRef.current = null;
    setElapsed(0); setFlashActive(false);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [resetTrigger]);

  // ── Merge real / demo for overlay ─────────────────────────────────────────
  const displayGuidance  = (isPlaying && demoGuidance)  ? demoGuidance  : guidance;
  const displayPointer   = (isPlaying && demoPointerNDC) ? demoPointerNDC : pointerNDC;
  const displayFlash     = isPlaying ? demoFlashActive : flashActive;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        camera={{ position: [0, -2, 4.5], fov: 40, near: 0.01, far: 1000, up: [0, 1, 0] }}
        gl={{
          antialias: true, alpha: true, preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7,
        }}
        style={{ touchAction: 'none' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Scene
            onGuidanceUpdate={handleGuidance}
            onReset={resetTrigger > 0 ? true : undefined}
            demoScanNDCRef={demoScanNDCRef}
            demoStageRef={demoStageRef}
          />
        </Suspense>
      </Canvas>

      <GuidanceOverlay
        guidance={displayGuidance}
        elapsedSeconds={elapsed}
        pointerNDC={displayPointer}
        flashActive={displayFlash}
      />
    </div>
  );
}
