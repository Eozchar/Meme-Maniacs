import { 
    FIGHTER_START_DISTANCE,
    FighterDirection, 
    FighterState, 
    FIGHTER_DEFAULT_WIDTH,
    FrameDelay, 
    FIGHTER_PUSH_FRICTION,
    FighterAttackType,
    FighterAttackStrength,
    FighterHurtBox,
    hurtStateVaildFrom,
    FIGHTER_HURT_DELAY,
    FighterAttackBaseData,
} from '../../constants/fighter.js';
import { FRAME_TIME } from '../../constants/game.js';
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from '../../constants/stage.js';
import * as control from '../../engine/InputHandler.js';

import { boxOverlap, getActualBoxDimensions, rectsOverlap } from '../../utils/collisions.js';
import * as DEBUG from '../../utils/fighterDebug.js';

export class Fighter {
    frames = new Map();
    image = new Image();    
    
    animations = {};
    animationFrame = 0;
    animationTimer = 0;
    
    currentState = FighterState.IDLE;
    opponent = undefined;    
    
    hurtShake = 0;
    hurtShakeTimer = 0;
    sildeVelocity = 0;
    slideFriction = 0;

    gravity = 0;    
    velocity = { x: 0, y: 0 };
    initialVelocity = {};
    attackStruck = false;

    boxes = {
        push: { x: 0, y: 0, width: 0, height: 0 },
        hit: { x: 0, y: 0, width: 0, height: 0 },
        hurt: { 
            [FighterHurtBox.HEAD]: [0, 0, 0, 0],
            [FighterHurtBox.BODY]: [0, 0, 0, 0],
            [FighterHurtBox.FEET]: [0, 0, 0, 0],
        },
    };

