import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import type { ModelBounds } from './types';

const TEX_SIZE = 256;
const BRUSH_RADIUS = 8; // pixels in the coverage texture

export function useScanProgress() {
  const dataRef = useRef<Uint8Array>(new Uint8Array(TEX_SIZE * TEX_SIZE).fill(0));

  const coverageTexture = useMemo(() => {
    const data = dataRef.current;
    const tex = new THREE.DataTexture(data, TEX_SIZE, TEX_SIZE, THREE.RedFormat, THREE.UnsignedByteType);
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  /** Paint a circle at the given world XZ position */
  const paintAt = useCallback((worldX: number, worldZ: number, bounds: ModelBounds) => {
    const data = dataRef.current;
    const rangeX = bounds.maxX - bounds.minX;
    const rangeZ = bounds.maxZ - bounds.minZ;
    if (rangeX === 0 || rangeZ === 0) return;

    // Normalize world XZ → 0-1
    const u = (worldX - bounds.minX) / rangeX;
    const v = (worldZ - bounds.minZ) / rangeZ;

    // Convert to texel coords
    const cx = Math.floor(u * TEX_SIZE);
    const cy = Math.floor(v * TEX_SIZE);

    // Paint a circle
    for (let dy = -BRUSH_RADIUS; dy <= BRUSH_RADIUS; dy++) {
      for (let dx = -BRUSH_RADIUS; dx <= BRUSH_RADIUS; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > BRUSH_RADIUS) continue;
        const px = cx + dx;
        const py = cy + dy;
        if (px < 0 || px >= TEX_SIZE || py < 0 || py >= TEX_SIZE) continue;
        const idx = py * TEX_SIZE + px;
        // Soft falloff
        const intensity = Math.max(0, 1 - dist / BRUSH_RADIUS);
        const value = Math.floor(intensity * 255);
        data[idx] = Math.max(data[idx], value);
      }
    }

    coverageTexture.needsUpdate = true;
  }, [coverageTexture]);

  /** Compute overall coverage as 0-1 */
  const getCoverage = useCallback(() => {
    const data = dataRef.current;
    let covered = 0;
    const threshold = 64; // ~25% intensity counts as covered
    for (let i = 0; i < data.length; i++) {
      if (data[i] >= threshold) covered++;
    }
    return covered / data.length;
  }, []);

  /** Get coverage within a normalized sub-region (0-1 coords) */
  const getRegionCoverage = useCallback((xMin: number, xMax: number, zMin: number, zMax: number) => {
    const data = dataRef.current;
    const threshold = 64;
    const x0 = Math.floor(xMin * TEX_SIZE);
    const x1 = Math.floor(xMax * TEX_SIZE);
    const z0 = Math.floor(zMin * TEX_SIZE);
    const z1 = Math.floor(zMax * TEX_SIZE);
    let total = 0;
    let covered = 0;
    for (let z = z0; z < z1; z++) {
      for (let x = x0; x < x1; x++) {
        if (x < 0 || x >= TEX_SIZE || z < 0 || z >= TEX_SIZE) continue;
        total++;
        if (data[z * TEX_SIZE + x] >= threshold) covered++;
      }
    }
    return total === 0 ? 0 : covered / total;
  }, []);

  /** Reset all coverage */
  const reset = useCallback(() => {
    dataRef.current.fill(0);
    coverageTexture.needsUpdate = true;
  }, [coverageTexture]);

  return { coverageTexture, paintAt, getCoverage, getRegionCoverage, reset };
}
