import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { ModelBounds } from './types';

interface RevealMaterialProps {
  coverageTexture: THREE.DataTexture;
  bounds: ModelBounds;
}

/**
 * Custom MeshPhysicalMaterial that uses a coverage DataTexture to
 * progressively reveal the model. Uncovered areas render as translucent gray;
 * covered areas show full vertex-colored dental material.
 */
export default function RevealMaterial({ coverageTexture, bounds }: RevealMaterialProps) {
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Store uniforms ref so we can update them
  const uniformsRef = useRef<{
    uCoverage: { value: THREE.DataTexture };
    uBBoxMin: { value: THREE.Vector2 };
    uBBoxMax: { value: THREE.Vector2 };
  } | null>(null);

  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;

    mat.onBeforeCompile = (shader) => {
      // Add custom uniforms
      shader.uniforms.uCoverage = { value: coverageTexture };
      shader.uniforms.uBBoxMin = { value: new THREE.Vector2(bounds.minX, bounds.minZ) };
      shader.uniforms.uBBoxMax = { value: new THREE.Vector2(bounds.maxX, bounds.maxZ) };

      uniformsRef.current = shader.uniforms as any;

      // Inject uniform declarations into fragment shader
      shader.fragmentShader = `
        uniform sampler2D uCoverage;
        uniform vec2 uBBoxMin;
        uniform vec2 uBBoxMax;
        varying vec3 vLocalPos;
      ` + shader.fragmentShader;

      // Inject local-space position varying into vertex shader
      shader.vertexShader = `
        varying vec3 vLocalPos;
      ` + shader.vertexShader;

      // Pass local-space position (geometry coords, unaffected by group rotation)
      shader.vertexShader = shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `
        #include <worldpos_vertex>
        vLocalPos = transformed;
        `
      );

      // Modify fragment output to blend based on coverage
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        #include <dithering_fragment>

        // Map local XZ to 0-1 UV — stays stable regardless of group rotation
        vec2 coverageUV = (vLocalPos.xz - uBBoxMin) / (uBBoxMax - uBBoxMin);
        coverageUV = clamp(coverageUV, 0.0, 1.0);

        float coverage = texture2D(uCoverage, coverageUV).r;

        // Smooth step for nice edge transition
        float reveal = smoothstep(0.1, 0.5, coverage);

        // Uncovered: faint translucent ghost so users can see the model shape
        float gray = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 ghostColor = vec3(gray * 0.55 + 0.3);

        gl_FragColor.rgb = mix(ghostColor, gl_FragColor.rgb, reveal);
        gl_FragColor.a = mix(0.18, 1.0, reveal);
        `
      );
    };

    // Force material recompilation
    mat.needsUpdate = true;
  }, [coverageTexture, bounds]);

  // Keep the coverage texture uniform updated each frame
  useFrame(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uCoverage.value = coverageTexture;
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
      transparent={true}
      depthWrite={true}
    />
  );
}
