import * as THREE from 'three';

export default function createTorus() {
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({
    color: '#ff4444', // Red
    wireframe: true
  });
  const torus = new THREE.Mesh(geometry, material);
  return torus;
}