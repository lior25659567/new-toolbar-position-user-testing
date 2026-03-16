import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import type { ModelBounds } from './types';

const TEX_SIZE = 256;
const BRUSH_RADIUS = 24;      // covers scanner frame footprint per ray
const BRUSH_RADIUS_DEMO = 24; // same size for demo

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

  /** Paint a circle at the given world XZ position. Pass isDemo=true for a larger scanner-sized brush. */
  const paintAt = useCallback((worldX: number, worldZ: number, bounds: ModelBounds, isDemo = false) => {
    const data = dataRef.current;
    const rangeX = bounds.maxX - bounds.minX;
    const rangeZ = bounds.maxZ - bounds.minZ;
    if (rangeX === 0 || rangeZ === 0) return;

    const u = (worldX - bounds.minX) / rangeX;
    const v = (worldZ - bounds.minZ) / rangeZ;
    const cx = Math.floor(u * TEX_SIZE);
    const cy = Math.floor(v * TEX_SIZE);
    const r  = isDemo ? BRUSH_RADIUS_DEMO : BRUSH_RADIUS;

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        const px = cx + dx;
        const py = cy + dy;
        if (px < 0 || px >= TEX_SIZE || py < 0 || py >= TEX_SIZE) continue;
        const idx = py * TEX_SIZE + px;
        const intensity = Math.max(0, 1 - dist / r);
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

  /** Capture a rectangular region at once — like a camera snapshot, fills the full rect instantly. */
  const captureRect = useCallback((
    worldXMin: number, worldXMax: number,
    worldZMin: number, worldZMax: number,
    bounds: ModelBounds,
  ) => {
    const data = dataRef.current;
    const rangeX = bounds.maxX - bounds.minX;
    const rangeZ = bounds.maxZ - bounds.minZ;
    if (rangeX === 0 || rangeZ === 0) return;

    const u0 = Math.floor(((worldXMin - bounds.minX) / rangeX) * TEX_SIZE);
    const u1 = Math.floor(((worldXMax - bounds.minX) / rangeX) * TEX_SIZE);
    const v0 = Math.floor(((worldZMin - bounds.minZ) / rangeZ) * TEX_SIZE);
    const v1 = Math.floor(((worldZMax - bounds.minZ) / rangeZ) * TEX_SIZE);

    const x0 = Math.max(0, Math.min(u0, u1));
    const x1 = Math.min(TEX_SIZE - 1, Math.max(u0, u1));
    const y0 = Math.max(0, Math.min(v0, v1));
    const y1 = Math.min(TEX_SIZE - 1, Math.max(v0, v1));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        data[y * TEX_SIZE + x] = 255;
      }
    }

    coverageTexture.needsUpdate = true;
  }, [coverageTexture]);

  /** Reset all coverage */
  const reset = useCallback(() => {
    dataRef.current.fill(0);
    coverageTexture.needsUpdate = true;
  }, [coverageTexture]);

  return { coverageTexture, paintAt, captureRect, getCoverage, getRegionCoverage, reset };
}
