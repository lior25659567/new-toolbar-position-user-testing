import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
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
function PLYModel({ url, monochrome = false, feedback = false, opacity = 100, heatmap = false }: { url: string; monochrome?: boolean; feedback?: boolean; opacity?: number; heatmap?: boolean }) {
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
    
    // Compute bounding box for heatmap normalization
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < posCount; i++) {
      const x = geo.attributes.position.getX(i);
      const y = geo.attributes.position.getY(i);
      const z = geo.attributes.position.getZ(i);
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }

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
      
      // Heatmap: full-coverage occlusal pressure visualization
      if (heatmap) {
        const px = geo.attributes.position.getX(i);
        const py = geo.attributes.position.getY(i);
        const pz = geo.attributes.position.getZ(i);

        const nx = (px - minX) / (maxX - minX);
        const nz = (pz - minZ) / (maxZ - minZ);
        const ny = (py - minY) / (maxY - minY);

        // Height-based base pressure — higher surfaces = more pressure
        const heightPressure = Math.pow(Math.max(0, ny), 1.2) * 0.6;

        // Surface curvature approximation using high-frequency noise
        const curv1 = Math.sin(px * 0.35) * Math.cos(pz * 0.28) * Math.sin(py * 0.32);
        const curv2 = Math.cos(px * 0.22 + 1.7) * Math.sin(pz * 0.31 + 0.9) * Math.cos(py * 0.27 + 2.1);
        const curv3 = Math.sin(px * 0.45 + 3.1) * Math.cos(pz * 0.38 + 1.5);
        const surfaceDetail = (curv1 + curv2 + curv3 * 0.7) * 0.18;

        // Many distributed cusp/contact hot spots across the arch
        const spots = [
          { x: 0.12, z: 0.25, s: 12 }, { x: 0.22, z: 0.35, s: 15 }, { x: 0.15, z: 0.55, s: 10 },
          { x: 0.30, z: 0.20, s: 14 }, { x: 0.35, z: 0.65, s: 11 }, { x: 0.42, z: 0.40, s: 13 },
          { x: 0.50, z: 0.25, s: 16 }, { x: 0.50, z: 0.75, s: 12 }, { x: 0.55, z: 0.50, s: 10 },
          { x: 0.62, z: 0.30, s: 14 }, { x: 0.68, z: 0.60, s: 13 }, { x: 0.75, z: 0.22, s: 15 },
          { x: 0.78, z: 0.45, s: 11 }, { x: 0.85, z: 0.35, s: 12 }, { x: 0.88, z: 0.55, s: 10 },
          { x: 0.25, z: 0.80, s: 9 },  { x: 0.72, z: 0.78, s: 9 },  { x: 0.45, z: 0.15, s: 11 },
        ];
        let spotPressure = 0;
        for (const sp of spots) {
          spotPressure += Math.exp(-((nx - sp.x) ** 2 + (nz - sp.z) ** 2) * sp.s);
        }

        // Ridge lines running along the arch
        const ridgeA = Math.exp(-((nz - 0.35) ** 2) * 4) * 0.25;
        const ridgeB = Math.exp(-((nz - 0.65) ** 2) * 5) * 0.2;
        const ridgeC = Math.exp(-((nx - 0.5) ** 2) * 3) * Math.exp(-((nz - 0.5) ** 2) * 3) * 0.15;

        // Combine all factors
        let pressure = heightPressure + surfaceDetail + spotPressure * 0.7 + ridgeA + ridgeB + ridgeC;
        // Add micro-texture noise for realism
        pressure += Math.sin(px * 1.2) * Math.cos(pz * 0.9) * Math.sin(py * 1.1) * 0.06;
        pressure = Math.min(1, Math.max(0, pressure));

        // Jet colormap: deep blue → cyan → green → yellow → orange → red
        let hr: number, hg: number, hb: number;
        if (pressure < 0.15) {
          const t = pressure / 0.15;
          hr = 0.0; hg = 0.0; hb = 0.4 + t * 0.6; // dark blue → blue
        } else if (pressure < 0.3) {
          const t = (pressure - 0.15) / 0.15;
          hr = 0.0; hg = t * 0.8; hb = 1.0 - t * 0.3; // blue → cyan
        } else if (pressure < 0.5) {
          const t = (pressure - 0.3) / 0.2;
          hr = t * 0.2; hg = 0.8 + t * 0.2; hb = 0.7 - t * 0.7; // cyan → green
        } else if (pressure < 0.65) {
          const t = (pressure - 0.5) / 0.15;
          hr = 0.2 + t * 0.8; hg = 1.0; hb = 0.0; // green → yellow
        } else if (pressure < 0.8) {
          const t = (pressure - 0.65) / 0.15;
          hr = 1.0; hg = 1.0 - t * 0.5; hb = 0.0; // yellow → orange
        } else {
          const t = (pressure - 0.8) / 0.2;
          hr = 1.0; hg = 0.5 - t * 0.5; hb = 0.0; // orange → red
        }

        const blend = 0.92;
        r = r * (1 - blend) + hr * blend;
        g = g * (1 - blend) + hg * blend;
        b = b * (1 - blend) + hb * blend;
      }

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
  }, [geometry, feedback, heatmap, problemIntensity]);

  // Create material based on monochrome state - always use vertex colors now
  const opacityValue = opacity / 100;
  const isTransparent = opacity < 100;

  const material = useMemo(() => {
    if (monochrome) {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x707070),
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide,
        vertexColors: false,
        transparent: isTransparent,
        opacity: opacityValue,
        depthWrite: !isTransparent,
      });
    } else {
      return new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        color: new THREE.Color(0xc8c8c0),
        roughness: 0.35,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        reflectivity: 0.5,
        envMapIntensity: 0.6,
        ior: 1.45,
        sheen: 0.1,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color(0xe8e8e0),
        transparent: isTransparent,
        opacity: opacityValue,
        depthWrite: !isTransparent,
      });
    }
  }, [monochrome, opacityValue, isTransparent]);

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

