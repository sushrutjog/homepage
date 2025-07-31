import * as THREE from 'three';

export default function createTorusKnot(material) {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}