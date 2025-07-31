import * as THREE from 'three';

export default function createIcosahedron() {
  const geometry = new THREE.IcosahedronGeometry(12);
  const material = new THREE.MeshStandardMaterial({
    color: '#00ff88', // Green
    wireframe: true
  });
  const icosahedron = new THREE.Mesh(geometry, material);
  return icosahedron;
}