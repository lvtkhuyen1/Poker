export default class ISacleEffect
{
    constructor(x, y, fCurrentScale, fTargetScale, timer, iImageWidth, iImageHeight, image)
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

        this.iUpdate = 0;

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
        this.iUpdate = 0;
        this.OnSize(this.fHR,this.fHR);
    }

    UpdateScale()
    {
        if ( this.iUpdate == 0 && this.fCurrentScale > this.fTargetScale )
        {
            this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.1;
            if ( this.fCurrentScale < this.fTargetScale*1.85 )
            {
                this.iUpdate = 1;
            }
        }
        else if (this.iUpdate == 1 && this.fCurrentScale > this.fTargetScale)
        {
            this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.3;
            if ( this.fCurrentScale > this.fTargetScale*1.65 )
            {
                this.iUpdate = 2;
            }
        }
        else if (this.iUpdate == 2 && this.fCurrentScale > this.fTargetScale)
        {
            this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.5;
            if ( this.fCurrentScale > this.fTargetScale*1.45 )
            {
                this.iUpdate = 3;
            }
        }else if (this.iUpdate == 3 && this.fCurrentScale > this.fTargetScale)
        {
            this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.7;
            if ( this.fCurrentScale > this.fTargetScale*1.25 )
            {
                this.iUpdate = 4;
            }
        }
        // else if (this.iUpdate == 1 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale += this.kTimer.GetElapsedTime()*0.3;
        //     if ( this.fCurrentScale > this.fTargetScale*1.95 )
        //     {
        //         this.iUpdate = 2;
        //     }
        // }
        // else if (this.iUpdate == 2 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.5;
        //     if ( this.fCurrentScale < this.fTargetScale*1.8 )
        //     {
        //         this.iUpdate = 3;
        //     }
        // }
        // else if (this.iUpdate == 3 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.4;
        //     if ( this.fCurrentScale < this.fTargetScale*1.85 )
        //     {
        //         this.iUpdate = 4;
        //     }
        // }
        // else if (this.iUpdate == 4 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.6;
        //     if ( this.fCurrentScale < this.fTargetScale*1.7 )
        //     {
        //         this.iUpdate = 5;
        //     }
        // }
        // else if (this.iUpdate == 5 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.7;
        //     if ( this.fCurrentScale < this.fTargetScale*1.5 )
        //     {
        //         this.iUpdate = 6;
        //     }
        // }
        // else if (this.iUpdate == 6 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.8;
        //     if ( this.fCurrentScale < this.fTargetScale*1.3 )
        //     {
        //         this.iUpdate = 7;
        //     }
        // }
        // else if (this.iUpdate == 7 && this.fCurrentScale > this.fTargetScale)
        // {
        //     this.fCurrentScale -= this.kTimer.GetElapsedTime()*0.9;
        //     if ( this.fCurrentScale < this.fTargetScale*1.1 )
        //     {
        //         this.iUpdate = 8;
        //     }
        // }
        else 
        {
            this.fCurrentScale -= this.kTimer.GetElapsedTime();
            if ( this.fCurrentScale < this.fTargetScale )
            {
                this.fCurrentScale = this.fTargetScale;
                this.iUpdate = 5;
            }
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

    Render(ctx)
    {
        this.UpdateScale();
        let iScaleWidth = Math.floor(this.iImageWidth * this.fCurrentScale);
        let iScaleHeight = Math.floor(this.iImageHeight * this.fCurrentScale);
        
        let tx = this.x + (this.iCurrentWidth-iScaleWidth) * 0.5;
        let ty = this.y + (this.iCurrentHeight-iScaleHeight) * 0.5;
        
        ctx.drawImage(this.image, 0, 0, this.iImageWidth, this.iImageHeight, tx, ty, iScaleWidth, iScaleHeight);
        //ctx.drawImage(this.image, 0, 0, this.iImageWidth, this.iImageHeight, 500,200,500,200 );
    }

};