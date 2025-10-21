import * as THREE from 'three';

export default function createSphere(material) {
  // Creates a sphere with a radius of 0.5, for a total diameter of 1
  const geometry = new THREE.SphereGeometry(0.5, 32, 16);
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
}