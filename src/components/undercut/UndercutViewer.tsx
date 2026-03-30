import React, { Suspense, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { PLYLoader } from 'three-stdlib';
import * as THREE from 'three';
import upperJawModel from '@/assets/3d-models/upper-jaw.ply?url';
import lowerJawModel from '@/assets/3d-models/lower-jaw.ply?url';
import UndercutMaterial from './UndercutMaterial';
import type { ArchType } from './types';

// Preload both models so arch switching is instant
useLoader.preload(PLYLoader, upperJawModel);
useLoader.preload(PLYLoader, lowerJawModel);

// ─── Insertion Path Arrow ────────────────────────────────────────────────────

interface ArrowProps {
  direction: [number, number, number];
  onDrag: (newDir: [number, number, number]) => void;
  interactive: boolean;
  accentColor?: string;
}

function InsertionArrow({ direction, onDrag, interactive, accentColor }: ArrowProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const shaftLen = 0.9;
  const headLen = 0.22;
  const shaftRadius = 0.018;
  const headRadius = 0.06;

  const baseColor = accentColor || '#009ACE';
  const baseDark = accentColor ? accentColor : '#007A9E';

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const from = new THREE.Vector3(0, 1, 0);
    const to = new THREE.Vector3(...direction).normalize();
    q.setFromUnitVectors(from, to);
    return q;
  }, [direction]);

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: any) => {
    if (!interactive) return;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  }, [interactive]);

  const handlePointerUp = useCallback((e: any) => {
    const wasClick = pointerDownPos.current &&
      Math.abs(e.clientX - pointerDownPos.current.x) < 5 &&
      Math.abs(e.clientY - pointerDownPos.current.y) < 5;
    pointerDownPos.current = null;
    setDragging(false);
    if (wasClick) return;
  }, []);

  const handlePointerMove = useCallback((e: any) => {
    if (!dragging || !interactive) return;
    e.stopPropagation();
    const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
    const newDir: [number, number, number] = [ndcX * 0.5, 1, ndcY * 0.5];
    const len = Math.sqrt(newDir[0] ** 2 + newDir[1] ** 2 + newDir[2] ** 2);
    newDir[0] /= len; newDir[1] /= len; newDir[2] /= len;
    onDrag(newDir);
  }, [dragging, interactive, onDrag]);

  const arrowColor = dragging ? '#EAB308' : hovered ? '#00B8F0' : baseColor;
  const headColor = dragging ? '#D97706' : hovered ? '#00B8F0' : baseDark;
  const glowOpacity = dragging ? 0.25 : hovered ? 0.15 : 0;

  return (
    <group ref={groupRef} quaternion={quaternion}>
      {/* Glow cylinder (visible on hover/drag) */}
      {interactive && (hovered || dragging) && (
        <mesh position={[0, shaftLen / 2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, shaftLen + 0.15, 12]} />
          <meshBasicMaterial color={arrowColor} transparent opacity={glowOpacity} />
        </mesh>
      )}
      {/* Shaft */}
      <mesh
        position={[0, shaftLen / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => { setHovered(true); if (interactive) document.body.style.cursor = 'grab'; }}
        onPointerLeave={() => { setHovered(false); if (!dragging) document.body.style.cursor = 'default'; }}
      >
        <cylinderGeometry args={[shaftRadius * 3, shaftRadius * 3, shaftLen, 12]} />
        <meshStandardMaterial color={arrowColor} transparent opacity={0.9} />
      </mesh>
      {/* Arrowhead */}
      <mesh
        position={[0, shaftLen + headLen / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => { setHovered(true); if (interactive) document.body.style.cursor = 'grab'; }}
        onPointerLeave={() => { setHovered(false); if (!dragging) document.body.style.cursor = 'default'; }}
      >
        <coneGeometry args={[headRadius, headLen, 12]} />
        <meshStandardMaterial color={headColor} />
      </mesh>
      {/* Handle sphere at tip */}
      {interactive && (
        <mesh
          position={[0, shaftLen + headLen + 0.04, 0]}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'grab'; }}
          onPointerLeave={() => { setHovered(false); if (!dragging) document.body.style.cursor = 'default'; }}
        >
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={dragging ? '#EAB308' : hovered ? '#00B8F0' : baseColor}
            emissive={dragging ? '#EAB308' : hovered ? '#00B8F0' : baseColor}
            emissiveIntensity={dragging ? 0.8 : hovered ? 0.5 : 0.15}
          />
        </mesh>
      )}
      {/* Base ring */}
      <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.07, 20]} />
        <meshStandardMaterial color={arrowColor} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Clickable Model ─────────────────────────────────────────────────────────

