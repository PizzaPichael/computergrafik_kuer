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
var mouseMoveSituation = "";
var instrumentToMove = null;

let theaterRoom = getTheaterRoom();
let theaterChairs = getTheaterChairs();
let curtainLeft = getCurtainLeft();
let curtainRight = getCurtainRight();
let curtainRope = getCurtainRope();

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

    // Event Listener for dragging the curtainrope
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    createDragPlane(scene);
    createLimitPlane(scene);
    cello = getCello();
    cord = getCurtainRope();

    // Event Listener for moving the instruments
    window.addEventListener('click', onMouseClick);

    // Event Listener for both cases
    window.addEventListener('mousemove', onMouseMove);

    // Initialising theaterRoom objects
    theaterRoom = getTheaterRoom();
    theaterChairs = getTheaterChairs();
    curtainLeft = getCurtainLeft();
    curtainRight = getCurtainRight();
    curtainRope = getCurtainRope();

    hideTheaterroom();
}

let outDragPlane;
function createDragPlane(scene) {
    // DragPlane
    const dragPlaneGeometry = new THREE.PlaneGeometry(100, 50);
    const dragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: true, color: 0xFFC0CB });
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
let previousCordWorldPointY = null;
let selectedObject = null;
let isDragging = false;

function onMouseDown(event) {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
    console.log("onMouseDown sagt: 'Objekte getroffen:", allIntersectedObjects, "'");
    if (allIntersectedObjects.length > 0) {
        const firstIntersectedObject = allIntersectedObjects[0].object;
        const worldPoint = allIntersectedObjects[0].point;
        previousCordWorldPointY = worldPoint.y;

        if (firstIntersectedObject.userData.isCord) {
            cordObject = firstIntersectedObject;
            selectedObject = firstIntersectedObject;
            isDragging = true;
            mouseMoveSituation = "cord";
        }
    }

}

// Funktion zum Bewegen der Kordel
let moveCurtains = false;
let moveCamera = false;
let worldCordYDifference = null;
let lastCordY = null;
let previousInstrumentWorldPointX = null;
let previousInstrumentWorldPointY = null;
let worldInstrumentXDifference = null;
let worldInstrumentYDifference = null;


function onMouseMove(event) {
    if(mouseMoveSituation == "cord") {
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
                worldCordYDifference = wordlPointY - previousCordWorldPointY;
                firstIntersectedObject.position.y += worldCordYDifference;
                lastCordY = firstIntersectedObject.position.y;
                previousCordWorldPointY = wordlPointY;
            }
            if (firstIntersectedObject.name === "dragPlane" && allIntersectedObjects[1].object.name === "cord") {
                console.log("dragPlane contact");
                activateSpotlights();
                setTimeout(startMovements(), 2000);
                //console.log("moveCurtains set by dragPlane contact", moveCurtains);
                //Hier Event einfügen
            }
        }
    } else if(mouseMoveSituation == "instrument") {
        console.log("Moving instrument...");
        console.log("instrumentToMove: ", instrumentToMove);
        const worldPoint = instrumentToMove.position;
        let worldPointX = worldPoint.x;
        let wordlPointY = worldPoint.y;
        worldInstrumentXDifference = worldPointX - previousInstrumentWorldPointX;
        worldInstrumentYDifference = wordlPointY - previousInstrumentWorldPointY;
        instrumentToMove.position.x += worldInstrumentXDifference;
        instrumentToMove.position.y += worldInstrumentYDifference;
        previousInstrumentWorldPointX = worldPointX;
        previousInstrumentWorldPointY = wordlPointY;

        //TODO implement instrument movement
    }
    
    
}

// Funktion zum Stoppen der Kordelbewegung
function onMouseUp(event) {
    //TODO fix the cord reset
    if (!isDragging || !selectedObject) return;

    if (lastCordY != cordObject.position.y) {
        mouseMoveSituation = "";
        console.log("Ressetting cord position to ", cordObject.position.y);
        cordObject.position.y = initCordYPos;
    }

    // Stoppe die Bewegung der Kordel
    isDragging = false;
    selectedObject = null;
}

