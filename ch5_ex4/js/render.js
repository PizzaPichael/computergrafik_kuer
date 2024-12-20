import { 
    enableCameraMovement, 
    getTrackBallControls, 
    updateTrackBallControls, 
    getRaycaster, 
    getMouse,
    moveCurtainsFunction,
    moveCameraForward
} from "./interactions.js";

export function renderLoop(scene, camera, gl) {
    //----Add the stats----
    var stats = initStats();

    //----Enable clock for later use of getElapsedTime() or similar----
    var clock = new THREE.Clock();

    //----Update resize----
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

    //enableCameraMovement();
    let raycaster = getRaycaster();
    let trackballControls = getTrackBallControls();
    let mouse = getMouse();

    //----Draw----
    function draw(time){
        time *= 0.001;

        //setTimeout(enableCameraMovement, 10000); // Enable camera movement after X milliseconds (1s = 1000ms)
        
        if(trackballControls) {
            updateTrackBallControls(clock.getDelta());
        }
        
        stats.update();

        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        //Raycaster für Mausinteraktion
        raycaster.setFromCamera(mouse, camera);

        moveCurtainsFunction();
        moveCameraForward();

        //Aufgb b)
        // rotate the cube around its axes
        /*cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // rotate the sphere around its axes
        sphere.rotation.x += controls.rotationSpeed;
        sphere.rotation.y += controls.rotationSpeed;
        sphere.rotation.z += controls.rotationSpeed;

        // make stuff move on z axis
        sphere.position.z = -controls.positionZ;
        cube.position.z = -controls.positionZ;*/

        gl.render(scene, camera);
        
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}