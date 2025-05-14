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
        this.iBarLocationMax = iBettingTime;
    }

    Render(ctx) 
    {
        if ( this.iBarLocation > 0 && this.bEnable == true)
        {
            this.UpdateBarLocation(this.iBarLocation);
            ctx.drawImage(
                    this.sprite, 
                    0, 
                    0, 
                    //this.iSpriteWidth, 
                    this.iLocationSpriteWidth,
                    this.iSpriteHeight, 
                    this.iCurrentX, 
                    this.iCurrentY, 
                    //this.iCurrentWidth, 
                    this.iLocationWidth,
                    this.iCurrentHeight);
        }
    }
}