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
var controls;

var gui;

export async function setupGui() {
    return new Promise((resolve, reject) => {
        try {
        //----Gui controls----
        console.log("Setting up controls...");
        controls = new function () {
            this.playSound = function() { playSound(); }
            this.suspendSound = function() { suspendSound(); }
            this.stopSound = function() { stopSound(); }
            this.textField1 = 'Cello on stage';
            this.textField2 = 'Piano on stage';
            this.textField3 = 'Violine on stage';
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
        //gui.add(controls, 'textField1').name('Text Field 1').listen();
        //gui.add(controls, 'textField2').name('Text Field 2').listen();
        //gui.add(controls, 'textField3').name('Text Field 3').listen();
        resolve();
        } catch (error) {
            console.error("Error in setupGui:", error);
            reject(error);
        }
    });
}

var previousCelloState = true;
var previousPianoState = true;
var previousViolinState = true;

export function updateStatus(fieldId, booleanOnStage) {
    if(fieldId === '1' && previousCelloState !== booleanOnStage) {
        if (!booleanOnStage) {
            //controls.textField1 = 'Cello not on Stage';
            muteCello();
            previousCelloState = false;
        } else {
            //controls.textField1 = 'Cello on Stage';
            unmuteCello();
            previousCelloState = true
        }
    } else if(fieldId === '2' && previousPianoState !== booleanOnStage) {
        if (!booleanOnStage) {
            //controls.textField2 = 'Piano not on Stage';
            mutePiano();
            previousPianoState = false;
        } else {
            //controls.textField2 = 'Piano on Stage';
            unmutePiano();
            previousPianoState = true;
        }

    } else if(fieldId === '3' && previousViolinState !== booleanOnStage) {
        if (!booleanOnStage) {
            //controls.textField3 = 'Violine not on Stage';
            muteViolin();
            previousViolinState = false;
        } else {
            //controls.textField3 = 'Violine on Stage';
            unmuteViolin();
            previousViolinState = true;
        }
    }
}

export function addControlExplanation() {
    gui.add(controls, 'explainControls').name('Full tutorial');
    gui.add(controls, 'explainMouse').name('Mouse tutorial');
    gui.add(controls, 'explainMusic').name('Music tutorial');
    gui.add(controls, 'explainIsntrument').name('Instrument tutorial');
}