const UPPER_FDI = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const LOWER_FDI = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

function mapClickToTooth(point: THREE.Vector3, bbox: THREE.Box3, arch: ArchType): number {
  const fdi = arch === 'upper' ? UPPER_FDI : LOWER_FDI;
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const t = (point.x - bbox.min.x) / size.x;
  const idx = Math.min(fdi.length - 1, Math.max(0, Math.floor(t * fdi.length)));
  return fdi[idx];
}

// ─── Scene ───────────────────────────────────────────────────────────────────

const UPPER_ROT_X = Math.PI * 0.6;
const UPPER_ROT_Z = Math.PI;
const LOWER_ROT_X = Math.PI * 0.4;
const LOWER_ROT_Z = Math.PI;

/** Convert a tooth FDI number to a normalized X range [0-1] on the model */
function toothToRange(toothId: number, arch: ArchType): [number, number] {
  const fdi = arch === 'upper' ? UPPER_FDI : LOWER_FDI;
  const idx = fdi.indexOf(toothId);
  if (idx === -1) return [0, 0];
  const step = 1 / fdi.length;
  return [idx * step, (idx + 1) * step];
}

// Distinct colors for per-tooth arrows
const TOOTH_ARROW_COLORS = [
  '#009ACE', '#E74C3C', '#27AE60', '#F39C12', '#8E44AD',
  '#16A085', '#D35400', '#2980B9', '#C0392B', '#1ABC9C',
  '#9B59B6', '#2ECC71', '#E67E22', '#3498DB', '#E91E63', '#00BCD4',
];

interface SceneProps {
  insertionDir: [number, number, number];
  onDragDir: (dir: [number, number, number]) => void;
  showHeatmap: boolean;
  interactiveArrow: boolean;
  onToothClick?: (toothId: number, shiftKey: boolean) => void;
  selectionMode: boolean;
  selectedTeeth: number[];
  sharedPath: boolean;
  perToothDirs: Map<number, [number, number, number]>;
  onDragToothDir?: (toothId: number, dir: [number, number, number]) => void;
  activeArch: ArchType;
}

