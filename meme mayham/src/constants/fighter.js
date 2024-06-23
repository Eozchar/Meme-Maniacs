import { FRAME_TIME } from "./game.js";

export const FIGHTER_PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;
export const FIGHTER_HURT_DELAY = 20;
export const FIGHTER_DEFAULT_WIDTH = 40;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

export const FighterId = {
    FROG: 'Frog',
    KNUCKS: 'Knucks',
};

export const FighterAttackType = {
    PUNCH: 'punch',
    KICK: 'kick',
};

export const FighterAttackStrength = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
};

export const FighterHurtBox = {
    HEAD: 'head',
    BODY: 'body',
    FEET: 'feet',
};

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        score: 100,
        damage: 12,
        slide: {
            velocity: -12 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.MEDIUM]: {
        score: 300,
        damage: 20,
        slide: {
            velocity: -16 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.HEAVY]: {
        score: 500,
        damage: 28,
        slide: {
            velocity: -22 * FRAME_TIME,
            friction: 800,
        },
    }
};

export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARDS: 'walkForwards',
    WALK_BACKWARDS: 'walkBackwards',
    JUMP_START: 'jumpStart',
    JUMP_UP: 'jumpUp',
    JUMP_FORWARD: 'jumpForward',
    JUMP_BACKWARD: 'jumpBackward',
    JUMP_LAND: 'jumpLand',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouchDown',
    CROUCH_UP: 'crouchUp',
    IDLE_TURN: 'idleTurn',
    CROUCH_TURN: 'crouchTurn',
    LIGHT_PUNCH: 'lightPunch',
    MEDIUM_PUNCH: 'mediumPunch',
    HEAVY_PUNCH: 'heavyPunch',
    LIGHT_KICK: 'lightKick',
    MEDIUM_KICK: 'mediumKick',
    HEAVY_KICK: 'heavyKick',
    HURT_HEAD_LIGHT: 'hurtHeadLight',
    HURT_HEAD_MEDIUM: 'hurtHeadMedium',
    HURT_HEAD_HEAVY: 'hurtHeadHard',
    HURT_BODY_LIGHT: 'hurtBodyLight',
    HURT_BODY_MEDIUM: 'hurtBodyMedium',
    HURT_BODY_HEAVY: 'hurtBodyHeavy',
    SPECIAL_1: 'special'
};

export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
};



export const PushBox = {
    IDLE: [-16, -58, 32, 60],
    JUMP: [-16, -58, 32, 66],
    BEND: [-16, -58, 32, 58],
    CROUCH: [-16, -50, 32, 50],    
};

export const HurtBox = {
    IDLE: [[-16, -58, 28, 27], [-20, -34, 32, 19], [-16, -13, 28, 12]],
    KIDLE: [[-10, -48, 28, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]],
    CROUCH: [[-16, -48, 28, 27], [-20, -24, 32, 12], [-16, -13, 28, 12]],
    MPUNCH: [[-16, -65, 35, 34], [-20, -34, 32, 19], [-16, -13, 28, 12]],
    KCROUCH: [[-10, -38, 28, 22], [-15, -20, 32, 19], [-13, -10, 35, 12]]
};

export const hurtStateVaildFrom = [
    FighterState.IDLE, FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS,
    FighterState.JUMP_START, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
    FighterState.LIGHT_PUNCH, FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
    FighterState.LIGHT_KICK, FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK,
    FighterState.HURT_BODY_HEAVY, FighterState.HURT_HEAD_HEAVY, FighterState.HURT_BODY_LIGHT, 
    FighterState.HURT_BODY_MEDIUM, FighterState.HURT_HEAD_LIGHT, FighterState.HURT_BODY_MEDIUM, 
];