import { 
    getCello, 
    getCurtainRope, 
    getCurtainLeft, 
    getCurtainRight, 
    getTheaterRoom, 
    getTheaterChairs, 
    getInstrumentActivationPlane, 
    getPiano, 
    getVioline, 
    getPortalPlane, 
    getCanvasPlane,
    getPlankLeft,
    getPlankRight 
} from "./loaders.js";

import { 
    updateStatus, 
    addControlExplanation 
} from "./gui.js";

import { setupGui } from "./gui.js";

// ---- Raycaster und Interaktion ----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//----Global variables----
var scene;
var camera;
var gl;
var cello;
var piano;
var violine;
var cord;
var instrumentActivationPlane;
var trackballControls;
var mouseMoveSituation = "";
var instrumentToMove = null;

let theaterRoom;
let theaterChairs;
let curtainLeft;
let curtainRight;
let curtainRope;
let portalPlane;
let canvasPlane;
let plankLeft;
let plankRight;
let initCordYPos;

export function getRaycaster() {
    return raycaster;
}

export function getMouse() {
    return mouse;
}

//----Setup function----
export async function setupInteractions(inScene, inCamera, inGl) {
    scene = inScene;
    camera = inCamera;
    gl = inGl;

    // Event Listener for dragging the curtainrope
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    createDragPlane(scene);
    createLimitPlane(scene);
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
    initCordYPos = curtainRope.position.y;

    // Initialising instrumentActivationPlane
    instrumentActivationPlane = getInstrumentActivationPlane();
    cello = getCello();
    piano = getPiano();
    violine = getVioline();

    // Initialising portalPlane
    portalPlane = getPortalPlane();
    canvasPlane = getCanvasPlane();

    // Initialising planks
    plankLeft = getPlankLeft();
    plankRight = getPlankRight();
    /*
    hideTheaterroom();
    enableCameraMovement();
    cameraInFinalPosition = true;*/

    toggleOverlay(true);
    updateOverlayText('Pull the cord to start! Make sure to keep the mouse over the cord while dragging.');

}

let outDragPlane;
function createDragPlane(scene) {
    // DragPlane, that triggers the curtain movement
    const dragPlaneGeometry = new THREE.PlaneGeometry(100, 50);
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
    // LimitPlane, that limits the movement of the cord, so that it can only be moved upwards to a certain amaount
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

let outInstrumentDragPlane;
function createInstrumentDragPlane(scene) {
    // Plane, that the isntruments can be moved on, once they are selected. Added when instrument is selceted, removed once the instrument is let go.
    const instrumentDragPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const instrumentDragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const instrumentDragPlane = new THREE.Mesh(instrumentDragPlaneGeometry, instrumentDragPlaneMaterial);

    instrumentDragPlane.rotation.x = -Math.PI / 2;
    instrumentDragPlane.position.set(0, 3, 0); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    instrumentDragPlane.name = "instrumentDragPlane";
    outInstrumentDragPlane = instrumentDragPlane;
    scene.add(instrumentDragPlane);
}


// Funktion zum Starten der Kordelbewegung
let cordObject = null;
let previousCordWorldPointY = null;
let selectedObject = null;
let isDragging = false;

function onMouseDown(event) {
    console.log("onMouseDown called");
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

// Funktion zum Abfragen der x- und y-Koordinaten des Raycasters, geschrieben von Copilot
function getRaycasterCoords(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}

// Funktion zum Bewegen der Kordel
let moveCurtains = false;
let moveCamera = false;
let worldCordYDifference = null;
let lastCordY = null;

let previousInstrumentWorldPointX = null;
let previousInstrumentWorldPointZ = null;
let instrumentsY = 2.5;


function onMouseMove(event) {
    const mouseCoords = getRaycasterCoords(event);
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
                updateOverlayText(''); // Remove overlay text
                activateSpotlights();
                setTimeout(startMovements(), 2000);
                //console.log("moveCurtains set by dragPlane contact", moveCurtains);
                //Hier Event einfügen
            }
        }
    } else if(mouseMoveSituation == "instrument") {
        raycaster.setFromCamera(mouseCoords, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if(intersects.length > 0) {
            const intersect = intersects[0];
            const worldPoint = intersect.point;

            instrumentToMove.position.x = worldPoint.x;
            instrumentToMove.position.y = instrumentsY;
            instrumentToMove.position.z = worldPoint.z;

            previousInstrumentWorldPointX = worldPoint.x;
            previousInstrumentWorldPointZ = worldPoint.z;
        }
    }
    
    
}

