import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';
import type { GuidanceDirection } from './types';

const ARROW_COLOR = '#E74C3C';
const ARROW_COLOR_THREE = new THREE.Color(ARROW_COLOR);

interface ArrowConfig {
  start: [number, number, number];
  mid:   [number, number, number];
  end:   [number, number, number];
  conePos: [number, number, number];
  coneRot: [number, number, number];
}

const ARROW_CONFIGS: Record<string, ArrowConfig> = {
  left: {
    start: [1.2, 0.6, 0],
    mid:   [0, 1.2, 0],
    end:   [-1.2, 0.6, 0],
    conePos: [-1.28, 0.55, 0],
    coneRot: [0, 0, Math.PI / 2 + 0.3],
  },
  right: {
    start: [-1.2, 0.6, 0],
    mid:   [0, 1.2, 0],
    end:   [1.2, 0.6, 0],
    conePos: [1.28, 0.55, 0],
    coneRot: [0, 0, -(Math.PI / 2 + 0.3)],
  },
  up: {
    start: [0, 0.6, 1.0],
    mid:   [0, 1.2, 0],
    end:   [0, 0.6, -1.0],
    conePos: [0, 0.55, -1.08],
    coneRot: [Math.PI / 2 + 0.3, 0, 0],
  },
  down: {
    start: [0, 0.6, -1.0],
    mid:   [0, 1.2, 0],
    end:   [0, 0.6, 1.0],
    conePos: [0, 0.55, 1.08],
    coneRot: [-(Math.PI / 2 + 0.3), 0, 0],
  },
  'rotate-left': {
    start: [1.2, 0.6, 0],
    mid:   [0, 1.2, 0],
    end:   [-1.2, 0.6, 0],
    conePos: [-1.28, 0.55, 0],
    coneRot: [0, 0, Math.PI / 2 + 0.3],
  },
  'rotate-right': {
    start: [-1.2, 0.6, 0],
    mid:   [0, 1.2, 0],
    end:   [1.2, 0.6, 0],
    conePos: [1.28, 0.55, 0],
    coneRot: [0, 0, -(Math.PI / 2 + 0.3)],
  },
};

interface GuidanceArrow3DProps {
  direction: GuidanceDirection | null;
  visible: boolean;
}

export default function GuidanceArrow3D({ direction, visible }: GuidanceArrow3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Fade in/out
    const target = visible && direction ? 1 : 0;
    opacityRef.current += (target - opacityRef.current) * 4 * delta;

    // Gentle pulse
    pulseRef.current += delta * 2.5;
    const pulse = 0.7 + 0.3 * Math.sin(pulseRef.current);
    const finalOpacity = opacityRef.current * pulse;

    groupRef.current.visible = finalOpacity > 0.01;

    // Update cone material opacity
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = finalOpacity;
          mat.transparent = true;
        }
      }
    });
  });

  if (!direction || !ARROW_CONFIGS[direction]) return null;

  const cfg = ARROW_CONFIGS[direction];

  return (
    <group ref={groupRef}>
      <QuadraticBezierLine
        start={cfg.start}
        end={cfg.end}
        mid={cfg.mid}
        color={ARROW_COLOR}
        lineWidth={5}
        transparent
        opacity={0.9}
      />
      {/* Arrowhead cone */}
      <mesh position={cfg.conePos} rotation={cfg.coneRot}>
        <coneGeometry args={[0.12, 0.35, 12]} />
        <meshBasicMaterial color={ARROW_COLOR_THREE} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
