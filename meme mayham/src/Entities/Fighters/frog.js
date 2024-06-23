import { Fighter } from './Fighter.js';
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY  } from '../../constants/fighter.js';

export class Frog extends Fighter {
    image = document.querySelector('img[alt="frog"]');

    frames = new Map([
        // Idle Stance         
        ['idle-1', [[[35, 24, 29, 62], [16, 61]], PushBox.IDLE, HurtBox.IDLE]],
        ['idle-2', [[[133, 23, 32, 63], [18, 62]], PushBox.IDLE, HurtBox.IDLE]],
        ['idle-3', [[[232, 22, 33, 64], [19, 63]], PushBox.IDLE, HurtBox.IDLE]],
        ['idle-4', [[[334, 22, 29, 64], [17, 63]], PushBox.IDLE, HurtBox.IDLE]],
        
        // Move Forwards            
        ['forward-1', [[[429, 23, 44, 63], [22, 62]], PushBox.IDLE, HurtBox.IDLE]],
        ['forward-2', [[[529, 25, 46, 61], [24, 61]], PushBox.IDLE, HurtBox.IDLE]],
        ['forward-3', [[[636, 23, 30, 63], [15, 63]], PushBox.IDLE, HurtBox.IDLE]],
        ['forward-4', [[[731, 24, 43, 62], [20, 62]], PushBox.IDLE, HurtBox.IDLE]],

        // Move Backwards            
        ['backward-1', [[[835, 25, 34, 73], [21, 64]], PushBox.IDLE, HurtBox.IDLE]],
        ['backward-2', [[[923, 23, 55, 74], [32, 64]], PushBox.IDLE, HurtBox.IDLE]],
        ['backward-3', [[[1037, 23, 34, 74], [20, 64]], PushBox.IDLE, HurtBox.IDLE]],
        ['backward-4', [[[1137, 23, 32, 74], [18, 64]], PushBox.IDLE, HurtBox.IDLE]],

        // Jump Up             
        ['jump-up-1', [[[3433, 24, 35, 55], [18, 54]], PushBox.JUMP, HurtBox.IDLE]],

        // Jump Roll
        ['jump-roll-1', [[[4333, 24, 35, 55], [18, 54]], PushBox.JUMP, HurtBox.IDLE]],
        ['jump-roll-2', [[[4428, 36, 47, 29], [22, 28]], PushBox.JUMP, HurtBox.IDLE]],
        ['jump-roll-3', [[[4543, 29, 29, 47], [13, 46]], PushBox.JUMP, HurtBox.IDLE]],
        ['jump-roll-4', [[[4626, 19, 41, 59], [20, 58]], PushBox.JUMP, HurtBox.IDLE]],

        // Jump first/last frame
        ['jump-land', [[[5535, 28, 29, 58], [15, 57]], PushBox.IDLE, HurtBox.IDLE]],

        // Crouch
        ['crouch-1', [[[5229, 29, 38, 57], [20, 56]], PushBox.IDLE, HurtBox.CROUCH]],
        ['crouch-2', [[[5327, 25, 39, 62], [24, 61]], PushBox.BEND,  [[-16, -48, 28, 27], [-20, -24, 32, 19], [-16, -13, 28, 12]]]],
        ['crouch-3', [[[5435, 24, 29, 62], [16, 61]], PushBox.CROUCH, HurtBox.IDLE]],

        // Stand Turn
        ['idle-turn-1', [[[5734, 24, 26, 62], [13, 61]], PushBox.IDLE, HurtBox.IDLE]],
        ['idle-turn-2', [[[5734, 24, 26, 62], [13, 61]], PushBox.IDLE, HurtBox.IDLE]],
        ['idle-turn-3', [[[5734, 24, 26, 62], [13, 61]], PushBox.IDLE, HurtBox.IDLE]],

        // Crouch Turn
        ['crouch-turn-1', [[[5832, 29, 36, 57], [18, 56]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouch-turn-2', [[[5832, 29, 36, 57], [18, 56]], PushBox.CROUCH, HurtBox.CROUCH]],
        ['crouch-turn-3', [[[5832, 29, 36, 57], [18, 56]], PushBox.CROUCH, HurtBox.CROUCH]],

        // L punhuh
        ['light-punch-1', [[[2037, 25, 34, 60], [14, 60]], PushBox.IDLE, HurtBox.IDLE, [11, -50, 25, 18]]],
        ['light-punch-2', [[[2139, 24, 35, 61], [14, 60]], PushBox.IDLE, HurtBox.IDLE, [11, -50, 25, 18]]],
        ['light-punch-3', [[[2139, 24, 35, 61], [14, 60]], PushBox.IDLE, HurtBox.IDLE]],

        // L punhuh
        ['med-punch-1', [[[2632, 14, 63, 71], [18, 71]], PushBox.IDLE, HurtBox.MPUNCH]],
        ['med-punch-2', [[[2732, 14, 63, 72], [18, 71]], PushBox.IDLE, HurtBox.MPUNCH]],
        ['med-punch-3', [[[2831, 14, 63, 72], [18, 71]], PushBox.IDLE, HurtBox.MPUNCH, [25, -45, 25, 18]]],
        ['med-punch-4', [[[2931, 14, 63, 72], [18, 71]], PushBox.IDLE, HurtBox.MPUNCH, [25, -45, 25, 18]]],

        // Heavy Punch
        ['heavy-punch-1', [[[5931, 12, 66, 72], [18, 71]], PushBox.IDLE, HurtBox.MPUNCH, [25, -35, 30, 18]]],

        // Light Kick
        ['light-kick-1', [[[6124, 19, 53, 67], [25, 66]], PushBox.IDLE, HurtBox.IDLE, [11, -45, 25, 18]]],
        ['light-kick-2', [[[6223, 21, 53, 65], [27, 64]], PushBox.IDLE, HurtBox.IDLE]],
        
        // middle
        ['med-kick-1', [[[1728, 29, 70, 58], [17, 57]], PushBox.IDLE, [[-4, -58, 30, 29], [-10, -34, 32, 19], [-16, -13, 50, 12]], [30, -50, 25, 18]]],
        ['med-kick-2', [[[1829, 29, 68, 58], [17, 57]], PushBox.IDLE, [[-4, -58, 30, 29], [-10, -34, 32, 19], [-16, -13, 50, 12]], [30, -50, 25, 18]]],
        ['med-kick-3', [[[1929, 34, 48, 52], [17, 57]], PushBox.IDLE, [[-4, -58, 30, 29], [-10, -34, 32, 19], [-16, -13, 50, 12]]]],
                    
        // Hard
        ['heavy-kick-1', [[[6321, 28, 38, 58], [18, 57]], PushBox.IDLE, HurtBox.IDLE]],
        ['heavy-kick-2', [[[6421, 23, 43, 63], [16, 62]], PushBox.IDLE, HurtBox.IDLE]],
        ['heavy-kick-3', [[[6509, 26, 76, 60], [41, 59]], PushBox.IDLE, [[-36, -58, 28, 27], [-20, -34, 32, 19], [-16, -13, 28, 12]], [11, -50, 25, 18]]],
        ['heavy-kick-4', [[[6609, 22, 77, 64], [41, 63]], PushBox.IDLE, [[-36, -58, 28, 27], [-20, -34, 32, 19], [-16, -13, 28, 12]], [11, -50, 25, 18]]],

        //Hit Face
        ['hit-face-1', [[[3538, 25, 27, 54], [11, 53]], PushBox.IDLE, HurtBox.IDLE]],
        ['hit-face-2', [[[3538, 25, 27, 54], [11, 53]], PushBox.IDLE, HurtBox.IDLE]],
        ['hit-face-3', [[[3538, 25, 27, 54], [11, 53]], PushBox.IDLE, HurtBox.IDLE]],

        //Hit B
        ['hit-body-1', [[[3738, 30, 30, 55], [11, 54]], PushBox.IDLE, HurtBox.IDLE]],
        ['hit-body-2', [[[3738, 30, 30, 55], [11, 54]], PushBox.IDLE, HurtBox.IDLE]],
        ['hit-body-3', [[[3738, 30, 30, 55], [11, 54]], PushBox.IDLE, HurtBox.IDLE]],

        //Stun
        ['stun-1', [[[6834, 30, 37, 56], [17, 55]], PushBox.IDLE, HurtBox.IDLE]],
        ['stun-2', [[[6936, 29, 33, 57], [16, 54]], PushBox.IDLE, HurtBox.IDLE]],
        ['stun-3', [[[7035, 22, 31, 65], [16, 64]], PushBox.IDLE, HurtBox.IDLE]],
    ]);

    animations = {
        [FighterState.IDLE]: [
            ['idle-1', 58], ['idle-2', 58], ['idle-3', 58], 
            ['idle-4', 58], ['idle-3', 58], ['idle-2', 58],
        ],
        [FighterState.WALK_FORWARDS]: [
            ['forward-1', 49], ['forward-2', 100], ['forward-3', 68], 
            ['forward-4', 68],
        ],
        [FighterState.WALK_BACKWARDS]: [
            ['backward-1', 49], ['backward-2', 100], ['backward-3', 68], 
            ['backward-4', 68],
        ],
        [FighterState.JUMP_START]: [
            ['jump-land', 50], ['jump-land', FrameDelay.TRANSITION],
        ],
        [FighterState.JUMP_UP]: [
            ['jump-up-1', 68],
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
            ['crouch-3', 30], ['crouch-2', 30], 
            ['crouch-1', 30], ['crouch-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCH_UP]: [
            ['crouch-1', 30], ['crouch-2', 30], 
            ['crouch-3', 30], ['crouch-3', FrameDelay.TRANSITION],
        ],
        [FighterState.IDLE_TURN]: [
            ['idle-turn-3', 33], ['idle-turn-2', 33], 
            ['idle-turn-1', 33], ['idle-turn-1', FrameDelay.TRANSITION],
        ],
        [FighterState.CROUCH_TURN]: [ 
            ['crouch-turn-1', 33], ['crouch-turn-1', FrameDelay.TRANSITION], 
        ],
        [FighterState.LIGHT_PUNCH]: [
            ['light-punch-3', 33], ['light-punch-1', 66], 
            ['light-punch-3', 33], ['light-punch-3', FrameDelay.TRANSITION],
        ],
        [FighterState.MEDIUM_PUNCH]: [
            ['med-punch-1', 16], ['med-punch-2', 33], 
            ['med-punch-3', 100], ['med-punch-4', 100], 
            ['med-punch-2', 33], ['med-punch-1', 33], ['med-punch-1', FrameDelay.TRANSITION],
        ],
        [FighterState.HEAVY_PUNCH]: [
            ['med-punch-1', 50], ['med-punch-2', 33], 
            ['heavy-punch-1', 100], ['med-punch-2', 166], ['med-punch-1', 199], 
            ['med-punch-1', FrameDelay.TRANSITION],
        ],
        [FighterState.LIGHT_KICK]: [
            ['light-kick-1', 33], ['light-kick-2', 66], 
            ['light-kick-1', 33], ['light-kick-1', FrameDelay.TRANSITION],
        ],
        [FighterState.MEDIUM_KICK]: [
            ['med-kick-3', 16], ['med-kick-2', 50], 
            ['med-kick-1', 100], ['med-kick-3', 33],  ['med-kick-3', FrameDelay.TRANSITION],
        ],
        [FighterState.HEAVY_KICK]: [
            ['heavy-kick-1', 50], ['heavy-kick-2', 33], 
            ['heavy-kick-3', 100], ['heavy-kick-4', 166], ['heavy-kick-2', 100],
            ['heavy-kick-2', FrameDelay.TRANSITION],
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
