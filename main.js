import * as THREE from 'three';

// --- CORE SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// --- DYNAMICALLY IMPORT & CREATE OBJECTS ---
const TOTAL_OBJECTS = 25;
const backgroundObjects = [];

const objectModulePaths = [
    './bgobjects/Sphere.js',
    './bgobjects/Torus.js',
    './bgobjects/Icosahedron.js',
    './bgobjects/Cube.js',
    './bgobjects/TrefoilKnot.js',
    './bgobjects/TorusKnot.js',
];

Promise.all(objectModulePaths.map(path => import(path)))
    .then(modules => {
        const createObjectFunctions = modules.map(module => module.default);
        populateScene(createObjectFunctions);
    });

function populateScene(creationFuncs) {
    for (let i = 0; i < TOTAL_OBJECTS; i++) {
        const createObject = creationFuncs[Math.floor(Math.random() * creationFuncs.length)];
        const mesh = createObject();

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
        
        mesh.position.set(x, y - 50, z - 50); // Spread objects out vertically
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        scene.add(mesh);
        backgroundObjects.push(mesh);
    }
}

// --- SCROLL-BASED CAMERA MOVEMENT ---
function handleScroll() {
    const t = document.body.getBoundingClientRect().top;
    // The multiplier controls the "speed" of the scroll
    camera.position.y = t * 0.05; 
    camera.position.x = t * 0.002;
    camera.rotation.y = t * 0.001;
}
document.body.onscroll = handleScroll;
handleScroll(); // Initialize position

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // Add subtle rotation to background objects
    backgroundObjects.forEach(obj => {
        obj.rotation.x += 0.001;
        obj.rotation.y += 0.0005;
        obj.rotation.z += 0.001;
    });

    renderer.render(scene, camera);
}

// --- RESPONSIVE RESIZE ---
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

// Start the animation loop once everything is set up
animate();