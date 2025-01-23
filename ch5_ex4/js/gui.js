/**
 * @fileoverview This file contains the setup of the GUI.
 */

import { 
    playSound,
     suspendSound, 
     stopSound, 
     mutePiano, 
     unmutePiano, 
     muteViolin, 
     unmuteViolin, 
     muteCello, 
     unmuteCello
} from './audio.js';

import { 
    explainControls 
} from './interactions.js';

//----Define global variables----
var controls;
var gui;

/**
 * This function sets up the GUI.
 * It adds all the nessecary buttons for palying the sound.
 * It initializes the buttons for calling the tutorial.
 * @returns A promise that resolves when the GUI is set up as to make sure the GUI is set up before the application starts.
 */
export async function setupGui() {
    return new Promise((resolve, reject) => {
        try {
        //----Gui controls----
        console.log("Setting up controls...");
        controls = new function () {
            this.playSound = function() { playSound(); }
            this.suspendSound = function() { suspendSound(); }
            this.stopSound = function() { stopSound(); }
            this.explainControls = function() { explainControls('all'); }
            this.explainMouse = function() { explainControls('mouse'); }
            this.explainMusic = function() { explainControls('music'); }
            this.explainIsntrument = function() { explainControls('instruments'); }
        };
        console.log("Controls: ", controls);

        gui = new dat.GUI();
        gui.add(controls, 'playSound').name('Play Music');
        gui.add(controls, 'suspendSound').name('Pause Music');
        gui.add(controls, 'stopSound').name('Stop Music');
        resolve();
        } catch (error) {
            console.error("Error in setupGui:", error);
            reject(error);
        }
    });
}

//----Global variables to keep track of the mute/unmute-status----
var previousCelloState = true;
var previousPianoState = true;
var previousViolinState = true;

/**
 * This function updates the mute/unmute-status of the instruments using the 
 * {@link mutePiano}, 
 * {@link unmutePiano}, 
 * {@link muteViolin},
 * {@link unmuteViolin}, 
 * {@link muteCello} and
 * {@link unmuteCello} functions.
 * 
 * The function also updates the global variables for the previous states of the instrument,
 * as to only update the status, when the previous status is different from the new status.
 * 
 * It was initially used to affect gui elements, thats why it is 
 * located in the gui.js.
 * Because of time issues, it was not moved to the interactions.js yet.
 * 
 * @param instrumentId The id of the instrument to be updated.
 * @param booleanOnStage Boolean parameter indicating if the instrument is on stage or not.
 */
export function updateStatus(instrumentId, booleanOnStage) {
    if(instrumentId === '1' && previousCelloState !== booleanOnStage) {
        if (!booleanOnStage) {
            muteCello();
            previousCelloState = false;
        } else {
            unmuteCello();
            previousCelloState = true
        }
    } else if(instrumentId === '2' && previousPianoState !== booleanOnStage) {
        if (!booleanOnStage) {
            mutePiano();
            previousPianoState = false;
        } else {
            unmutePiano();
            previousPianoState = true;
        }

    } else if(instrumentId === '3' && previousViolinState !== booleanOnStage) {
        if (!booleanOnStage) {
            muteViolin();
            previousViolinState = false;
        } else {
            unmuteViolin();
            previousViolinState = true;
        }
    }
}

/**
 * This function adds the tutorial buttons to the GUI.
 * The buttons call either the full tutorial or the tutorial for the mouse, music or instruments.
 */
export function addControlExplanation() {
    gui.add(controls, 'explainControls').name('Full tutorial');
    gui.add(controls, 'explainMouse').name('Mouse tutorial');
    gui.add(controls, 'explainMusic').name('Music tutorial');
    gui.add(controls, 'explainIsntrument').name('Instrument tutorial');
}