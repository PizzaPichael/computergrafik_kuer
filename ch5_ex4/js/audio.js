/**
 * @fileoverview  This file contains the functions to set up and play audio in the scene.
 */

//----Global variables----
var piano_listener;
var audioLoader;
var piano_sound;
var violin_listener;
var violin_sound;
var cello_listener;
var cello_sound;

/**
 * The function initializes the AudioLoader, as well
 * as the AudioListeners that are responsible for playing
 * the sounds of the individual instruments.
 * It then adds the audio files/stems to the corresponding listeners.
 * 
 * @param camera The camera to which the listeners are added.
 */
export function setupAudio(camera) {
    audioLoader = new THREE.AudioLoader();

    //Setting up the Listeners
    piano_listener = new THREE.AudioListener();
    camera.add(piano_listener);

    violin_listener = new THREE.AudioListener();
    camera.add(violin_listener);

    cello_listener = new THREE.AudioListener();
    camera.add(cello_listener);

    //Setting up the stems
    piano_sound = new THREE.Audio(piano_listener);
    audioLoader.load('./music/stems/14_Piano.mp3', function (buffer) {
        piano_sound.setBuffer(buffer);
        piano_sound.setLoop(false);
        piano_sound.setVolume(1);
    });

    violin_sound = new THREE.Audio(violin_listener);
    audioLoader.load('./music/stems/17_Violin.mp3', function (buffer) {
        violin_sound.setBuffer(buffer);
        violin_sound.setLoop(false);
        violin_sound.setVolume(1);
    });

    cello_sound = new THREE.Audio(cello_listener);
    audioLoader.load('./music/stems/23_Cello.mp3', function (buffer) {
        cello_sound.setBuffer(buffer);
        cello_sound.setLoop(false);
        cello_sound.setVolume(1);
    });
}

/**
 * The function continous playing the sound of all three instruments 
 * if they are suspendend or starts from the beginning if they were not yet played.
 */
export function playSound() {
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

/**
 * The function suspends the sound of all three instruments.
 */
export function suspendSound() {
    console.log("Suspending sound...");
    piano_sound.context.suspend();
    violin_sound.context.suspend();
    cello_sound.context.suspend();
}

/**
 * The function stops the sound of all three instruments.
 */
export function stopSound() {
    console.log("Stopping sound...");
    piano_sound.stop();
    violin_sound.stop();
    cello_sound.stop();
}

/**
 * The function mutes the piano sound.
 */
export function mutePiano() {
    piano_sound.setVolume(0);
}

/**
 * The function unmutes the piano sound.
 */
export function unmutePiano() {
    piano_sound.setVolume(1);
}

/**
 * The function mutes the violin sound.
 */
export function muteViolin() {
    violin_sound.setVolume(0);
}

/**
 * The function unmutes the violin sound.
 */
export function unmuteViolin() {
    violin_sound.setVolume(1);
}

/**
 * The function mutes the cello sound.
 */
export function muteCello() {
    cello_sound.setVolume(0);
}

/**
 * The function unmutes the cello sound.
 */
export function unmuteCello() { 
    cello_sound.setVolume(1);
}

