var EButtonActionType = Object.freeze({"None":0, "Over":1, "Down":2, "Disable":3});


export default class IUIButton{
    constructor(x, y, width, height, click_handler, sprite, cSpriteWidth, cSpriteHeight, strCaption, strColor, iFontSize, strAmount, strBetpercent, eState, Label)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.click_handler  = click_handler;
        this.eButtonState = EButtonActionType.None;
        this.bDown = false;
        this.sprite = sprite;
        this.iSpriteWidth = cSpriteWidth;
        this.iSpriteHeight = cSpriteHeight;
        this.strCaption = strCaption;

        this.iBettingCredits = 0;

        this.iCurrentX = x;
        this.iCurrentY = y;
        this.iCurrentWidth = width;
        this.iCurrentHeight = height;

        this.bCelebration = 0;

        this.iElapsedTime = 0;

        this.bEnable = true;
        this.strColor = strColor;
        this.OriginFontSize = 0;
        this.iFontSize = 0;
        this.strAmount = '';
        this.eState = 0;
        this.strBetpercent = '';
        this.Label = null;
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
            this.strFont = iFontSize.toString() + 'px Gothic A1';
        }
        if(eState != null || strAmount != null || strBetpercent != null)
        {
            this.eState = eState;
            this.strAmount = strAmount;
            this.strBetpercent = strBetpercent;
        }

        if(Label != null)
        {
            this.Label = Label;
            console.log(`Button`);
            console.log(this.Label);
        }

        this.fHR = 0;
        this.fVR = 0;
    }

    SetState(state)
    {
        this.eButtonState = state;

        //console.log(state);
    }

    OnSize(fHR, fVR)
    {
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.width * fHR;
        this.iCurrentHeight = this.height * fVR;

        this.iFontSize = this.OriginFontSize * fHR;
        // this.strFont ='bold '+ this.iFontSize.toString()+'px Gothic A1';
        this.strFont = this.iFontSize.toString()+'px Gothic A1';
        console.log(this.iFontSize);

        this.fHR = fHR;
        this.fVR = fVR;
    }

    In(mouse)
    {
        if ( this.eButtonState == EButtonActionType.Disable )
            return false;

        //if (this.iCurrentX < mouse.x && this.x + this.iCurrentWidth > mouse.x && this.y < mouse.y && this.iCurrentY + this.iCurrentHeight > mouse.y) 
        if (this.iCurrentX < mouse.x && this.iCurrentX + this.iCurrentWidth > mouse.x && this.iCurrentY < mouse.y && this.iCurrentY + this.iCurrentHeight > mouse.y) 
        { 
            return true;
        }
        return false;
    }

    Over(mouse)
    {
        if ( this.eButtonState == EButtonActionType.Disable )
            return false;

            //if (this.x < mouse.x && this.x + this.width > mouse.x && this.y < mouse.y && this.y + this.height > mouse.y) 
        if ( true == this.In(mouse))
        { 
            if ( this.eButtonState == EButtonActionType.None)
            {
                if ( this.bDown == true )
                    //this.eButtonState = EButtonActionType.Down;
                    this.SetState(EButtonActionType.Down);
                else
                    //this.eButtonState = EButtonActionType.Over;
                    this.SetState(EButtonActionType.Over);
            }
            // else if ( this.eButtonState == EButtonActionType.DownNone)
            // this.eButtonState = EButtonActionType.Over;

            return true;
        }
  
         //if ( this.eButtonState == EButtonActionType.None)
             //this.eButtonState = EButtonActionType.None;
             this.SetState(EButtonActionType.None);
        //  else if ( this.eButtonState == EButtonActionType.Down)
        //     this.eButtonSate = EButtonActionType.DownNone;
        return false;
    }

    Touch(touch)
    {
        if ( this.eButtonState == EButtonActionType.Disable )
            return false;

                //if (this.x < mouse.x && this.x + this.width > mouse.x && this.y < mouse.y && this.y + this.height > mouse.y) 
                if ( this.eButtonState == EButtonActionType.None)
                {
                    if ( this.bDown == true ){
                        //this.eButtonState = EButtonActionType.Down;
                        //alert("down~!!!");
                        this.SetState(EButtonActionType.Down);
                    }
                    else{
                        //this.eButtonState = EButtonActionType.Over;
                        //alert("over~!!!");
                        this.SetState(EButtonActionType.Over);
                    }
                    return true;
                }
        // this.SetState(EButtonActionType.None);
        // return false;
    }

    Down(mouse)
    {
        if ( this.eButtonState == EButtonActionType.Disable )
            return false;

            this.bDown = true;

        if ( true == this.In(mouse))
        {
            //this.eButtonState = EButtonActionType.Down;
            this.SetState(EButtonActionType.Down);
            return true;
        }
        //this.eButtonState = EButtonActionType.None;
        this.SetState(EButtonActionType.None);
        return false;
    }
  
    Up(mouse)
    {
        if ( this.eButtonState == EButtonActionType.Disable )
            return false;

            this.bDown = false;

        //this.eButtonState = EButtonActionType.None;
        this.SetState(EButtonActionType.None);
    }

    Disable()
    {
        //this.eButtonState = EButtonActionType.Disable;
        this.SetState(EButtonActionType.Disable);
    }

    Click(mouse, args) 
    {
        if ( this.bEnable == false )
            return;

        if ( this.eButtonState == EButtonActionType.Disable )
            return false;


        if ( true == this.In(mouse))
        {
            this.click_handler(args);
            return true;
        }

        return false;
    }

    UpdateArrow()
    {
        ctx.drawImage(imageArrow, 0, 0, 130, 130, this.iCurrentX, this.iCurrentY, 130, 130);
    }

    Render(ctx) 
    {
        if ( false == this.bEnable )
            return;

        if(this.eState == 0)
        {
            if ( this.eButtonState == EButtonActionType.Over )
            {
                // ctx.fillStyle = "rgba(0, 147, 255, 0.5)";
                // ctx.fillRect(this.x, this.y, this.width, this.height);

                //ctx.drawImage(this.sprite, 0, this.iSpriteHeight, this.iSpriteWidth, this.iSpriteHeight, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.sprite, this.iSpriteWidth, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);

                ctx.fillStyle = this.strColor;
            }
            else if ( this.eButtonState == EButtonActionType.Down )
            {
                // ctx.fillStyle = "rgba(0, 147, 70, 0.5)";
                // ctx.fillRect(this.x, this.y, this.width, this.height);

                //ctx.drawImage(this.sprite, 0, this.iSpriteHeight*2, this.iSpriteWidth, this.iSpriteHeight, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.sprite, this.iSpriteWidth*2, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);

                ctx.fillStyle = "white";
            }
            else if ( this.eButtonState == EButtonActionType.None)
            {
                ctx.drawImage(this.sprite, 0, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
                ctx.fillStyle = "white";
            }
            else if ( this.eButtonState == EButtonActionType.Disable )
            {
                ctx.drawImage(this.sprite, this.iSpriteWidth*3, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
                ctx.fillStyle = "white";           
            }

            if ( this.bCelebration == 1 )
            {
                this.iElapsedTime ++;
                if ( this.iElapsedTime > 60 )
                    this.iElapsedTime   = 0;

                if ( this.iElapsedTime > 30 )
                    ctx.drawImage(this.sprite, this.iSpriteWidth, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);

                ctx.fillStyle = "green";
            }

            ctx.font = this.strFont;
            ctx.textAlign = "center";

            ctx.fillText(this.strCaption, this.iCurrentX+this.iCurrentWidth/2, this.iCurrentY+this.iCurrentHeight/2+(this.iCurrentHeight/6));
        }
        else
        {
            if ( this.eButtonState == EButtonActionType.Over )
            {
                // ctx.fillStyle = "rgba(0, 147, 255, 0.5)";
                // ctx.fillRect(this.x, this.y, this.width, this.height);

                //ctx.drawImage(this.sprite, 0, this.iSpriteHeight, this.iSpriteWidth, this.iSpriteHeight, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.sprite, this.iSpriteWidth, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);

                ctx.fillStyle = this.strColor;
            }
            else if ( this.eButtonState == EButtonActionType.Down )
            {
                // ctx.fillStyle = "rgba(0, 147, 70, 0.5)";
                // ctx.fillRect(this.x, this.y, this.width, this.height);

                //ctx.drawImage(this.sprite, 0, this.iSpriteHeight*2, this.iSpriteWidth, this.iSpriteHeight, this.x, this.y, this.width, this.height);
                ctx.drawImage(this.sprite, this.iSpriteWidth*2, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);

                ctx.fillStyle = "white";
            }
            else if ( this.eButtonState == EButtonActionType.None)
            {
                ctx.drawImage(this.sprite, 0, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
                ctx.fillStyle = "white";
            }
            else if ( this.eButtonState == EButtonActionType.Disable )
            {
                ctx.drawImage(this.sprite, this.iSpriteWidth*3, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
                ctx.fillStyle = "white";           
            }

            if (this.strAmount) {
                ctx.textAlign = "center";
                ctx.font = `${this.iFontSize * 0.85}px Gothic A1`;
                ctx.fillStyle = "yellow";
                ctx.fillText(this.strAmount, this.iCurrentX + this.iCurrentWidth / 2, this.iCurrentY + (this.iCurrentHeight/2.5));
            }
    
            // 베팅 타입 렌더링 (하단 가운데)
            if (this.strCaption == "폴드" || this.strCaption == "체크") {

                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = `${this.iFontSize * 0.7}px Gothic A1`;
                ctx.fillText(this.strCaption, this.iCurrentX + this.iCurrentWidth / 2, this.iCurrentY + this.iCurrentHeight / 2 +(this.iCurrentHeight/6));
            }
            else
            {
                ctx.textAlign = "center";
                ctx.fillStyle = "white";
                ctx.font = `${this.iFontSize * 0.7}px Gothic A1`;
                ctx.fillText(this.strCaption, this.iCurrentX + this.iCurrentWidth / 2, this.iCurrentY + this.iCurrentHeight - (this.iCurrentHeight/6));
            }
    
            // 비율 렌더링 (왼쪽 하단), 비율이 0이 아닐 때만
            if (this.strBetpercent > 0) {
                ctx.textAlign = "left";
                ctx.fillStyle = "gray";
                ctx.font = `${this.iFontSize * 0.5}px Gothic A1`; // 비율 폰트는 조금 더 작게
                ctx.fillText(`${this.strBetpercent}%`, this.iCurrentX + (20*this.fHR), this.iCurrentY + this.iCurrentHeight - (15* this.fVR));
            }
        }
        if (this.Label) {
            // Label 위치 설정
            this.Label.SetLocation(this.iCurrentX - this.iCurrentWidth * 3, this.iCurrentY + (this.iCurrentHeight/6));
            // Label 렌더링
            this.Label.Render(ctx);
        }
    }

    UpdateAmount(strAmount)
    {
        this.strAmount = strAmount;
    }

    UpdateCaption(strCaption)
    {
        console.log(`Button strCaption : ${strCaption}`);
        this.strCaption = strCaption;
    }
    
    SetLocation(x, y)
    {
        this.x = x;
        this.y = y;

        this.iCurrentX = x;
        this.iCurrentY = y;
    }
}