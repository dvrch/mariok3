export const GamepadButtons = {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    start: 8,
    select: 9,
    L3: 10,
    R3: 11,
    up: 12,
    down: 13,
    left: 14,
    right: 15,
    count: 16
}

export const GamepadAxes = {
    leftjoy_x: 0,  // Steer left/right
    leftjoy_y: 1,
    rightjoy_x: 2,
    rightjoy_y: 3
}

class GamepadStore {
    state = $state({
        connected: false,
        buttonA: false,
        buttonB: false,
        buttonX: false,
        buttonY: false,
        joystick: [0, 0],
        joystickRight: [0, 0],
        RB: false,
        LB: false,
        RT: false,
        LT: false,
        start: false,
        select: false,
        up: false,
        down: false,
        left: false,
        right: false,
        L3: false,
        R3: false
    });

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('gamepadconnected', () => this.updateLoop());
            window.addEventListener('gamepaddisconnected', () => this.reset());
            this.updateLoop();
        }
    }

    isButtonActive(activeButtons: number, button: number) {
        return Boolean(activeButtons & (1 << button));
    }

    reset() {
        this.state.connected = false;
        // ... reset other fields if strictly necessary, but connected=false is usually enough
    }

    updateLoop() {
        const update = () => {
            const [gamepad] = navigator.getGamepads ? navigator.getGamepads() : [];
            if (gamepad) {
                this.state.connected = true;

                let newActiveButtons = 0;
                for (let i = 0; i < gamepad.buttons.length; i++) {
                    if (gamepad.buttons[i].pressed) {
                        newActiveButtons |= (1 << i);
                    }
                }

                this.state.buttonA = this.isButtonActive(newActiveButtons, GamepadButtons.A);
                this.state.buttonB = this.isButtonActive(newActiveButtons, GamepadButtons.B);
                this.state.buttonX = this.isButtonActive(newActiveButtons, GamepadButtons.X);
                this.state.buttonY = this.isButtonActive(newActiveButtons, GamepadButtons.Y);
                this.state.LB = this.isButtonActive(newActiveButtons, GamepadButtons.LB);
                this.state.RB = this.isButtonActive(newActiveButtons, GamepadButtons.RB);
                this.state.LT = this.isButtonActive(newActiveButtons, GamepadButtons.LT);
                this.state.RT = this.isButtonActive(newActiveButtons, GamepadButtons.RT);
                this.state.start = this.isButtonActive(newActiveButtons, GamepadButtons.start);
                this.state.select = this.isButtonActive(newActiveButtons, GamepadButtons.select);
                this.state.up = this.isButtonActive(newActiveButtons, GamepadButtons.up);
                this.state.down = this.isButtonActive(newActiveButtons, GamepadButtons.down);
                this.state.left = this.isButtonActive(newActiveButtons, GamepadButtons.left);
                this.state.right = this.isButtonActive(newActiveButtons, GamepadButtons.right);
                this.state.joystick = [gamepad.axes[0], gamepad.axes[1]];
                this.state.joystickRight = [gamepad.axes[2], gamepad.axes[3]];

                requestAnimationFrame(update);
            }
        }
        update();
    }
}

export const gamepadStore = new GamepadStore();
