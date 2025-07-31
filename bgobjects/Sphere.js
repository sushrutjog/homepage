import * as THREE from 'three';

export default function createSphere(material) {
  const geometry = new THREE.SphereGeometry(15, 32, 16);
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
}