import * as THREE from 'three';

export default function createTorus(material) {
  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const torus = new THREE.Mesh(geometry, material);
  return torus;
}