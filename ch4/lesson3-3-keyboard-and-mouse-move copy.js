main();

let angleX = 0;

let angleY = 0;

let angleZ = 0;

function checkKey(event) {

    console.log(event.keyCode);

    switch (event.keyCode) {

        case 88 /*"KeyX"*/: angleX += 0.1; break;

        case 89 /*"KeyY"*/: angleY += 0.1; break;

        case 90 /*"KeyZ"*/: angleZ += 0.1; break;

    }

}

function handleMouseMove(event) {
  // Aktualisiere angleX und angleY basierend auf der Mausposition
  angleX = event.clientX * 0.01; // Skaliere, um die Bewegung zu glätten
  angleY = event.clientY * 0.01;
}

// Funktion zur Behandlung des Mausklicks (rechtsklick für Z-Winkel)
function handleMouseDown(event) {
  if (event.button === 0) { // Rechte Maustaste
      angleZ += 0.1;
  }
}


function main() {
  /*========== Create a WebGL Context ==========*/
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext('webgl');
  if (!gl) {
      console.log('WebGL unavailable');
  } else {
      console.log('WebGL is good to go');
  }

  /*========== Define and Store the Geometry ==========*/
  const squares = [
      // front face
      -0.3 , -0.3, -0.3,
        0.3, -0.3, -0.3,
        0.3, 0.3, -0.3,  

      -0.3, -0.3, -0.3,
      -0.3, 0.3, -0.3,
        0.3, 0.3, -0.3,                  

        // back face
      -0.2, -0.2, 0.3,
      0.4, -0.2, 0.3,
      0.4, 0.4, 0.3, 

      -0.2, -0.2, 0.3,
      -0.2, 0.4, 0.3,
      0.4, 0.4, 0.3, 
      
      // top face
      -0.3, 0.3, -0.3,
      0.3, 0.3, -0.3,
      -0.2, 0.4, 0.3,

      0.4, 0.4, 0.3,
      0.3, 0.3, -0.3,
      -0.2, 0.4, 0.3,
  ];
    
  // buffer
  const origBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

  const squareColors = [
    0.0,  0.0,  1.0,  1.0,
    0.0,  0.0,  1.0,  1.0,  
    0.0,  0.0,  1.0,  1.0,  
    0.0,  0.0,  1.0,  1.0,  
    0.0,  0.0,  1.0,  1.0,  
    0.0,  0.0,  1.0,  1.0,      
    1.0,  0.0,  0.0,  1.0,   
    1.0,  0.0,  0.0,  1.0,  
    1.0,  0.0,  0.0,  1.0,  
    1.0,  0.0,  0.0,  1.0,  
    1.0,  0.0,  0.0,  1.0,  
    1.0,  0.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
    0.0,  1.0,  0.0,  1.0,
  ];
    
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

  /*========== Shaders ==========*/

  const vsSource = `
    attribute vec4 aPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
      vColor = aVertexColor;
  }
  `;

  const fsSource = `
      varying lowp vec4 vColor;

      void main() {
          gl_FragColor = vColor;
  }
  `;

  //create shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.shaderSource(fragmentShader, fsSource);

  // compile shaders
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return null;
    }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return null;
  }

  // create program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link program
  gl.linkProgram(program);
  gl.useProgram(program);
  
  let cubeRotation = 0.0;
  let then = 0;

  /*========== Connect the attribute with the vertex shader ==========*/
  function render(now){       
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    
    const posAttribLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, origBuffer);
    gl.vertexAttribPointer(posAttribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttribLocation);

    const colorAttribLocation = gl.getAttribLocation(program, "aVertexColor");
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribLocation);

    
    const modelMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
    const projMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
    
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
    
    const modelViewMatrix = mat4.create();
    
    mat4.translate(modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, .0, -5.0]);  // amount to translate
      mat4.rotate(modelViewMatrix, modelViewMatrix, angleX, [1, 0, 0]);      

      mat4.rotate(modelViewMatrix, modelViewMatrix, angleY, [0, 1, 0]);      
  
      mat4.rotate(modelViewMatrix, modelViewMatrix, angleZ, [0, 0, 1]);       
    
    gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelViewMatrix);
            
    /*========== Drawing ========== */
    gl.clearColor(1, 1, 1, 1);
    
    gl.enable(gl.DEPTH_TEST);
    //gl.depthFunc(gl.LEQUAL);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Draw the points on the screen
    const mode = gl.TRIANGLES;
    const first = 0;
    const count = 18;
    gl.drawArrays(mode, first, count);   
    cubeRotation += deltaTime;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  window.onkeydown = checkKey;
  window.onmousemove = handleMouseMove;
  window.onmousedown = handleMouseDown;
}