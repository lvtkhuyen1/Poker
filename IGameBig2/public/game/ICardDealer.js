import IUIImage from "../js/image.js";

export default class ICardDealer
{
    constructor(x, y, tx, ty, fHR, fVR, timer, iImageWidth, iImageHeight, iCardIndex, strDeckCode, fAngle)
    {
        // this.vLocation = {x:x, y:y};
        // this.vTargetLocation = {x:tx, y:ty};
        this.vLocation = {x:x*fHR, y:y*fVR};
        this.vTargetLocation = {x:tx*fHR, y:ty*fVR};

        this.fHR = fHR;
        this.fVR = fVR;

        this.fLength = 0;
        this.fRemainedLength = 0;
        this.vDirection = {x:0, y:0};
        this.vCurrentLocation = {x:0, y:0};

        // this.SetLocation(x, y, tx, ty);
        this.SetLocation(this.vLocation.x, this.vLocation.y, this.vTargetLocation.x, this.vTargetLocation.y);

        this.kTimer = timer;

        this.iImageWidth = iImageWidth * fHR;
        this.iImageHeight = iImageHeight * fVR;

        if(strDeckCode == 1)
        {
            this.imageCard = new IUIImage(x, y, this.iImageWidth, this.iImageHeight, imageCards[52], 167, 231);
        }
        else if(strDeckCode == 2 )
        {
            this.imageCard = new IUIImage(x, y, this.iImageWidth, this.iImageHeight, imageCards[53], 167, 231);
        }
        this.iCardIndex = iCardIndex;

        this.fAngle = fAngle;
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


    Update(frmain,flength)
    {
        if ( this.fRemainedLength > frmain )
        {
            const length = this.fRemainedLength * flength * this.kTimer.GetElapsedTime();
            
            this.vCurrentLocation.x += this.vDirection.x * length;
            this.vCurrentLocation.y += this.vDirection.y * length;

            this.imageCard.SetLocation(this.vCurrentLocation.x, this.vCurrentLocation.y);

            this.fRemainedLength -= length;

            if ( this.fRemainedLength < frmain )
            {
                //this.fRemainedLength = 0;
                this.Complete();
            }
        }
    }
    Render(ctx)
    {
        if ( this.fAngle == undefined )
            this.imageCard.Render(ctx);
        else
            this.imageCard.RenderRotation(ctx, this.fAngle);
    }

    Complete()
    {
        this.iCompleteStep = 1;
        console.log(`Complete!!!`);
    }
};