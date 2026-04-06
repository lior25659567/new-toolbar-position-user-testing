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
import type { ScanPhase, GuidanceState, ModelBounds, GuidanceMode } from './types';

// ─── Inner scene ──────────────────────────────────────────────────────────────

const BASE_ROT_X = Math.PI * 0.6;
const BASE_ROT_Z = Math.PI;

// Frame NDC half-extents (matches CSS clamp sizes on ~1400×900 viewport)
const FRAME_HALF_W = 0.18;
const FRAME_HALF_H = 0.38;

// Reusable vector for projection (avoids GC)
const _projVec = new THREE.Vector3();

interface SceneProps {
  onGuidanceUpdate: (g: GuidanceState) => void;
  onReset?: number;
  guidanceMode?: GuidanceMode;
}

const DOF_AXIS: Record<string, 'lr'|'ud'|'fb'|'roll'|'pitch'|'yaw'> = {
  'dof-lr':'lr','bare-lr':'lr','ring-lr':'lr','pulse-lr':'lr','ghost-lr':'lr','wand-lr':'lr','gwand-lr':'lr','bgwand-lr':'lr','fgwand-lr':'lr','fagwand-lr':'lr',
  'dof-ud':'ud','bare-ud':'ud','ring-ud':'ud','pulse-ud':'ud','ghost-ud':'ud','wand-ud':'ud','gwand-ud':'ud','bgwand-ud':'ud','fgwand-ud':'ud','fagwand-ud':'ud',
  'dof-fb':'fb','bare-fb':'fb','ring-fb':'fb','pulse-fb':'fb','ghost-fb':'fb','wand-fb':'fb','gwand-fb':'fb','bgwand-fb':'fb','fgwand-fb':'fb','fagwand-fb':'fb',
  'dof-roll':'roll','bare-roll':'roll','ring-roll':'roll','pulse-roll':'roll','ghost-roll':'roll','wand-roll':'roll','gwand-roll':'roll','bgwand-roll':'roll','fgwand-roll':'roll','fagwand-roll':'roll',
  'dof-pitch':'pitch','bare-pitch':'pitch','ring-pitch':'pitch','pulse-pitch':'pitch','ghost-pitch':'pitch','wand-pitch':'pitch','gwand-pitch':'pitch','bgwand-pitch':'pitch','fgwand-pitch':'pitch','fagwand-pitch':'pitch',
  'dof-yaw':'yaw','bare-yaw':'yaw','ring-yaw':'yaw','pulse-yaw':'yaw','ghost-yaw':'yaw','wand-yaw':'yaw','gwand-yaw':'yaw','bgwand-yaw':'yaw','fgwand-yaw':'yaw','fagwand-yaw':'yaw',
  'rot-cw':'roll','rot-ccw':'roll','rot-tilt':'pitch',
};

