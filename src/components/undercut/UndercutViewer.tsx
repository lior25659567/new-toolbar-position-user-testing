import React, { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import { PLYLoader } from 'three-stdlib';
import * as THREE from 'three';
import upperJawModel from '@/assets/3d-models/upper-jaw.ply?url';
import UndercutMaterial from './UndercutMaterial';

// ─── Insertion Path Arrow ────────────────────────────────────────────────────

interface ArrowProps {
  direction: [number, number, number];
  onDrag: (newDir: [number, number, number]) => void;
  interactive: boolean;
}

function InsertionArrow({ direction, onDrag, interactive }: ArrowProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const shaftLen = 0.9;
  const headLen = 0.22;
  const shaftRadius = 0.018;
  const headRadius = 0.06;

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const from = new THREE.Vector3(0, 1, 0);
    const to = new THREE.Vector3(...direction).normalize();
    q.setFromUnitVectors(from, to);
    return q;
  }, [direction]);

  const handlePointerDown = useCallback((e: any) => {
    if (!interactive) return;
    e.stopPropagation();
    setDragging(true);
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  }, [interactive]);

  const handlePointerUp = useCallback(() => { setDragging(false); }, []);

  const handlePointerMove = useCallback((e: any) => {
    if (!dragging || !interactive) return;
    e.stopPropagation();
    const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
    // Tilt the upward vector based on mouse position
    const newDir: [number, number, number] = [ndcX * 0.5, 1, ndcY * 0.5];
    const len = Math.sqrt(newDir[0] ** 2 + newDir[1] ** 2 + newDir[2] ** 2);
    newDir[0] /= len; newDir[1] /= len; newDir[2] /= len;
    onDrag(newDir);
  }, [dragging, interactive, onDrag]);

  const arrowColor = dragging ? '#EAB308' : hovered ? '#00B8F0' : '#009ACE';
  const headColor = dragging ? '#D97706' : hovered ? '#00B8F0' : '#007A9E';
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
      <mesh position={[0, shaftLen / 2, 0]}>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLen, 12]} />
        <meshStandardMaterial color={arrowColor} />
      </mesh>
      {/* Arrowhead */}
      <mesh position={[0, shaftLen + headLen / 2, 0]}>
        <coneGeometry args={[headRadius, headLen, 12]} />
        <meshStandardMaterial color={headColor} />
      </mesh>
      {/* Handle sphere at tip — visible grab point */}
      {interactive && (
        <mesh position={[0, shaftLen + headLen + 0.04, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial
            color={dragging ? '#EAB308' : hovered ? '#00B8F0' : '#009ACE'}
            emissive={dragging ? '#EAB308' : hovered ? '#00B8F0' : '#009ACE'}
            emissiveIntensity={dragging ? 0.8 : hovered ? 0.5 : 0.15}
          />
        </mesh>
      )}
      {/* Invisible hit area — generous for easy grab */}
      <mesh
        position={[0, (shaftLen + headLen) / 2, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = interactive ? 'grab' : 'default'; }}
        onPointerLeave={() => { setHovered(false); if (!dragging) document.body.style.cursor = 'default'; }}
      >
        <cylinderGeometry args={[0.12, 0.12, shaftLen + headLen + 0.25, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
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

function mapClickToTooth(point: THREE.Vector3, bbox: THREE.Box3): number {
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const t = (point.x - bbox.min.x) / size.x;
  const idx = Math.min(UPPER_FDI.length - 1, Math.max(0, Math.floor(t * UPPER_FDI.length)));
  return UPPER_FDI[idx];
}

// ─── Scene ───────────────────────────────────────────────────────────────────

const BASE_ROT_X = Math.PI * 0.6;
const BASE_ROT_Z = Math.PI;

interface SceneProps {
  insertionDir: [number, number, number];
  onDragDir: (dir: [number, number, number]) => void;
  showHeatmap: boolean;
  interactiveArrow: boolean;
  onToothClick?: (toothId: number, shiftKey: boolean) => void;
  selectionMode: boolean;
}

function Scene({ insertionDir, onDragDir, showHeatmap, interactiveArrow, onToothClick, selectionMode }: SceneProps) {
  const geometry = useLoader(PLYLoader, upperJawModel);
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

  const handleModelClick = useCallback((e: any) => {
    if (!onToothClick) return;
    e.stopPropagation();
    const localPt = e.point.clone();
    if (groupRef.current) groupRef.current.worldToLocal(localPt);
    const toothId = mapClickToTooth(localPt, bbox);
    onToothClick(toothId, e.nativeEvent?.shiftKey ?? false);
  }, [onToothClick, bbox]);

  return (
    <>
      <Center>
        <group ref={groupRef} rotation={[BASE_ROT_X, 0, BASE_ROT_Z]}>
          <mesh
            geometry={processedGeometry}
            scale={0.035}
            onClick={handleModelClick}
            onPointerEnter={() => { if (selectionMode) document.body.style.cursor = 'crosshair'; }}
            onPointerLeave={() => { document.body.style.cursor = 'default'; }}
          >
            <UndercutMaterial insertionDir={insertionDir} showHeatmap={showHeatmap} />
          </mesh>
        </group>
      </Center>

      {showHeatmap && (
        <InsertionArrow direction={insertionDir} onDrag={onDragDir} interactive={interactiveArrow} />
      )}

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
}

export default function UndercutViewer({
  insertionDir, onDragDir, showHeatmap, interactiveArrow, onToothClick, selectionMode,
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
        />
      </Suspense>
    </Canvas>
  );
}
