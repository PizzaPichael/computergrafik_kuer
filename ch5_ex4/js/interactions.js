import { getScene, getCamera } from "./app.js";
import { getCello, getCurtainRope, getCurtainLeft, getCurtainRight, getTheaterRoom, getTheaterChairs } from "./loaders.js";

// ---- Raycaster und Interaktion ----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var scene;
var camera;
var gl;
var cello;
var cord;
var trackballControls;

export function getRaycaster() {
    return raycaster;
}

export function getMouse() {
    return mouse;
}

//----Setup function----
export async function setupInteractions(inScene, inCamera, inGl, initTrackballControls) {
    scene = inScene;
    camera = inCamera;
    gl = inGl;
    trackballControls = initTrackballControls;

    // Event Listener
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    createDragPlane(scene);

    createLimitPlane(scene);
    console.log("Getting cello...")
    cello = getCello();
    console.log("Got cello: ", cello);
    console.log("Getting cord...")
    cord = getCurtainRope();
    console.log("Got cord: ", cord);
}

let outDragPlane;
function createDragPlane(scene) {
    // DragPlane
    const dragPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const dragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const dragPlane = new THREE.Mesh(dragPlaneGeometry, dragPlaneMaterial);

    dragPlane.rotation.x = -Math.PI / 2;
    dragPlane.position.set(20, 10, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    dragPlane.name = "dragPlane";
    outDragPlane = dragPlane;
    scene.add(dragPlane);
}

export function getDragPlane() {
    return outDragPlane;
}

let outLimitPlane;
function createLimitPlane(scene) {
    // LimitPlane
    const limitPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const limitPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const limitPlane = new THREE.Mesh(limitPlaneGeometry, limitPlaneMaterial);

    limitPlane.rotation.x = Math.PI / 2;
    limitPlane.position.set(20, 25, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    limitPlane.name = "limitPlane";
    outLimitPlane = limitPlane;
    scene.add(limitPlane);
}

export function getLimitPlane() {
    return outLimitPlane;
}


// Funktion zum Starten der Kordelbewegung
let cordObject = null;
let previousWorldPointY = null;
let selectedObject = null;
let isDragging = false;

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

    if (lastCordY != cordObject.position.y) {
        console.log("Ressetting cord position to ", cordObject.position.y);
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
    console.log("Setting target.")
    spotLight1.target = cello;
    console.log("Target set: ", spotLight1.target);
    scene.add(spotLight1);
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

export function moveCurtainsFunction() {
    var curtainLeft = getCurtainLeft();
    var curtainRight = getCurtainRight();
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
let cameraMovementSpeed = 0.2;
let cameraEndPosition = 45;

export function moveCameraForward() {
    if (!moveCamera) return;
    
    // Berechne die Differenz zwischen der aktuellen und der Zielposition
    if (camera.position.z > cameraEndPosition) {
        camera.position.z -= cameraMovementSpeed;
    } else {
        moveCamera = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
        console.log("Calling enableCameraMovement...");
        enableCameraMovement();
        console.log("Calling hideTheaterroom...");
        hideTheaterroom();
    }
}

//Hide Theaterroom
function hideTheaterroom() {
    console.log("Hiding theaterroom...");
    let theaterRoom = getTheaterRoom();
    let theaterChairs = getTheaterChairs();
    let getCurtainLeft = getCurtainLeft();
    let getCurtainRight = getCurtainRight();
    let getCurtainRope = getCurtainRope();
    theaterRoom.visible = false;
    theaterChairs.visible = false;
    getCurtainLeft.visible = false;
    getCurtainRight.visible = false;
    getCurtainRope.visible = false;
}

//----Enable camera control by mouse----
export function enableCameraMovement() {
    console.log("Enabling CameraMovement")
    trackballControls = initTrackballControls(camera, gl);
    console.log("CameraMovement enabled")
    //console.log("TrackballControls set to: ", trackballControls);
}

export function getTrackBallControls() {
    //console.log("Called getTrackBallControls")
    return trackballControls;
}

export function updateTrackBallControls(clockInput) {
    trackballControls.update(clockInput);
}
