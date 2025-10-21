import * as THREE from 'three';

export default function createOctahedron(material) {
  // Creates an octahedron with a radius of 0.5
  const geometry = new THREE.OctahedronGeometry(0.5);
  const octahedron = new THREE.Mesh(geometry, material);
  return octahedron;
}