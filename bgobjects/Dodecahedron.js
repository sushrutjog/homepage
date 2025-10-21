import * as THREE from 'three';

export default function createDodecahedron(material) {
  // Creates a dodecahedron with a radius of 0.5
  const geometry = new THREE.DodecahedronGeometry(0.5);
  const dodecahedron = new THREE.Mesh(geometry, material);
  return dodecahedron;
}