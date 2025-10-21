import * as THREE from 'three';

export default function createVase(material) {
  // Define the 2D profile shape of the vase
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
  }
  
  const geometry = new THREE.LatheGeometry(points);
  const vase = new THREE.Mesh(geometry, material);
  return vase;
}