// Camera controller for zoom animation - only triggers on margin line toggle
function CameraController({ zoomIn }: { zoomIn: boolean }) {
  const { camera } = useThree();
  const prevZoomIn = useRef(zoomIn);
  
  const zoomedPosition = new THREE.Vector3(0, -1.2, 2.5); // Zoomed in position
  const defaultPosition = new THREE.Vector3(0, -2, 4.5); // Default position
  
  // Instantly move camera when zoomIn state changes
  useEffect(() => {
    if (prevZoomIn.current !== zoomIn) {
      const targetPos = zoomIn ? zoomedPosition : defaultPosition;
      
      // Quick smooth animation using requestAnimationFrame
      const startPos = camera.position.clone();
      const duration = 300; // 300ms animation
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPos, targetPos, eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
      prevZoomIn.current = zoomIn;
    }
  }, [zoomIn, camera]);
  
  return null;
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
  zoomIn?: boolean; // Zoom in on the model (for margin line view)
  opacity?: number; // 0-100, controls model transparency
  heatmap?: boolean; // Show occlusal heatmap coloring
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
  zoomIn = false,
  opacity = 100,
  heatmap = false,
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
          toneMappingExposure: 0.7,
        }}
        style={{ touchAction: 'none' }}
        dpr={[1, 2]}
      >
        {/* Lighting - darker, more realistic dental model lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={0.8} 
          castShadow
          color="#f5f0e8"
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.35}
          color="#e8eef5"
        />
        <directionalLight 
          position={[0, -3, 5]} 
          intensity={0.25}
        />
        <directionalLight 
          position={[0, 5, -5]} 
          intensity={0.2}
        />
        <pointLight position={[0, 10, 0]} intensity={0.2} color="#fff5e6" />
        <pointLight position={[3, 0, 3]} intensity={0.15} color="#e6f0ff" />

        {/* Environment for subtle realistic reflections */}
        <Environment preset="apartment" background={false} />

        {/* Camera zoom controller */}
        <CameraController zoomIn={zoomIn} />

        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          {modelUrl ? (
            modelUrl.toLowerCase().endsWith('.stl') ? (
              <STLModel url={modelUrl} />
            ) : modelUrl.toLowerCase().endsWith('.ply') ? (
              <PLYModel url={modelUrl} monochrome={monochrome} feedback={feedback} opacity={opacity} heatmap={heatmap} />
            ) : (
              <GLTFModel url={modelUrl} />
            )
          ) : (
            <PlaceholderTeeth />
          )}
        </Suspense>

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

