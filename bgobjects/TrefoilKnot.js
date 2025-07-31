import * as THREE from 'three';

export default function createTrefoilKnot(material) {
  const geometry = new THREE.TorusKnotGeometry(10, 2, 100, 16, 2, 3);
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}