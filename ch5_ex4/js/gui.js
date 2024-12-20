export function setupGui() {
    //----Gui controls----
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.positionZ = 0;
        this.playSound = function() { sound.play(); }
        this.stopSound = function() { sound.stop(); }
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'positionZ', 0, 100);
    gui.add(controls, 'playSound').name('Play Sound');
    gui.add(controls, 'stopSound').name('Stop Sound');
}