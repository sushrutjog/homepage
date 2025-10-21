import * as THREE from 'three';
import { LineMaterial } from '../jsm/lines/LineMaterial.js';
import { LineGeometry } from '../jsm/lines/LineGeometry.js';
import { Line2 } from '../jsm/lines/Line2.js';

// --- Core mathematical functions ---
function hopfFiber1(basePoint, resolution) {
    const r1 = new THREE.Quaternion(0, 1 + basePoint.x, basePoint.y, basePoint.z);
    r1.multiply(new THREE.Quaternion(1 / Math.sqrt(2 + 2 * basePoint.x), 0, 0, 0));
    const fiber = [];
    for (let i = 0; i < resolution; i++) {
        const pt = new THREE.Quaternion();
        pt.multiplyQuaternions(r1, new THREE.Quaternion(Math.cos(2 * Math.PI * i / resolution), Math.sin(2 * Math.PI * i / resolution), 0, 0));
        fiber.push(pt);
    }
    return fiber;
}

function stereographicProjection(points) {
    const proj = [];
    for (let i = 0; i < points.length; i++) {
        const denominator = Math.max(1 - points[i].x, 0.001);
        const pt = new THREE.Vector3(points[i].y / denominator, points[i].z / denominator, points[i].w / denominator);
        proj.push(pt);
    }
    proj.push(proj[0]);
    return proj;
}

// --- Main creation function ---
export default function createHopfFibration(material) {
    const hopfGroup = new THREE.Group();
    const fiberResolution = 100;
    const pointCountPerCircle = 25;

    // We will ignore the passed-in material and use its color for our LineMaterial
    const matLine = new LineMaterial({
        color: material.color,
        linewidth: 0.005,
        worldUnits: true
    });

    const baseCirclesParams = [
        { distance: -0.8, circumference: 2 * Math.PI },
        { distance: 0, circumference: 2 * Math.PI },
        { distance: 0.8, circumference: 2 * Math.PI },
        { distance: 0.95, circumference: 2 * Math.PI }
    ];

    // Store the original base points and the line objects for animation
    hopfGroup.userData.basePoints = [];
    hopfGroup.userData.lineObjects = [];

    for (const params of baseCirclesParams) {
        const circlePoints = [];
        const distanceToCenter_radians = params.distance * Math.PI / 2;

        for (let j = 0; j < pointCountPerCircle; j++) {
            const basePoint = new THREE.Vector3(
                Math.cos(distanceToCenter_radians) * Math.sin(params.circumference * j / pointCountPerCircle),
                Math.sin(distanceToCenter_radians),
                Math.cos(distanceToCenter_radians) * Math.cos(params.circumference * j / pointCountPerCircle)
            );
            circlePoints.push(basePoint);
        }
        hopfGroup.userData.basePoints.push(circlePoints);
    }

    // Initial creation of the lines
    for (const circle of hopfGroup.userData.basePoints) {
        for (const basePoint of circle) {
            const fiber4D = hopfFiber1(basePoint, fiberResolution);
            const projectedCircle3D = stereographicProjection(fiber4D);

            const positions = [];
            projectedCircle3D.forEach(p => positions.push(p.x, p.y, p.z));

            const geomLine = new LineGeometry();
            geomLine.setPositions(positions);

            const line = new Line2(geomLine, matLine);
            line.computeLineDistances();
            
            hopfGroup.add(line);
            hopfGroup.userData.lineObjects.push(line);
        }
    }
    
    // Define the update function and attach it to the group
    hopfGroup.userData.updateAnimation = () => {
        const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0.5, 1, 0).normalize(), // Rotation axis
            0.0005 // Rotation speed
        );

        let lineIndex = 0;
        for (const circle of hopfGroup.userData.basePoints) {
            for (const basePoint of circle) {
                // Rotate the source point
                basePoint.applyQuaternion(rotationQuaternion);

                // Recalculate and update the line geometry
                const fiber4D = hopfFiber1(basePoint, fiberResolution);
                const projectedCircle3D = stereographicProjection(fiber4D);
                
                const positions = [];
                projectedCircle3D.forEach(p => positions.push(p.x, p.y, p.z));
                
                const line = hopfGroup.userData.lineObjects[lineIndex];
                line.geometry.setPositions(positions);
                line.computeLineDistances();

                lineIndex++;
            }
        }
    };
    
    // Tag this object so we can find it in the main animation loop
    hopfGroup.name = "HopfFibration";
    hopfGroup.scale.setScalar(4);
    return hopfGroup;
}