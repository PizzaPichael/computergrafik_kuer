var textureLoader;
var objectLoader;

let outPlane;
function createInitPlane(scene, gl) {
    //----Create initial plane----
    const planeWidth = 0.1; //256
    const planeHeight = 0.1;  //128
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );
    /*
    const planeTextureMap = textureLoader.load(./textures/stone_texture4293.jpg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);

    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    
    const planeNorm = textureLoader.load(./textures/pebbles_normal.png');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNorm 
    });*/

    const plane = new THREE.Mesh(planeGeometry); //, planeMaterial
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = "plane";
    outPlane = plane;
    scene.add(plane);

    return new Promise((resolve) => {
        // ... (after plane creation is complete) ...
        console.log("...delivering promise...")
        resolve();
    });
}

export function getPlane() {
    return outPlane;
}

let outBackgroundSphere;
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

    console.log("Sphere: creating geometry");

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    console.log("Sphere: created sphere ", sphere);
    sphere.userData.selectable = false;
    sphere.name = "backgroundSphere";

    console.log("Created sphere for background: ", sphere);

    // Setze die Kugel als Hintergrund
    outBackgroundSphere = sphere;
    scene.add(sphere);
}

export function getBackgroundSphere() {
    return outBackgroundSphere;
}

let outTheaterRoom;
async function createTheaterRoom(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Theaterroom----
            const cubeGeometry = new THREE.BoxGeometry(60, 30, 30);

            const theaterRoomTexture = textureLoader.load('./textures/red_brick/red_brick_diff_4k.jpg');
            theaterRoomTexture.wrapS = THREE.RepeatWrapping;
            theaterRoomTexture.wrapT = THREE.RepeatWrapping;
            theaterRoomTexture.repeat.set(2, 2);

            const theaterRoomNormalMap = textureLoader.load('./textures/red_brick/red_brick_disp_4k.jpg');
            theaterRoomNormalMap.wrapS = THREE.RepeatWrapping;
            theaterRoomNormalMap.wrapT = THREE.RepeatWrapping;
            theaterRoomNormalMap.repeat.set(2, 2);

            const roomMaterial = new THREE.MeshPhongMaterial({
                //color: 'purple',
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

export function getTheaterRoom() {
    return outTheaterRoom;
}

let outFog
function createFog(scene) {
    const fog = new THREE.Fog("grey", 0, 200);
    outFog = fog;
    scene.fog = fog;
    scene.fog = null;
}

//----Define all other scene objects----
let theaterChairs;
let curtainLeft;
let curtainRight;
let curtainRope;
let stage;
let stageRim;
let piano;
let cello;
let violine;

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

                    // TheaterChairs wurde erfolgreich erstellt und hinzugefügt
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


export function getTheaterChairs() {
    return theaterChairs;
}

function createCurtainLeft(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Curtaintexture----
            const curtainTexture = textureLoader.load('./textures/curtain/leather_red_03_coll1_4k.png');
            curtainTexture.wrapS = THREE.RepeatWrapping;
            curtainTexture.wrapT = THREE.RepeatWrapping;

            //----Curtain left----
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

function createCurtainRight(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Curtaintexture----
            const curtainTexture = textureLoader.load('./textures/curtain/leather_red_03_coll1_4k.png');
            curtainTexture.wrapS = THREE.RepeatWrapping;
            curtainTexture.wrapT = THREE.RepeatWrapping;

            //----Curtain right----
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

                    // Auflösung des Promises
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

export function getCurtainLeft() {
    return curtainLeft; 
}

export function getCurtainRight() {
    return curtainRight;
}

function createCurtainRope(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Curtain rope----
            const curtainRopeTexture = textureLoader.load('./textures/holz_hellbraun.jpg');
            curtainRopeTexture.wrapS = THREE.RepeatWrapping;
            curtainRopeTexture.wrapT = THREE.RepeatWrapping;

            objectLoader.load('objects/rope/elongated_rope.obj', function (mesh) {
                var material = new THREE.MeshPhongMaterial({ map: curtainRopeTexture });

                // Eine neue leere Geometrie für das kombinierte Mesh
                var combinedGeometry = new THREE.BufferGeometry();

                // Traverse durch alle Mesh-Kinder und füge ihre Geometrien zusammen
                mesh.traverse(function (child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.userData.selectable = true;

                        // Geometrie des aktuellen Meshes zum combinedGeometry hinzufügen
                        if (combinedGeometry.attributes.position === undefined) {
                            // Falls die Geometrie leer ist, füge die Geometrie des ersten Meshes hinzu
                            combinedGeometry = child.geometry.clone();
                        } else {
                            // Wenn bereits Geometrie vorhanden ist, kombiniere sie
                            combinedGeometry.merge(child.geometry, child.matrix);
                        }
                    }
                });

                // Erstelle ein neues Mesh mit der kombinierten Geometrie
                var combinedMesh = new THREE.Mesh(combinedGeometry, material);
                combinedMesh.position.set(15, 10, 50);  // Position des gesamten Objekts
                combinedMesh.rotation.set(0, 0, 0);    // Rotation des gesamten Objekts
                combinedMesh.scale.set(0.2, 0.2, 0.2); // Skalierung des gesamten Objekts
                combinedMesh.name = "cord";             // Name des Objekts
                combinedMesh.userData.isCord = true;

                // Füge das kombinierte Mesh der Szene hinzu
                scene.add(combinedMesh);

                // Das ursprüngliche Mesh (der Parent) wird nicht mehr benötigt
                curtainRope = combinedMesh;

                // Auflösung des Promises
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

export function getCurtainRope() {
    return curtainRope;
}

function createStage(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Stage----
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
                    mesh.name = "stage";
                    stage = mesh;

                    scene.add(mesh);
                    // Auflösung des Promises
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

export function getStage() {
    return stage;
}

function createStageRim(scene, gl) {
    return new Promise((resolve, reject) => {
        try {
            //----Stagerim----
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

export function getStageRim() {
    return stageRim;
}

function createPiano(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Piano----
            const pianoTexture = textureLoader.load('./textures/piano/new/main_Albedo.png');
            pianoTexture.wrapS = THREE.RepeatWrapping;
            pianoTexture.wrapT = THREE.RepeatWrapping;

            const pianoNormalMap = textureLoader.load('./textures/piano/new/main_Normal.png');
            pianoNormalMap.wrapS = THREE.RepeatWrapping;
            pianoNormalMap.wrapT = THREE.RepeatWrapping;

            objectLoader.load('objects/piano/uploads_files_4987684_Piano.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: pianoTexture, normalMap: pianoNormalMap });

                    // Eine neue leere Geometrie für das kombinierte Mesh
                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;

                            // Geometrie des aktuellen Meshes zum combinedGeometry hinzufügen
                            if (combinedGeometry.attributes.position === undefined) {
                                // Falls die Geometrie leer ist, füge die Geometrie des ersten Meshes hinzu
                                combinedGeometry = child.geometry.clone();
                            } else {
                                // Wenn bereits Geometrie vorhanden ist, kombiniere sie
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    // Erstelle ein neues Mesh mit der kombinierten Geometrie
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

export function getPiano() {
    return piano;
}

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

                    // Eine neue leere Geometrie für das kombinierte Mesh
                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;

                            // Geometrie des aktuellen Meshes zum combinedGeometry hinzufügen
                            if (combinedGeometry.attributes.position === undefined) {
                                // Falls die Geometrie leer ist, füge die Geometrie des ersten Meshes hinzu
                                combinedGeometry = child.geometry.clone();
                            } else {
                                // Wenn bereits Geometrie vorhanden ist, kombiniere sie
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    // Erstelle ein neues Mesh mit der kombinierten Geometrie
                    var combinedMesh = new THREE.Mesh(combinedGeometry, material);  
                    combinedMesh.position.set(-10.7, 2.5, 5); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    combinedMesh.rotation.set(350, 0, 0); //300 = 90°
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

export function getCello() {
    return cello;
}

function createVioline(scene) {
    return new Promise((resolve, reject) => {
        try {
            //----Violine----
            const violineTexture = textureLoader.load('./textures/violine/ViolinHomeWork_TD_Checker_Diffuse.png');
            violineTexture.wrapS = THREE.RepeatWrapping;
            violineTexture.wrapT = THREE.RepeatWrapping;

            const violineNormalMap = textureLoader.load('./textures/violine/ViolinHomeWork_TD_Checker_Normal.png');
            violineNormalMap.wrapS = THREE.RepeatWrapping;
            violineNormalMap.wrapT = THREE.RepeatWrapping;

            objectLoader.load('objects/violine/V2.obj',
                function (mesh) {
                    var material = new THREE.MeshPhongMaterial({ map: violineTexture, normalMap: violineNormalMap });

                    // Eine neue leere Geometrie für das kombinierte Mesh
                    var combinedGeometry = new THREE.BufferGeometry();

                    mesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = material;
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData.selectable = true;

                            // Geometrie des aktuellen Meshes zum combinedGeometry hinzufügen
                            if (combinedGeometry.attributes.position === undefined) {
                                // Falls die Geometrie leer ist, füge die Geometrie des ersten Meshes hinzu
                                combinedGeometry = child.geometry.clone();
                            } else {
                                // Wenn bereits Geometrie vorhanden ist, kombiniere sie
                                combinedGeometry.merge(child.geometry, child.matrix);
                            }
                        }
                    });

                    // Erstelle ein neues Mesh mit der kombinierten Geometrie
                    var combinedMesh = new THREE.Mesh(combinedGeometry, material);
                    combinedMesh.position.set(10, 2.5, 5); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                    combinedMesh.rotation.set(0, -2.356, 0.175); //300 = 90°
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

export function getVioline() {
    return violine;
}


export async function loadObjects(scene, gl) {
    console.log("Loaders: Loading objects...");

    textureLoader = new THREE.TextureLoader();
    objectLoader = new THREE.OBJLoader();
    //----Create Objects in the Scene----
    await createInitPlane(scene, gl);

    await createBackgroundSphere(scene);
    
    await createTheaterRoom(scene);

    createFog(scene);

    await createTheaterChairs(scene);

    await createCurtainLeft(scene);

    await createCurtainRight(scene);

    await createCurtainRope(scene);
    
    await createStage(scene);

    await createStageRim(scene);

    await createPiano(scene);

    await createCello(scene);

    await createVioline(scene);

    console.log("Objects: ");
    console.log("Plane: ", outPlane);
    console.log("BackgroundSphere: ", outBackgroundSphere);
    console.log("TheaterRoom: ", outTheaterRoom);
    console.log("Fog: ", outFog);
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