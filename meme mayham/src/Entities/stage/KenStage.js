import { STAGE_MID_POINT, STAGE_PADDING } from '../../constants/stage.js';

import { drawFrame } from '../../utils/context.js';

export class KenStage {
    image = document.querySelector('img[alt="stage"]');
    music = document.querySelector('audio#theme-song')

    frames = new Map([
        ['stage-background', [72, 208, 768, 176]],
        ['stage-boat', [8, 16, 521, 180]],
        ['stage-floor', [8, 392, 896, 56]],
    ]);
    
    constructor() {
        this.music.play();
    }

    update() { }

    drawFrame(context, frameKey, x, y) {
        drawFrame(context, this.image, this.frames.get(frameKey), x, y);
    }
    
    drawBackground(context, camera) {
        this.drawFrame(context, 'stage-background', Math.floor(16 -(camera.position.x / 2.157303)), -camera.position.y);
        this.drawFrame(context, 'stage-boat', Math.floor(150 -(camera.position.x / 1.613445)), -1 -camera.position.y);
        this.drawFrame(context, 'stage-floor', Math.floor(192 - camera.position.x), 176 - camera.position.y);
    }

    drawForeground(context, camera) {

    }
}

