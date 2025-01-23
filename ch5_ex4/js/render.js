/**
 * @fileoverview This file contains the render loop for the scene.
 */

import { 
    getTrackBallControls, 
    updateTrackBallControls, 
    moveCurtainsFunction,
    moveCameraForward,
    checkInstrumentsPosition,
    rotatePortal
} from "./interactions.js";

/**
 * Function to loop through the rendering of the scene.
 * 
 * The function is called in the {@link app.js} file.
 * The function is responsible for rendering the scene and updating the camera.
 * The function contains the functions {@link resizeGLToDisplaySize} and {@link draw}.
 * 
 * The function is mostly taken from the exercise we did.
 * 
 * @param scene The scene to be rendered.
 * @param camera The camera to be updated.
 * @param gl The renderer to render the scene.
 */
export function renderLoop(scene, camera, gl) {
    var stats = initStats();
    var clock = new THREE.Clock();

    /**
     * Function to resize the canvas to the display size.
     * The function is called in the draw function.
     * 
     * @param gl The renderer to resize.
     * @returns A boolean value indicating if the canvas needs to be resized.
     */
    function resizeGLToDisplaySize(gl) {
        const canvas = gl.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width != width || canvas.height != height;
        if (needResize) {
            gl.setSize(width, height, false);
        }
        return needResize;
    }

    let trackballControls;

    /**
     * The draw function that is called in a loop.
     * The function is responsible for rendering the scene and updating
     * the aspectratio of the camera as well as its projection matrix.
     * 
     * The function also updates the trackball controls and the stats
     * 
     * The fucntion continously calls the functions 
     * {@link updateTrackBallControls},
     * {@link rotatePortal}, 
     * {@link moveCurtainsFunction}, 
     * {@link moveCameraForward}, 
     * {@link checkInstrumentsPosition},
     * {@link render} function of the renderer,
     * {@link requestAnimationFrame} function using itself as parameter.
     * 
     * @param time The time in milliseconds. 
     */
    function draw(time){
        time *= 0.001;
        trackballControls = getTrackBallControls();

        if(trackballControls) {
            updateTrackBallControls(clock.getDelta());
        }
        
        stats.update();

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        
        rotatePortal();
        moveCurtainsFunction();
        moveCameraForward();
        checkInstrumentsPosition();

        gl.render(scene, camera);
        
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}