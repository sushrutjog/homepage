import * as THREE from 'three';

export default function createTrefoilKnot() {
  const geometry = new THREE.TorusKnotGeometry(10, 2, 100, 16, 2, 3);
  const material = new THREE.MeshStandardMaterial({
    color: '#ff8800', // Orange
    wireframe: true
  });
  const knot = new THREE.Mesh(geometry, material);
  return knot;
}