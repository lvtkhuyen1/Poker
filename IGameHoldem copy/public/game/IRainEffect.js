export default class IRainEffect {
    constructor(image, spriteWidth, spriteHeight, canvasWidth, canvasHeight, speedRange, scaleRange, rotationSpeed) {
        this.image = image; // 단일 이미지
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.iCurrentWidth = 0;
        this.iCurrentHeight = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.initPosition(); // 위치 초기화 함수 호출

        this.speed = Math.random() * (speedRange.max - speedRange.min) + speedRange.min; // 랜덤 속도
        this.scale = Math.random() * (scaleRange.max - scaleRange.min) + scaleRange.min; // 랜덤 스케일

        this.rotation = 0;
        this.rotationSpeed = rotationSpeed; // 회전 속도

        this.fHR = 0;
        this.fVR = 0;
    }

    initPosition() {
        this.x = Math.random() * this.canvasWidth; // 랜덤 X 위치
        this.y = -Math.random() * 200; // 화면 위에서 랜덤 시작
    }

    update() {
        this.y += this.speed; // Y 위치 업데이트
        this.rotation += this.rotationSpeed; // 회전 업데이트

        if (this.y > this.canvasHeight) { // 화면 아래로 벗어나면
            this.initPosition(); // 위치 재설정
        }
    }

    OnSize(fHR, fVR, canvasWidth, canvasHeight)
    {
        this.iCurrentWidth = this.spriteWidth * fHR;
        this.iCurrentHeight = this.spriteHeight * fVR;

        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.fHR = fHR;
        this.fVR = fVR;
    }


    Render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.image, -this.iCurrentWidth * this.scale / 2, -this.iCurrentHeight * this.scale / 2, this.iCurrentWidth * this.scale, this.iCurrentHeight * this.scale);
        ctx.restore();
    }
}