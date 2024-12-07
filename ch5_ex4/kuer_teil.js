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
    camera.position.set(0, 20, 80); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)

    //----Create scene----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);   //0.3, 0.5, 0.8         0x000000
    const tripod = new THREE.AxesHelper(50);
    scene.add(tripod);
    //const fog = new THREE.Fog("grey", 1,200);
    //scene.fog = fog;

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
    scene.add(plane);

    //----Lights-----
    const color = 0xffffff;
    const intensity = .7;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
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

    // add the stats
    var stats = initStats();
    var trackballControls = initTrackballControls(camera, gl);
    var clock = new THREE.Clock();

    //----Textures----
    const curtainTexture = textureLoader.load('textures/curtain/leather_red_03_coll1_4k.png');
    curtainTexture.wrapS = THREE.RepeatWrapping;
    curtainTexture.wrapT = THREE.RepeatWrapping;

    const stageTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageTexture.wrapS = THREE.RepeatWrapping;
    stageTexture.wrapT = THREE.RepeatWrapping;
    stageTexture.repeat.set(10, 10)

    const stageNormalMap = textureLoader.load('textures/wood_cabinet/wood_planks_normal.png');
    stageNormalMap.wrapS = THREE.RepeatWrapping;
    stageNormalMap.wrapT = THREE.RepeatWrapping;
    stageNormalMap.repeat.set(10, 10)
    
    const stageRimTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageRimTexture.wrapS = THREE.RepeatWrapping;
    stageRimTexture.wrapT = THREE.RepeatWrapping;

    const celloTexture = textureLoader.load('textures/cello/10372_Cello_v01.jpg');
    celloTexture.wrapS = THREE.RepeatWrapping;
    celloTexture.wrapT = THREE.RepeatWrapping;

    const celloNormalMap = textureLoader.load('textures/cello/celloNormalMap.png');
    celloNormalMap.wrapS = THREE.RepeatWrapping;
    celloNormalMap.wrapT = THREE.RepeatWrapping;

    const pianoTexture = textureLoader.load('textures/piano/new/main_Albedo.png');
    pianoTexture.wrapS = THREE.RepeatWrapping;
    pianoTexture.wrapT = THREE.RepeatWrapping;

    const pianoNormalMap = textureLoader.load('textures/piano/new/main_Normal.png');
    pianoNormalMap.wrapS = THREE.RepeatWrapping;
    pianoNormalMap.wrapT = THREE.RepeatWrapping;

    const violineTexture = textureLoader.load('textures/violine/ViolinHomeWork_TD_Checker_Diffuse.png');
    violineTexture.wrapS = THREE.RepeatWrapping;
    violineTexture.wrapT = THREE.RepeatWrapping;

    const violineNormalMap = textureLoader.load('textures/violine/ViolinHomeWork_TD_Checker_Normal.png');
    violineNormalMap.wrapS = THREE.RepeatWrapping;
    violineNormalMap.wrapT = THREE.RepeatWrapping;

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
        
        // Setze die Kugel als Hintergrund
        scene.add(sphere);
    });

    //----Curtain left----
    objectLoader.load('objects/curtain/curtain_closed.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:curtainTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(2.5, 0, 50);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(0, 0, 0);
                mesh.scale.set(0.3, 0.3, 0.3);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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
                    }
                });

                mesh.position.set(31, 0, 50);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(0, 0, 0);
                mesh.scale.set(0.3, 0.3, 0.3);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Stage----
    objectLoader.load('objects/BuehneFullCircleNachBlender.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:stageTexture, normalMap: stageNormalMap});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-18.7, -2.5, 0);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                mesh.scale.set(500, 500, 250);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Stagerim----
    objectLoader.load('objects/stageRimFullCircle38_5.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:stageRimTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-18.7, -2.5, 0);   //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                mesh.scale.set(500, 500, 250);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Piano----
    objectLoader.load('objects/piano/uploads_files_4987684_Piano.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:pianoTexture, normalMap: pianoNormalMap});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-10.7, 2.5, -8); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(0, -100, 0);
                mesh.scale.set(0.038, 0.038, 0.038);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Cello----
    objectLoader.load('objects/cello/10372_Cello_v01_l3.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:celloTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(1.3, 2.5, -10); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(350, 0, 0); //300 = 90°
                mesh.scale.set(0.01, 0.01, 0.01);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Violine----
    objectLoader.load('objects/violine/V2.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:violineTexture, normalMap: violineNormalMap});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(9.3, 2.5, -8); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
                mesh.rotation.set(0, -2.356, 0.175); //300 = 90°
                mesh.scale.set(0.01, 0.01, 0.01);
        
            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    //----Gui controls----
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.positionZ = 0;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'positionZ', 0, 100);

    //----Draw----
    function draw(time){
        time *= 0.001;

        trackballControls.update(clock.getDelta());
        stats.update();


        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

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