// Funktion zum Stoppen der Kordelbewegung
function onMouseUp(event) {
    //TODO fix the cord reset
    if (!isDragging || !selectedObject) return;
    if (initCordYPos != cordObject.position.y) {
        mouseMoveSituation = "";
        cordObject.position.y = initCordYPos;
    }

    // Stoppe die Bewegung der Kordel
    isDragging = false;
    selectedObject = null;
}

let amountOfClicks = 0;
function onMouseClick(event) {
    if(theaterRoomHidden) {
        amountOfClicks++;
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    
        raycaster.setFromCamera(mouse, camera);
        if(amountOfClicks == 1) {
            const allIntersectedObjects = raycaster.intersectObjects(scene.children, true);
            if (allIntersectedObjects.length > 0) {
                const firstIntersectedObject = allIntersectedObjects[0].object;
                if (firstIntersectedObject.userData.selectable) {
                    createInstrumentDragPlane(scene);
                    instrumentToMove = firstIntersectedObject;
                    previousInstrumentWorldPointX = instrumentToMove.position.x;
                    previousInstrumentWorldPointZ = instrumentToMove.position.y;
                    mouseMoveSituation = "instrument";
                } else {
                    amountOfClicks = 0;
                }
            }
        } else {
            // Let go of instrument
            console.log("Removing outInstrumentDragPlane...");
            removeObjectFromScene(outInstrumentDragPlane);
            mouseMoveSituation = "";
            amountOfClicks = 0;
        }
    }
}

// Activate theaterroom spotlights
var spotLight1 = null;

function activateSpotlights() { 
    spotLight1 = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 0.5, 2);
    spotLight1.position.set(0, 25, 80); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    spotLight1.castShadow = true;
    console.log("Setting target.")
    spotLight1.target = instrumentActivationPlane;
    console.log("Target set: ", spotLight1.target);
    scene.add(spotLight1);
}

//Start movements
function startMovements() {
    moveCurtains = true;  // Starte die Vorhangbewegung sofort
    
    // Verzögere die Kamerabewegung um 5 Sekunden
    setTimeout(function() {
        moveCamera = true;  // Starte die Kamerabewegung nach 5 Sekunden
    }, 5000);
}

//Function to move the curtains
let curtainMovementSpeed = 0.03;
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

export async function moveCameraForward() {
    if(cameraInFinalPosition && !theaterRoomHidden) {
        console.log("Calling hideTheaterroom...");
        hideTheaterroom();
    }

    if (!moveCamera) return;
    
    if (camera.position.z > cameraEndPosition) {
        camera.position.z -= cameraMovementSpeed;
    } else {
        moveCamera = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
        moveCurtains = false; // Stoppe die Vorhangbewegung
        cameraInFinalPosition = true;
        panCameraToZero();
        setupGui();
        if(cameraPanned) {
            console.log("Current camera position: ", camera.position);
            console.log("Current camera rotation: ", camera.rotation);
            setTimeout(() => {
                console.log("Calling enableCameraMovement...");
                enableCameraMovement();
            },2000);
        }
    }
}

