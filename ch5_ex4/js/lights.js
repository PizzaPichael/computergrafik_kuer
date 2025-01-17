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