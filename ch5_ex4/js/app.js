/**
 *  @fileoverview This file is the main entry point of the application.
 * Authorship of this and all other .js files is as follows:
 * @author Michael Kaup, s0589545
 */
import { loadObjects } from './loaders.js';
import { setupInteractions } from './interactions.js';
import { setupAudio } from './audio.js';
import { setupGui } from './gui.js';
import { renderLoop } from './render.js';
import { loadLights } from './lights.js';

main();

/**
 * Main function
 * 
 * This function is the main entry point of the application.
 * It sets up the context, camera and scene.
 * This is almost exactly the same as in the exercise.
 * 
 * Then, it sets up all the other .js files.
 * Certain setup functions are async.
 * This should prevent objects not being loaded when they are called.
 */
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

    //----Create scene----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);   //0.3, 0.5, 0.8         0x000000
    const tripod = new THREE.AxesHelper(50);
    tripod.name = "tripod";
    tripod.visible = false;
    scene.add(tripod);

    //----Setting up remaining .js files----
    await loadObjects(scene, gl);
    await loadLights(scene);
    await setupInteractions(scene, camera, gl);
    setupAudio(camera);
    //await setupGui();

    //----Start render loop----
    renderLoop(scene, camera, gl);
}
