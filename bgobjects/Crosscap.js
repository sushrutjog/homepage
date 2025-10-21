import * as THREE from 'three';

export default function createCrossCap(material) {
  // Define the level of detail
  const uSegments = 50;
  const vSegments = 50;

  const positions = [];
  const indices = [];

  // --- Generate Vertices ---
  for (let i = 0; i <= uSegments; i++) {
    const u = i / uSegments * Math.PI;
    for (let j = 0; j <= vSegments; j++) {
      const v = j / vSegments * 2 * Math.PI;

      // Mathematical parameterization for the Roman surface
      const x = Math.sin(2 * u) * Math.pow(Math.cos(v), 2);
      const y = Math.sin(u) * Math.sin(2 * v);
      const z = Math.cos(u) * Math.sin(2 * v);

      // Add the vertex without extra scaling
      positions.push(x, y, z);
    }
  }

  // --- Generate Faces (Indices) ---
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = a + vSegments + 1;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  // --- Create the final BufferGeometry ---
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals(); // For correct lighting

  // --- NORMALIZE & CENTER (Best for custom shapes) ---
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scaleFactor = 1.0 / maxDim;
  geometry.scale(scaleFactor, scaleFactor, scaleFactor);
  geometry.center();
  // --- END ---

  const crossCap = new THREE.Mesh(geometry, material);
  return crossCap;
}