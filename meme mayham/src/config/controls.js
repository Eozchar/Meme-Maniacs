import { GamepadThumbstick, Control } from '../constants/control.js';

export const controls = [
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.LEFT]: 0,
            [Control.RIGHT]: 1,
            [Control.UP]: 3,
            [Control.DOWN]: 4,
            [Control.LIGHT_PUNCH]: 3,
            [Control.MEDIUM_PUNCH]: 0,
            [Control.HEAVY_PUNCH]: 2,
            [Control.LIGHT_KICK]: 3,
            [Control.MEDIUM_KICK]: 3,
            [Control.HEAVY_KICK]: 3, 
        },
        keyboard: {
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
            [Control.LIGHT_PUNCH]: 'KeyP',
            [Control.MEDIUM_PUNCH]: 'KeyO',
            [Control.HEAVY_PUNCH]: 'KeyI',
            [Control.LIGHT_KICK]: 'KeyL',
            [Control.MEDIUM_KICK]: 'KeyK',
            [Control.HEAVY_KICK]: 'KeyJ', 
        },
    },
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.LEFT]: 0,
            [Control.RIGHT]: 1,
            [Control.UP]: 3,
            [Control.DOWN]: 4,
            [Control.LIGHT_PUNCH]: 3,
            [Control.MEDIUM_PUNCH]: 0,
            [Control.HEAVY_PUNCH]: 2,
            [Control.LIGHT_KICK]: 3,
            [Control.MEDIUM_KICK]: 3,
            [Control.HEAVY_KICK]: 3, 

        },
        keyboard: {
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LIGHT_PUNCH]: 'Digit1',
            [Control.MEDIUM_PUNCH]: 'Digit2',
            [Control.HEAVY_PUNCH]: 'Digit3',
            [Control.LIGHT_KICK]: 'KeyR',
            [Control.MEDIUM_KICK]: 'KeyF',
            [Control.HEAVY_KICK]: 'KeyG', 
        },
    }
];