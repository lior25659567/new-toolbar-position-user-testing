import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface UndercutMaterialProps {
  insertionDir: [number, number, number];
  showHeatmap: boolean;
}

/**
 * Custom MeshPhysicalMaterial that overlays an undercut heatmap.
 * Uses surface normals vs insertion direction to simulate undercut detection.
 * Green = clear, yellow = minor (<0.5mm equivalent), red = severe (>0.5mm).
 */
export default function UndercutMaterial({ insertionDir, showHeatmap }: UndercutMaterialProps) {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const uniformsRef = useRef<{
    uInsertionDir: { value: THREE.Vector3 };
    uShowHeatmap: { value: number };
  } | null>(null);

  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uInsertionDir = { value: new THREE.Vector3(...insertionDir) };
      shader.uniforms.uShowHeatmap = { value: showHeatmap ? 1.0 : 0.0 };

      uniformsRef.current = shader.uniforms as any;

      // Add varyings and uniforms to vertex shader
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

      // Add uniforms and varyings to fragment shader
      shader.fragmentShader = `
        uniform vec3 uInsertionDir;
        uniform float uShowHeatmap;
        varying vec3 vWorldNormal;
        varying vec3 vLocalPos;
      ` + shader.fragmentShader;

      // Modify fragment output to overlay heatmap
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>

        if (uShowHeatmap > 0.5) {
          // Compute undercut: dot(normal, insertionDir)
          // Negative = undercut (surface faces away from insertion)
          vec3 insDir = normalize(uInsertionDir);
          float dotN = dot(vWorldNormal, insDir);

          // Undercut depth simulation
          float undercutDepth = max(0.0, -dotN) * 1.2;

          // Heatmap: green → yellow → red
          vec3 heatColor;
          if (undercutDepth < 0.15) {
            // Clear — green
            heatColor = vec3(0.086, 0.639, 0.290); // #16A34A
          } else if (undercutDepth < 0.4) {
            // Minor — interpolate green to yellow
            float t = (undercutDepth - 0.15) / 0.25;
            heatColor = mix(vec3(0.086, 0.639, 0.290), vec3(0.918, 0.702, 0.031), t);
          } else {
            // Severe — interpolate yellow to red
            float t = clamp((undercutDepth - 0.4) / 0.3, 0.0, 1.0);
            heatColor = mix(vec3(0.918, 0.702, 0.031), vec3(0.863, 0.149, 0.149), t);
          }

          // Blend heatmap with the base color
          float heatStrength = smoothstep(0.02, 0.15, undercutDepth);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, heatColor, heatStrength * 0.75);

          // Add subtle edge glow for severe undercuts
          if (undercutDepth > 0.5) {
            float pulse = sin(undercutDepth * 12.0) * 0.5 + 0.5;
            gl_FragColor.rgb += vec3(0.1, 0.0, 0.0) * pulse * 0.3;
          }
        }
        `
      );
    };

    mat.needsUpdate = true;
  }, [insertionDir, showHeatmap]);

  // Update uniforms each frame
  useFrame(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uInsertionDir.value.set(...insertionDir);
      uniformsRef.current.uShowHeatmap.value = showHeatmap ? 1.0 : 0.0;
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
