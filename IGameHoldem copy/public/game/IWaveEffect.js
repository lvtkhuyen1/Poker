export default class IWaveEffect {
    constructor(x, y, iImageWidth, iImageHeight, amplitude, frequency, speed, animationDuration, timer, image) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.iImageWidth = iImageWidth;
        this.iImageHeight = iImageHeight;
        this.amplitude = amplitude; // 물결의 높이
        this.frequency = frequency; // 물결의 주기
        this.speed = speed; // 물결의 속도
        this.kTimer = timer;
        console.log(this.kTimer);

        this.fHR = 0;
        this.fVR = 0;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = iImageWidth;
        this.iCurrentHeight = iImageHeight;

        this.animationDuration = animationDuration; // 예시: 애니메이션을 실행할 총 시간(초)
        this.elapsedTime = 0;
        this.animationCompleted = false;
    }

    Clear()
    {
        this.elapsedTime = 0;
        this.animationCompleted = false; // 애니메이션 상태 초기화
        //this.OnSize(this.fHR,this.fHR);
    }

    OnSize(fHR, fVR)
    {
        this.fHR = fHR;
        this.fVR = fVR;

        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.iImageWidth * fHR;
        this.iCurrentHeight = this.iImageHeight * fVR;
    }

    Render(ctx) {
        if (this.animationCompleted) {
            // 애니메이션이 종료된 후 원본 이미지를 올바른 크기와 위치로 복원
            ctx.drawImage(this.image, 0, 0, this.iImageWidth, this.iImageHeight, this.iCurrentX, this.iCurrentY , this.iCurrentWidth, this.iCurrentHeight);
            return;
        }

        this.elapsedTime += this.kTimer.GetElapsedTime();
        if (this.elapsedTime >= this.animationDuration) {
            this.animationCompleted = true;
        }

        const slices = 4;
        const sliceWidth = (this.iImageWidth * this.fHR) / slices;

        for (let i = 0; i < slices; i++) {
            let phase = this.elapsedTime * this.speed + (i / slices) * this.frequency;
            let waveHeight = Math.sin(phase) * this.amplitude;

            let dy = (this.y * this.fVR) - (waveHeight * this.fVR * 0.5);
            let sx = i * sliceWidth / this.fHR;
            let dx = (this.x * this.fHR) + (sliceWidth * i);

            let scaledHeight = (this.iImageHeight * this.fVR) * (1 + waveHeight / this.iImageHeight);
            let scaledWidth = sliceWidth; // 너비 조정 없음

            ctx.drawImage(this.image, sx, 0, sliceWidth / this.fHR, this.iImageHeight, dx, dy, scaledWidth, scaledHeight);
        }
    }
};
