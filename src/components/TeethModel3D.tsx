import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, ContactShadows } from '@react-three/drei';
import { STLLoader, PLYLoader } from 'three-stdlib';
import * as THREE from 'three';

// Placeholder component when no model is loaded
function PlaceholderTeeth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Simple arch shape as placeholder */}
      <torusGeometry args={[1.5, 0.4, 16, 32, Math.PI]} />
      <meshStandardMaterial 
        color="#f5f5f0" 
        roughness={0.3} 
        metalness={0.1}
      />
    </mesh>
  );
}

// GLB/GLTF Model Loader
function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      // Subtle breathing animation
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Center>
      <primitive 
        ref={modelRef}
        object={scene} 
        scale={1}
      />
    </Center>
  );
}

// STL Model Loader (common for dental scans)
function STLModel({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);

  // Center and scale the geometry
  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [geometry]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Center>
      <mesh ref={meshRef} geometry={centeredGeometry} scale={0.1}>
        <meshStandardMaterial 
          color="#f8f8f5"
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Center>
  );
}

// PLY Model Loader (supports vertex colors from scans)
function PLYModel({ url, monochrome = false, feedback = false }: { url: string; monochrome?: boolean; feedback?: boolean }) {
  const geometry = useLoader(PLYLoader, url);

  // Generate organic "problem areas" using noise-like patterns
  const problemIntensity = useMemo(() => {
    const pos = geometry.attributes.position;
    const intensities = new Float32Array(pos.count);
    
    // First, compute the bounding box to position blobs relative to model size
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }
    
    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const avgSize = (sizeX + sizeY + sizeZ) / 3;
    
    // Simple noise function for organic shapes
    const noise3D = (x: number, y: number, z: number, scale: number) => {
      const sx = x * scale;
      const sy = y * scale;
      const sz = z * scale;
      let val = Math.sin(sx * 1.2 + sy * 0.8) * Math.cos(sy * 1.1 + sz * 0.9);
      val += Math.sin(sx * 2.3 + sz * 1.7) * 0.5;
      val += Math.cos(sy * 2.1 + sx * 1.3) * 0.5;
      val += Math.sin(sz * 1.8 + sy * 2.2 + sx * 0.7) * 0.3;
      return val;
    };
    
    // Define organic blob centers relative to model bounds - larger coverage
    const blobs = [
      { x: centerX + sizeX * 0.25, y: centerY - sizeY * 0.1, z: centerZ + sizeZ * 0.2, radius: avgSize * 0.25, strength: 1.0 },
      { x: centerX - sizeX * 0.3, y: centerY + sizeY * 0.15, z: centerZ - sizeZ * 0.1, radius: avgSize * 0.22, strength: 0.9 },
      { x: centerX + sizeX * 0.05, y: centerY + sizeY * 0.25, z: centerZ, radius: avgSize * 0.18, strength: 0.85 },
      { x: centerX - sizeX * 0.15, y: centerY - sizeY * 0.2, z: centerZ + sizeZ * 0.15, radius: avgSize * 0.2, strength: 0.95 },
      { x: centerX + sizeX * 0.35, y: centerY + sizeY * 0.1, z: centerZ - sizeZ * 0.2, radius: avgSize * 0.19, strength: 0.88 },
      { x: centerX - sizeX * 0.4, y: centerY - sizeY * 0.05, z: centerZ + sizeZ * 0.1, radius: avgSize * 0.17, strength: 0.92 },
      { x: centerX + sizeX * 0.15, y: centerY - sizeY * 0.3, z: centerZ - sizeZ * 0.15, radius: avgSize * 0.21, strength: 0.87 },
      { x: centerX, y: centerY + sizeY * 0.1, z: centerZ + sizeZ * 0.25, radius: avgSize * 0.16, strength: 0.83 },
    ];
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      
      let intensity = 0;
      
      // Calculate influence from each blob with smooth falloff
      for (const blob of blobs) {
        const dx = x - blob.x;
        const dy = y - blob.y;
        const dz = z - blob.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Smooth organic falloff using noise
        const noiseOffset = noise3D(x, y, z, 0.05 / avgSize) * avgSize * 0.3;
        const adjustedDist = dist + noiseOffset;
        
        if (adjustedDist < blob.radius) {
          // Smooth cubic falloff for organic edges
          const t = adjustedDist / blob.radius;
          const falloff = 1 - (t * t * (3 - 2 * t)); // Smoothstep
          intensity = Math.max(intensity, falloff * blob.strength);
        }
      }
      
      // Add noise variation to break up uniformity
      const edgeNoise = noise3D(x, y, z, 0.03 / avgSize) * 0.25;
      intensity = Math.max(0, Math.min(1, intensity + edgeNoise * intensity));
      
      intensities[i] = intensity;
    }
    
    return intensities;
  }, [geometry]);

  // Center and prepare the geometry, enhance colors
  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();
    
    const posCount = geo.attributes.position.count;
    const hasColors = geo.attributes.color !== undefined;
    
    // Primary blue color for feedback marks: #009ACE
    const blueR = 0 / 255;
    const blueG = 154 / 255;
    const blueB = 206 / 255;
    
    // Create or modify vertex colors
    const enhancedColors = new Float32Array(posCount * 3);
    
    for (let i = 0; i < posCount; i++) {
      let r: number, g: number, b: number;
      
      if (hasColors) {
        r = geo.attributes.color.getX(i);
        g = geo.attributes.color.getY(i);
        b = geo.attributes.color.getZ(i);
        
        // Darken and increase contrast for more depth
        const avg = (r + g + b) / 3;
        const saturationBoost = 1.4;
        const contrastBoost = 1.35;
        const darken = 0.65;
        
        r = ((r - avg) * saturationBoost + avg) * contrastBoost * darken;
        g = ((g - avg) * saturationBoost + avg) * contrastBoost * darken;
        b = ((b - avg) * saturationBoost + avg) * contrastBoost * darken;
      } else {
        // Default tooth color if no vertex colors
        r = 0.9;
        g = 0.85;
        b = 0.8;
      }
      
      r = Math.min(1, Math.max(0, r));
      g = Math.min(1, Math.max(0, g));
      b = Math.min(1, Math.max(0, b));
      
      // Blend with blue based on feedback
      if (feedback) {
        const intensity = problemIntensity[i] || 0;
        
        // Get centered position for scattered patches
        const px = geo.attributes.position.getX(i);
        const py = geo.attributes.position.getY(i);
        const pz = geo.attributes.position.getZ(i);
        
        // Create multiple scattered patches across the model using higher frequency patterns
        // Each pattern creates separate "islands" of blue marks
        const patch1 = Math.sin(px * 0.15) * Math.sin(py * 0.12) * Math.sin(pz * 0.14) > 0.3;
        const patch2 = Math.cos(px * 0.18 + 1.5) * Math.cos(py * 0.16 + 2.1) * Math.cos(pz * 0.13 + 0.8) > 0.35;
        const patch3 = Math.sin(px * 0.22 + 3.2) * Math.sin(pz * 0.19 + 1.4) > 0.45;
        const patch4 = Math.cos(py * 0.2 + 2.8) * Math.sin(px * 0.17 + 4.1) > 0.42;
        const patch5 = Math.sin(pz * 0.25 + 1.1) * Math.cos(py * 0.21 + 3.5) > 0.4;
        const patch6 = Math.sin(px * 0.13 + py * 0.11 + 2.0) * Math.cos(pz * 0.15 + 1.7) > 0.38;
        
        // Combine all scattered patches
        const showBlue = intensity > 0.03 || patch1 || patch2 || patch3 || patch4 || patch5 || patch6;
        
        if (showBlue) {
          const blendAmount = intensity > 0.03 ? Math.min(1, intensity * 1.8) : 0.9;
          r = r * (1 - blendAmount) + blueR * blendAmount;
          g = g * (1 - blendAmount) + blueG * blendAmount;
          b = b * (1 - blendAmount) + blueB * blendAmount;
        }
      }
      
      enhancedColors[i * 3] = r;
      enhancedColors[i * 3 + 1] = g;
      enhancedColors[i * 3 + 2] = b;
    }
    
    geo.setAttribute('color', new THREE.BufferAttribute(enhancedColors, 3));
    
    return geo;
  }, [geometry, feedback, problemIntensity]);

  // Create material based on monochrome state - always use vertex colors now
  const material = useMemo(() => {
    if (monochrome) {
      // Completely gray stone material - no vertex colors
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x707070),
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
        vertexColors: false,
      });
    } else {
      // Realistic dental material with vertex colors - darker with high gloss
      return new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        color: new THREE.Color(0xeeeeee),
        roughness: 0.02,
        metalness: 0.15,
        side: THREE.DoubleSide,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 1.2,
        envMapIntensity: 2.5,
        ior: 1.6,
        sheen: 0.3,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color(0xffffff),
      });
    }
  }, [monochrome]);

  return (
    <Center>
      <group rotation={[Math.PI * 0.6, 0, Math.PI]}>
        <mesh 
          key={`ply-${feedback ? 'feedback' : 'normal'}`}
          geometry={centeredGeometry} 
          scale={0.035} 
          material={material} 
        />
      </group>
    </Center>
  );
}

