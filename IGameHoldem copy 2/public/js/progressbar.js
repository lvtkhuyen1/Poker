export default class IProgressBar{
    constructor(x, y, width, height, sprite, cSpriteWidth, cSpriteHeight, kTimer)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.iSpriteWidth = cSpriteWidth;
        this.iSpriteHeight = cSpriteHeight;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = width;
        this.iCurrentHeight = height;

        this.kTimer = kTimer;

        this.iBarLocation = 0;
        this.iBarLocationMax = 0;

        this.iLocationWidth = this.iCurrentWidth;
        this.iLocationSpriteWidth = this.iSpriteWidth;

        this.bEnable = false;
    }

    Clear()
    {
        ctx.drawImage(this.sprite, 0,0,0,0,0,0,0,0);
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.width * fHR;
        this.iCurrentHeight = this.height * fVR;
    }

    SetLocation(x, y)
    {
        this.x = x;
        this.y = y;

        this.iCurrentX = x;
        this.iCurrentY = y;
    }

    UpdateBarLocation(iBarLocation)
    {
        this.iBarLocation = iBarLocation;
        if ( this.iBarLocation < 0 )
            this.iBarLocation = 0;

        const cRate = (this.iBarLocation / this.iBarLocationMax);
        this.iLocationWidth = this.iCurrentWidth * cRate;
        this.iLocationSpriteWidth = this.iSpriteWidth * cRate;
    }

    UpdateTime(iBettingTime)
    {
        this.iBettingTime = iBettingTime;
        this.iBarLocation = iBettingTime;
    }

    SetBettingTime(iBettingTime)
    {
        this.iBarLocationMax = iBettingTime*1000;
    }

    Render(ctx) {
        if (this.iBarLocation > 0 && this.bEnable == true) {
            const angle = (2 * Math.PI) * (this.iBarLocation / this.iBarLocationMax); // 전체 회전 각도
    
            const centerX = this.iCurrentX + this.iCurrentWidth / 2;
            const centerY = this.iCurrentY + this.iCurrentHeight / 2;
            const radius = Math.max(this.iCurrentWidth, this.iCurrentHeight); // 반지름 설정
    
            ctx.save(); // 현재 상태 저장
            ctx.beginPath();
    
            // 상단 가운데부터 시작점 설정
            ctx.moveTo(centerX, centerY); // 중심점으로 이동
            ctx.lineTo(centerX, 0); // 상단 중앙까지 선을 그림
    
            // 중심점에서 상단 중앙을 지나 반시계 방향으로 경로 생성
            if (angle >= 0) {
                ctx.arc(centerX, centerY, radius, -0.5 * Math.PI, (-0.5 * Math.PI) - angle, true);
            }
    
            ctx.lineTo(centerX, centerY); // 다시 중심점으로 선을 그림
            ctx.clip(); // 클리핑 영역 설정
    
            // 이미지 렌더링
            ctx.drawImage(
                this.sprite,
                0,
                0,
                this.iSpriteWidth,
                this.iSpriteHeight,
                this.iCurrentX,
                this.iCurrentY,
                this.iCurrentWidth,
                this.iCurrentHeight
            );
    
            ctx.restore(); // 상태 복원
        }
    }
}