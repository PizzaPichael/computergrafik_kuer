var piano_listener;
var audioLoader;
var piano_sound;
var violin_listener;
var violin_sound;
var cello_listener;
var cello_sound;

export function setupAudio(camera) {
    //----Music----
    // create an AudioListener and add it to the camera
    piano_listener = new THREE.AudioListener();
    camera.add(piano_listener);

    audioLoader = new THREE.AudioLoader();

    //Setting up the stems
    piano_sound = new THREE.Audio(piano_listener);
    audioLoader.load('./music/stems/14_Piano.mp3', function (buffer) {
        piano_sound.setBuffer(buffer);
        piano_sound.setLoop(false);
        piano_sound.setVolume(0.5);
    });


    violin_listener = new THREE.AudioListener();
    camera.add(violin_listener);

    violin_sound = new THREE.Audio(violin_listener);
    audioLoader.load('./music/stems/17_Violin.mp3', function (buffer) {
        violin_sound.setBuffer(buffer);
        violin_sound.setLoop(false);
        violin_sound.setVolume(0.5);
    });

    cello_listener = new THREE.AudioListener();
    camera.add(cello_listener);

    cello_sound = new THREE.Audio(cello_listener);
    audioLoader.load('./music/stems/23_Cello.mp3', function (buffer) {
        cello_sound.setBuffer(buffer);
        cello_sound.setLoop(false);
        cello_sound.setVolume(0.5);
    });
}

export function playSound() {
    console.log("Playing sound...");
    if (piano_sound.context.state === 'suspended') {
        piano_sound.context.resume().then(() => {
            piano_sound.play();
        });
    } else {
        piano_sound.play();
    }
    if (violin_sound.context.state === 'suspended') {
        violin_sound.context.resume().then(() => {
            violin_sound.play();
        });
    } else {
        violin_sound.play();
    }
    if (cello_sound.context.state === 'suspended') {
        cello_sound.context.resume().then(() => {
            cello_sound.play();
        });
    } else {
        cello_sound.play();
    }

}

export function suspendSound() {
    console.log("Suspending sound...");
    piano_sound.context.suspend();
    violin_sound.context.suspend();
    cello_sound.context.suspend();
}

export function stopSound() {
    console.log("Stopping sound...");
    piano_sound.stop();
    violin_sound.stop();
    cello_sound.stop();
}

export function mutePiano() {
    console.log("Muting piano...");
    piano_sound.setVolume(0);
}

export function unmutePiano() {
    console.log("Unmuting piano...");
    piano_sound.setVolume(0.5);
}

export function muteViolin() {
    console.log("Muting violin...");
    violin_sound.setVolume(0);
}

export function unmuteViolin() {
    console.log("Unmuting violin...");
    violin_sound.setVolume(0.5);
}

export function muteCello() {
    console.log("Muting cello...");
    cello_sound.setVolume(0);
}

export function unmuteCello() { 
    console.log("Unmuting cello...");
    cello_sound.setVolume(0.5);
}
