import * as THREE from 'three';

export default function createTrefoilKnot(material) {
  // Radius of 0.4 and tube of 0.15 makes the total diameter ~1.1
  const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 200, 32, 2, 3);
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}