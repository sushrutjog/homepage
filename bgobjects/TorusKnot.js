import * as THREE from 'three';

export default function createTorusKnot() {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: '#aa00ff', // Purple
    wireframe: true
  });
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}