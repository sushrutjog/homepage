import * as THREE from 'three';

export default function createCone(material) {
  // geometry: radius, height, radialSegments
  const geometry = new THREE.ConeGeometry(10, 20, 32);
  const cone = new THREE.Mesh(geometry, material);
  return cone;
}