function Scene({ onGuidanceUpdate, onReset, guidanceMode }: SceneProps) {
  const geometry = useLoader(PLYLoader, upperJawModel);
  const meshRef  = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, pointer } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const samplePt  = useRef(new THREE.Vector2());

  const [phase, setPhase]         = useState<ScanPhase>('idle');
  const [isHovering, setIsHovering] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const currentRegionRef = useRef<string | undefined>(undefined);
  const weakestCenterRef = useRef<{ x: number; z: number } | null>(null);
  const dofTime = useRef(0);

  const { coverageTexture, captureRect, getCoverage, getRegionCoverage, reset } = useScanProgress();
  const { evaluate, resetEngine } = useGuidanceEngine();

  // ── Geometry ──────────────────────────────────────────────────────────────
  const { bounds, enhancedGeo } = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();

    const pos = geo.attributes.position;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
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
    const surfaceY = (minY + maxY) / 2;
    return { bounds: { minX, maxX, minZ, maxZ, surfaceY } as ModelBounds, enhancedGeo: geo };
  }, [geometry]);

  useLayoutEffect(() => {
    if (groupRef.current) groupRef.current.rotation.set(BASE_ROT_X, 0, BASE_ROT_Z);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (onReset && onReset > 0) {
      reset(); resetEngine();
      setPhase('idle'); setStartTime(null); setIsHovering(false);
      currentRegionRef.current = undefined;
      weakestCenterRef.current = null;
      if (groupRef.current) groupRef.current.rotation.set(BASE_ROT_X, 0, BASE_ROT_Z);
    }
  }, [onReset]);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame(() => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    // ── Model rotation: mouse follow + bias toward unscanned area ──
    const isSurfaceGuide = guidanceMode === 'surface-guide';
    let targetX = BASE_ROT_X + pointer.y * -0.20;
    let targetY = pointer.x * 0.40;

    const wc = weakestCenterRef.current;
    if (wc) {
      if (isSurfaceGuide) {
        // Auto-rotate aggressively toward weakest region
        targetX += (wc.z - 0.5) * -0.55;
        targetY += (wc.x - 0.5) * 0.80;
      } else {
        targetX += (wc.z - 0.5) * -0.15;
        targetY += (wc.x - 0.5) * 0.25;
      }
    }

    const lerpSpeed = isSurfaceGuide ? 0.025 : 0.06;
    group.rotation.x += (targetX - group.rotation.x) * lerpSpeed;
    group.rotation.y += (targetY - group.rotation.y) * lerpSpeed;
    group.rotation.z  = BASE_ROT_Z;

    // ── 6DoF model animation ──
    const axis = guidanceMode ? DOF_AXIS[guidanceMode] : undefined;
    dofTime.current += 0.018;
    const sin = Math.sin(dofTime.current * 1.6);
    const m = meshRef.current;
    if (m) {
      if (axis === 'lr')         { group.position.x = sin * 0.12; group.position.y *= 0.92; m.scale.setScalar(0.055); }
      else if (axis === 'ud')    { group.position.y = sin * 0.10; group.position.x *= 0.92; m.scale.setScalar(0.055); }
      else if (axis === 'fb')    { group.position.x *= 0.92; group.position.y *= 0.92; m.scale.setScalar(0.055 * (1 + sin * 0.12)); }
      else if (axis === 'roll')  { group.position.x *= 0.92; group.position.y *= 0.92; group.rotation.z = BASE_ROT_Z + sin * 0.12; m.scale.setScalar(0.055); }
      else if (axis === 'pitch') { group.position.x *= 0.92; group.position.y *= 0.92; group.rotation.x = targetX + sin * 0.15; m.scale.setScalar(0.055); }
      else if (axis === 'yaw')   { group.position.x *= 0.92; group.position.y *= 0.92; group.rotation.y = targetY + sin * 0.18; m.scale.setScalar(0.055); }
      else { group.position.x += (0 - group.position.x) * 0.08; group.position.y += (0 - group.position.y) * 0.08; m.scale.setScalar(0.055); }
    }

    // Center ray for hover detection
    raycaster.current.setFromCamera(pointer, camera);
    const hits = raycaster.current.intersectObject(mesh, false);
    const hitting = hits.length > 0;

    if (hitting !== isHovering) setIsHovering(hitting);

    const coverage = getCoverage();
    let currentPhase: ScanPhase = phase;

    if (coverage >= 0.95) {
      currentPhase = 'complete';
    } else if (hitting) {
      if (startTime === null) setStartTime(Date.now());
      currentPhase = 'scanning';

      // Camera-style capture: raycast 4 corners of the frame, fill the rect
      let xMin = Infinity, xMax = -Infinity, zMin = Infinity, zMax = -Infinity;
      const corners = [
        [pointer.x - FRAME_HALF_W, pointer.y - FRAME_HALF_H],
        [pointer.x + FRAME_HALF_W, pointer.y - FRAME_HALF_H],
        [pointer.x - FRAME_HALF_W, pointer.y + FRAME_HALF_H],
        [pointer.x + FRAME_HALF_W, pointer.y + FRAME_HALF_H],
      ];

      const centerLocal = mesh.worldToLocal(hits[0].point.clone());
      xMin = Math.min(xMin, centerLocal.x);
      xMax = Math.max(xMax, centerLocal.x);
      zMin = Math.min(zMin, centerLocal.z);
      zMax = Math.max(zMax, centerLocal.z);

      for (const [cx, cy] of corners) {
        samplePt.current.set(cx, cy);
        raycaster.current.setFromCamera(samplePt.current, camera);
        const cornerHits = raycaster.current.intersectObject(mesh, false);
        if (cornerHits.length > 0) {
          const loc = mesh.worldToLocal(cornerHits[0].point.clone());
          xMin = Math.min(xMin, loc.x);
          xMax = Math.max(xMax, loc.x);
          zMin = Math.min(zMin, loc.z);
          zMax = Math.max(zMax, loc.z);
        }
      }

      captureRect(xMin, xMax, zMin, zMax, bounds);

      // Track current region
      const local = centerLocal;
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

    // ── Evaluate guidance ──
    const guidance = evaluate(currentPhase, coverage, getRegionCoverage, currentRegionRef.current);

    // ── Project weakest region center from 3D → screen space ──
    const wr = guidance.weakestRegion;
    if (wr && guidance.direction) {
      // Compute center of weakest region in model-local space
      const wrCenterX = bounds.minX + ((wr.xMin + wr.xMax) / 2) * (bounds.maxX - bounds.minX);
      const wrCenterZ = bounds.minZ + ((wr.zMin + wr.zMax) / 2) * (bounds.maxZ - bounds.minZ);

      // Use the model's surface Y for accurate projection onto the visible surface
      _projVec.set(wrCenterX, bounds.surfaceY, wrCenterZ);
      mesh.localToWorld(_projVec);
      _projVec.project(camera);

      guidance.targetScreenPos = {
        x: Math.min(0.95, Math.max(0.05, (_projVec.x + 1) / 2)),
        y: Math.min(0.95, Math.max(0.05, (1 - _projVec.y) / 2)),
      };

      // Store for rotation bias (normalized 0-1)
      weakestCenterRef.current = {
        x: (wr.xMin + wr.xMax) / 2,
        z: (wr.zMin + wr.zMax) / 2,
      };
    } else {
      guidance.targetScreenPos = null;
      weakestCenterRef.current = null;
    }

    // Pass actual model rotation delta to the overlay
    guidance.modelRotation = {
      x: group.rotation.x - BASE_ROT_X,
      y: group.rotation.y,
    };

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
          <mesh ref={meshRef} geometry={enhancedGeo} scale={0.055}>
            <RevealMaterial coverageTexture={coverageTexture} bounds={bounds} />
          </mesh>
        </group>
      </Center>

      {/* ScanningBoundary removed — scanning happens from the guidance element itself */}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
        rotateSpeed={1.5}
        zoomSpeed={1.2}
        panSpeed={0.8}
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
  guidanceMode?: GuidanceMode;
}

export default function ScanGuidanceViewer({ resetTrigger, guidanceMode = 'classic' }: ScanGuidanceViewerProps) {
  const [guidance, setGuidance] = useState<GuidanceState>({
    phase: 'idle', direction: null, hint: '', coveragePercent: 0,
    activeRegion: null, regions: [],
    stage: 'occlusal', activeEdge: null, stageAdvanced: false,
    targetScreenPos: null, weakestRegion: null, modelRotation: { x: 0, y: 0 },
  });
  const [elapsed, setElapsed]     = useState(0);
  const [pointerNDC, setPointerNDC] = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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

  // Track container size for arrow pixel calculations
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setContainerSize({ width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
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
        camera={{ position: [0, -1.5, 3.5], fov: 40, near: 0.01, far: 1000, up: [0, 1, 0] }}
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
            onReset={resetTrigger}
            guidanceMode={guidanceMode}
          />
        </Suspense>
      </Canvas>

      <GuidanceOverlay
        guidance={guidance}
        elapsedSeconds={elapsed}
        pointerNDC={pointerNDC}
        flashActive={flashActive}
        containerSize={containerSize}
        mode={guidanceMode}
      />
    </div>
  );
}
