export default class IImage{
    constructor(x, y, width, height, sprite, cSpriteWidth, cSpriteHeight, iFontSize)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
        this.OriginSprite = sprite;
        this.iSpriteWidth = cSpriteWidth;
        this.iSpriteHeight = cSpriteHeight;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = width;
        this.iCurrentHeight = height;

        this.fHR = 1;
        this.fVR = 1;

        this.iDirection = 0;

        this.fDealingCardElapsedTime = 0;

        this.shakeAngle = 0;
        this.shakeDirection = 0;

        this.OriginFontSize = 0;
        this.iFontSize = 0;
        this.textX = 80;
        this.textY = 48;
        this.iCurrentTextX = 0;
        this.iCurrentTextY = 0;
        if(iFontSize == null)
        {
            this.OriginFontSize = 30;
            this.iFontSize = 30;
            this.strFont = '30px Gothic A1';
        }
        else
        {
            this.iFontSize = iFontSize;
            this.OriginFontSize = iFontSize;

            this.strFont = iFontSize.toString()+'px Gothic A1';       
        }
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.width * fHR;
        this.iCurrentHeight = this.height * fVR;

        this.iFontSize = this.OriginFontSize * fHR;
        this.strFont = this.iFontSize.toString()+'px Gothic A1';

        this.iCurrentTextX = this.textX * fHR;
        this.iCurrentTextY = this.textY * fVR;

