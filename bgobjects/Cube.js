import * as THREE from 'three';

export default function createCube(material) {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}