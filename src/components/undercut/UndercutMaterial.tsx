import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface UndercutMaterialProps {
  insertionDir: [number, number, number];
  showHeatmap: boolean;
  /** Normalized X positions [0–1] of selected tooth regions for highlighting */
  selectedRanges: [number, number][];
}

/**
 * Custom MeshPhysicalMaterial that overlays an undercut heatmap
 * and highlights selected tooth regions with a primary-color outline.
 */
export default function UndercutMaterial({ insertionDir, showHeatmap, selectedRanges }: UndercutMaterialProps) {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const uniformsRef = useRef<{
    uInsertionDir: { value: THREE.Vector3 };
    uShowHeatmap: { value: number };
    uSelectedCount: { value: number };
    uSelectedRanges: { value: Float32Array };
  } | null>(null);

  // Pack ranges into a flat Float32Array (max 16 ranges = 32 floats)
  const rangesArray = useRef(new Float32Array(32));

  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;

    // Fill ranges array
    rangesArray.current.fill(0);
    for (let i = 0; i < Math.min(selectedRanges.length, 16); i++) {
      rangesArray.current[i * 2] = selectedRanges[i][0];
      rangesArray.current[i * 2 + 1] = selectedRanges[i][1];
    }

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uInsertionDir = { value: new THREE.Vector3(...insertionDir) };
      shader.uniforms.uShowHeatmap = { value: showHeatmap ? 1.0 : 0.0 };
      shader.uniforms.uSelectedCount = { value: selectedRanges.length };
      shader.uniforms.uSelectedRanges = { value: rangesArray.current };

      uniformsRef.current = shader.uniforms as any;

      shader.vertexShader = `
        varying vec3 vWorldNormal;
        varying vec3 vLocalPos;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
        vLocalPos = transformed;
        `
      );

      shader.fragmentShader = `
        uniform vec3 uInsertionDir;
        uniform float uShowHeatmap;
        uniform float uSelectedCount;
        uniform float uSelectedRanges[32];
        varying vec3 vWorldNormal;
        varying vec3 vLocalPos;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>

        // Selection highlight — blue tint on selected tooth regions
        int selCount = int(uSelectedCount);
        if (selCount > 0) {
          // vLocalPos.x is in model local space; normalize to 0–1 using a rough bbox
          // The geometry is centered, so x goes roughly from -maxExtent to +maxExtent
          float normX = (vLocalPos.x + 700.0) / 1400.0; // Approx range for this PLY model
          bool isSelected = false;
          for (int i = 0; i < 16; i++) {
            if (i >= selCount) break;
            float lo = uSelectedRanges[i * 2];
            float hi = uSelectedRanges[i * 2 + 1];
            if (normX >= lo && normX <= hi) {
              isSelected = true;
              break;
            }
          }
          if (isSelected) {
            // Tint with primary blue #009ACE
            vec3 selectColor = vec3(0.0, 0.604, 0.808);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, selectColor, 0.25);
          }
        }

        if (uShowHeatmap > 0.5) {
          vec3 insDir = normalize(uInsertionDir);
          float dotN = dot(vWorldNormal, insDir);
          float undercutDepth = max(0.0, -dotN) * 1.2;

          vec3 heatColor;
          if (undercutDepth < 0.15) {
            heatColor = vec3(0.086, 0.639, 0.290);
          } else if (undercutDepth < 0.4) {
            float t = (undercutDepth - 0.15) / 0.25;
            heatColor = mix(vec3(0.086, 0.639, 0.290), vec3(0.918, 0.702, 0.031), t);
          } else {
            float t = clamp((undercutDepth - 0.4) / 0.3, 0.0, 1.0);
            heatColor = mix(vec3(0.918, 0.702, 0.031), vec3(0.863, 0.149, 0.149), t);
          }

          float heatStrength = smoothstep(0.02, 0.15, undercutDepth);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, heatColor, heatStrength * 0.75);

          if (undercutDepth > 0.5) {
            float pulse = sin(undercutDepth * 12.0) * 0.5 + 0.5;
            gl_FragColor.rgb += vec3(0.1, 0.0, 0.0) * pulse * 0.3;
          }
        }
        `
      );
    };

    mat.needsUpdate = true;
  }, [insertionDir, showHeatmap, selectedRanges]);

  useFrame(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uInsertionDir.value.set(...insertionDir);
      uniformsRef.current.uShowHeatmap.value = showHeatmap ? 1.0 : 0.0;
      uniformsRef.current.uSelectedCount.value = selectedRanges.length;
      for (let i = 0; i < Math.min(selectedRanges.length, 16); i++) {
        rangesArray.current[i * 2] = selectedRanges[i][0];
        rangesArray.current[i * 2 + 1] = selectedRanges[i][1];
      }
    }
  });

  return (
    <meshPhysicalMaterial
      ref={matRef}
      vertexColors={true}
      color={new THREE.Color(0xc8c8c0)}
      roughness={0.35}
      metalness={0.02}
      side={THREE.DoubleSide}
      clearcoat={0.4}
      clearcoatRoughness={0.25}
      reflectivity={0.5}
      envMapIntensity={0.6}
      ior={1.45}
      sheen={0.1}
      sheenRoughness={0.4}
      sheenColor={new THREE.Color(0xe8e8e0)}
    />
  );
}
