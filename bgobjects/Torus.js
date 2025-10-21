import * as THREE from 'three';

export default function createTorus(material) {
  // Creates a torus with a total diameter of 1 (0.35 radius + 0.15 tube radius = 0.5 * 2)
  const geometry = new THREE.TorusGeometry(0.35, 0.15, 16, 100);
  const torus = new THREE.Mesh(geometry, material);
  return torus;
}