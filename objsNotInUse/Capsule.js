import * as THREE from 'three';

export default function createCapsule(material) {
  // geometry: radius, length, capSegments, radialSegments
  const geometry = new THREE.CapsuleGeometry(6, 10, 10, 20);
  const capsule = new THREE.Mesh(geometry, material);
  return capsule;
}