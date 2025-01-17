/**
 *  @fileoverview This file contains all the functions to load the objects for the scene.
 * 
 * The function for loading the objects is mainly the same as in the exercise.
 * The addition of promises to it to enable asynchronous creation has been proposed by ChatGPT.
 * It also gave an exmaple of how to add the promis efunctionality.
 * This example has been edited to cater to the needs of the program.
 * 
 * The functions for basic geometries and planes have also been adopted from the exercise.
 * 
 * links(-)/rechts(+), oben/unten, vorne(+)/hinten(-) have been added throuhgout the functions 
 * to make it easier to understand the positioning of the objects.
 */
var textureLoader;
var objectLoader;

/**
 * Sets up and loads all objects for the scene.
 * 
 * Most objects are a bit larger and take time to load, 
 * so async is used to ensure that the objects are loaded before they can be called.
 * Outputs all the objects in the console after they are loaded for debugging purposes.
 * 
 * @param scene The scene to add the objects to.
 */
export async function loadObjects(scene) {
    console.log("Loaders: Loading objects...");

    textureLoader = new THREE.TextureLoader();
    objectLoader = new THREE.OBJLoader();

    //----Create Objects in the Scene----
    createPlaneForInstrumentActivation(scene);
    await createBackgroundSphere(scene);
    await createTheaterRoom(scene);
    await createTheaterChairs(scene);
    await createCurtainLeft(scene);
    await createCurtainRight(scene);
    await createCurtainRope(scene);
    await createWoodenPlankLeft(scene);
    await createWoodenPlankRight(scene);
    createCanvasPlane(scene);
    createPortalPlane(scene);
    await createStage(scene);
    await createStageRim(scene);
    await createPiano(scene);
    await createCello(scene);
    await createVioline(scene);
    console.log("Objects: ");
    console.log("Plane: ", outInstrumentActivationPlane);
    console.log("BackgroundSphere: ", outBackgroundSphere);
    console.log("TheaterRoom: ", outTheaterRoom);
    console.log("TheaterChairs: ", theaterChairs);
    console.log("CurtainLeft: ", curtainLeft);
    console.log("CurtainRight: ", curtainRight);
    console.log("CurtainRope: ", curtainRope);
    console.log("Stage: ", stage);
    console.log("StageRim: ", stageRim);
    console.log("Piano: ", piano);
    console.log("Cello: ", cello);
    console.log("Violine: ", violine);
    console.log("Objects loaded!");
}

//----Variables for all the objects to be saved in for reference----
let outInstrumentActivationPlane; 
let outBackgroundSphere;
let outTheaterRoom;
let theaterChairs;
let curtainLeft;
let curtainRight;
let curtainRope;
let outCanvasPlane;
let outPortalPlane;
let stage;
let stageRim;
let piano;
let cello;
let violine;
let plankLeft;
let plankRight;

//----Implementations of functions to load all objects----
/**
 * Creates a plane, that the instruments have to be placed on to be unmuted.
 * 
 * @param scene The scene to add the plane to. 
 */
function createPlaneForInstrumentActivation(scene) {
    const radius = 18; 
    const segments = 32; 
    const planeGeometry = new THREE.CircleGeometry(radius, segments);

    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2; 
    plane.receiveShadow = false;
    plane.position.set(0, 2.6, 0);
    plane.name = "circularPlane";
    plane.visible = false;
    outInstrumentActivationPlane = plane;
    scene.add(plane);
}

/**
 * Creates the BackgroundSphere that is used as a background for the scene.
 * As the texture image is a bit larger, it is loaded as a promise 
 * to ensure that it is loaded before it is used.
 */
