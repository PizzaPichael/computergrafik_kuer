// ---- Raycaster und Interaktion ----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function setupInteractions(scene, camera, gl) {
    // Event Listener
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let selectedObject = null;
    let isDragging = false;

    // DragPlane
    const dragPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const dragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const dragPlane = new THREE.Mesh(dragPlaneGeometry, dragPlaneMaterial);

    dragPlane.rotation.x = -Math.PI / 2;
    dragPlane.position.set(20, 10, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    dragPlane.name = "dragPlane";
    scene.add(dragPlane);


    // LimitPlane
    const limitPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const limitPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const limitPlane = new THREE.Mesh(limitPlaneGeometry, limitPlaneMaterial);

    limitPlane.rotation.x = Math.PI / 2;
    limitPlane.position.set(20, 25, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    limitPlane.name = "limitPlane";
    scene.add(limitPlane);

    // Init variables

    let cordObject = null;
    let previousWorldPointY = null;

    // Funktion zum Starten der Kordelbewegung
    function onMouseDown(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
        console.log("Objekte getroffen:", allIntersectedObjects);
        if (allIntersectedObjects.length > 0) {
            const firstIntersectedObject = allIntersectedObjects[0].object;
            const worldPoint = allIntersectedObjects[0].point;
            previousWorldPointY = worldPoint.y;

            if (firstIntersectedObject.userData.isCord) {
                cordObject = firstIntersectedObject;
                selectedObject = firstIntersectedObject;
                isDragging = true;
            }
        }

    }

    // Funktion zum Bewegen der Kordel
    let moveCurtains = false;
    let moveCamera = false;
    let worldYDifference = null;
    var lastCordY = null;

    console.log(scene.children);
    function onMouseMove(event) {
        if (!isDragging) {
            return;
        }

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const allIntersectedObjects = raycaster.intersectObjects(scene.children);

        if (allIntersectedObjects.length > 0) {
            const firstIntersectedObject = allIntersectedObjects[0].object; 
            const worldPoint = allIntersectedObjects[0].point;
            if (firstIntersectedObject.userData.isCord) {
                let wordlPointY = worldPoint.y;
                worldYDifference = wordlPointY - previousWorldPointY;
                firstIntersectedObject.position.y += worldYDifference;
                lastCordY = firstIntersectedObject.position.y;
                previousWorldPointY = wordlPointY;
            }
            if (firstIntersectedObject.name === "dragPlane" && allIntersectedObjects[1].object.name === "cord") {
                console.log("dragPlane contact");
                activateSpotlights();
                setTimeout(startMovements(), 2000);
                //console.log("moveCurtains set by dragPlane contact", moveCurtains);
                //Hier Event einfügen
            }
        }
        
    }

    // Funktion zum Stoppen der Kordelbewegung
    function onMouseUp(event) {
        if (!isDragging || !selectedObject) return;
    
        if (lastCordY != initCordYPos) {
            console.log("Ressetting cord position");
            cordObject.position.y = initCordYPos;
        }
    
        // Stoppe die Bewegung der Kordel
        isDragging = false;
        selectedObject = null;
    }

    // Activate theaterroom spotlights
    var spotLight1 = null;
    var spotLight2 = null;

    function activateSpotlights() { 
        spotLight1 = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);
        spotLight1.position.set(0, 25, 80); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
        spotLight1.castShadow = true;
        spotLight1.target = cello;
        scene.add(spotLight1);
        enableCameraMovement();
    }

    
    //Start movements
    function startMovements() {
        moveCurtains = true;  // Starte die Vorhangbewegung sofort
        
        // Verzögere die Kamerabewegung um 5 Sekunden
        setTimeout(function() {
            moveCamera = true;  // Starte die Kamerabewegung nach 5 Sekunden
        }, 2000);
    }

    //Function to move the curtains
    let curtainMovementSpeed = 0.05;
    let curtainRightEndPosition = 62;
    let curtainLeftEndPosition = -28;

    function moveCurtainsFunction() {
        if (!moveCurtains) return;
        
        // Berechne die Differenz zwischen der aktuellen und der Zielposition
        if (curtainRight.position.x < curtainRightEndPosition && curtainLeft.position.x > curtainLeftEndPosition) {
            curtainRight.position.x += curtainMovementSpeed;
            curtainLeft.position.x -= curtainMovementSpeed;
        } else {
            moveCurtains = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
        }
    }

    //Function to move camera after Curtain movement
    let cameraMovementSpeed = 0.08;
    let cameraEndPosition = 45;
    
    function moveCameraForward() {
        if (!moveCamera) return;
        
        // Berechne die Differenz zwischen der aktuellen und der Zielposition
        if (camera.position.z > cameraEndPosition) {
            camera.position.z -= cameraMovementSpeed;
        } else {
            moveCamera = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
            enableCameraMovement();
            hideTheaterroom();
        }
    }

    //Hide Theaterroom
    function hideTheaterroom() {
        cube.visible = false;
        theaterChairs.visible = false;
        curtainLeft.visible = false;
        curtainRight.visible = false;
        curtainRope.visible = false;
    }
}

//----Enable camera control by mouse----
var trackballControls
export function enableCameraMovement() {
    trackballControls = initTrackballControls(camera, gl);
}

export function getTrackBallControls() {
    return trackballControls;
}

export function updateTrackBallControls(clockInput) {
    trackballControls.update(clockInput);
}
