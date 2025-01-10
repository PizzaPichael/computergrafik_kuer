var listener;
var audioLoader;
var sound;

export function setupAudio(camera) {
    //----Music----
    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    sound = new THREE.Audio(listener);

    // load a sound and set it as the Audio object's buffer
    audioLoader = new THREE.AudioLoader();
    audioLoader.load('./music/Dark_Waltz.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
    });
}

export function playSound() {
    console.log("Playing sound...");
    if (sound.context.state === 'suspended') {
        sound.context.resume().then(() => {
            sound.play();
        });
    } else {
        sound.play();
    }
}

export function suspendSound() {
    console.log("Suspending sound...");
    sound.context.suspend();
}

export function stopSound() {
    console.log("Stopping sound...");
    sound.stop();
}

export function muteSound() {
    console.log("Muting sound...");
    sound.setVolume(0);
}

export function unmuteSound() {
    console.log("Unmuting sound...");
    sound.setVolume(0.5);
}
