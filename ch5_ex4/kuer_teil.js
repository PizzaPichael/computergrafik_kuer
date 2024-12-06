//import * as THREE from './modules/three.module.js';

main();

function main() {
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });
    


    // create camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 8, 30);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.3, 0.5, 0.8);
    const fog = new THREE.Fog("grey", 1,90);
    scene.fog = fog;

    // GEOMETRY
    // create the cube
    const cubeSize = 4;
    const cubeGeometry = new THREE.BoxGeometry(
        cubeSize,
        cubeSize,
        cubeSize
    );  

    // Create the Sphere
    const sphereRadius = 3;
    const sphereWidthSegments = 32;
    const sphereHeightSegments = 16;
    const sphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        sphereWidthSegments,
        sphereHeightSegments
    );

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight =  128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );
    

    // MATERIALS
    const textureLoader = new THREE.TextureLoader();

    const cubeMaterial = new THREE.MeshPhongMaterial({
        color: 'purple',
    });

    const sphereNormalMap = textureLoader.load('textures/sphere_normal.png');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 'tan',
        normalMap: sphereNormalMap
    });

    
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

    // MESHES
    //Cube
    /*const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);
    //Sphere
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);*/

    //Create plane for shadows
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    //LIGHTS
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

    // Aufgabe c)
    const stageTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageTexture.wrapS = THREE.RepeatWrapping;
    stageTexture.wrapT = THREE.RepeatWrapping;
    stageTexture.repeat.set(5, 5)

    const stageNormalMap = textureLoader.load('textures/wood_cabinet/wood_planks_normal.png');
    sphereNormalMap.wrapS = THREE.RepeatWrapping;
    sphereNormalMap.wrapT = THREE.RepeatWrapping;
    sphereNormalMap.repeat.set(5, 5)
    
    const stageRimTexture = textureLoader.load('textures/wood_cabinet/wood_cabinet_worn_long_diff_4k.jpg');
    stageRimTexture.wrapS = THREE.RepeatWrapping;
    stageRimTexture.wrapT = THREE.RepeatWrapping;

    const celloTexture = textureLoader.load('textures/cello/10372_Cello_v01.jpg');
    celloTexture.wrapS = THREE.RepeatWrapping;
    celloTexture.wrapT = THREE.RepeatWrapping;

    const pianoTexture = textureLoader.load('textures/piano/main_Albedo+Paint.png');
    pianoTexture.wrapS = THREE.RepeatWrapping;
    pianoTexture.wrapT = THREE.RepeatWrapping;

    var loader = new THREE.OBJLoader();

    //----Bühnenobjekt----
    loader.load('objects/buehneNachBlender.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:stageTexture, normalMap: stageNormalMap});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-15, 0, 0);
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

    //----Bühnenumrandung----
    loader.load('objects/stageRim38_5.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:stageRimTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-15, 0, 0);
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
    loader.load('objects/piano/uploads_files_4987684_Piano.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:pianoTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(-7, 2.5, 8); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
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
    loader.load('objects/cello/10372_Cello_v01_l3.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:celloTexture});
        
                mesh.traverse(function(child) {
                    if (child.isMesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                mesh.position.set(5, 2.5, 5); //links(-)/rechts(+), oben/unten, vorne(+)/hinten(-)
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

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.positionZ = 0;
        /*this.moveCube = function() {
            if (cube.position.z === 0) {
                cube.position.z += 10;
            } else {
                cube.position.z = 0;
            }
        };*/
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'positionZ', 0, 100);
    //gui.add(controls, 'moveCube').name('Move Cube');

    // DRAW
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

// UPDATE RESIZE
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