    states = {
        [FighterState.IDLE]: {
            init: this.handleIdleInit.bind(this),
            update: this.handleIdleState.bind(this),
            vaildFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS,
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                FighterState.CROUCH_UP, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                FighterState.LIGHT_PUNCH, FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
                FighterState.LIGHT_KICK, FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK,
                FighterState.HURT_HEAD_LIGHT, FighterState.HURT_BODY_HEAVY, FighterState.HURT_HEAD_HEAVY,
                FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM

            ],
        },
        [FighterState.WALK_FORWARDS]: {
            init: this.handleMoveInit.bind(this),
            update: this.handleWalkForwardState.bind(this),
            vaildFrom: [
                FighterState.IDLE, FighterState.WALK_BACKWARDS,
            ],
        },
        [FighterState.WALK_BACKWARDS]: {
            init: this.handleMoveInit.bind(this),
            update: this.handleWalkBackwardsState.bind(this),
            vaildFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARDS,
            ],
        },
        [FighterState.JUMP_START]: {
            init: this.handleJumpStartInit.bind(this),
            update: this.handleJumpStartState.bind(this),
            vaildFrom: [
                FighterState.IDLE, FighterState.JUMP_LAND,
                FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS,
            ],
        },
        [FighterState.JUMP_UP]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            vaildFrom: [FighterState.JUMP_START],
        },
        [FighterState.JUMP_FORWARD]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            vaildFrom: [FighterState.JUMP_START],
        },
        [FighterState.JUMP_BACKWARD]: {
            init: this.handleJumpInit.bind(this),
            update: this.handleJumpState.bind(this),
            vaildFrom: [FighterState.JUMP_START],
        },
        [FighterState.JUMP_LAND]: {
            init: this.handleJumpLandInit.bind(this),
            update: this.handleJumpLandState.bind(this),
            vaildFrom: [
                FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ],
        },
        [FighterState.CROUCH]: {
            init: () => { },
            update: this.handleCrouchState.bind(this),
            vaildFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
        },
        [FighterState.CROUCH_DOWN]: {
            init: this.handleCrouchDownInit.bind(this),
            update: this.handleCrouchDownState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS],
        },
        [FighterState.CROUCH_UP]: {
            init: () => { },
            update: this.handleCrouchUpState.bind(this),
            vaildFrom: [FighterState.CROUCH],
        },
        [FighterState.IDLE_TURN]: {
            init: () => { },
            update: this.handleIdleTurnState.bind(this),
            vaildFrom: [
                FighterState.IDLE, FighterState.JUMP_LAND,
                FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS,
            ],
        },
        [FighterState.CROUCH_TURN]: {
            init: () => { },
            update: this.handleCrouchTurnState.bind(this),
            vaildFrom: [FighterState.CROUCH],
        },
        [FighterState.LIGHT_PUNCH]: {
            attackType: FighterAttackType.PUNCH,
            attackStrength: FighterAttackStrength.LIGHT,
            init: this.handleAttackInit.bind(this),
            update: this.handleLightPunchState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS],
        },
        [FighterState.MEDIUM_PUNCH]: {
            attackType: FighterAttackType.PUNCH,
            attackStrength: FighterAttackStrength.MEDIUM,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumPunchState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_BACKWARDS, FighterState.WALK_FORWARDS],
        },
        [FighterState.HEAVY_PUNCH]: {
            attackType: FighterAttackType.PUNCH,
            attackStrength: FighterAttackStrength.HEAVY,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumPunchState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_BACKWARDS, FighterState.WALK_FORWARDS],
        },
        [FighterState.LIGHT_KICK]: {
            attackType: FighterAttackType.KICK,
            attackStrength: FighterAttackStrength.LIGHT,
            init: this.handleAttackInit.bind(this),
            update: this.handleLightKickState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_FORWARDS, FighterState.WALK_BACKWARDS],
        },
        [FighterState.MEDIUM_KICK]: {
            attackType: FighterAttackType.KICK,
            attackStrength: FighterAttackStrength.MEDIUM,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumKickState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_BACKWARDS, FighterState.WALK_FORWARDS],
        },
        [FighterState.HEAVY_KICK]: {
            attackType: FighterAttackType.KICK,
            attackStrength: FighterAttackStrength.HEAVY,
            init: this.handleAttackInit.bind(this),
            update: this.handleMediumKickState.bind(this),
            vaildFrom: [FighterState.IDLE, FighterState.WALK_BACKWARDS, FighterState.WALK_FORWARDS],
        },
        [FighterState.HURT_HEAD_LIGHT]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : [FighterState.IDLE, FighterState.WALK_BACKWARDS, FighterState.WALK_FORWARDS],
        },
        [FighterState.HURT_HEAD_MEDIUM]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : hurtStateVaildFrom,
        },
        [FighterState.HURT_HEAD_HEAVY]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : hurtStateVaildFrom,
        },
        [FighterState.HURT_BODY_LIGHT]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : hurtStateVaildFrom,
        },
        [FighterState.HURT_BODY_MEDIUM]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : hurtStateVaildFrom,
        },
        [FighterState.HURT_BODY_HEAVY]: {
            init: this.handleHurtInit.bind(this),
            update: this.handleHurtState.bind(this),
            vaildFrom : hurtStateVaildFrom,
        },
    };    

    soundAttacks = {
        [FighterAttackStrength.LIGHT]: document.querySelector('audio#LightAttack'),
        [FighterAttackStrength.MEDIUM]: document.querySelector('audio#MediumAttack'),
        [FighterAttackStrength.HEAVY]: document.querySelector('audio#HeavyAttack'),
    };

    soundHits = {
        [FighterAttackStrength.LIGHT]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-light-punch'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-light-kick'),
        },
        [FighterAttackStrength.MEDIUM]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-middle-punch'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-middle-kick'),
        },
        [FighterAttackStrength.HEAVY]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-heavy-punch'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-heavy-hit'),
        },
    };

    soundLand = document.querySelector('audio#sound-fighter-land');
    
    constructor(playerId, onAttackHit) {
        this.playerId = playerId;
        this.onAttackHit = onAttackHit;
        this.position = { 
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        
    }

    isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    hasCollidedWithOppenent = () => rectsOverlap(
        this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x, this.opponent.position.y + this.opponent.boxes.push.y,      
        this.opponent.boxes.push.width, this.opponent.boxes.push.height,  
    );

    resetVelocities() {
        this.velocity = { x: 0, y: 0 };
    }

    resetSlide(transferToOppenent = false) {
        if (transferToOppenent) {
            this.opponent.sildeVelocity = this.sildeVelocity;
            this.opponent.slideFriction = this.slideFriction;
        }
        
        this.slideFriction = 0;
        this.sildeVelocity = 0;
    }

    getDirection() { 
        if  (
            this.position.x + this.boxes.push.x + this.boxes.push.width
            <= this.opponent.position.x + this.opponent.boxes.push.x
        )   {
            return FighterDirection.RIGHT;
        }   else if (
            this.position.x + this.boxes.push.x
            >= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width
        )   {
            return FighterDirection.LEFT;
        }

        return this.direction;
    }

    getBoxes(frameKey) {
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0, 0, 0, 0], body = [0, 0, 0, 0], feet = [0, 0, 0, 0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ]   = this.frames.get(frameKey);

        return {
            push: { x: pushX, y: pushY, width: pushWidth, height: pushHeight },
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },            
            hurt: {
                [FighterHurtBox.HEAD]: head,
                [FighterHurtBox.BODY]: body,
                [FighterHurtBox.FEET]: feet,
            },    
        };
    }

    getHitState(attackStrength, hitLocation) {
        switch (attackStrength) {
            case FighterAttackStrength.LIGHT:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_LIGHT;
                return FighterState.HURT_BODY_LIGHT;
            case FighterAttackStrength.MEDIUM:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_MEDIUM;
                return FighterState.HURT_BODY_MEDIUM;
            case FighterAttackStrength.HEAVY:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_HEAVY;
                return FighterState.HURT_BODY_HEAVY;               
        }
    }

    setAnimationFrame(frame, time) {
        const animation = this.animations[this.currentState];

        this.animationFrame = frame;
        if (this.animationFrame >= animation.length) this.animationFrame = 0;

        const [frameKey, FrameDelay] = animation[this.animationFrame];
        this.boxes = this.getBoxes(frameKey);
        this.animationTimer = time.previous + FrameDelay;
    }

    changeState(newState, time) {
        if (!this.states[newState].vaildFrom.includes(this.currentState)) {
            console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`);
            return;
        }

        this.currentState = newState;
        this.setAnimationFrame(0, time);

        this.states[this.currentState].init(time);
    }

    handleIdleInit() {
        this.resetVelocities();
    }

    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleJumpStartInit() {
        this.resetVelocities();
    }

    handleJumpLandInit() {
        this.resetVelocities();
        this.soundLand.play();
    }

    handleCrouchDownInit() {
        this.resetVelocities();
    }

    handleAttackInit() {
        this.resetVelocities();

    }

    handleHurtInit(time) {
        this.resetVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = time.previous * FRAME_TIME;
    }
    
    handleIdleState(time) {
        if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START, time);
        }   else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN, time);
        }   else if (control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_BACKWARDS, time);
        }   else if (control.isForward(this.playerId, this.direction)) {
             this.changeState(FighterState.WALK_FORWARDS, time);
        }   else if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH, time);
        }   else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH, time);
        }   else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH, time);
        }   else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        }   else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        }   else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN, time);
        }
    }

    handleWalkForwardState(time) {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START, time);
        }
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);

        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH, time);
        }   else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH, time);
        }   else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH, time);
        }   else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        }   else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        }   else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        this.direction = this.getDirection();
    }

    handleWalkBackwardsState(time) {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START, time);
        }
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);
        
        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH, time);
        }   else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH, time);
        }   else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH, time);
        }   else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        }   else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        }   else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        this.direction = this.getDirection();
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND, time);
        }
    }

    handleCrouchState(time) {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP, time);

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN, time);
        }
    }

    handleCrouchDownState(time) {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.CROUCH, time);
        }

        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.setAnimationFrame(
                Math.max(0, this.animations[FighterState.CROUCH_UP][this.animationFrame].length - this.animationFrame),
                time,
            );
        }
    }

    handleCrouchUpState(time) {
        if (this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleJumpStartState(time) {
        if (this.isAnimationCompleted()) return;
            
        if (control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.JUMP_BACKWARD, time);
        }   else if (control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.JUMP_FORWARD, time);
        }   else {
            this.changeState(FighterState.JUMP_UP, time);
        }
    }

    handleJumpLandState(time) {
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;

        if (!control.isIdle(this.playerId)) {
            this.direction = this.getDirection();

            this.handleIdleState(time);
        }   else {
            const newDirection = this.getDirection();

            if (newDirection !== this.direction) {
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            }   else {
                if (!this.isAnimationCompleted()) return;
            }
        }

        this.changeState(newState, time);
    }

    handleIdleTurnState(time) {
        this.handleIdleState();

        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchTurnState(time) {
        this.handleCrouchState();

        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleLightAttackReset() {
        this.setAnimationFrame = 0;
        this.handleAttackInit();
        this.attackStruck = false;
    }

    handleLightPunchState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightPunch(this.playerId)) this.handleLightAttackReset(time);
        
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleMediumPunchState(time) {
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleLightKickState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightKick(this.playerId)) this.handleLightAttackReset(time);
        
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleMediumKickState(time) {
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleHurtState(time) {
        if (!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.changeState(FighterState.IDLE, time)    
    }

    handleAttackHit(attackStrength, hitLocation, time) {
        const newState = this.getHitState(attackStrength, hitLocation);
        const { velocity, friction } = FighterAttackBaseData[attackStrength].slide

        this.sildeVelocity = velocity;
        this.slideFriction = friction;
        this.changeState(newState, time)

        DEBUG.logHit(this, attackStrength, hitLocation);
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        if (animation[this.animationFrame][1] <= FrameDelay.FREEZE || time.previous <= this.animationTimer) return;

        this.setAnimationFrame(this.animationFrame + 1, time);
    }

    updateStageConstraints(time, context, camera) {
        if (this.position.x > camera.position.x + context.canvas.width - FIGHTER_DEFAULT_WIDTH) {
            this.position.x = camera.position.x + context.canvas.width - FIGHTER_DEFAULT_WIDTH;
            this.resetSlide(true);
        }

        if (this.position.x < camera.position.x + FIGHTER_DEFAULT_WIDTH) {
            this.position.x = camera.position.x + FIGHTER_DEFAULT_WIDTH;
            this.resetSlide(true);
        }

        if (!this.hasCollidedWithOppenent()) return;

        if (this.position.x <= this.opponent.position.x) {
            this.position.x = Math.max(
                (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.width + this.boxes.push.x),
                camera.position.x + FIGHTER_DEFAULT_WIDTH,  
            );

            if ([
                FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ]   .includes(this.opponent.currentState)) {
                this.opponent.position.x += FIGHTER_PUSH_FRICTION * time.secondsPassed;
            }
        }

        if (this.position.x >= this.opponent.position.x) {
            this.position.x = Math.min(
                (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) + (this.boxes.push.width + this.boxes.push.x),
                camera.position.x + context.canvas.width - FIGHTER_DEFAULT_WIDTH,
            );

            if ([
                FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD
            ]   .includes(this.opponent.currentState)) {
                this.opponent.position.x += -FIGHTER_PUSH_FRICTION * time.secondsPassed;
            }
            
        }
    }

    updateHitBoxCollied(time) {
        const { attackStrength, attackType } = this.states[this.currentState];
        
        if (!attackType || this.attackStruck) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        for (const [hurtLocation, hurtBox] of Object.entries(this.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            if (!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;
            

            const hitPosition = {
                x: (actualHitBox.x + (actualHitBox.width / 2) + actualOpponentHurtBox.x + (actualOpponentHurtBox.width / 2)) / 2,
                y: (actualHitBox.y + (actualHitBox.height / 2) + actualOpponentHurtBox.y + (actualOpponentHurtBox.height / 2)) / 2,
            };
            hitPosition.x -= 4 - Math.random() * 8;
            hitPosition.y -= 4 - Math.random() * 8;

            this.onAttackHit(
                time,
                this.playerId, this.opponent.playerId, hitPosition,
                this.states[this.currentState].attackStrength,
            );
            this.opponent.handleAttackHit(attackStrength, hurtLocation);
            this.attackStruck = true;
            return
        }
    }

    updateHurtShake(time, delay) {
        if (this.hurtShake === 0 || time.previous <= this.hurtShakeTimer) return;

        const shakeAmount = (delay - time.previous < (FIGHTER_HURT_DELAY) / 2 ? 1 : 2);

        this.hurtShake = shakeAmount - this.hurtShake;
        this.hurtShakeTimer = time.previous;
    }

    updateSlide(time) { 
        if (this.sildeVelocity >= 0) return;

        this.sildeVelocity += this.slideFriction * time.secondsPassed;
        if (this.sildeVelocity < 0) return;

        this.resetSlide();
    }

    updatePosition(time) {
        this.position.x += ((this.velocity.x + this.sildeVelocity) * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;        
    }

    update(time, context, camera) {
        this.states[this.currentState].update(time, context);
        this.updateSlide(time);
        this.updatePosition(time);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateHitBoxCollied(time);
    }   

    draw(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [frameX, frameY, frameWidth, frameHeight],
            [orginX, orginY],
        ]]  = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            frameX, frameY,
            frameWidth, frameHeight,
            Math.floor((this.position.x - this.hurtShake - camera.position.x) * this.direction - orginX), 
            Math.floor(this.position.y - camera.position.y) - orginY,
            frameWidth, frameHeight
        ); 
        context.setTransform(1, 0, 0, 1, 0, 0);

        DEBUG.drawCollisionInfo(this, context, camera);
    }
}