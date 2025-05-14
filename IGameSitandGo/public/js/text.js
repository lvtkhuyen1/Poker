export default class IUIText{

    constructor(x, y, iFontSize, strCaption, eAlignType)
    {
        this.x = x;
        this.y = y;
        this.strCaption = strCaption;
        this.iFontSize = iFontSize;
        this.OriginFontSize = iFontSize;

        this.strFont = iFontSize.toString()+'px Gothic A1';        

        this.iCurrentX = x;
        this.iCurrentY = y;

        this.eAlignType = eAlignType;

        this.iLength = strCaption.length;
        this.fHR = 0;
        this.fVR = 0;
    }

    Clear()
    {
        this.iCurrentY = this.y * this.fVR;
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iFontSize = this.OriginFontSize * fHR;
        // this.strFont ='bold '+ this.iFontSize.toString()+'px Gothic A1';
        this.strFont = this.iFontSize.toString()+'px Gothic A1';

        this.fHR = fHR;
        this.fVR = fVR;

        console.log(`this.iFontSize : ${this.iFontSize}`);
        console.log(this.strFont);
    }

    SetLocation(x, y)
    {
        this.x = x;
        this.y = y;

        this.iCurrentX = x;
        this.iCurrentY = y;
    }

    Render(ctx) 
    {
        if ( this.eAlignType == 0 )  // Center
        {
            ctx.textAlign = "center";
        }                
        else if ( this.eAlignType == 1 ) // Left
        {
            ctx.textAlign = "left";
        }                
        else if ( this.eAlignType == 2 ) // Right
        {
            ctx.textAlign = "right";
        }

        //this.iCurrentX = current_x;

        ctx.font = this.strFont;
        ctx.fillStyle = "white";
        ctx.fillText(this.strCaption, this.iCurrentX, this.iCurrentY);
    }

    RenderLocationUp(ctx, targetY, speed) {
        // Check if the current Y position is already at or past the target
        if (this.iCurrentY <= targetY) {
            return; // Stop the animation if the target has been reached or surpassed
        }

        // Calculate the new Y position, moving up at the specified speed
        this.iCurrentY -= speed;

        // Ensure the Y position does not go beyond the target
        if (this.iCurrentY < targetY) {
            this.iCurrentY = targetY;
        }

        if ( this.eAlignType == 0 )  // Center
        {
            ctx.textAlign = "center";
        }                
        else if ( this.eAlignType == 1 ) // Left
        {
            ctx.textAlign = "left";
        }                
        else if ( this.eAlignType == 2 ) // Right
        {
            ctx.textAlign = "right";
        }
        ctx.font = this.strFont;
        ctx.fillStyle = "rgba(20, 255, 36, 0.8)";;
        ctx.fillText(this.strCaption, this.iCurrentX, this.iCurrentY);
    }

    UpdateCaption(strCaption)
    {
        this.strCaption = strCaption;
    }

    UpdateFontSize(iWidth)
    {
        this.iFontSize = Math.round(iWidth * 0.025);
        this.strFont = this.iFontSize.toString()+'px Noto Sans KR';
    }
}