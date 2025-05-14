import IRainEffect from "./IRainEffect.js";

export default class ActionEffectManager {
    constructor(image, count, canvasWidth, canvasHeight, speedRange, scaleRange, rotationSpeed) {
        this.effects = [];

        for (let i = 0; i < count; i++) {
            this.effects.push(new IRainEffect(image, 117, 200, canvasWidth, canvasHeight, speedRange, scaleRange, rotationSpeed));
        }
    }

    OnSize(fHR,fVR, canvasWidth, canvasHeight)
    {
        this.effects.forEach(effect => effect.OnSize(fHR,fVR, canvasWidth, canvasHeight));
    }

    update() {
        this.effects.forEach(effect => effect.update());
    }

    Render(ctx) {
        this.effects.forEach(effect => effect.Render(ctx));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    }
}