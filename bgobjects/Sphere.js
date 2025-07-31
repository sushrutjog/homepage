import * as THREE from 'three';

export default function createSphere() {
  const geometry = new THREE.SphereGeometry(15, 32, 16);
  const material = new THREE.MeshStandardMaterial({
    color: '#0077ff', // Blue
    wireframe: true
  });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
}