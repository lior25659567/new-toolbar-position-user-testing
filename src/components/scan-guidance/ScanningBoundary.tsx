import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ScanningBoundaryProps {
  meshRef: React.RefObject<THREE.Mesh | null>;
  isScanning: boolean;
}

/**
 * Semi-transparent blue disc that follows the mouse cursor on the model surface.
 * Pulses when idle to draw attention, solid when scanning.
 */
export default function ScanningBoundary({ meshRef, isScanning }: ScanningBoundaryProps) {
  const discRef = useRef<THREE.Mesh>(null);
  const { camera, pointer } = useThree();
  const raycaster = useRef(new THREE.Raycaster());

  useFrame((state) => {
    const disc = discRef.current;
    const target = meshRef.current;
    if (!disc || !target) return;

    // Raycast from mouse to model
    raycaster.current.setFromCamera(pointer, camera);
    const hits = raycaster.current.intersectObject(target, false);

    if (hits.length > 0) {
      const hit = hits[0];
      disc.visible = true;
      disc.position.copy(hit.point);

      // Orient disc to face the surface normal
      if (hit.face) {
        const normal = hit.face.normal.clone();
        normal.transformDirection(target.matrixWorld);
        disc.lookAt(disc.position.clone().add(normal));
      }

      // Offset slightly above surface
      const normalDir = new THREE.Vector3(0, 0, 1).applyQuaternion(disc.quaternion);
      disc.position.add(normalDir.multiplyScalar(0.002));

      // Pulse opacity when idle, solid when scanning
      const mat = disc.material as THREE.MeshBasicMaterial;
      if (isScanning) {
        mat.opacity = 0.45;
      } else {
        const pulse = 0.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        mat.opacity = pulse;
      }
    } else {
      disc.visible = false;
    }
  });

  return (
    <mesh ref={discRef} visible={false}>
      <circleGeometry args={[0.06, 32]} />
      <meshBasicMaterial
        color="#009ACE"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