let cameraPanned = false;
export function panCameraToZero() {
    if(cameraInFinalPosition && !cameraPanned) {
        let angleToAchieve =-0.38050637711236873;
        camera.rotation.x = angleToAchieve;
        while(camera.rotation.x > angleToAchieve) {
            camera.rotation.x -= 0.001;
            setTimeout(() => {
            }, 500);       }
        cameraPanned = true; 
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
    removeObjectFromScene(theaterRoom);
    removeObjectFromScene(theaterChairs);
    removeObjectFromScene(curtainLeft);
    removeObjectFromScene(curtainRight);
    removeObjectFromScene(curtainRope);
    removeObjectFromScene(spotLight1);
    removeObjectFromScene(outDragPlane);
    removeObjectFromScene(outLimitPlane);
    removeObjectFromScene(portalPlane);
    removeObjectFromScene(canvasPlane);
    removeObjectFromScene(plankLeft);
    removeObjectFromScene(plankRight);
    theaterRoomHidden = true;
}

export function rotatePortal() {
    portalPlane.rotation.z -= 0.01;
}

//----Enable camera control by mouse----
export function enableCameraMovement() {
    if(!trackballControls) {
        console.log("Enabling CameraMovement")
        trackballControls = initTrackballControls(camera, gl);
        console.log("Camera rotation after enabling movement: ", camera.rotation);        
        explainControls('all');
    }
    
}

let controlExplanationAdded = false;
export async function explainControls(controlType) {
    console.log("Explaining controls...");
    if(controlType == 'mouse' || controlType == 'all') {
        await updateOverlayText('You can now move the camera by clicking and dragging the mouse.', true, 4000);
        await updateOverlayText('You can also zoom in and out by scrolling the mouse wheel.', true, 4000);
    } 
    if(controlType == 'music' || controlType == 'all') {
        await updateOverlayText('Please enable your computers sound.', true, 4000);
        await updateOverlayText('You can start playing music by selecting the "Play Music" button in the upper right controls.', true, 5000);
        await updateOverlayText('If you wish to pause or stop the music entirely, you can do that with the "Pause Music" and "Stop Music" buttons in the upper right controls.', true, 6000);
    } 
    if(controlType == 'instruments' || controlType == 'all') {
        await updateOverlayText('If you want to mute an instrument, click on it once, move it off stage and click on it again. ', true, 5000);
        await updateOverlayText('To unmute the instrument, bring it back on stage by clicking on it, dragging it on stage and clicking on it again.', true, 6000);
    }
    await updateOverlayText('');
    if(!controlExplanationAdded) {
        addControlExplanation();
        controlExplanationAdded = true;
    }
}

export function getTrackBallControls() {
    //console.log("Called getTrackBallControls")
    return trackballControls;
}

export function updateTrackBallControls(clockInput) {
    trackballControls.update(clockInput);
}

function isObjectWithinActivationPlane(object) {
    const planePosition = instrumentActivationPlane.position;
    const planeRadius = instrumentActivationPlane.geometry.parameters.radius;

    const distance = Math.sqrt(
        Math.pow(object.position.x - planePosition.x, 2) +
        Math.pow(object.position.z - planePosition.z, 2)
    );

    return distance <= planeRadius;
}

export function checkInstrumentsPosition() {
    if(cameraInFinalPosition) {
        if(isObjectWithinActivationPlane(cello)) {
            updateStatus('1', true);
        } else {
            updateStatus('1', false);
        }

        if(isObjectWithinActivationPlane(piano)) {
            updateStatus('2', true);
        } else {
            updateStatus('2', false);
        }

        if(isObjectWithinActivationPlane(violine)) {
            updateStatus('3', true);
        } else {
            updateStatus('3', false);
        }

    }

}

function updateOverlayText(text, delay=false, delaytime=0) {
    console.log("Updating overlay text: ", text);
    return new Promise((resolve, reject) => {
        try {
            const overlay = document.getElementById('overlay');
            if (overlay) {
                if(!delay) {
                    overlay.textContent = text;
                    resolve();
                } else if(delay){
                    overlay.textContent = text;
                    setTimeout(() => {
                        resolve();
                    }, delaytime);
                }
            } else {
                reject("Overlay element not found");
            }
        } catch (error) {
            console.error("Error in updateOverlayText:", error);
            reject(error);
        }
    });
}

// Funktion zum Ein- und Ausblenden des Overlays
function toggleOverlay(visible) {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = visible ? 'block' : 'none';
    }
    console.log("Overlay toggled: ", overlay.style.display);
}

//TODO add Spotlights to the instrumnnts when they are on stage