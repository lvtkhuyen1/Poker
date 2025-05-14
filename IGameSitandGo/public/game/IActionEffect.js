export default class IActionEffect
{
    constructor(x, y, fCurrentScale, fTargetScale, speed, timer, iImageWidth, iImageHeight, image, direction, shakeIntensity)
    {
        this.image = image;
        this.x = x;
        this.y = y;

        this.fscale = fCurrentScale;
        this.iOriginWidth = iImageWidth;
        this.iOriginHeight = iImageHeight;

        this.fCurrentScale = fCurrentScale;
        this.fTargetScale = fTargetScale;
        this.iImageWidth = iImageWidth;
        this.iImageHeight = iImageHeight;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = iImageWidth;
        this.iCurrentHeight = iImageHeight;

        this.kTimer = timer;

        this.isScaling = true; // 초기 스케일링 플래그
        this.isActive = true;

        this.direction = direction; // 'rightToLeft' 또는 'bottomToTop'
        this.speed = speed;
        this.speedVariance = 10; // 속도 변화 범위 설정
        this.shakeIntensity = shakeIntensity; // 흔들림 강도
        this.scaleSpeed = 0.02; // 스케일 변화 속도

        this.fHR = 0;
        this.fVR = 0;
    }

    Clear()
    {
        this.fCurrentScale = this.fscale;
        this.iImageWidth = this.iOriginWidth;
        this.iImageHeight = this.iOriginHeight;
        this.iCurrentX = this.x;
        this.iCurrentY = this.y;
        this.iCurrentWidth = this.iOriginWidth;
        this.iCurrentHeight = this.iOriginHeight;
        this.isScaling = true;
        this.isActive = true;
        this.OnSize(this.fHR,this.fHR);
    }

    UpdateLocation() {
        if (this.isScaling) {
            this.ScaleUpDown();
        }
        let randomSpeed = this.speed + (Math.random() - 0.5) * this.speedVariance;
        // 위치 업데이트 로직
        if (this.direction === 'rightToLeft') {
            this.x -= randomSpeed;
        } else if (this.direction === 'bottomToTop') {
            this.y -= randomSpeed;
        }

        // 흔들림 효과: X와 Y 좌표에 무작위 변동 추가
        this.x += (Math.random() - 0.5) * this.shakeIntensity;
        this.y += (Math.random() - 0.5) * this.shakeIntensity;

        // S자 모양으로 움직이기 위한 추가 로직
        if (this.direction === 'rightToLeft') {
            this.y += Math.sin(this.x / 130) * 6; // X좌표에 따라 Y좌표 조정
        } else if (this.direction === 'bottomToTop') {
            this.x += Math.sin(this.y / 130) * 6; // Y좌표에 따라 X좌표 조정
        }
    }

    ScaleUpDown() {
        if (this.scaleSpeed > 0 && this.fCurrentScale >= this.fTargetScale) {
            // 타겟 스케일에 도달하면 방향 전환
            this.scaleSpeed = -this.scaleSpeed;
        } else if (this.scaleSpeed < 0 && this.fCurrentScale <= this.fscale) {
            // 원래 스케일에 도달하면 스케일링 중단
            this.fCurrentScale = this.fscale;
            this.isScaling = false;
        }
    
        // 스케일 업데이트
        if (this.isScaling) {
            this.fCurrentScale += this.scaleSpeed;
        }
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.iImageWidth * fHR;
        this.iCurrentHeight = this.iImageHeight * fVR;

        this.fHR = fHR;
        this.fVR = fVR;
    }

    Render(ctx) {
        this.UpdateLocation();
    
        // 화면 밖으로 벗어났는지 체크
        let imageWidthBuffer = this.iImageWidth;
        if (this.x < -imageWidthBuffer || this.x > ctx.canvas.width + imageWidthBuffer) {
            // 화면의 왼쪽 또는 오른쪽 경계에서 이미지 너비만큼 떨어진 위치에 도달하면 비활성화
            this.isActive = false;
        }
    
        if (this.isActive) {
            let iScaleWidth = Math.floor(this.iImageWidth * this.fCurrentScale);
            let iScaleHeight = Math.floor(this.iImageHeight * this.fCurrentScale);
    
            let tx = this.x - iScaleWidth / 2;
            let ty = this.y - iScaleHeight / 2;
    
            ctx.drawImage(this.image, 0, 0, this.iImageWidth, this.iImageHeight, tx, ty, iScaleWidth, iScaleHeight);
        }
    }
};