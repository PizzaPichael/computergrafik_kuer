/**
 *  @fileoverview This file contains the functions to load the lights in the scene.
 */
import { getInstrumentActivationPlane } from "./loaders.js";

/**
 * Load the ambient lights in the scene.
 * @param scene The scene to add the lights to.
 */
export async function loadLights(scene) {   
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = getInstrumentActivationPlane();
    console.log("Light target: ", light.target);
    light.position.set(0, 30, 30);
    light.name = "directionalLight";
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);
}

// Activate theaterroom spotlights
let outSpotLight;
/**
 * Creates a spotlight shining on the theater canvas.
 * @param scene The scene to add the spotlight to.
 * @param instrumentActivationPlane The plane that represents the theater canvas.
 */
export function activateSpotlight(scene, inTarget) { 
    const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);
    spotLight.position.set(0, 25, 80); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    spotLight.castShadow = true;
    spotLight.target = inTarget; //instrumentActivationPlane
    outSpotLight = spotLight;
    scene.add(spotLight);
}

/**
 * Getter for the spotlight.
 * @returns The spotlight.
 */
export function getSpotlight() {
    return outSpotLight;
}