import * as THREE from 'three';

// --- CORE SETUP ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// --- CONTROL FLAGS & ELEMENTS ---
const RENDER_BACKGROUND = true;
const ANIMATE_HOPF_FIBRATION = true; // Set to false to stop the Hopf Fibration's internal animation
const ANIMATE_OTHER_OBJECTS = true; // Set to false to stop the rotation of other objects

const bodyElement = document.body;
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('main section');
const themeToggleButton = document.querySelector('#theme-toggle');
let stickyPoint = 0;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);

// --- DYNAMIC SCENE CONSTANT ---
const CAMERA_TRAVEL_PER_PIXEL = 0.1;

// ---CONSTANTS & GLOBAL VARIABLES ---
const MAX_OBJECTS =25; // The total number of objects to display

const DARK_MODE_COLORS = [
  '#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6', '#ecf0f1',
  '#1abc9c', '#e91e63', '#00bcd4', '#8bc34a', '#e74c3c', '#4a69bd',
  '#7bed9f', '#ffb8b8', '#f6b93b', '#6a89cc'
];

const LIGHT_MODE_COLORS = [
    '#3498db', '#16a085', '#f39c12', '#d35400', '#8e44ad', '#2c3e50',
    '#2980b9', '#c0392b', '#0077c2', '#6c5ce7', '#fd79a8', '#00b894'
];

let backgroundObjects = []; // Will store all objects EXCEPT the Hopf Fibration
let hopfFibrationObject = null; // A dedicated variable for the Hopf Fibration

const objectModulePaths = [
    './bgobjects/Sphere.js', './bgobjects/Torus.js', './bgobjects/Icosahedron.js',
    './bgobjects/Cube.js', './bgobjects/Dodecahedron.js', './bgobjects/MobiusStrip.js',
    './bgobjects/Octahedron.js', './bgobjects/Crosscap.js', './bgobjects/HopfFibration.js', './bgobjects/KleinBottle.js', './bgobjects/TorusKnot.js', './bgobjects/TrefoilKnot.js'
];

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);


// --- MAIN SCENE SETUP ---
function setupScene() {
    if (!RENDER_BACKGROUND) {
        canvas.style.display = 'none';
        return;
    }
    
    // Clear all old objects from the scene and arrays
    backgroundObjects.forEach(obj => scene.remove(obj));
    backgroundObjects = [];
    if (hopfFibrationObject) {
        scene.remove(hopfFibrationObject);
        hopfFibrationObject = null;
    }

    // Load the 3D object modules, then pass them to the population function
    Promise.all(objectModulePaths.map(path => import(path)))
        .then(modules => {
            const hopfIndex = objectModulePaths.findIndex(path => path.includes('HopfFibration.js'));
            let createHopfFunction = null;
            let otherCreateObjectFunctions = [];

            if (hopfIndex !== -1) {
                createHopfFunction = modules[hopfIndex].default;
                otherCreateObjectFunctions = modules
                    .filter((_, index) => index !== hopfIndex)
                    .map(module => module.default);
            } else {
                otherCreateObjectFunctions = modules.map(module => module.default);
            }

            populateScene(createHopfFunction, otherCreateObjectFunctions);
        });
}

function populateScene(createHopf, otherCreationFuncs) {
    const activeColors = bodyElement.classList.contains('light-mode') 
        ? LIGHT_MODE_COLORS 
        : DARK_MODE_COLORS;

    // Helper function to create and configure a mesh
    const configureMesh = (mesh, isHopf = false) => {
        // Set a general X range first
        const x = THREE.MathUtils.randFloat(-40, 40);
        
        // Use the new Y-range for the other objects
        const y = THREE.MathUtils.randFloat(-100, -20); 
        const z = 0;
        const baseScale = THREE.MathUtils.randFloat(3, 5);
        const depthScale = THREE.MathUtils.randFloat(0.9, 3);
        const finalScale = baseScale * depthScale;
        
        mesh.scale.setScalar(finalScale);
        mesh.position.set(x, y, z);
        mesh.rotation.set(
            Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI
        );
        
        scene.add(mesh);
    };

    // Create exactly one Hopf Fibration and store it separately
    if (createHopf) {
        const material = new THREE.MeshStandardMaterial({ color: activeColors[Math.floor(Math.random() * activeColors.length)] });
        const hopfMesh = createHopf(material);
        configureMesh(hopfMesh);
        
        // *** MODIFICATIONS FOR HOPF FIBRATION ***
        // Override the X and Y positions to constrain it to the desired ranges
        hopfMesh.position.x = THREE.MathUtils.randFloat(-20, 20);
        hopfMesh.position.y = THREE.MathUtils.randFloat(0, 20);
        
        hopfFibrationObject = hopfMesh; // Assign to its dedicated variable
    }

    // Loop to create the remaining objects
    for (let i = 0; i < MAX_OBJECTS; i++) {
        const randomCreationFunc = otherCreationFuncs[Math.floor(Math.random() * otherCreationFuncs.length)];
        const material = new THREE.MeshStandardMaterial({
            color: activeColors[Math.floor(Math.random() * activeColors.length)],
            wireframe: true,
            side: THREE.DoubleSide
        });
        const mesh = randomCreationFunc(material);
        configureMesh(mesh);
        backgroundObjects.push(mesh); // Add to the general array
    }
}

// --- THEME TOGGLE LOGIC ---
themeToggleButton.addEventListener('click', () => {
    bodyElement.classList.toggle('light-mode');
    const isLight = bodyElement.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    const targetColors = isLight ? LIGHT_MODE_COLORS : DARK_MODE_COLORS;

    backgroundObjects.forEach(obj => {
        if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
            const newColor = targetColors[Math.floor(Math.random() * targetColors.length)];
            obj.material.color.set(newColor);
        }
    });
});


// --- PAGE NAVIGATION LOGIC ---
function showSection(sectionId) {
    contentSections.forEach(section => {
        section.classList.toggle('active-section', section.id === sectionId);
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === sectionId);
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

// --- SCROLL & RESIZE HANDLERS ---
function handleScroll() {
    nav.classList.toggle('nav-stuck', window.scrollY > stickyPoint);
    if (!RENDER_BACKGROUND) return;
    const t = document.body.getBoundingClientRect().top;
    camera.position.y = t * CAMERA_TRAVEL_PER_PIXEL;
}
document.body.onscroll = handleScroll;

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    stickyPoint = nav.offsetTop - 20;
    setupScene();
}
window.addEventListener('resize', handleResize);

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    if (RENDER_BACKGROUND) {
        
        // Handle Hopf Fibration animation independently
        if (ANIMATE_HOPF_FIBRATION && hopfFibrationObject && hopfFibrationObject.userData.updateAnimation) {
            hopfFibrationObject.userData.updateAnimation();
        }

        // Handle other objects' animations independently
        if (ANIMATE_OTHER_OBJECTS) {
            backgroundObjects.forEach(obj => {
                obj.rotation.x += 0.001;
                obj.rotation.y += 0.0005;
                obj.rotation.z += 0.001;
            });
        }
        
        renderer.render(scene, camera);
    }
}

// --- INITIALIZATION ---
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        bodyElement.classList.add('light-mode');
    }
    
    setupScene();
    stickyPoint = nav.offsetTop - 20;
    
    showSection('home');
    handleScroll();
});

animate();