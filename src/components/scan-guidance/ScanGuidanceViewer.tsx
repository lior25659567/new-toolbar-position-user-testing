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
import GuidanceOverlay from './GuidanceOverlay';
import type { ScanPhase, GuidanceState, ModelBounds } from './types';

// ─── Inner scene ──────────────────────────────────────────────────────────────

interface SceneProps {
  onGuidanceUpdate: (g: GuidanceState) => void;
  onReset?: boolean;
}

function Scene({ onGuidanceUpdate, onReset }: SceneProps) {
  const geometry = useLoader(PLYLoader, upperJawModel);
  const meshRef  = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  const [phase, setPhase]         = useState<ScanPhase>('idle');
  const [isHovering, setIsHovering] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const currentRegionRef = useRef<string | undefined>(undefined);

  const { coverageTexture, paintAt, getCoverage, getRegionCoverage, reset } = useScanProgress();
  const { evaluate, resetEngine } = useGuidanceEngine();

  // ── Geometry ──────────────────────────────────────────────────────────────
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

  // Set initial group rotation imperatively
  useLayoutEffect(() => {
    if (groupRef.current) groupRef.current.rotation.set(Math.PI * 0.6, 0, Math.PI);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (onReset) {
      reset(); resetEngine();
      setPhase('idle'); setStartTime(null); setIsHovering(false);
      currentRegionRef.current = undefined;
    }
  }, [onReset, reset, resetEngine]);

  // ── Frame loop — hover to scan, no click needed ───────────────────────────
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    raycaster.current.setFromCamera(pointer, camera);
    const hits = raycaster.current.intersectObject(mesh, false);
    const hitting = hits.length > 0;

    if (hitting !== isHovering) setIsHovering(hitting);

    const coverage = getCoverage();
    let currentPhase: ScanPhase = phase;

    if (coverage >= 0.95) {
      currentPhase = 'complete';
    } else if (hitting) {
      // Scanning: just move the cursor over the model
      if (startTime === null) setStartTime(Date.now());
      currentPhase = 'scanning';

      const local = mesh.worldToLocal(hits[0].point.clone());
      paintAt(local.x, local.z, bounds, false);

      // Track current region
      const nx = (local.x - bounds.minX) / (bounds.maxX - bounds.minX);
      const nz = (local.z - bounds.minZ) / (bounds.maxZ - bounds.minZ);
      if      (nx < 0.5 && nz < 0.5) currentRegionRef.current = 'upper-left';
      else if (nx >= 0.5 && nz < 0.5) currentRegionRef.current = 'upper-right';
      else if (nx < 0.5)              currentRegionRef.current = 'lower-left';
      else                            currentRegionRef.current = 'lower-right';
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
        <group ref={groupRef}>
          <mesh ref={meshRef} geometry={enhancedGeo} scale={0.035}>
            <RevealMaterial coverageTexture={coverageTexture} bounds={bounds} />
          </mesh>
        </group>
      </Center>

      <ScanningBoundary meshRef={meshRef} isScanning={isHovering} />

      {/* Right-click to rotate, scroll to zoom */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        mouseButtons={{
          LEFT: undefined as any,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        rotateSpeed={1.5}
        zoomSpeed={1.2}
        enableDamping={true}
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={10}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        target={[0, 0, 0]}
        makeDefault
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
}

export default function ScanGuidanceViewer({ resetTrigger }: ScanGuidanceViewerProps) {
  const [guidance, setGuidance] = useState<GuidanceState>({
    phase: 'idle', direction: null, hint: '', coveragePercent: 0,
    activeRegion: null, regions: [],
    stage: 'occlusal', activeEdge: null, stageAdvanced: false,
  });
  const [elapsed, setElapsed]     = useState(0);
  const [pointerNDC, setPointerNDC] = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive] = useState(false);

  const containerRef    = useRef<HTMLDivElement>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGuidance = useCallback((g: GuidanceState) => {
    setGuidance(g);
    if (g.stageAdvanced) {
      setFlashActive(true);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setFlashActive(false), 600);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointerNDC({
      x:  (e.clientX - rect.left) / rect.width  * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    });
  }, []);

  // Elapsed timer
  const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (guidance.phase === 'scanning' && !startTimeRef.current) startTimeRef.current = Date.now();
    if (guidance.phase === 'idle') { startTimeRef.current = null; setElapsed(0); }
  }, [guidance.phase]);

  useEffect(() => {
    if (!startTimeRef.current || guidance.phase === 'complete') return;
    const id = setInterval(() => {
      if (startTimeRef.current) setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 200);
    return () => clearInterval(id);
  }, [guidance.phase]);

  useEffect(() => {
    startTimeRef.current = null;
    setElapsed(0); setFlashActive(false);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
  }, [resetTrigger]);

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
          />
        </Suspense>
      </Canvas>

      <GuidanceOverlay
        guidance={guidance}
        elapsedSeconds={elapsed}
        pointerNDC={pointerNDC}
        flashActive={flashActive}
      />
    </div>
  );
}
