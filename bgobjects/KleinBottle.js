import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

// Klein bottle parametric function (scalar removed)
const klein = (v, u, target) => {
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;
    let x, y, z;
    if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
    }
    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    target.set(x, y, z); // Removed .multiplyScalar(0.75)
};

export default function createKleinBottle(material) {
  const geometry = new ParametricGeometry(klein, 25, 25);
  
  // --- NORMALIZE & CENTER (Best for custom shapes) ---
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = 1.0 / maxDim;
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);
  geometry.center();
  // --- END ---

  const bottle = new THREE.Mesh(geometry, material);
  return bottle;
}