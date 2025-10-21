import * as THREE from 'three';

export default function createCylinder(material) {
  // geometry: radiusTop, radiusBottom, height, radialSegments
  const geometry = new THREE.CylinderGeometry(8, 8, 20, 32);
  const cylinder = new THREE.Mesh(geometry, material);
  return cylinder;
}