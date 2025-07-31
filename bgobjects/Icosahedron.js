import * as THREE from 'three';

export default function createIcosahedron(material) {
  const geometry = new THREE.IcosahedronGeometry(12);
  const icosahedron = new THREE.Mesh(geometry, material);
  return icosahedron;
}