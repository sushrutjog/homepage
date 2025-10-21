import * as THREE from 'three';

export default function createTorusKnot(material) {
  // Radius of 0.4 and tube of 0.1 makes the total diameter ~1.0
  const geometry = new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16);
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}