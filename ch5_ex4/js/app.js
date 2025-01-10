import { loadObjects } from './loaders.js';
import { setupInteractions } from './interactions.js';
import { setupAudio } from './audio.js';
import { setupGui } from './gui.js';
import { renderLoop } from './render.js';
import { loadLights } from './lights.js';


var outCanvas;
var outGL;
var outCamera;
var outScene;

main();

export function getCanvas() {
    return outCanvas;
}  

export function getGL() {
    return outGL;
}

export function getCamera() {
    return outCamera;
}

export function getScene() {
    return outScene;
}


async function main() {
    console.log("Starting main function...");
    console.log("Creating context");
    //----Create context/renderer----
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    gl.shadowMap.enabled = true;

    outCanvas = canvas;

    console.log("Setting up camera");
    //----Create camera----
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    const initCameraPosZ = 80;
    camera.position.set(0, 18, initCameraPosZ); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    camera.rotation.x = THREE.Math.degToRad(-10); // Set the pitch (in degrees)

    outCamera = camera;

    console.log("Setting up scene");
    //----Create scene----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);   //0.3, 0.5, 0.8         0x000000
    const tripod = new THREE.AxesHelper(50);
    tripod.name = "tripod";
    scene.add(tripod);

    outScene = scene;

    console.log("Main: Loading objects");
    // Objekte laden
    await loadObjects(scene, gl);

    // Licht laden
    await loadLights(scene);

    // Interaktionen hinzufügen
    await setupInteractions(scene, camera, gl);

    // Audio hinzufügen
    setupAudio(camera);

    // GUI hinzufügen
    await setupGui();

    // Render-Schleife starten
    renderLoop(scene, camera, gl);
}
