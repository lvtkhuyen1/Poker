import IUIImage from "../js/image.js";

export default class ICardDealer
{
    constructor(x, y, tx, ty, fHR, fVR, timer, iImageWidth, iImageHeight, iCardIndex, strDeckCode, bJackpot,fAngle)
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
        if(bJackpot == true)
        {
            this.imageCard = new IUIImage(x, y, this.iImageWidth, this.iImageHeight, imageCards[54], 167, 231);
        }
        this.iCardIndex = iCardIndex;

        this.fAngle = fAngle;
    }

    SetLocation(x, y, tx, ty)
    {
        // console.log(`SetLocation : ${ax}, ${ay}, ${atx}, ${aty}`);

        // console.log(`${this.fHR}`);
        // console.log(`${this.fVR}`);

        // let x = ax * this.fHR;
        // let y = ay * this.fVR;
        // let tx = atx * this.fHR;
        // let ty = aty * this.fVR;

        // console.log(`SetLocation : ${x}, ${y}, ${tx}, ${ty}`);

        let dirx = tx - x;
        let diry = ty - y;

        let length = Math.sqrt((dirx*dirx + diry*diry));
        let dirxn = dirx / length;
        let diryn = diry / length;
        this.vDirection = {x:dirxn, y:diryn};
        this.fLength = length;

        this.fRemainedLength = length;
        this.vCurrentLocation = {x:x, y:y};

        //console.log(`x : ${x}, y : ${y}, tx : ${tx}, ty : ${ty}`);
        // console.log(`Direction x : ${this.vDirection.x}, y : ${this.vDirection.y}`);
        // console.log(`Length : ${this.fRemainedLength}`);

        this.iCompleteStep = 0;
    }


    Update()
    {
        if ( this.fRemainedLength > 1 )
        {
            const length = this.fRemainedLength * 10 * this.kTimer.GetElapsedTime();
            
            this.vCurrentLocation.x += this.vDirection.x * length;
            this.vCurrentLocation.y += this.vDirection.y * length;

            this.imageCard.SetLocation(this.vCurrentLocation.x, this.vCurrentLocation.y);

            this.fRemainedLength -= length;
            if ( this.fRemainedLength < 1 )
            {
                this.Complete();
            }

            //console.log(`x : ${this.vCurrentLocation.x}, y : ${this.vCurrentLocation.y}, R-length : ${this.fRemainedLength}`);
            //console.log(this.fRemainedLength);
        }
        //console.log(this.kTimer.GetElapsedTime());
        // this.timeEnd = new Date();
        
        // let timeElapsed = (this.timeEnd - this.timeStart) / 1000;
        // console.log(timeElapsed);

        // this.timeStart = new Date();
    }
    Render(ctx)
    {
        if ( this.fAngle == undefined )
            this.imageCard.Render(ctx);
        else
            this.imageCard.RenderRotation(ctx, this.fAngle);

        // ctx.font = "30px consolas";
        // ctx.fillStyle = "white";
        // ctx.fillText(".", this.vTargetLocation.x, this.vTargetLocation.y);

        // ctx.fillStyle = "green";
        // ctx.fillText(".", this.vCurrentLocation.x, this.vCurrentLocation.y);

    }

    Complete()
    {
        this.iCompleteStep = 1;
        console.log(`Complete!!!`);
    }
};