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

// Smooth Hermite interpolation (GLSL smoothstep) used to softly gate the
// occlusal heatmap so only upward-facing contact surfaces light up.
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (edge0 === edge1 ? 0 : (x - edge0) / (edge1 - edge0))));
  return t * t * (3 - 2 * t);
}

// Occlusal contact "blobs" for the heatmap. Each is a radial gaussian in the
// arch's normalized footprint (nx, nz). A single blob fades from its peak at
// the centre out to zero, so when run through the colour ramp it reads as a
// real contact: hot core → green → faint blue halo, on otherwise-neutral teeth.
// Generated deterministically (fixed seed) so the pattern is stable across
// renders. Uniform placement is fine — blobs that fall in the tongue-space at
// the centre of the U-arch simply hit no geometry and never render.
const HEAT_HOTSPOTS = (() => {
  let seed = 20240611;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const spots: { x: number; z: number; s: number; peak: number }[] = [];
  for (let k = 0; k < 52; k++) {
    spots.push({
      x: 0.05 + rand() * 0.9,
      z: 0.05 + rand() * 0.9,
      s: 32 + rand() * 60,                 // lower spread → larger blobs, so the
                                           // radial colour ramp has room to sweep
      peak: 0.62 + Math.pow(rand(), 1.2) * 0.7, // most reach a hot core, some cooler
    });
  }
  return spots;
})();