function Scene({
  insertionDir, onDragDir, showHeatmap, interactiveArrow,
  onToothClick, selectionMode, selectedTeeth,
  sharedPath, perToothDirs, onDragToothDir,
  activeArch,
}: SceneProps) {
  const modelUrl = activeArch === 'upper' ? upperJawModel : lowerJawModel;
  const geometry = useLoader(PLYLoader, modelUrl);
  const groupRef = useRef<THREE.Group>(null);

  const processedGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.computeVertexNormals();
    geo.center();
    return geo;
  }, [geometry]);

  const bbox = useMemo(() => {
    const b = new THREE.Box3();
    b.setFromBufferAttribute(processedGeometry.getAttribute('position') as THREE.BufferAttribute);
    return b;
  }, [processedGeometry]);

  // Compute half-extent for shader normalization
  const modelExtent = useMemo(() => {
    const size = new THREE.Vector3();
    bbox.getSize(size);
    return size.x / 2;
  }, [bbox]);

  const selectedRanges = useMemo(() => {
    return selectedTeeth.map(t => toothToRange(t, activeArch)).filter(r => r[0] !== r[1]);
  }, [selectedTeeth, activeArch]);

  // Build per-tooth direction array (ordered same as selectedRanges)
  const perToothDirsArray = useMemo((): [number, number, number][] => {
    return selectedTeeth
      .filter(t => toothToRange(t, activeArch)[0] !== toothToRange(t, activeArch)[1])
      .map(t => perToothDirs.get(t) || [0, 1, 0] as [number, number, number]);
  }, [selectedTeeth, perToothDirs, activeArch]);

  const handleModelClick = useCallback((e: any) => {
    if (!onToothClick) return;
    e.stopPropagation();
    const localPt = e.point.clone();
    if (groupRef.current) groupRef.current.worldToLocal(localPt);
    const toothId = mapClickToTooth(localPt, bbox, activeArch);
    onToothClick(toothId, e.nativeEvent?.shiftKey ?? false);
  }, [onToothClick, bbox, activeArch]);

  const rotX = activeArch === 'upper' ? UPPER_ROT_X : LOWER_ROT_X;
  const rotZ = activeArch === 'upper' ? UPPER_ROT_Z : LOWER_ROT_Z;

  return (
    <>
      <Center>
        <group ref={groupRef} rotation={[rotX, 0, rotZ]}>
          <mesh
            geometry={processedGeometry}
            scale={0.035}
            onClick={handleModelClick}
            onPointerEnter={() => { if (selectionMode) document.body.style.cursor = 'crosshair'; }}
            onPointerLeave={() => { document.body.style.cursor = 'default'; }}
          >
            <UndercutMaterial
              insertionDir={insertionDir}
              showHeatmap={showHeatmap}
              selectedRanges={selectedRanges}
              modelExtent={modelExtent}
              perToothDirs={perToothDirsArray}
              usePerTooth={!sharedPath && selectedTeeth.length > 0}
            />
          </mesh>
        </group>
      </Center>

      {/* Arrows */}
      {showHeatmap && sharedPath && (
        <InsertionArrow direction={insertionDir} onDrag={onDragDir} interactive={interactiveArrow} />
      )}

      {showHeatmap && !sharedPath && selectedTeeth.map((toothId, i) => {
        const dir = perToothDirs.get(toothId) || [0, 1, 0] as [number, number, number];
        const arrowColor = TOOTH_ARROW_COLORS[i % TOOTH_ARROW_COLORS.length];
        return (
          <InsertionArrow
            key={toothId}
            direction={dir}
            onDrag={(d) => onDragToothDir?.(toothId, d)}
            interactive={interactiveArrow}
            accentColor={arrowColor}
          />
        );
      })}

      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#f5f0e8" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.35} color="#e8eef5" />
      <directionalLight position={[0, -3, 5]} intensity={0.25} />
      <directionalLight position={[0, 5, -5]} intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={0.2} color="#fff5e6" />
      <pointLight position={[3, 0, 3]} intensity={0.15} color="#e6f0ff" />
      <Environment preset="apartment" background={false} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        rotateSpeed={1.5}
        zoomSpeed={1.2}
        panSpeed={1.2}
        enableDamping={true}
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={10}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        screenSpacePanning={true}
        target={[0, 0, 0]}
        makeDefault
      />
    </>
  );
}

// ─── Viewer Wrapper ──────────────────────────────────────────────────────────

interface UndercutViewerProps {
  insertionDir: [number, number, number];
  onDragDir: (dir: [number, number, number]) => void;
  showHeatmap: boolean;
  interactiveArrow: boolean;
  onToothClick?: (toothId: number, shiftKey: boolean) => void;
  selectionMode: boolean;
  selectedTeeth: number[];
  sharedPath: boolean;
  perToothDirs: Map<number, [number, number, number]>;
  onDragToothDir?: (toothId: number, dir: [number, number, number]) => void;
  activeArch: ArchType;
}

export default function UndercutViewer({
  insertionDir, onDragDir, showHeatmap, interactiveArrow,
  onToothClick, selectionMode, selectedTeeth,
  sharedPath, perToothDirs, onDragToothDir,
  activeArch,
}: UndercutViewerProps) {
  return (
    <Canvas
      camera={{ position: [0, -2, 4.5], fov: 40, near: 0.01, far: 1000, up: [0, 1, 0] }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.7 }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene
          insertionDir={insertionDir}
          onDragDir={onDragDir}
          showHeatmap={showHeatmap}
          interactiveArrow={interactiveArrow}
          onToothClick={onToothClick}
          selectionMode={selectionMode}
          selectedTeeth={selectedTeeth}
          sharedPath={sharedPath}
          perToothDirs={perToothDirs}
          onDragToothDir={onDragToothDir}
          activeArch={activeArch}
        />
      </Suspense>
    </Canvas>
  );
}
