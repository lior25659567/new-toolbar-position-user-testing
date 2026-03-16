import React, { Suspense, useRef, useMemo, useState, useCallback, useEffect } from 'react';
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
import type { ScanPhase, GuidanceState, ModelBounds } from './types';

// ─── Inner scene (must be inside Canvas) ─────────────────────────────────────

interface SceneProps {
  onGuidanceUpdate: (g: GuidanceState) => void;
  onReset?: boolean;
  // Demo painting: when non-null, auto-paint at this NDC position each frame
  demoScanNDCRef: React.RefObject<{ x: number; y: number } | null>;
}

function Scene({ onGuidanceUpdate, onReset, demoScanNDCRef }: SceneProps) {
  const geometry = useLoader(PLYLoader, upperJawModel);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, pointer, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [mouseDown, setMouseDown] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const currentRegionRef = useRef<string | undefined>(undefined);

  const { coverageTexture, paintAt, getCoverage, getRegionCoverage, reset } = useScanProgress();
  const { evaluate, resetEngine } = useGuidanceEngine();

  // Center geometry and compute bounds
  const { bounds, enhancedGeo } = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();

    const pos = geo.attributes.position;
    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }

    const hasColors = geo.attributes.color !== undefined;
    const enhancedColors = new Float32Array(pos.count * 3);
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
      } else {
        r = 0.9; g = 0.85; b = 0.8;
      }
      enhancedColors[i * 3] = Math.min(1, Math.max(0, r));
      enhancedColors[i * 3 + 1] = Math.min(1, Math.max(0, g));
      enhancedColors[i * 3 + 2] = Math.min(1, Math.max(0, b));
    }
    geo.setAttribute('color', new THREE.BufferAttribute(enhancedColors, 3));

    const modelBounds: ModelBounds = { minX, maxX, minZ, maxZ };
    return { bounds: modelBounds, enhancedGeo: geo };
  }, [geometry]);

  // Handle reset from parent
  useEffect(() => {
    if (onReset) {
      reset();
      resetEngine();
      setPhase('idle');
      setStartTime(null);
      setElapsed(0);
      currentRegionRef.current = undefined;
    }
  }, [onReset, reset, resetEngine]);

  // Mouse down/up for scanning — only left button
  useEffect(() => {
    const canvas = gl.domElement;
    const handleDown = (e: MouseEvent) => { if (e.button !== 0) return; setMouseDown(true); };
    const handleUp   = (e: MouseEvent) => { if (e.button !== 0) return; setMouseDown(false); };
    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mouseup',   handleUp);
    window.addEventListener('mouseup',   handleUp);
    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mouseup',   handleUp);
      window.removeEventListener('mouseup',   handleUp);
    };
  }, [gl.domElement]);

  // Frame loop: raycast, paint, evaluate guidance + demo auto-paint
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (startTime !== null && phase !== 'complete') {
      setElapsed((Date.now() - startTime) / 1000);
    }

    // ── Demo auto-paint (no raycasting — direct UV mapping)
    const demoNDC = demoScanNDCRef.current;
    if (demoNDC) {
      const u = (demoNDC.x + 1) / 2;
      const v = (1 - demoNDC.y) / 2;
      const localX = bounds.minX + u * (bounds.maxX - bounds.minX);
      const localZ = bounds.minZ + v * (bounds.maxZ - bounds.minZ);
      paintAt(localX, localZ, bounds);
      return; // skip user-scan logic during demo
    }

    // ── Normal user-scan logic
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
        const localPoint = mesh.worldToLocal(hits[0].point.clone());
        paintAt(localPoint.x, localPoint.z, bounds);
        const nx = (localPoint.x - bounds.minX) / (bounds.maxX - bounds.minX);
        const nz = (localPoint.z - bounds.minZ) / (bounds.maxZ - bounds.minZ);
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
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow color="#f5f0e8" />
      <directionalLight position={[-5, 5, -5]} intensity={0.35} color="#e8eef5" />
      <directionalLight position={[0, -3, 5]} intensity={0.25} />
      <directionalLight position={[0, 5, -5]} intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={0.2} color="#fff5e6" />
      <pointLight position={[3, 0, 3]} intensity={0.15} color="#e6f0ff" />
      <Environment preset="apartment" background={false} />

      <Center>
        <group rotation={[Math.PI * 0.6, 0, Math.PI]}>
          <mesh ref={meshRef} geometry={enhancedGeo} scale={0.035}>
            <RevealMaterial coverageTexture={coverageTexture} bounds={bounds} />
          </mesh>
        </group>
      </Center>

      <ScanningBoundary meshRef={meshRef} isScanning={mouseDown} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
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
  const [pointerNDC, setPointerNDC] = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Demo mode
  const { isPlaying, play, demoGuidance, demoPointerNDC, demoFlashActive } = useDemoMode();

  // Ref used by Scene.useFrame to auto-paint during demo
  const demoScanNDCRef = useRef<{ x: number; y: number } | null>(null);

  // Keep the ref in sync: paint when demo is in a scanning phase
  useEffect(() => {
    const isScanning = isPlaying && demoGuidance?.phase === 'scanning';
    demoScanNDCRef.current = isScanning ? (demoPointerNDC ?? null) : null;
  }, [isPlaying, demoGuidance?.phase, demoPointerNDC]);

  // Start demo after a reset has propagated (200ms delay)
  useEffect(() => {
    if (demoTrigger <= 0) return;
    const t = setTimeout(() => play(), 200);
    return () => clearTimeout(t);
  }, [demoTrigger, play]);

  // ── Real user guidance handler (ignored while demo is playing)
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

  // ── Elapsed timer (real mode only)
  const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) return;
    if (guidance.phase === 'scanning' && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    if (guidance.phase === 'idle') { startTimeRef.current = null; setElapsed(0); }
  }, [guidance.phase, isPlaying]);

  useEffect(() => {
    if (isPlaying || startTimeRef.current === null || guidance.phase === 'complete') return;
    const id = setInterval(() => {
      if (startTimeRef.current) setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 200);
    return () => clearInterval(id);
  }, [guidance.phase, isPlaying]);

  useEffect(() => {
    startTimeRef.current = null;
    setElapsed(0);
    setFlashActive(false);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [resetTrigger]);

  // ── Decide what the overlay displays
  const displayGuidance = (isPlaying && demoGuidance) ? demoGuidance : guidance;
  const displayPointerNDC = (isPlaying && demoPointerNDC) ? demoPointerNDC : pointerNDC;
  const displayFlash = isPlaying ? demoFlashActive : flashActive;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <Canvas
        camera={{ position: [0, -2, 4.5], fov: 40, near: 0.01, far: 1000, up: [0, 1, 0] }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true,
              toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7 }}
        style={{ touchAction: 'none' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Scene
            onGuidanceUpdate={handleGuidance}
            onReset={resetTrigger > 0 ? true : undefined}
            demoScanNDCRef={demoScanNDCRef}
          />
        </Suspense>
      </Canvas>

      <GuidanceOverlay
        guidance={displayGuidance}
        elapsedSeconds={elapsed}
        pointerNDC={displayPointerNDC}
        flashActive={displayFlash}
      />
    </div>
  );
}