// PLY Model Loader (supports vertex colors from scans)
function PLYModel({ url, monochrome = false, feedback = false, opacity = 100, heatmap = false, centerOverride }: { url: string; monochrome?: boolean; feedback?: boolean; opacity?: number; heatmap?: boolean; centerOverride?: [number, number, number] }) {
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
    // When two arches share one canvas they must be centered as a GROUP, not
    // each on its own — otherwise both arch centroids collapse onto the origin
    // and the meshes interpenetrate. centerOverride is the combined centroid.
    if (centerOverride) {
      geo.translate(-centerOverride[0], -centerOverride[1], -centerOverride[2]);
    } else {
      geo.center();
    }
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

    // Primary blue color for feedback marks: var(--ads-background-interactive)
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
      
      // Heatmap: occlusal pressure on teeth only
      if (heatmap) {
        const px = geo.attributes.position.getX(i);
        const py = geo.attributes.position.getY(i);
        const pz = geo.attributes.position.getZ(i);

        const nx = (px - minX) / (maxX - minX);
        const nz = (pz - minZ) / (maxZ - minZ);
        const ny = (py - minY) / (maxY - minY);

        // Detect teeth vs gums using original vertex color
        // Gums are pink/red (high r, lower g/b), teeth are lighter/whiter
        const origR = hasColors ? geo.attributes.color.getX(i) : 0.9;
        const origG = hasColors ? geo.attributes.color.getY(i) : 0.85;
        const origB = hasColors ? geo.attributes.color.getZ(i) : 0.8;

        const brightness = (origR + origG + origB) / 3;
        const pinkness = origR - (origG + origB) / 2;
        const isTooth = brightness > 0.45 && pinkness < 0.15;

        if (isTooth) {
          // Only upward (occlusal) surfaces register contact; the sides and
          // necks of the teeth stay neutral. Softly gated so it's not a hard cut.
          const normalY = geo.attributes.normal ? Math.abs(geo.attributes.normal.getY(i)) : ny;
          const occlusalGate = smoothstep(0.3, 0.72, normalY);

          // Pressure is the single strongest nearby contact blob — a radial
          // gaussian. This is the key to a real heatmap look: each blob fades
          // smoothly from a hot core out to a faint halo, instead of the whole
          // occlusal table being washed in one broad rainbow.
          let blob = 0;
          for (const sp of HEAT_HOTSPOTS) {
            const d2 = (nx - sp.x) ** 2 + (nz - sp.z) ** 2;
            // Single smooth gaussian → a clean radial gradient. The value falls
            // off gradually from the centre, so the colour ramp sweeps through
            // the full spectrum (hot core → cool rim) across each blob's radius.
            blob = Math.max(blob, sp.peak * Math.exp(-d2 * sp.s));
          }
          // Subtle organic noise so blob outlines aren't perfect circles.
          const noise = Math.sin(px * 0.5 + pz * 0.4) * Math.cos(py * 0.3 + 1.1) * 0.045;

          let pressure = occlusalGate * (blob + noise);
          pressure = Math.min(1, Math.max(0, pressure));

          // Colormap matching prep QC legend gradient
          // Stops: var(--ads-background-interactive) → var(--ads-background-interactive) → var(--ads-text-link) → #0FF4FC → #2CE9C6 → var(--ads-text-success) → var(--ads-text-warning) → var(--ads-text-warning) → var(--ads-text-warning) → var(--ads-text-warning) → var(--ads-text-error) → var(--ads-text-error)
          const stops = [
            { t: 0.000, r: 0/255, g: 102/255, b: 255/255 },
            { t: 0.091, r: 1/255, g: 151/255, b: 236/255 },
            { t: 0.182, r: 63/255, g: 186/255, b: 255/255 },
            { t: 0.273, r: 15/255, g: 244/255, b: 252/255 },
            { t: 0.364, r: 44/255, g: 233/255, b: 198/255 },
            { t: 0.455, r: 84/255, g: 191/255, b: 0/255 },
            { t: 0.545, r: 255/255, g: 230/255, b: 0/255 },
            { t: 0.636, r: 255/255, g: 214/255, b: 0/255 },
            { t: 0.727, r: 255/255, g: 160/255, b: 8/255 },
            { t: 0.818, r: 247/255, g: 119/255, b: 26/255 },
            { t: 0.909, r: 255/255, g: 0/255, b: 0/255 },
            { t: 1.000, r: 198/255, g: 19/255, b: 19/255 },
          ];
          let hr = stops[0].r, hg = stops[0].g, hb = stops[0].b;
          for (let s = 0; s < stops.length - 1; s++) {
            if (pressure >= stops[s].t && pressure <= stops[s + 1].t) {
              const lt = (pressure - stops[s].t) / (stops[s + 1].t - stops[s].t);
              hr = stops[s].r + (stops[s + 1].r - stops[s].r) * lt;
              hg = stops[s].g + (stops[s + 1].g - stops[s].g) * lt;
              hb = stops[s].b + (stops[s + 1].b - stops[s].b) * lt;
              break;
            }
          }

          // Punch saturation + contrast so the hot core stays a vivid red and
          // the mid-range greens/yellows read clearly — the glow comes from the
          // wide gaussian halo above, not from washing the colour toward white.
          const sat = 1.35;
          const lum = hr * 0.3 + hg * 0.59 + hb * 0.11;
          hr = Math.min(1, Math.max(0, lum + (hr - lum) * sat));
          hg = Math.min(1, Math.max(0, lum + (hg - lum) * sat));
          hb = Math.min(1, Math.max(0, lum + (hb - lum) * sat));

          // Opacity follows a square-root curve so the cooler outer rings of
          // each blob stay visible (a smooth radial gradient) rather than being
          // clipped — feathering to neutral tooth only at the very edge.
          const blend = Math.min(0.96, Math.sqrt(pressure) * 1.45);
          r = r * (1 - blend) + hr * blend;
          g = g * (1 - blend) + hg * blend;
          b = b * (1 - blend) + hb * blend;
        }
        // Gums keep original color
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
  }, [geometry, feedback, heatmap, problemIntensity, centerOverride]);

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
      <meshBasicMaterial color="var(--ads-background-interactive)" wireframe />
    </mesh>
  );
}

