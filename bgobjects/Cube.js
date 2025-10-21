import * as THREE from 'three';

export default function createCube(material) {
  // Creates a 1x1x1 unit cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}