        this.fHR = fHR;
        this.fVR = fVR;
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
        ctx.drawImage(
            this.sprite, 
            0, 
            0, 
            this.iSpriteWidth, 
            this.iSpriteHeight, 
            this.iCurrentX, 
            this.iCurrentY, 
            this.iCurrentWidth, 
            this.iCurrentHeight);
    }

    RenderLocation(ctx, x, y)
    {
        this.iCurrentX = x * this.fHR;
        this.iCurrentY = y * this.fVR;

        ctx.drawImage(
            this.sprite, 
            0, 
            0, 
            this.iSpriteWidth, 
            this.iSpriteHeight, 
            this.iCurrentX, 
            this.iCurrentY, 
            this.iCurrentWidth, 
            this.iCurrentHeight);
    }

    RenderRotation(ctx, angle)
    {
        // this.iCurrentX = x * this.fHR;
        // this.iCurrentY = y * this.fVR;

        let centerx = this.iCurrentX + this.iCurrentWidth/2;
        let centery = this.iCurrentY + this.iCurrentHeight/2;

        ctx.save();
        ctx.translate(centerx, centery);
        ctx.rotate(angle*Math.PI/180);
        ctx.translate(-centerx, -centery);

        ctx.drawImage(
            this.sprite, 
            0, 
            0, 
            this.iSpriteWidth, 
            this.iSpriteHeight, 
            this.iCurrentX, 
            this.iCurrentY, 
            this.iCurrentWidth, 
            this.iCurrentHeight);

        ctx.restore();
    }

    RenderLR(ctx, x, y, angle)
    {
        this.iCurrentX = x * this.fHR;
        this.iCurrentY = y * this.fVR;

        let centerx = this.iCurrentX + this.iCurrentWidth/2;
        let centery = this.iCurrentY + this.iCurrentHeight/2;

        ctx.save();
        ctx.translate(centerx, centery);
        ctx.rotate(angle*Math.PI/180);
        ctx.translate(-centerx, -centery);

        ctx.drawImage(
            this.sprite, 
            0, 
            0, 
            this.iSpriteWidth, 
            this.iSpriteHeight, 
            this.iCurrentX, 
            this.iCurrentY, 
            this.iCurrentWidth, 
            this.iCurrentHeight);

        ctx.restore();
    }
    CardRenderTurn(ctx, x, y, kTimer, cardturntype, strDeckCode, bJackpot)
    {
        this.iCurrentX = x*this.fHR;
        this.iCurrentY = y*this.fVR;
        //this.iDirection = 0;
        if(this.iDirection == 0 )
        {
            if(strDeckCode == 1){
                this.sprite = imageCards[52];
            }
            else if(strDeckCode == 2)
            {
                this.sprite = imageCards[53];
            }
            if(bJackpot)
            {
                this.sprite = imageCards[54];
            }
        }
        else 
        {
            this.sprite = this.OriginSprite;
        }
        // cardturntype = 0,1,2 : flopcard, 3 : turncard, 4 : rivercard
        if(cardturntype == 4)
        {
            if ( this.iDirection == 0)
            {
                this.iCurrentWidth -= kTimer.GetElapsedTime()*100;
                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5;
                if ( this.iCurrentWidth <= 0){
                    this.iDirection = 1;
                }
            }
            else if ( this.iDirection == 1 ) //&& this.iCurrentWidth >= 10)
            {
                this.iCurrentWidth += kTimer.GetElapsedTime()*500;
                if ( this.iCurrentWidth > (this.width*this.fHR) )
                    this.iCurrentWidth = this.width*this.fHR;
                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5 ;
            }
        }
        else if ( cardturntype == 3 )
        {
            if ( this.iDirection == 0)
            {
                this.iCurrentWidth -= kTimer.GetElapsedTime()*700;
                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5;
                if ( this.iCurrentWidth <= 0){
                    this.iDirection = 1;
                }
            }
            else if ( this.iDirection == 1 )
            {
                this.iCurrentWidth += kTimer.GetElapsedTime()*500;
                if ( this.iCurrentWidth > (this.width*this.fHR) )
                    this.iCurrentWidth = this.width*this.fHR;

                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5;
            }
        }
        else {
            if ( this.iDirection == 0)
            {
                this.iCurrentWidth -= kTimer.GetElapsedTime()*900;
                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5;
                if ( this.iCurrentWidth <= 0){
                    this.iDirection = 1;
                }
            }
            else if ( this.iDirection == 1 )
            {
                this.iCurrentWidth += kTimer.GetElapsedTime()*1000;
                if ( this.iCurrentWidth > (this.width*this.fHR) )
                    this.iCurrentWidth = this.width*this.fHR;

                this.iCurrentX = (x*this.fHR) + ((this.width*this.fHR)-this.iCurrentWidth)*0.5;
            }
        }
        
        ctx.drawImage(
            this.sprite, 
            0, 
            0, 
            this.iSpriteWidth, 
            this.iSpriteHeight, 
            this.iCurrentX, 
            this.iCurrentY, 
            this.iCurrentWidth, 
            this.iCurrentHeight);
    } 

    RenderShake(ctx, shakeSpeed, minAngle, maxAngle) {
        let centerx = this.iCurrentX + this.iCurrentWidth / 2;
        let centery = this.iCurrentY + this.iCurrentHeight / 2;
    
        if (this.shakeAngle == undefined) {
            this.shakeAngle = minAngle;
        }
    
        if (this.shakeDirection === undefined || this.shakeDirection === 0) {
            this.shakeAngle += shakeSpeed;
            if (this.shakeAngle > maxAngle) {
                this.shakeDirection = 1;
            }
        } else {
            this.shakeAngle -= shakeSpeed;
            if (this.shakeAngle < minAngle) {
                this.shakeDirection = 0;
            }
        }
    
        ctx.save();
        ctx.translate(centerx, centery);
        ctx.rotate(this.shakeAngle * Math.PI / 180);
        ctx.translate(-centerx, -centery);
    
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
    
        ctx.restore();
    }

    RenderText(ctx, strCaption, textX, textY) {
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

        ctx.font = this.strFont;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        ctx.fillText(strCaption, this.iCurrentX + this.iCurrentTextX, this.iCurrentY + this.iCurrentTextY);
    }

    RenderLS(ctx, x, y, scale) {
        this.iCurrentX = x * this.fHR;
        this.iCurrentY = y * this.fVR;
  
        ctx.save();
  
        ctx.imageSmoothingEnabled = true;
        //ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          this.sprite,
          0,
          0,
          this.iSpriteWidth,
          this.iSpriteHeight,
          this.iCurrentX,
          this.iCurrentY,
          Math.floor(this.iCurrentWidth * scale),
          Math.floor(this.iCurrentHeight * scale)
        );
        ctx.restore();
    }

    RenderLSR(ctx, x, y, scale, angle) {
        this.iCurrentX = x * this.fHR;
        this.iCurrentY = y * this.fVR;
    
        let centerx = this.iCurrentX + this.iCurrentWidth / 2;
        let centery = this.iCurrentY + this.iCurrentHeight / 2;
    
        ctx.save();
        ctx.translate(centerx, centery);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-centerx, -centery);
        ctx.imageSmoothingEnabled = true;
        //ctx.imageSmoothingQuality = "high";  
        ctx.drawImage(
          this.sprite,
          0,
          0,
          this.iSpriteWidth,
          this.iSpriteHeight,
          this.iCurrentX,
          this.iCurrentY,
          Math.floor(this.iCurrentWidth * scale),
          Math.floor(this.iCurrentHeight * scale)
        );
    
        ctx.restore();
    }
}