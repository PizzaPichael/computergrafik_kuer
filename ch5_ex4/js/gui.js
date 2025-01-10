import { playSound, suspendSound, stopSound, muteSound, unmuteSound } from './audio.js';
var controls;

export async function setupGui() {
    return new Promise((resolve, reject) => {
        try {
        //----Gui controls----
        console.log("Setting up controls...");
        controls = new function () {
            this.rotationSpeed = 0.02;
            this.positionZ = 0;
            this.playSound = function() { playSound(); }
            this.suspendSound = function() { suspendSound(); }
            this.stopSound = function() { stopSound(); }
            this.textField1 = 'Cello on stage';
            this.textField2 = 'Piano on stage';
            this.textField3 = 'Violine on stage';
        };
        console.log("Controls: ", controls);

        var gui = new dat.GUI();
        gui.add(controls, 'rotationSpeed', 0, 0.5);
        gui.add(controls, 'positionZ', 0, 100);
        gui.add(controls, 'playSound').name('Play Sound');
        gui.add(controls, 'suspendSound').name('Suspend Sound');
        gui.add(controls, 'stopSound').name('Stop Sound');
        gui.add(controls, 'textField1').name('Text Field 1').listen();
        gui.add(controls, 'textField2').name('Text Field 2').listen();
        gui.add(controls, 'textField3').name('Text Field 3').listen();
        resolve();
        } catch (error) {
            console.error("Error in createTheaterRoom:", error);
            reject(error);
        }
    });
}

export function updateStatus(fieldId, someCondition) {
    if(fieldId === '1') {
        if (!someCondition) {
            controls.textField1 = 'Cello not on Stage';
            muteSound();
        } else {
            controls.textField1 = 'Cello on Stage';
            unmuteSound();
        }
    } else if(fieldId === '2') {
        if (!someCondition) {
            controls.textField2 = 'Piano not on Stage';
        } else {
            controls.textField2 = 'Piano on Stage';
        }

    } else if(fieldId === '3') {
        if (!someCondition) {
            controls.textField3 = 'Violine not on Stage';
        } else {
            controls.textField3 = 'Violine on Stage';
        }
    }
}