// Loading spinner
function LoadingSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#009ACE" wireframe />
    </mesh>
  );
}

interface TeethModel3DProps {
  modelUrl?: string; // Path to the 3D model (GLB/GLTF)
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  monochrome?: boolean; // Stone/gray texture mode
  feedback?: boolean; // Show blue marks for missing scan areas
  className?: string;
}

export default function TeethModel3D({
  modelUrl,
  width = '100%',
  height = '100%',
  backgroundColor = 'transparent',
  showControls = true,
  autoRotate = false,
  monochrome = false,
  feedback = false,
  className = '',
}: TeethModel3DProps) {
  return (
    <div 
      className={className}
      style={{ 
        width, 
        height, 
        backgroundColor,
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <Canvas
        camera={{ 
          position: [0, -2, 4.5], 
          fov: 40,
          near: 0.01,
          far: 1000,
          up: [0, 1, 0]
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ touchAction: 'none' }}
        dpr={[1, 2]}
      >
        {/* Lighting - optimized for realistic dental models */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.5} 
          castShadow
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.8}
        />
        <directionalLight 
          position={[0, -3, 5]} 
          intensity={0.6}
        />
        <directionalLight 
          position={[0, 5, -5]} 
          intensity={0.4}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#fff5e6" />
        <pointLight position={[3, 0, 3]} intensity={0.3} color="#e6f0ff" />

        {/* Environment for realistic reflections */}
        <Environment preset="studio" background={false} />

        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          {modelUrl ? (
            modelUrl.toLowerCase().endsWith('.stl') ? (
              <STLModel url={modelUrl} />
            ) : modelUrl.toLowerCase().endsWith('.ply') ? (
              <PLYModel url={modelUrl} monochrome={monochrome} feedback={feedback} />
            ) : (
              <GLTFModel url={modelUrl} />
            )
          ) : (
            <PlaceholderTeeth />
          )}
        </Suspense>

        {/* Shadow */}
        <ContactShadows 
          position={[0, -1.5, 0]} 
          opacity={0.3} 
          scale={10} 
          blur={2} 
        />

        {/* Controls - improved X and Y rotation */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
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
        )}
      </Canvas>

      {/* Instructions overlay */}
      {!modelUrl && (
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            pointerEvents: 'none'
          }}
        >
          Add 3D model to src/assets/3d-models/
        </div>
      )}
    </div>
  );
}

// Preload models for better performance
// useGLTF.preload('/path/to/model.glb');

