//import * as THREE from './modules/three.module.js';

main();

function main() {
    //----Create context----
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    
    //----Loaders----
    const objectLoader = new THREE.OBJLoader();
    const textureLoader = new THREE.TextureLoader();


    //----Create camera----
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    const initCameraPosZ = 80;
    camera.position.set(0, 18, initCameraPosZ); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    camera.rotation.x = THREE.Math.degToRad(-10); // Set the pitch (in degrees)

    //----Create scene----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);   //0.3, 0.5, 0.8         0x000000
    const tripod = new THREE.AxesHelper(50);
    tripod.name = "tripod";
    scene.add(tripod);

    //----Create plane----
    const planeWidth = 0.1; //256
    const planeHeight =  0.1;  //128
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );
    
    const planeTextureMap = textureLoader.load('textures/stone_texture4293.jpg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);

    //planeTextureMap.magFilter = THREE.NearestFilter;
    planeTextureMap.minFilter = THREE.NearestFilter;
    planeTextureMap.anisotropy = gl.getMaxAnisotropy();
    
    const planeNorm = textureLoader.load('textures/pebbles_normal.png');
    planeNorm.wrapS = THREE.RepeatWrapping;
    planeNorm.wrapT = THREE.RepeatWrapping;
    planeNorm.minFilter = THREE.NearestFilter;
    planeNorm.repeat.set(16, 16);
    const planeMaterial = new THREE.MeshStandardMaterial({
        map: planeTextureMap,
        side: THREE.DoubleSide,
        normalMap: planeNorm 
    });

    const plane = new THREE.Mesh(planeGeometry); //, planeMaterial
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = "plane";
    scene.add(plane);

    //----Lights-----
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    light.name = "directionalLight";
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    ambientLight.name = "ambientLight";
    scene.add(ambientLight);

    // Aufgabe b)
    //Add shadowMap to renderer
    gl.shadowMap.enabled = true;
    //cube.castShadow = true; //Add shadow to cube
    //sphere.castShadow = true;   //Add shadow to sphere

    // add pointlight for the shadows
    /*var pointLight = new THREE.pointLight(0xffffff);
    pointLight.position.set(-10, 20, -5);
    pointLight.castShadow = true;
    scene.add(pointLight);*/

    // add controls for rotationSpeed
    /*var controls = new function () {
        this.rotationSpeed = 0.02;
    };*/

    // add the gui
    /*var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);*/

    //----Add the stats----
    var stats = initStats();

    //----Enable camera control by mouse----
    var trackballControls
    function enableCameraMovement() {
        trackballControls = initTrackballControls(camera, gl);
    }

    //enableCameraMovement();

    //----Enable clock for later use of getElapsedTime() or similar----
    var clock = new THREE.Clock();

    //----Objects in the Scene----
    //----Backgroundsphere----
    textureLoader.load('textures/starmap_16k.jpg', function(texture) {
        // Erstelle die Geometrie und das Material für die Kugel
        const geometry = new THREE.SphereGeometry(500, 60, 40); // Radius 500, Unterteilungen
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide  // Textur soll nach innen zeigen
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.userData.selectable = false;
        sphere.name = "backgroundSphere";

        // Setze die Kugel als Hintergrund
        scene.add(sphere);
    });

    //----Theaterroom----
    const cubeGeometry = new THREE.BoxGeometry(60, 30, 30);  

    const theaterRoomTexture = textureLoader.load('textures/red_brick/red_brick_diff_4k.jpg');
    theaterRoomTexture.wrapS = THREE.RepeatWrapping;
    theaterRoomTexture.wrapT = THREE.RepeatWrapping;
    theaterRoomTexture.repeat.set(2, 2)

    const theaterRoomNormalMap = textureLoader.load('textures/red_brick/red_brick_disp_4k.jpg');
    theaterRoomNormalMap.wrapS = THREE.RepeatWrapping;
    theaterRoomNormalMap.wrapT = THREE.RepeatWrapping;
    theaterRoomNormalMap.repeat.set(2, 2)

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
    scene.add(cube);

    //----Theaterfog----
    const fog = new THREE.Fog("grey", 0, 200);
    scene.fog = fog;
    scene.fog = null;

    //----Define all loader objects----
    let theaterChairs;
    let curtainLeft;
    let curtainRight;
    let curtainRope;
    let stage;
    let stageRim;
    let piano;
    let cello;
    let violine;

    //----Theaterchairs----
    const theaterchairsTexture = textureLoader.load('textures/theaterchairs/velvet_diff.jpg');
    theaterchairsTexture.wrapS = THREE.RepeatWrapping;
    theaterchairsTexture.wrapT = THREE.RepeatWrapping;

    objectLoader.load('objects/theaterchairs/armchair_cinema_6.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:theaterchairsTexture});
    
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.selectable = false;
                }
            });

            mesh.position.set(11, 0, 65);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
            mesh.rotation.set(0, 3.14159, 0);
            mesh.scale.set(10, 10, 10);
            mesh.name = "chairs";
            theaterChairs = mesh;
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( "chairs " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Curtains----
    const curtainTexture = textureLoader.load('textures/curtain/leather_red_03_coll1_4k.png');
    curtainTexture.wrapS = THREE.RepeatWrapping;
    curtainTexture.wrapT = THREE.RepeatWrapping;

    //----Curtain left----
    objectLoader.load('objects/curtain/curtain_closed.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:curtainTexture});
    
            mesh.traverse(function(child) {
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
        },
        function ( xhr ) {
            console.log( "curtainLeft " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Curtain right----
    objectLoader.load('objects/curtain/curtain_closed.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:curtainTexture});
    
            mesh.traverse(function(child) {
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
        },
        function ( xhr ) {
            console.log( "curtainRight " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Curtain rope----
    const curtainRopeTexture = textureLoader.load('textures/holz_hellbraun.jpg');
    curtainRopeTexture.wrapS = THREE.RepeatWrapping;
    curtainRopeTexture.wrapT = THREE.RepeatWrapping;

    const initCordYPos = 10;

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
        combinedMesh.position.set(15, initCordYPos, 50);  // Position des gesamten Objekts
        combinedMesh.rotation.set(0, 0, 0);    // Rotation des gesamten Objekts
        combinedMesh.scale.set(0.2, 0.2, 0.2); // Skalierung des gesamten Objekts
        combinedMesh.name = "cord";             // Name des Objekts
        combinedMesh.userData.isCord = true;
    
        // Füge das kombinierte Mesh der Szene hinzu
        scene.add(combinedMesh);
    
        // Das ursprüngliche Mesh (der Parent) wird nicht mehr benötigt
        curtainRope = combinedMesh;
    },
    function (xhr) {
        console.log("cord " + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log(error);
        console.log('An error happened');
    });

    //----Stage----
    const stageTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageTexture.wrapS = THREE.RepeatWrapping;
    stageTexture.wrapT = THREE.RepeatWrapping;
    stageTexture.repeat.set(10, 10)

    const stageNormalMap = textureLoader.load('textures/wood_cabinet/wood_planks_normal.png');
    stageNormalMap.wrapS = THREE.RepeatWrapping;
    stageNormalMap.wrapT = THREE.RepeatWrapping;
    stageNormalMap.repeat.set(10, 10)

    objectLoader.load('objects/BuehneFullCircleNachBlender.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:stageTexture, normalMap: stageNormalMap});
    
            mesh.traverse(function(child) {
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
        },
        function ( xhr ) {
            console.log("stage " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Stagerim----
    const stageRimTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageRimTexture.wrapS = THREE.RepeatWrapping;
    stageRimTexture.wrapT = THREE.RepeatWrapping;

    objectLoader.load('objects/stageRimFullCircle38_5.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:stageRimTexture});
    
            mesh.traverse(function(child) {
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
        },
        function ( xhr ) {
            console.log( "stageRim " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Piano----
    const pianoTexture = textureLoader.load('textures/piano/new/main_Albedo.png');
    pianoTexture.wrapS = THREE.RepeatWrapping;
    pianoTexture.wrapT = THREE.RepeatWrapping;

    const pianoNormalMap = textureLoader.load('textures/piano/new/main_Normal.png');
    pianoNormalMap.wrapS = THREE.RepeatWrapping;
    pianoNormalMap.wrapT = THREE.RepeatWrapping;

    objectLoader.load('objects/piano/uploads_files_4987684_Piano.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:pianoTexture, normalMap: pianoNormalMap});
    
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.selectable = true;
                }
            });

            mesh.position.set(-10.7, 2.5, -8); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
            mesh.rotation.set(0, -100, 0);
            mesh.scale.set(0.038, 0.038, 0.038);
            mesh.name = "piano";
            piano = mesh;
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( "piano " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Cello----
    const celloTexture = textureLoader.load('textures/cello/10372_Cello_v01.jpg');
    celloTexture.wrapS = THREE.RepeatWrapping;
    celloTexture.wrapT = THREE.RepeatWrapping;

    const celloNormalMap = textureLoader.load('textures/cello/celloNormalMap.png');
    celloNormalMap.wrapS = THREE.RepeatWrapping;
    celloNormalMap.wrapT = THREE.RepeatWrapping;

    objectLoader.load('objects/cello/10372_Cello_v01_l3.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:celloTexture});
    
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.selectable = true;
                }
            });

            mesh.position.set(1.3, 2.5, -10); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
            mesh.rotation.set(350, 0, 0); //300 = 90°
            mesh.scale.set(0.01, 0.01, 0.01);
            mesh.name = "cello";
            cello = mesh;
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( "cello "+( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Violine----
    const violineTexture = textureLoader.load('textures/violine/ViolinHomeWork_TD_Checker_Diffuse.png');
    violineTexture.wrapS = THREE.RepeatWrapping;
    violineTexture.wrapT = THREE.RepeatWrapping;

    const violineNormalMap = textureLoader.load('textures/violine/ViolinHomeWork_TD_Checker_Normal.png');
    violineNormalMap.wrapS = THREE.RepeatWrapping;
    violineNormalMap.wrapT = THREE.RepeatWrapping;

    objectLoader.load('objects/violine/V2.obj',
        function(mesh) {
            var material = new THREE.MeshPhongMaterial({map:violineTexture, normalMap: violineNormalMap});
    
            mesh.traverse(function(child) {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.userData.selectable = true;
                }
            });

            mesh.position.set(9.3, 2.5, -8); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
            mesh.rotation.set(0, -2.356, 0.175); //300 = 90°
            mesh.scale.set(0.01, 0.01, 0.01);
            mesh.name = "violine";
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( "violine " + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Music----
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('music/Dark_Waltz.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
    });

    // ---- Raycaster und Interaktion ----
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let selectedObject = null;
    let isDragging = false;

    // ---- DragPlane ----
    const dragPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const dragPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const dragPlane = new THREE.Mesh(dragPlaneGeometry, dragPlaneMaterial);

    dragPlane.rotation.x = -Math.PI / 2;
    dragPlane.position.set(20, 10, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    dragPlane.name = "dragPlane";
    scene.add(dragPlane);


    // ---- LimitPlane ----
    const limitPlaneGeometry = new THREE.PlaneGeometry(100, 100);
    const limitPlaneMaterial = new THREE.MeshBasicMaterial({ visible: false, color: 0xFFC0CB });
    const limitPlane = new THREE.Mesh(limitPlaneGeometry, limitPlaneMaterial);

    limitPlane.rotation.x = Math.PI / 2;
    limitPlane.position.set(20, 25, 55); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
    limitPlane.name = "limitPlane";
    scene.add(limitPlane);

    // ---- Event Listener ----
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

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
                moveCurtains = true;
                moveCamera = true;
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

    //----Function to move the curtains----
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

    //----Function to move camera after Curtain movement----
    let cameraMovementSpeed = 0.08;
    let cameraEndPosition = 45;
    
    function moveCameraForward() {
        if (!moveCamera) return;
        
        // Berechne die Differenz zwischen der aktuellen und der Zielposition
        if (camera.position.z > cameraEndPosition) {
            camera.position.z -= cameraMovementSpeed;
        } else {
            moveCamera = false;  // Stoppe die Bewegung, wenn das Ziel erreicht ist
        }
    }

    

    //----Gui controls----
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.positionZ = 0;
        this.playSound = function() { sound.play(); }
        this.stopSound = function() { sound.stop(); }
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'positionZ', 0, 100);
    gui.add(controls, 'playSound').name('Play Sound');
    gui.add(controls, 'stopSound').name('Stop Sound');


    //enableCameraMovement();

    //----Draw----
    function draw(time){
        time *= 0.001;

        //setTimeout(enableCameraMovement, 10000); // Enable camera movement after X milliseconds (1s = 1000ms)
        
        if(trackballControls) {
            trackballControls.update(clock.getDelta());
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
        setTimeout(moveCameraForward(), 5000);

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