async function createBackgroundSphere(scene) {
    console.log("Spehre function: starting");

    // Umwandlung von textureLoader.load in ein Promise
    const texture = await new Promise((resolve, reject) => {
        textureLoader.load(
            './textures/starmap_16k.jpg',
            (loadedTexture) => {
                console.log("Sphere: loading texture");
                resolve(loadedTexture);
            },
            undefined,
            (error) => {
                console.error("Error loading texture:", error);
                reject(error);
            }
        );
    });

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,   //Place texture on the inside of the sphere
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.userData.selectable = false;     //Custom variable, to decide which objects can be selected and which can not be selected
    sphere.name = "backgroundSphere";   //Naming the object appropriately for identification purposes
    outBackgroundSphere = sphere;   //Saving the object in a global variable for reference
    scene.add(sphere);
}

/**
 * Creates a cube with breick texture on the inside that is used as the theaterrom.
 * 
 * @param scene The scene to add the theater room to.
 * @returns a promise to ensure that the theater room is loaded before it is used.
 */
async function createTheaterRoom(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Theaterroom----
            const cubeGeometry = new THREE.BoxGeometry(60, 30, 30);

            const theaterRoomTexture = textureLoader.load('./textures/red_brick/red_brick_diff_4k.jpg');
            theaterRoomTexture.wrapS = THREE.RepeatWrapping;
            theaterRoomTexture.wrapT = THREE.RepeatWrapping;
            theaterRoomTexture.repeat.set(2, 2);

            const theaterRoomNormalMap = textureLoader.load('./textures/red_brick/red_brick_disp_4k.png');
            theaterRoomNormalMap.wrapS = THREE.RepeatWrapping;
            theaterRoomNormalMap.wrapT = THREE.RepeatWrapping;
            theaterRoomNormalMap.repeat.set(2, 2);

            const roomMaterial = new THREE.MeshPhongMaterial({
                map: theaterRoomTexture,
                normalMap: theaterRoomNormalMap,
                side: THREE.BackSide
            });

            const cube = new THREE.Mesh(cubeGeometry, roomMaterial);
            cube.position.set(0, 15, 60);
            cube.userData.selectable = false;
            cube.name = "theaterRoom";
            outTheaterRoom = cube;
            scene.add(cube);
            // Auflösung des Promises
            resolve();
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the theater chairs that are used in the theater room.
 * 
 * @param scene The scene to add the theater chairs to. 
 * @returns a promise to ensure that the theater chairs are loaded before they are used.
 */
function createTheaterChairs(scene) {
    return new Promise((resolve, reject) => {
        try {
            const theaterchairsTexture = textureLoader.load('./textures/theaterchairs/velvet_diff.jpg');
            theaterchairsTexture.wrapS = THREE.RepeatWrapping;
            theaterchairsTexture.wrapT = THREE.RepeatWrapping;

            objectLoader.load(
                'objects/theaterchairs/armchair_cinema_6.obj',
                function (mesh) {
                    const material = new THREE.MeshPhongMaterial({ map: theaterchairsTexture });

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });

                    mesh.position.set(11, 0, 65);
                    mesh.rotation.set(0, 3.14159, 0);
                    mesh.scale.set(10, 10, 10);
                    mesh.name = "chairs";
                    theaterChairs = mesh;

                    scene.add(mesh);

                    resolve(mesh);
                },
                function (xhr) {
                    console.log("chairs " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the left curtain in the theater room.
 * 
 * @param scene Scene to add the curtain to 
 * @returns A promise to ensure that the curtain is loaded before it is used. 
 */
function createCurtainLeft(scene) {
    return new Promise((resolve, reject) => {
        try {
            const curtainTexture = textureLoader.load('./textures/curtain/leather_red_03_coll1_4k.png');
            curtainTexture.wrapS = THREE.RepeatWrapping;
            curtainTexture.wrapT = THREE.RepeatWrapping;
            
            objectLoader.load('objects/curtain/curtain_closed.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: curtainTexture });

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });

                    mesh.position.set(3, 0, 50);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(0, 0, 0);
                    mesh.scale.set(0.3, 0.3, 0.3);
                    mesh.name = "curtainLeft";
                    curtainLeft = mesh;
                    
                    scene.add(mesh);
                    resolve(mesh);
                },
                function (xhr) {
                    console.log("curtainLeft " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        }
        catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the right curtain in the theater room.
 * 
 * @param scene The scene to add the curtain to
 * @returns A promise to ensure that the curtain is loaded before it is used.
 */
function createCurtainRight(scene) {
    return new Promise((resolve, reject) => {
        try {
            const curtainTexture = textureLoader.load('./textures/curtain/leather_red_03_coll1_4k.png');
            curtainTexture.wrapS = THREE.RepeatWrapping;
            curtainTexture.wrapT = THREE.RepeatWrapping;

            objectLoader.load('objects/curtain/curtain_closed.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: curtainTexture });

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });

                    mesh.position.set(31, 0, 50);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(0, 0, 0);
                    mesh.scale.set(0.3, 0.3, 0.3);
                    mesh.name = "curtainRight";
                    curtainRight = mesh;
                    
                    scene.add(mesh);
                    
                    resolve();
                },
                function (xhr) {
                    console.log("curtainRight " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );

        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });

}

/**
 * Creates the curtain rope in the theater room.
 * A combined geometry was needed to combine the different parts of the rope and create a single object.
 * As later on, the raycaster lists all the objects that are intersected by the ray,
 * the combined geometry was needed to ensure that the rope is treated as a single object and
 * shown as the first intersected object.
 * 
 * This solution was proposed by Copilot.
 * 
 * @param scene Scene to add the curtain to 
 * @returns A promise to ensure that the curtain rope is loaded before it is used.
 */
function createCurtainRope(scene) {
    return new Promise((resolve, reject) => {
        try {
            const curtainRopeTexture = textureLoader.load('./textures/holz_hellbraun.jpg');
            curtainRopeTexture.wrapS = THREE.RepeatWrapping;
            curtainRopeTexture.wrapT = THREE.RepeatWrapping;
            
            objectLoader.load('objects/rope/elongated_rope.obj', function (mesh) {
                var material = new THREE.MeshPhongMaterial({ map: curtainRopeTexture });
                //A combined geometry 
                var combinedGeometry = new THREE.BufferGeometry();

                mesh.traverse(function (child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.userData.selectable = true;
                        
                        // If the geometry is empty, add the geometry of the first mesh
                        if (combinedGeometry.attributes.position === undefined) {
                            combinedGeometry = child.geometry.clone();
                        } 
                        // If geometry already exists, combine it
                        else {
                            combinedGeometry.merge(child.geometry, child.matrix);
                        }
                    }
                });

                // Create a new mesh with the combined geometry
                var combinedMesh = new THREE.Mesh(combinedGeometry, material);
                combinedMesh.position.set(15, 10, 50);  
                combinedMesh.rotation.set(0, 0, 0);    
                combinedMesh.scale.set(0.2, 0.2, 0.2); 
                combinedMesh.name = "cord";             
                combinedMesh.userData.isCord = true;
                curtainRope = combinedMesh;

                scene.add(combinedMesh);

                resolve();
            },
                function (xhr) {
                    console.log("cord " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                });
            } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the left plank in the theater room, to hide the left curtain clipping through the room wall.
 * 
 * @param scene The scene to add the left plank to. 
 * @returns A promise to ensure that the left plank is loaded before it is used.
 */
function createWoodenPlankLeft(scene) {
    return new Promise((resolve, reject) => {
        try {
            const baseColorTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_baseColor.jpeg');
            const metallicRoughnessTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_metallicRoughness.png');
            const normalMapTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_normal.png');
            
            const material = new THREE.MeshStandardMaterial({
                map: baseColorTexture,
                metalnessMap: metallicRoughnessTexture,
                roughnessMap: metallicRoughnessTexture,
                normalMap: normalMapTexture,
            });

            objectLoader.load(
                'objects/woodenplank/plank.obj',
                function (mesh) {
                    

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });

                    mesh.position.set(-29, 10, 52);    //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(0, Math.PI / 2, Math.PI / 2);
                    mesh.scale.set(20, 10, 15);
                    mesh.name = "plankleft";
                    plankLeft = mesh;

                    scene.add(mesh);

                    resolve(mesh);
                },
                function (xhr) {
                    console.log("chairs " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the right plank in the theater room, to hide the right curtain clipping through the room wall.
 * 
 * @param scene The scene to add the right plank to. 
 * @returns A promise to ensure that the right plank is loaded before it is used.
 */
function createWoodenPlankRight(scene) {
    return new Promise((resolve, reject) => {
        try {
            const baseColorTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_baseColor.jpeg');
            const metallicRoughnessTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_metallicRoughness.png');
            const normalMapTexture = textureLoader.load('./textures/woodenplank/DefaultMaterial_normal.png');

            const material = new THREE.MeshStandardMaterial({
                map: baseColorTexture,
                metalnessMap: metallicRoughnessTexture,
                roughnessMap: metallicRoughnessTexture,
                normalMap: normalMapTexture,
            });

            objectLoader.load(
                'objects/woodenplank/plank.obj',
                function (mesh) {
                    

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });

                    mesh.position.set(29, 10, 52);    //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(0, Math.PI / 2, Math.PI / 2);
                    mesh.scale.set(20, 10, 15);
                    mesh.name = "plankright";
                    plankRight = mesh;

                    scene.add(mesh);

                    resolve(mesh);
                },
                function (xhr) {
                    console.log("chairs " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the canvas plane that is used as a canvas for the portal.
 * 
 * @param scene The scene to add the canvas plane to.
 */
function createCanvasPlane(scene) {
    const canvasGeometry = new THREE.PlaneGeometry(50, 25);

    const canvasTexture = textureLoader.load('./textures/leinwand/leinwand.png');
    const canvasMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture, side: THREE.DoubleSide });
    
    const plane = new THREE.Mesh(canvasGeometry, canvasMaterial);
    plane.receiveShadow = false;
    plane.position.set(0, 18, 45.1); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    plane.name = "canvasPlane";
    plane.visible = true;
    outCanvasPlane = plane;
    scene.add(plane);
}

/**
 * Creates the portal plane that is used as a portal in the scene.
 * 
 * @param scene The scene to add the portal plane to.
 */
function createPortalPlane(scene) {
    const radius = 18; 
    const segments = 32; 
    const planeGeometry = new THREE.CircleGeometry(radius, segments);

    const portalTexture = textureLoader.load('./textures/portal/portalV2.png');
    const portalMaterial = new THREE.MeshBasicMaterial({ map: portalTexture, side: THREE.DoubleSide });
    

    const plane = new THREE.Mesh(planeGeometry, portalMaterial);
    plane.receiveShadow = false;
    plane.position.set(0, 18, 45.2);
    plane.scale.set(0.6, 0.6, 0.6);
    plane.name = "portalPlane";
    plane.visible = true;
    outPortalPlane = plane;
    scene.add(plane);
}

/**
 * Creates the stage on which the instruments stand on.
 * 
 * @param scene The scene to add the stage to. 
 * @returns A promise to ensure that the stage is loaded before it is used. 
 */
function createStage(scene) {
    return new Promise((resolve, reject) => {
        try {
            const stageTexture = textureLoader.load('./textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
            stageTexture.wrapS = THREE.RepeatWrapping;
            stageTexture.wrapT = THREE.RepeatWrapping;
            stageTexture.repeat.set(10, 10)
            
            const stageNormalMap = textureLoader.load('./textures/wood_cabinet/wood_planks_normal.png');
            stageNormalMap.wrapS = THREE.RepeatWrapping;
            stageNormalMap.wrapT = THREE.RepeatWrapping;
            stageNormalMap.repeat.set(10, 10)

            objectLoader.load('objects/BuehneFullCircleNachBlender.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: stageTexture, normalMap: stageNormalMap });

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });
                    
                    mesh.position.set(-18.7, -2.5, 0);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(-Math.PI / 2, 0, 0);
                    mesh.scale.set(500, 500, 250);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    mesh.name = "stage";
                    stage = mesh;

                    scene.add(mesh);

                    resolve();
                },
                function (xhr) {
                    console.log("stage " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the stage rim that is used as a rim for the stage.
 * 
 * @param scene The scene to add the stage rim to. 
 * @returns A promise to ensure that the stage rim is loaded before it is used.
 */
function createStageRim(scene) {
    return new Promise((resolve, reject) => {
        try {
            const stageRimTexture = textureLoader.load('./textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
            stageRimTexture.wrapS = THREE.RepeatWrapping;
            stageRimTexture.wrapT = THREE.RepeatWrapping;
            
            objectLoader.load('objects/stageRimFullCircle38_5.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: stageRimTexture });

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = false;
                        }
                    });
                    
                    mesh.position.set(-18.7, -2.5, 0);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    mesh.rotation.set(-Math.PI / 2, 0, 0);
                    mesh.scale.set(500, 500, 250);
                    mesh.name = "stageRim";
                    stageRim = mesh;

                    scene.add(mesh);

                    resolve();
                },
                function (xhr) {
                    console.log("stageRim " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the piano that is used in the scene.
 * This object also needed a combined mesh. 
 * For further details please refer to description of {@link createCurtainRope}.
 * 
 * @param scene The scene to add the piano to. 
 * @returns A promise to ensure that the piano is loaded before it is used. 
 */
function createPiano(scene) {
    return new Promise((resolve, reject) => {
        try {
            const pianoTexture = textureLoader.load('./textures/piano/new/main_Albedo.png');
            pianoTexture.wrapS = THREE.RepeatWrapping;
            pianoTexture.wrapT = THREE.RepeatWrapping;

            const pianoNormalMap = textureLoader.load('./textures/piano/new/main_Normal.png');
            pianoNormalMap.wrapS = THREE.RepeatWrapping;
            pianoNormalMap.wrapT = THREE.RepeatWrapping;
            
            objectLoader.load('objects/piano/uploads_files_4987684_Piano_low.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: pianoTexture, normalMap: pianoNormalMap });

                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;

                            if (combinedGeometry.attributes.position === undefined) {
                                combinedGeometry = child.geometry.clone();
                            } else {
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    var combinedMesh = new THREE.Mesh(combinedGeometry, material);  
                    
                    combinedMesh.position.set(1.3, 2.5, -10); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)  
                    combinedMesh.rotation.set(0, -100, 0);
                    combinedMesh.scale.set(0.06, 0.06, 0.06);
                    combinedMesh.name = "piano";
                    combinedMesh.userData.selectable = true;
                    piano = combinedMesh;

                    scene.add(combinedMesh);

                    resolve();
                },
                function (xhr) {
                    console.log("piano " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the cello that is used in the scene.
 * This object also needed a combined mesh. 
 * For further details please refer to description of {@link createCurtainRope}.
 * 
 * @param scene The scene to add the cello to. 
 * @returns A promise to ensure that the cello is loaded before it is used. 
 */
function createCello(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Cello----
            const celloTexture = textureLoader.load('./textures/cello/10372_Cello_v01.jpg');
            celloTexture.wrapS = THREE.RepeatWrapping;
            celloTexture.wrapT = THREE.RepeatWrapping;

            const celloNormalMap = textureLoader.load('./textures/cello/celloNormalMap.png');
            celloNormalMap.wrapS = THREE.RepeatWrapping;
            celloNormalMap.wrapT = THREE.RepeatWrapping;

            objectLoader.load('objects/cello/10372_Cello_v01_l3.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: celloTexture });
                    
                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;

                            if (combinedGeometry.attributes.position === undefined) {
                                combinedGeometry = child.geometry.clone();
                            } else {
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    var combinedMesh = new THREE.Mesh(combinedGeometry, material);  
                    combinedMesh.position.set(-10.7, 2.5, 5); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    combinedMesh.rotation.set(350, 0, 0); 
                    combinedMesh.scale.set(0.015, 0.015, 0.015);
                    combinedMesh.name = "cello";
                    combinedMesh.userData.selectable = true;
                    cello = combinedMesh;

                    scene.add(combinedMesh);
                    resolve();

                },
                function (xhr) {
                    console.log("cello " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

/**
 * Creates the violine that is used in the scene.
 * This object also needed a combined mesh.
 * For further details please refer to description of {@link createCurtainRope}.
 * 
 * @param scene The scene to add the violine to.
 * @returns A promise to ensure that the violine is loaded before it is used.
 */
function createVioline(scene) {
    return new Promise((resolve, reject) => {
        try {
            const violineTexture = textureLoader.load('./textures/violine/ViolinHomeWork_TD_Checker_Diffuse.png');
            violineTexture.wrapS = THREE.RepeatWrapping;
            violineTexture.wrapT = THREE.RepeatWrapping;
            
            const violineNormalMap = textureLoader.load('./textures/violine/ViolinHomeWork_TD_Checker_Normal.png');
            violineNormalMap.wrapS = THREE.RepeatWrapping;
            violineNormalMap.wrapT = THREE.RepeatWrapping;
            
            objectLoader.load('objects/violine/V2.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: violineTexture, normalMap: violineNormalMap });

                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;
                            
                            if (combinedGeometry.attributes.position === undefined) {
                                combinedGeometry = child.geometry.clone();
                            } else {
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    var combinedMesh = new THREE.Mesh(combinedGeometry, material);
                    combinedMesh.position.set(10, 2.5, 5); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    combinedMesh.rotation.set(0, -2.356, 0.175);
                    combinedMesh.scale.set(0.015, 0.015, 0.015);
                    combinedMesh.name = "violine";
                    combinedMesh.userData.selectable = true;
                    violine = combinedMesh;
                    scene.add(combinedMesh);
                    resolve();

                },
                function (xhr) {
                    console.log("violine " + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error) {
                    console.log(error);
                    console.log('An error happened');
                }
            );
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

//----Implementation of getters for all objects----

/**
 * Getter for the plane for instrument activation.
 * 
 * @returns The plane for instrument activation.
*/
export function getInstrumentActivationPlane() {
    return outInstrumentActivationPlane;
}

/**
 * Getter for the background sphere.
 * @returns The background sphere.
 */
export function getBackgroundSphere() {
    return outBackgroundSphere;
}

/**
 * Getter for the theater room.
 * @returns The theater room.
 */
export function getTheaterRoom() {
    return outTheaterRoom;
}

/**
 * Getter for the theater chairs.
 * @returns The theater chairs.
 */
export function getTheaterChairs() {
    return theaterChairs;
}

/**
 * Getter for the left curtain.
 * @returns the left curtain object.
 */
export function getCurtainLeft() {
    return curtainLeft; 
}

/**
 * Getter for the right curtain.
 * @returns the right curtain.
 */
export function getCurtainRight() {
    return curtainRight;
}

/**
 * Getter for the curtain rope object.
 * @returns The curtain rope object
 */
export function getCurtainRope() {
    return curtainRope;
}

/**
 * Getter for the left plank in the theater room.
 * @returns The left plank in the theater room.
 */
export function getPlankLeft() {
    return plankLeft;
}

/**
 * Getter for the right plank in the theater room.
 * @returns The right plank in the theater room.
 */
export function getPlankRight() {
    return plankRight;
}

/**
 * Getter for the canvas plane.
 * @returns The canvas plane.
 */
export function getCanvasPlane() {
    return outCanvasPlane;
}

/**
 * Getter for the portal plane.
 * 
 * @returns The portal plane.
 */
export function getPortalPlane() {
    return outPortalPlane;
}

/**
 * Getter for the stage object.
 * @returns The stage object.
 */
export function getStage() {
    return stage;
}
/**
 * Getter for the stage rim object.
 * @returns The stage rim object.
 */
export function getStageRim() {
    return stageRim;
}

/**
 * Getter for the piano object.
 * @returns The piano object.
 */
export function getPiano() {
    return piano;
}

/**
 * Getter for the cello object.
 * @returns The cello object.
 */
export function getCello() {
    return cello;
}

/**
 * Getter for the violine object.
 * @returns The violine object.
 */
export function getVioline() {
    return violine;
}