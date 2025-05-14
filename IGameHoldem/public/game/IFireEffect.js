export default class IFireEffect {
    constructor(x, y, particleCount, particleLife, timer, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.fHR = 0;
        this.fVR = 0;
        this.particleCount = particleCount;
        this.particleLife = particleLife;
        this.timer = timer;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.particles = [];
        this.explodingParticles = [];
        //this.isExploding = false;

        this.initRisingParticles();
    }

    initRisingParticles() {
        //for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvasWidth,
                y: this.canvasHeight,
                life: this.particleLife,
                velocityX: 0,
                velocityY: -4, // 속도 조절
                size: 5,
                color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`
            });
        //}
    }

    initExplodingParticles(x, y) {
        for (let i = 0; i < this.particleCount; i++) {
            this.explodingParticles.push({
                x: x,
                y: y,
                life: Math.random() * 20 + 20,
                velocityX: Math.random() * 5 - 3,
                velocityY: Math.random() * 5 - 3,
                size: Math.random() * 4 + 1,
                color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`
            });
        }
        //this.isExploding = true;
    }

    updateParticles() {
        // 상승하는 파티클 업데이트
        this.particles.forEach((particle, index) => {
            particle.y += particle.velocityY;

            // 높이의 반절에서 3/4 사이 랜덤 위치에서 폭발
            let explodeHeight = this.canvasHeight/4 + Math.random() * (this.canvasHeight / 3);

            if (particle.y < explodeHeight ) { // 특정 높이에 도달하면 폭발
                this.initExplodingParticles(particle.x, particle.y);
                this.particles.splice(index, 1); // 현재 상승 파티클 제거
            }
        });

        // 상승 파티클은 지속적으로 랜덤한 타이밍으로 생성
        if (Math.random() < 0.1) { // 예: 10% 확률로 새 파티클 생성
            this.initRisingParticles();
        }

        // 폭발 파티클 업데이트
        this.explodingParticles.forEach(particle => {
            particle.life -= 1;
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.size *= 0.95;
        });

        // 폭발 파티클 정리
        this.explodingParticles = this.explodingParticles.filter(particle => particle.life > 0);
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.fHR = fHR;
        this.fVR = fVR;
    }

    Render(ctx) {
        this.updateParticles();
            this.particles.forEach(particle => {
    
                // 직사각형 모양으로 파티클을 그립니다.
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x, particle.y, 3, 10); // 가로 2, 세로 10 크기의 직사각형
            });

        this.explodingParticles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
    }
}