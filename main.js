import * as THREE from 'three';

// Add this array near the top of main.js
const COLORS = [
  '#3498db', // Bright Blue
  '#2ecc71', // Vibrant Green
  '#f1c40f', // Sunny Yellow
  '#e67e22', // Bright Orange
  '#9b59b6', // Nice Purple
  '#ecf0f1', // Clean White
  '#1abc9c', // Turquoise
  '#e91e63', // Magenta
  '#00bcd4', // Cyan
  '#8bc34a'  // Lime Green
];

// --- CORE SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// --- NEW: DYNAMIC SCENE SCALING ---
// 1. Define the total vertical "depth" of your 3D scene.
const SCENE_VERTICAL_DEPTH = 500; 

// 2. Calculate the multiplier dynamically based on actual page height.
// This should run after the page is laid out to get the correct height.
let scrollMultiplier;
function calculateScrollMultiplier() {
    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollMultiplier = SCENE_VERTICAL_DEPTH / maxScroll;
}
// Run calculation on load and on resize.
window.addEventListener('load', calculateScrollMultiplier);
window.addEventListener('resize', calculateScrollMultiplier);


// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// --- DYNAMICALLY IMPORT & CREATE OBJECTS ---
const TOTAL_OBJECTS = 50;
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
        // --- START: DYNAMIC COLOR LOGIC ---

        // 1. Pick a random color from the COLORS array
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

        // 2. Create a new material with the random color
        const material = new THREE.MeshStandardMaterial({
            color: randomColor,
            wireframe: true // Kept the wireframe style
        });

        // 3. Get the object creation function
        const createObject = creationFuncs[Math.floor(Math.random() * creationFuncs.length)];
        
        // 4. Create the mesh by passing the new material to the function
        const mesh = createObject(material);

        // --- END: DYNAMIC COLOR LOGIC ---

        // The rest of the positioning logic remains the same...
        const y = THREE.MathUtils.randFloat(0, -SCENE_VERTICAL_DEPTH);
        const z = THREE.MathUtils.randFloat(-250, 10);
        const centralGap = 40;
        const horizontalSpread = 100;
        const x = Math.random() < 0.5
            ? THREE.MathUtils.randFloat(-horizontalSpread, -centralGap)
            : THREE.MathUtils.randFloat(centralGap, horizontalSpread);

        mesh.position.set(x, y, z);

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
    const t = document.body.getBoundingClientRect().top; // 't' is negative on scroll

    // 3. Use the dynamic multiplier to move the camera.
    if (scrollMultiplier) { // Ensure multiplier is calculated
        camera.position.y = t * scrollMultiplier;
    }
    
    // Keep subtle movements relative to the main scroll
    camera.position.x = t * 0.0005;
    camera.rotation.y = t * 0.0001;
}
document.body.onscroll = handleScroll;
handleScroll();

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
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
    // Recalculate multiplier on resize
    calculateScrollMultiplier(); 
}
window.addEventListener('resize', handleResize);

// Start the animation loop
animate();