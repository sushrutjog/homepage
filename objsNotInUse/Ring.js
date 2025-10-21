import * as THREE from 'three';

export default function createRing(material) {
  // geometry: innerRadius, outerRadius, thetaSegments
  const geometry = new THREE.RingGeometry(5, 10, 32);
  const ring = new THREE.Mesh(geometry, material);
  return ring;
}