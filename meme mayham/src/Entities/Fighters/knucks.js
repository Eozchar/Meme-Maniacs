import { Fighter } from './Fighter.js';
import { FighterState, FrameDelay, PushBox, HurtBox, FIGHTER_HURT_DELAY } from '../../constants/fighter.js';

export class Knucks extends Fighter {
    image = document.querySelector('img[alt="knucks"]');

    frames = new Map([
        // Idle Stance            
        ['idle-1', [[[23, 23, 44, 49], [21, 48]], PushBox.IDLE, HurtBox.KIDLE]],
        ['idle-2', [[[123, 22, 44, 50], [21, 49]], PushBox.IDLE, HurtBox.KIDLE]],
        ['idle-3', [[[221, 19, 46, 53], [23, 52]], PushBox.IDLE, HurtBox.KIDLE]],
        ['idle-4', [[[321, 24, 46, 48], [23, 47]], PushBox.IDLE, HurtBox.KIDLE]],
        
        // Move Forwards
        ['forward-1', [[[422, 17, 46, 53], [22, 53]], PushBox.IDLE, [[-15, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['forward-2', [[[522, 18, 46, 53], [22, 53]], PushBox.IDLE, [[-15, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['forward-3', [[[622, 17, 52, 55], [23, 53]], PushBox.IDLE, [[-5, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['forward-4', [[[722, 17, 51, 54], [23, 53]], PushBox.IDLE, [[-5, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],

        // Move Backwards
        ['backward-1', [[[422, 17, 46, 53], [22, 53]], PushBox.IDLE, [[-15, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['backward-2', [[[522, 18, 46, 53], [22, 53]], PushBox.IDLE, [[-15, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['backward-3', [[[622, 17, 52, 55], [23, 53]], PushBox.IDLE, [[-5, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],
        ['backward-4', [[[722, 17, 51, 54], [23, 53]], PushBox.IDLE, [[-5, -48, 30, 22], [-15, -30, 32, 19], [-13, -10, 28, 12]]]],            
    
        // Jump Up             
        ['jump-up-1', [[[4712, 21, 69, 48], [33, 47]], PushBox.IDLE, HurtBox.KIDLE]],

        // Jump Roll
        ['jump-roll-1', [[[5412, 21, 69, 47], [33, 46]], PushBox.JUMP, HurtBox.KIDLE]],
        ['jump-roll-2', [[[5510, 32, 54, 36], [33, 35]], PushBox.JUMP, HurtBox.KIDLE]],
        ['jump-roll-3', [[[5632, 36, 31, 35], [14, 34]], PushBox.JUMP, HurtBox.KIDLE]],
        ['jump-roll-4', [[[5711, 18, 60, 49], [31, 48]], PushBox.JUMP, HurtBox.KIDLE]],

        // Jump first/last frame
        ['jump-land', [[[6722, 25, 44, 47], [21, 46]], PushBox.IDLE, HurtBox.KIDLE]],
        
        // Crouch
        ['crouch-1', [[[6323, 29, 46, 40], [23, 39]], PushBox.IDLE, HurtBox.KCROUCH]],
        ['crouch-2', [[[6423, 27, 46, 42], [23, 41]], PushBox.BEND, HurtBox.KCROUCH]],
        ['crouch-3', [[[6525, 19, 44, 50], [21, 49]], PushBox.CROUCH, HurtBox.KCROUCH]],

        // Stand Turn
        ['idle-turn-1', [[[6921, 22, 41, 50], [19, 50]], PushBox.IDLE, HurtBox.KIDLE]],
        ['idle-turn-2', [[[6921, 22, 41, 50], [19, 50]], PushBox.IDLE, HurtBox.KIDLE]],
        ['idle-turn-3', [[[6921, 22, 41, 50], [19, 50]], PushBox.IDLE, HurtBox.KIDLE]],

            // Crouch Turn
        ['crouch-turn-1', [[[6833, 29, 45, 50], [25, 39]], PushBox.CROUCH, HurtBox.KIDLE]],
        ['crouch-turn-2', [[[6833, 29, 45, 50], [25, 39]], PushBox.CROUCH, HurtBox.KCROUCH]],
        ['crouch-turn-3', [[[6833, 29, 45, 50], [25, 39]], PushBox.CROUCH, HurtBox.KCROUCH]],

        // Crouch Turn
        ['light-punch-1', [[[7023, 23, 61, 49], [22, 48]], PushBox.IDLE, HurtBox.KIDLE, [15, -35, 25, 18]]],
        ['light-punch-2', [[[7123, 23, 53, 49], [22, 48]], PushBox.IDLE, HurtBox.KIDLE]],

        // L punhuh
        ['med-punch-1', [[[2329, 20, 69, 52], [20, 51]], PushBox.IDLE, HurtBox.KIDLE, [25, -50, 25, 18]]],
        ['med-punch-2', [[[2427, 20, 69, 52], [22, 51]], PushBox.IDLE, HurtBox.KIDLE, [25, -50, 25, 18]]],
        ['med-punch-3', [[[2526, 20, 69, 52], [23, 51]], PushBox.IDLE, HurtBox.KIDLE]],
        ['med-punch-4', [[[2625, 20, 69, 52], [24, 51]], PushBox.IDLE, HurtBox.KIDLE]],
        
        // Heavy Punch
        ['heavy-punch-1', [[[2720, 28, 52, 44], [26, 42]], PushBox.IDLE, HurtBox.KCROUCH]],
        ['heavy-punch-2', [[[2820, 28, 52, 44], [26, 42]], PushBox.IDLE, HurtBox.KCROUCH]],
        ['heavy-punch-3', [[[2930, 9, 52, 63], [16, 61]], PushBox.IDLE, [[-6, -58, 28, 27], [-10, -34, 32, 19], [-6, -13, 28, 12]], [11, -55, 25, 23]]],
        ['heavy-punch-4', [[[3030, 9, 52, 63], [16, 61]], PushBox.IDLE, [[-6, -58, 28, 27], [-10, -34, 32, 19], [-6, -13, 28, 12]], [11, -55, 25, 23]]],

        // Light Kick
        ['light-kick-1', [[[7323, 20, 56, 50], [29, 49]], PushBox.IDLE, HurtBox.KIDLE, [11, -25, 25, 18]]],
        ['light-kick-2', [[[7423, 22, 49, 50], [28, 49]], PushBox.IDLE, HurtBox.KIDLE]],

        // middle
        ['med-kick-1', [[[1717, 34, 77, 35], [28, 34]], PushBox.IDLE, HurtBox.KCROUCH]],
        ['med-kick-2', [[[1814, 10, 68, 59], [28, 58]], PushBox.IDLE, HurtBox.KIDLE, [16, -60, 23, 18]]],
        ['med-kick-3', [[[1914, 11, 68, 58], [28, 58]], PushBox.IDLE, HurtBox.KIDLE, [16, -60, 23, 18]]],
        
        // Hard
        ['heavy-kick-1', [[[7520, 21, 53, 51], [24, 50]], PushBox.IDLE, HurtBox.KIDLE, [11, -30, 25, 18]]],
        ['heavy-kick-2', [[[7620, 21, 53, 51], [24, 50]], PushBox.IDLE, HurtBox.KIDLE, [11, -30, 25, 18]]],
        ['heavy-kick-3', [[[7728, 24, 41, 48], [19, 47]], PushBox.IDLE, HurtBox.KIDLE]],
        ['heavy-kick-4', [[[7828, 23, 41, 49], [19, 47]], PushBox.IDLE, HurtBox.KIDLE]],

        //Hit Face
        ['hit-face-1', [[[4319, 13, 44, 59], [25, 58]], PushBox.IDLE, HurtBox.KIDLE]],
        ['hit-face-2', [[[4319, 13, 44, 59], [25, 58]], PushBox.IDLE, HurtBox.KIDLE]],
        ['hit-face-3', [[[4319, 13, 44, 59], [25, 58]], PushBox.IDLE, HurtBox.KIDLE]],
        
        //Hit B
        ['hit-body-1', [[[5122, 19, 45, 50], [22, 49]], PushBox.IDLE, HurtBox.KIDLE]],
        ['hit-body-2', [[[5122, 19, 45, 50], [22, 49]], PushBox.IDLE, HurtBox.KIDLE]],
        ['hit-body-3', [[[5122, 19, 45, 50], [22, 49]], PushBox.IDLE, HurtBox.KIDLE]],
        
        //Stun
        ['stun-1', [[[7921, 25, 41, 47], [20, 46]], PushBox.IDLE, HurtBox.KIDLE]],
        ['stun-2', [[[8021, 24, 42, 48], [20, 46]], PushBox.IDLE, HurtBox.IDLE]],
    ]);

    animations = {
        [FighterState.IDLE]: [
            ['idle-1', 58], ['idle-2', 58], ['idle-3', 58], 
            ['idle-4', 58], 
        ],
        [FighterState.WALK_FORWARDS]: [
            ['forward-1', 49], ['forward-2', 100], ['forward-3', 68], 
            ['forward-4', 68],
        ],
        [FighterState.WALK_BACKWARDS]: [
            ['backward-4', 49], ['backward-3', 100], ['backward-2', 68], 
            ['backward-1', 68],
        ],
        [FighterState.JUMP_START]: [
            ['jump-land', 50], ['jump-land', FrameDelay.TRANSITION],
        ],
        [FighterState.JUMP_UP]: [
            ['jump-up-1', FrameDelay.FREEZE],
        ],
        [FighterState.JUMP_FORWARD]: [
            ['jump-roll-1', 232], ['jump-roll-2', 83], ['jump-roll-3', 50], 
            ['jump-roll-4', 83], ['jump-roll-1', FrameDelay.FREEZE],
        ],
        [FighterState.JUMP_BACKWARD]: [
            ['jump-roll-1', 249], ['jump-roll-4', 50], ['jump-roll-3', 50], 
            ['jump-roll-2', 50], ['jump-roll-1', FrameDelay.FREEZE],
        ],
        [FighterState.JUMP_LAND]: [
            ['jump-land', 33], ['jump-land', 117], 
            ['jump-land', FrameDelay.TRANSITION], 
        ],
        [FighterState.CROUCH]: [['crouch-1', FrameDelay.FREEZE]],
        [FighterState.CROUCH_DOWN]: [
            ['crouch-3', 30], ['crouch-2', 30], ['crouch-1', 30], ['crouch-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCH_UP]: [
            ['crouch-1', 30], ['crouch-2', 30], ['crouch-3', 30], ['crouch-3', FrameDelay.TRANSITION],
        ],
        [FighterState.IDLE_TURN]: [
            ['idle-turn-3', 33], ['idle-turn-2', 33], 
            ['idle-turn-1', 33], ['idle-turn-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCH_TURN]: [
            ['crouch-turn-1', 33], ['crouch-turn-1', FrameDelay.TRANSITION], 
        ],
        [FighterState.LIGHT_PUNCH]: [
            ['light-punch-2', 33], ['light-punch-1', 66], 
            ['light-punch-2', 33], ['light-punch-2', FrameDelay.TRANSITION],
        ],
        [FighterState.MEDIUM_PUNCH]: [
            ['med-punch-4', 16], ['med-punch-3', 33], 
            ['med-punch-2', 50], ['med-punch-1', 100], 
            ['med-punch-3', 50], ['med-punch-4', 50], ['med-punch-4', FrameDelay.TRANSITION],
        ],
        [FighterState.HEAVY_PUNCH]: [
            ['heavy-punch-1', 50], ['heavy-punch-2', 33], 
            ['heavy-punch-3', 100], ['heavy-punch-4', 166], ['heavy-punch-2', 199], ['heavy-punch-1', 199], 
            ['heavy-punch-1', FrameDelay.TRANSITION],
        ],
        [FighterState.LIGHT_KICK]: [
            ['light-kick-1', 33], ['light-kick-2', 66], 
            ['light-kick-1', 33], ['light-kick-1', FrameDelay.TRANSITION],
        ],
        [FighterState.MEDIUM_KICK]: [
            ['med-kick-1', 50], ['med-kick-2', 100], 
            ['med-kick-3', 100], ['med-kick-1', 50],  ['med-kick-1', FrameDelay.TRANSITION],
        ],
        [FighterState.HEAVY_KICK]: [
            ['heavy-kick-3', 100], ['heavy-kick-4', 166], ['heavy-kick-2', 100], ['heavy-kick-1', 66], 
            ['heavy-kick-1', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_HEAD_LIGHT]: [
            ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 33], 
            ['hit-face-2', 33], ['hit-face-2', FrameDelay.TRANSITION], 
        ],
        [FighterState.HURT_HEAD_MEDIUM]: [
            ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 33], 
            ['hit-face-2', 33], ['hit-face-2', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_HEAD_HEAVY]: [
            ['hit-face-3', FIGHTER_HURT_DELAY], ['hit-face-3', 33], 
            ['stun-2', 33], ['stun-2', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_BODY_LIGHT]: [
            ['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 33], 
            ['hit-body-2', 33], ['hit-body-2', FrameDelay.TRANSITION], 
        ],
        [FighterState.HURT_BODY_MEDIUM]: [
            ['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 33], 
            ['hit-body-2', 33], ['hit-body-2', FrameDelay.TRANSITION],
        ],
        [FighterState.HURT_BODY_HEAVY]: [
            ['hit-body-3', FIGHTER_HURT_DELAY], ['hit-body-3', 33], 
            ['stun-1', 33], ['stun-1', FrameDelay.TRANSITION],
        ],
    };    
     

    initialVelocity = {
        x: {
            [FighterState.WALK_FORWARDS]: 3 * 60,
            [FighterState.WALK_BACKWARDS]: -(2 * 60),
            [FighterState.JUMP_FORWARD]: ((48 * 3) + (12 * 2)),
            [FighterState.JUMP_BACKWARD]: -((45 * 4) + (15 * 3)),
        },
        jump: -420,
    };

    gravity = 1000;  

    constructor(playerId, onAttackHit) {
        super(playerId, onAttackHit);
   }
}
