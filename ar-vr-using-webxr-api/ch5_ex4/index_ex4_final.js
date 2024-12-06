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

    
    const planeTextureMap = textureLoader.load('textures/pebbles.jpg');
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
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(cubeSize + 1, cubeSize + 1, 0);
    scene.add(cube);

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(sphere);

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
    cube.castShadow = true; //Add shadow to cube
    sphere.castShadow = true;   //Add shadow to sphere

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
    var texture = textureLoader.load('textures/stone.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    var loader = new THREE.OBJLoader();

    loader.load('objects/teapot.obj',
        function(mesh) {
                var material = new THREE.MeshPhongMaterial({map:texture});
        
                mesh.children.forEach(function(child) {
                child.material = material;
                child.castShadow = true;
                });

                mesh.position.set(-15, 2, 0);
                mesh.rotation.set(-Math.PI / 2, 0, 0);
                mesh.scale.set(0.005, 0.005, 0.005);
        
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


    // Schritt 4: Abschlussaufgabe

    let h1 = 3;
    let h2 = 2.4;
    let h3 = 1.8;

    let seg1, seg2, seg3, pointlight1;
    seg1 = addSeg(scene, h1, 0, 0);
    seg2 = addSeg(seg1, h2, h1, 1);
    seg3 = addSeg(seg2, h3, h2, 2);
    pointlight1 = addPointLight(seg3, h3, 3);

    seg1.position.x = -25;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.rotY1 = 0;
        this.rotZ1 = 0;
        this.rotZ2 = 0;
        this.rotZ3 = 0;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'rotY1', 0, 2 * Math.PI);
    gui.add(controls, 'rotZ1', 0, 2 * Math.PI);
    gui.add(controls, 'rotZ2', 0, 2 * Math.PI);
    gui.add(controls, 'rotZ3', 0, 2 * Math.PI);    

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
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // rotate the sphere around its axes
        sphere.rotation.x += controls.rotationSpeed;
        sphere.rotation.y += controls.rotationSpeed;
        sphere.rotation.z += controls.rotationSpeed;

        /*
        // rotate the teapot around its axes
        teapot.rotation.x += controls.rotationSpeed;
        teapot.rotation.y += controls.rotationSpeed;
        teapot.rotation.z += controls.rotationSpeed;
        */

        //Schritt 4: Abschlussaufgabe
        seg1.rotation.y = controls.rotY1;
        seg1.rotation.z = controls.rotZ1;
        seg2.rotation.z = controls.rotZ2;
        seg3.rotation.z = controls.rotZ3;

        //light.position.x = 20*Math.cos(time);
        //light.position.y = 20*Math.sin(time);

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

//Schirtt 4: Abschlussaufgabe
function addSeg(parent, height, posY, partNr) {
    var axisSphere = new THREE.Group();
    if (partNr == 0) {
        axisSphere.position.y = posY;
        
    }
    else {
        axisSphere.position.y = 2*posY;
    }
        
    parent.add(axisSphere);

    var sphereGeometry = new THREE.SphereGeometry(1, 20, 20); // radius 1 -> diameter 2
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.scale.x = 1
    sphere.scale.y = height
    sphere.scale.z = 1
    sphere.position.x = 0
    sphere.position.y = height
    sphere.position.z = 0
    sphere.castShadow = true;

    sphere.receiveShadow = true;

    axisSphere.add(sphere);

    const tripod = new THREE.AxesHelper(5);
    axisSphere.add(tripod);

    return axisSphere;
}

function addPointLight(parent, posY, partNr) {
    var axisPointLight = new THREE.Group();
    if (partNr == 0) {
        axisPointLight.position.y = posY;
    }
    else {
        axisPointLight.position.y = 2*posY;
    }
    parent.add(axisPointLight);

    var pointLight = new THREE.PointLight(0x7FFF00);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    axisPointLight.add(pointLight);

    const tripod = new THREE.AxesHelper(5);
    axisPointLight.add(tripod);

    return axisPointLight;
}

//Für den ROboterarm dreimal hintereinander die addSeg Funktion aufrufen