let amountOfClicks = 0;
function onMouseClick(event) {
    if(theaterRoomHidden) {
        console.log("MouseClick amountOfClicks:", amountOfClicks);
        amountOfClicks++;
        console.log("MouseClick amountOfClicks:", amountOfClicks);
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    
        raycaster.setFromCamera(mouse, camera);
        if(amountOfClicks == 1) {
            const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
            console.log("MouseClick Objekte getroffen:", allIntersectedObjects);
            if (allIntersectedObjects.length > 0) {
                const firstIntersectedObject = allIntersectedObjects[0].object;
                console.log("MouseClick firstIntersectedObject:", firstIntersectedObject);
                console.log("MouseClick firstIntersectedObject.userData.selectable:", firstIntersectedObject.userData.selectable);
                if (firstIntersectedObject.userData.selectable) {
                    console.log("MousClick setting instrumentToMove to firstIntersectedObject");
                    instrumentToMove = firstIntersectedObject;
                    previousInstrumentWorldPointX = instrumentToMove.position.x;
                    console.log("MouseClick previousInstrumentWorldPointX:", previousInstrumentWorldPointX);
                    previousInstrumentWorldPointY = instrumentToMove.position.y;
                    console.log("MouseClick previousInstrumentWorldPointY:", previousInstrumentWorldPointY);
                    mouseMoveSituation = "instrument";
                    console.log("MouseClick mouseMoveSituation set to ", mouseMoveSituation);
                } else {
                    console.log("No selectable object clicked.");
                    amountOfClicks = 0;
                }
            }
        } else {
            // Let go of instrument
            mouseMoveSituation = "";
            console.log("MouseClick mouseMoveSituation set to ", mouseMoveSituation);
            amountOfClicks = 0;
            console.log("MouseClick amountOfClicks:", amountOfClicks);
        }
    }
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
let curtainMovementSpeed = 0.07;
let curtainRightEndPosition = 62;
let curtainLeftEndPosition = -28;
var cameraInFinalPosition = false;

export async function moveCurtainsFunction() {
    var curtainLeft = await getCurtainLeft();
    var curtainRight = getCurtainRight();
    if (!moveCurtains) return;
    
    // Berechne die Differenz zwischen der aktuellen und der Zielposition
    if (curtainRight.position.x < curtainRightEndPosition && curtainLeft.position.x > curtainLeftEndPosition) {
        curtainRight.position.x += curtainMovementSpeed;
        curtainLeft.position.x -= curtainMovementSpeed;
    } 
}

//Function to move camera after Curtain movement
let cameraMovementSpeed = 0.2;
let cameraEndPosition = 45;
let theaterRoomHidden = false;

export function moveCameraForward() {
    if(cameraInFinalPosition && !theaterRoomHidden) {
        console.log("Calling hideTheaterroom...");
        hideTheaterroom();
    }

    if (!moveCamera) return;
    
    // Berechne die Differenz zwischen der aktuellen und der Zielposition
    if (camera.position.z > cameraEndPosition) {
        camera.position.z -= cameraMovementSpeed;
    } else {
        moveCamera = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
        moveCurtains = false; // Stoppe die Vorhangbewegung
        cameraInFinalPosition = true;
        console.log("Calling enableCameraMovement...");
        enableCameraMovement();
    }
}

// Funktion zum Entfernen eines Objekts aus der Szene geschrieben von Copilot
function removeObjectFromScene(object) {
    if (object && object.parent) {
        object.parent.remove(object);
    }
}

//Hide Theaterroom
function hideTheaterroom() {
    console.log("Hiding theaterroom...");
    /*theaterRoom.visible = false;
    theaterChairs.visible = false;
    curtainLeft.visible = false;
    curtainRight.visible = false;
    curtainRope.visible = false;
    theaterRoomHidden = true;*/
    removeObjectFromScene(theaterRoom);
    removeObjectFromScene(theaterChairs);
    removeObjectFromScene(curtainLeft);
    removeObjectFromScene(curtainRight);
    removeObjectFromScene(curtainRope);
    removeObjectFromScene(spotLight1);
    removeObjectFromScene(outDragPlane);
    removeObjectFromScene(outLimitPlane);
    theaterRoomHidden = true;
}

//----Enable camera control by mouse----
export function enableCameraMovement() {
    if(!trackballControls) {
        console.log("Enabling CameraMovement")
        trackballControls = initTrackballControls(camera, gl);
        console.log("CameraMovement enabled")
    }
    //console.log("TrackballControls set to: ", trackballControls);
}

export function getTrackBallControls() {
    //console.log("Called getTrackBallControls")
    return trackballControls;
}

export function updateTrackBallControls(clockInput) {
    trackballControls.update(clockInput);
}

export function selectIsntrument() {

}
