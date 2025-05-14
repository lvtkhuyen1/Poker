import IUIImage from "../js/image.js";

export default class IObjectDealer
{
    constructor(x, y, tx, ty, fHR, fVR, timer, iWidth, iHeight, iImageWidth, iImageHeight, image, iState, delay)
    {
        this.vLocation = {x:x*fHR, y:y*fVR};
        this.vTargetLocation = {x:tx*fHR, y:ty*fVR};

        this.fHR = fHR;
        this.fVR = fVR;

        this.fLength = 0;
        this.fRemainedLength = 0;
        this.vDirection = {x:0, y:0};
        this.vCurrentLocation = {x:0, y:0};

        this.SetLocation(this.vLocation.x, this.vLocation.y, this.vTargetLocation.x, this.vTargetLocation.y);

        this.kTimer = timer;

        this.iImageWidth = iImageWidth;
        this.iImageHeight = iImageHeight;

        this.iWidth = iWidth * fHR;
        this.iHeight = iHeight * fHR;

        this.imageCard = new IUIImage(x, y, this.iWidth, this.iHeight, image, iImageWidth, iImageHeight);
        
        this.fAngle = Math.random() * 360;

        this.iState = iState;
        this.delay = delay; // 지연 시간
        this.elapsedTime = 0; // 경과 시간
    }

    SetLocation(x, y, tx, ty)
    {
        let dirx = tx - x;
        let diry = ty - y;

        let length = Math.sqrt((dirx*dirx + diry*diry));
        let dirxn = dirx / length;
        let diryn = diry / length;
        this.vDirection = {x:dirxn, y:diryn};
        this.fLength = length;

        this.fRemainedLength = length;
        this.vCurrentLocation = {x:x, y:y};

        this.iCompleteStep = 0;
    }


    Update()
    {
        if ( this.fRemainedLength > 1 )
        {
            this.elapsedTime += this.kTimer.GetElapsedTime();
            let speed = 10;
            if(this.iState == 1)
            {
                speed = 10;
                const length = this.fRemainedLength * speed * this.kTimer.GetElapsedTime();
            
                this.vCurrentLocation.x += this.vDirection.x * length;
                this.vCurrentLocation.y += this.vDirection.y * length;

                this.imageCard.SetLocation(this.vCurrentLocation.x, this.vCurrentLocation.y);

                this.fRemainedLength -= length;
                if ( this.fRemainedLength < 1 )
                {
                    this.Complete();
                }
            }
            else if(this.iState == 2)
            {
                if (this.elapsedTime > this.delay && this.fRemainedLength > 1) {
                    speed = 5;
                    const length = this.fRemainedLength * speed * this.kTimer.GetElapsedTime();
                
                    this.vCurrentLocation.x += this.vDirection.x * length;
                    this.vCurrentLocation.y += this.vDirection.y * length;

                    this.imageCard.SetLocation(this.vCurrentLocation.x, this.vCurrentLocation.y);

                    this.fRemainedLength -= length;
                    if ( this.fRemainedLength < 1 )
                    {
                        this.Complete();
                    }
                }
            }
            
        }
    }
    RenderRotation(ctx)
    {
        this.imageCard.RenderRotation(ctx, this.fAngle);
    }

    Render(ctx)
    {
        if(this.iState == 2)
        {
            if(this.iCompleteStep != 1)
            {
                this.imageCard.Render(ctx);
            }
        }
        else
        {
            this.imageCard.Render(ctx);
        }
    }

    Complete()
    {
        this.iCompleteStep = 1;
        console.log(`Complete!!!`);
    }
};