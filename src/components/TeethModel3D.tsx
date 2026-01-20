import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
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
function PLYModel({ url }: { url: string }) {
  const geometry = useLoader(PLYLoader, url);

  // Center and prepare the geometry
  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [geometry]);

  // Check if geometry has vertex colors
  const hasVertexColors = centeredGeometry.attributes.color !== undefined;

  return (
    <Center>
      <mesh geometry={centeredGeometry} scale={0.05}>
        <meshStandardMaterial 
          vertexColors={hasVertexColors}
          color={hasVertexColors ? undefined : "#f8f8f5"}
          roughness={0.4}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
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
  className?: string;
}

export default function TeethModel3D({
  modelUrl,
  width = '100%',
  height = '100%',
  backgroundColor = 'transparent',
  showControls = true,
  autoRotate = false,
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
          position: [0, 1.5, 2.5], 
          fov: 45,
          near: 0.01,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
        style={{ touchAction: 'none' }}
      >
        {/* Lighting - improved for dental models */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.6}
        />
        <directionalLight 
          position={[0, -5, 0]} 
          intensity={0.3}
        />
        <pointLight position={[0, 10, 0]} intensity={0.4} />

        {/* Environment for realistic reflections */}
        <Environment preset="studio" />

        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          {modelUrl ? (
            modelUrl.toLowerCase().endsWith('.stl') ? (
              <STLModel url={modelUrl} />
            ) : modelUrl.toLowerCase().endsWith('.ply') ? (
              <PLYModel url={modelUrl} />
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

        {/* Controls - improved responsiveness and movement */}
        {showControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            rotateSpeed={2}
            zoomSpeed={1.5}
            panSpeed={1.5}
            enableDamping={false}
            minDistance={0.5}
            maxDistance={10}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            minAzimuthAngle={-Infinity}
            maxAzimuthAngle={Infinity}
            screenSpacePanning={true}
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

