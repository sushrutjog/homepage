import * as THREE from 'three';

export default function createIcosahedron(material) {
  // Creates an icosahedron with a radius of 0.5
  const geometry = new THREE.IcosahedronGeometry(0.5);
  const icosahedron = new THREE.Mesh(geometry, material);
  return icosahedron;
}