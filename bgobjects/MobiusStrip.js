import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

// Mobius strip parametric function (scalar removed)
const mobius = (u, t, target) => {
    u = u - 0.5;
    const v = 2 * Math.PI * t;
    const x = Math.cos(v) * (1 + u * Math.cos(v / 2));
    const y = Math.sin(v) * (1 + u * Math.cos(v / 2));
    const z = u * Math.sin(v / 2);
    target.set(x, y, z); // Removed .multiplyScalar(10)
};

export default function createMobiusStrip(material) {
  const geometry = new ParametricGeometry(mobius, 25, 25);

  // --- NORMALIZE & CENTER (Best for custom shapes) ---
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = 1.0 / maxDim;
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);
  geometry.center();
  // --- END ---

  const strip = new THREE.Mesh(geometry, material);
  return strip;
}