// Camera controller for zoom animation - only triggers on margin line toggle.
// Dollies in/out along the CURRENT view direction by scaling the orbit radius,
// so whatever rotation the user is at is preserved — it just zooms, never
// resets the model to a fixed orientation.
function CameraController({ zoomIn }: { zoomIn: boolean }) {
  const { camera } = useThree();
  const prevZoomIn = useRef(zoomIn);

  const ZOOM_FACTOR = 0.58; // zoomed distance ≈ 58% of the current distance

  useEffect(() => {
    if (prevZoomIn.current === zoomIn) return;

    // OrbitControls orbits around the model centre (origin); scale only the
    // distance along the current camera→centre vector to keep the rotation.
    const target = new THREE.Vector3(0, 0, 0);
    const offset = camera.position.clone().sub(target);
    const targetDist = zoomIn ? offset.length() * ZOOM_FACTOR : offset.length() / ZOOM_FACTOR;
    const startPos = camera.position.clone();
    const endPos = target.clone().add(offset.setLength(targetDist));

    const duration = 300;
    const startTime = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      camera.position.lerpVectors(startPos, endPos, eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
    prevZoomIn.current = zoomIn;
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
  opacity?: number; // 0-100, controls model transparency (the upper arch in dual mode)
  /** When set, the lower arch is rendered as a second mesh in the same canvas
   *  with its own opacity, so each arch can be faded independently. */
  lowerModelUrl?: string;
  opacityLower?: number; // 0-100, lower-arch transparency in dual mode
  heatmap?: boolean; // Show occlusal heatmap coloring
  className?: string;
}

/**
 * Renders the upper and lower arches as two independent meshes in one shared
 * canvas (one camera / one OrbitControls), each with its own opacity. Both are
 * centered by the COMBINED bounding box so they keep their real bite alignment
 * instead of collapsing onto the origin. This is what lets the Layers-panel
 * upper slider fade only the upper arch and the lower slider only the lower.
 */
function DualArchModel({
  upperUrl,
  lowerUrl,
  upperOpacity,
  lowerOpacity,
  monochrome,
  feedback,
  heatmap,
}: {
  upperUrl: string;
  lowerUrl: string;
  upperOpacity: number;
  lowerOpacity: number;
  monochrome?: boolean;
  feedback?: boolean;
  heatmap?: boolean;
}) {
  const upperGeo = useLoader(PLYLoader, upperUrl);
  const lowerGeo = useLoader(PLYLoader, lowerUrl);
  const { center, lift } = useMemo(() => {
    upperGeo.computeBoundingBox();
    lowerGeo.computeBoundingBox();
    const box = new THREE.Box3();
    if (upperGeo.boundingBox) box.union(upperGeo.boundingBox);
    if (lowerGeo.boundingBox) box.union(lowerGeo.boundingBox);
    const c = new THREE.Vector3();
    box.getCenter(c);
    const s = new THREE.Vector3();
    box.getSize(s);
    const maxDim = Math.max(s.x, s.y, s.z);
    const safeDim = Number.isFinite(maxDim) && maxDim > 0 ? maxDim : 1;
    return {
      center: [c.x, c.y, c.z] as [number, number, number],
      // Small upward nudge so the upper arch reads as separated from the lower
      // at the bite line (scaled to model size, so it's unit-independent).
      // Keep this small — a few % of model size is a "slight" gap.
      lift: safeDim * 0.005,
    };
  }, [upperGeo, lowerGeo]);

  return (
    <>
      {/* World-space group (outside the mesh's own rotation) lifts the upper
          arch straight up on screen. */}
      <group position={[0, lift, 0]}>
        <PLYModel url={upperUrl} opacity={upperOpacity} monochrome={monochrome} feedback={feedback} heatmap={heatmap} centerOverride={center} />
      </group>
      <PLYModel url={lowerUrl} opacity={lowerOpacity} monochrome={monochrome} feedback={feedback} heatmap={heatmap} centerOverride={center} />
    </>
  );
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
  lowerModelUrl,
  opacityLower = 100,
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
          color="var(--ads-background-highlight-orange)"
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={0.35}
          color="var(--ads-background-highlight-blue)"
        />
        <directionalLight 
          position={[0, -3, 5]} 
          intensity={0.25}
        />
        <directionalLight 
          position={[0, 5, -5]} 
          intensity={0.2}
        />
        <pointLight position={[0, 10, 0]} intensity={0.2} color="var(--ads-background-highlight-orange)" />
        <pointLight position={[3, 0, 3]} intensity={0.15} color="var(--ads-background-highlight-blue)" />

        {/* Environment for subtle realistic reflections */}
        <Environment preset="apartment" background={false} />

        {/* Camera zoom controller */}
        <CameraController zoomIn={zoomIn} />

        {/* Model */}
        <Suspense fallback={<LoadingSpinner />}>
          {modelUrl ? (
            lowerModelUrl && modelUrl.toLowerCase().endsWith('.ply') && lowerModelUrl.toLowerCase().endsWith('.ply') ? (
              <DualArchModel
                upperUrl={modelUrl}
                lowerUrl={lowerModelUrl}
                upperOpacity={opacity}
                lowerOpacity={opacityLower}
                monochrome={monochrome}
                feedback={feedback}
                heatmap={heatmap}
              />
            ) : modelUrl.toLowerCase().endsWith('.stl') ? (
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

