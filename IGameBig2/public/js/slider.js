export default class IUISlider{
    constructor(x, y, width, height, sprite, cSpriteWidth, cSpriteHeight, button, irotate)
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

        this.bCelebration = 0;

        this.iElapsedTime = 0;

        this.bEnable = true;

        this.button = button;

        this.bFocus = false;

        this.iOriginClickX = 0;
        this.iOriginClickY = 0;
        this.iDelta = 0;
        //console.log(this);

        this.iCurrentLocation = 0;
        this.iCurrentLocationMin = 0;
        // if(irotate == 0) // 0 : 가로, 1 : 세로
        // {
        //     this.iCurrentLocationMax = this.iCurrentWidth;
        // }
        // else
        // {
        //     this.iCurrentLocationMax = this.iCurrentHeight;
        // }
        this.iCurrentLocationMax = 0;
        this.iOriginLocation = 0;
        this.iCurrentBar = 0;

        this.irotate = irotate;

        this.UpdateCurrentLocation();
        this.fHR = 1;
        this.fVR = 1;
    }

    InitLocation()
    {
        this.iCurrentLocation = this.iCurrentLocationMin;
        this.UpdateCurrentLocation();
    }

    // SetBar(iCurrentCoin, iMinCoin, iMaxCoin)
    // {
    //     let fDelta = iMinCoin / iMaxCoin;
    //     if ( fDelta > 1 )
    //         fDelta = 1;
    //     let iCurrent = Math.floor(fDelta*iCurrentCoin);

    //     this.iCurrentBar = iCurrent;
    //     this.iCurrentLcation = Math.floor(this.iCurrentLocationMax * fDelta);

    //     this.button.iCurrentX = this.iCurrentX + this.iCurrentLocation - Math.floor(this.button.iCurrentWidth / 2);
    //     this.button.iCurrentY = this.iCurrentY - Math.floor(this.button.iCurrentHeight / 2) + Math.floor(this.iCurrentHeight/2);
    //     // this.button.iCurrentX = this.iCurrentX + this.iCurrentLocation - Math.floor(this.button.iCurrentWidth / 2);
    //     // this.button.iCurrentY = this.iCurrentY - Math.floor(this.button.iCurrentHeight / 2) + Math.floor(this.iCurrentHeight/2);

    //     // console.log(this.iCurrentLocationMax);
    //     // let value = 100 / this.iCurrentLocationMax;
    //     // let delta = Math.floor(this.iCurrentLocation*value);

    //     // this.iCurrentBar = Math.floor(delta);   
    // }

    UpdateCurrentLocation()
    {
        //let cFxLocation = this.GetFxDelta();
        //cFxLocation *= this.iCurrentLocation;
        if(this.irotate == 0)
        {
            this.button.iCurrentX = this.iCurrentX + this.iCurrentLocation - Math.floor(this.button.iCurrentWidth / 2);
            this.button.iCurrentY = this.iCurrentY - Math.floor(this.button.iCurrentHeight / 2) + Math.floor(this.iCurrentHeight/2);
        }
        else if(this.irotate == 1)
        {
            this.button.iCurrentX = this.iCurrentX - Math.floor(this.button.iCurrentWidth / 2) + Math.floor(this.iCurrentWidth/2);
            this.button.iCurrentY = this.iCurrentY + (this.iCurrentLocationMax - this.iCurrentLocation) - Math.floor(this.button.iCurrentHeight / 2);
        }
        console.log(`this.iCurrentLocationMax : ${this.iCurrentLocationMax}, this.iCurrentLocation : ${this.iCurrentLocation}`);
        let value = 100 / this.iCurrentLocationMax;
        let delta = Math.floor(this.iCurrentLocation*value);
        console.log(value);
        this.iCurrentBar = Math.floor(delta);
    }

    SetOriginLocation()
    {
        if(this.irotate == 0)
        {
            let fDelta = this.width / this.iCurrentWidth;
            this.iOriginLocation = Math.floor(this.iCurrentLocation * fDelta);
        }
        else if(this.irotate == 1)
        {
            let fDelta = this.height / this.iCurrentHeight;
            this.iOriginLocation = Math.floor(this.iCurrentLocation* fDelta);
        }
    }

    OnSize(fHR, fVR)
    {
        this.fHR = fHR;
        this.fVR = fVR;
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.iCurrentWidth = this.width * fHR;
        this.iCurrentHeight = this.height * fVR;
        //this.iCurrentLocationMin = this.iCurrentLocationMin * fHR;
        if(this.irotate == 0)
        {
            this.iCurrentLocationMax = Math.floor(this.width * fHR);
            this.iCurrentLocation = Math.floor(this.iOriginLocation * fHR);
        }
        else if(this.irotate == 1)
        {
            this.iCurrentLocationMax = Math.floor(this.height * fVR);
            this.iCurrentLocation = Math.floor(this.iOriginLocation * fVR);
        }
        //this.iCurrentBar = this.iCurrentBar * fHR;

        this.button.OnSize(fHR, fVR);

        this.UpdateCurrentLocation();

        console.log(`OnSize : ${this.iCurrentWidth}, this.iCurrentLocationMax : ${this.iCurrentLocationMax}`);
    }

    In(mouse)
    {
        if (this.iCurrentX < mouse.x && this.iCurrentX + this.iCurrentWidth > mouse.x && this.iCurrentY < mouse.y && this.iCurrentY + this.iCurrentHeight > mouse.y) 
        { 
            return true;
        }
        return false;
    }

    Over(mouse)
    {
        this.button.Over(mouse);

        if ( this.bFocus == true )
        {
            //this.iOriginClickX = mouse.x;
            //this.iDelta = mouse.x - this.iOriginClickX;
            //this.button.iCurrentX += this.iDelta;

            //let current = Math.floor(this.GetLocation() * (mouse.x - this.iOriginClickX));
            //console.log(current);

            //this.iCurrentLocation += this.GetLocation(Math.floor((mouse.x - this.iOriginClickX) * this.GetFxDelta()));
            let current = 0;
            if(this.irotate == 0){
                current = mouse.x - this.iOriginClickX;
                this.iCurrentLocation += current;
                this.iOriginClickX = mouse.x;
                this.SetOriginLocation();
                if ( this.iCurrentLocation < this.iCurrentLocationMin )
                {
                    this.iCurrentLocation = this.iCurrentLocationMin;
                    this.UpdateCurrentLocation();
                    
                }
                else if ( this.iCurrentLocation > this.iCurrentLocationMax )
                {
                    this.iCurrentLocation = this.iCurrentLocationMax;
                    this.UpdateCurrentLocation();
                    
                }
                else 
                {
                    this.UpdateCurrentLocation();
                }
            }
            else if(this.irotate == 1) 
            {
                //alert('모바일 레이즈바 터치');
                current = mouse.y - this.iOriginClickY;
                this.iCurrentLocation -= current;
                this.iOriginClickY = mouse.y;
                this.SetOriginLocation();
                if ( this.iCurrentLocation < this.iCurrentLocationMin )
                {
                    this.iCurrentLocation = this.iCurrentLocationMin;
                    this.UpdateCurrentLocation();
                    
                }
                else if ( this.iCurrentLocation > this.iCurrentLocationMax )
                {
                    this.iCurrentLocation = this.iCurrentLocationMax;
                    this.UpdateCurrentLocation();
                    
                }
                else 
                {
                    this.UpdateCurrentLocation();
                }
            } 
            return true;
        }

        return false;
    }

    Down(mouse)
    {
        if ( this.In(mouse) == true )
        {
            //this.button.iCurrentX = mouse.x;
            alert(`this.iCurrentLocation : ${this.iCurrentLocation}, this.iCurrentY : ${this.iCurrentY}, mouse.y : ${mouse.y}, this.height : ${this.height}`);
            console.log(`this.iCurrentLocation : ${this.iCurrentLocation}, this.iCurrentY : ${this.iCurrentY}, mouse.y : ${mouse.y}, this.height : ${this.height}`);
            if(this.irotate == 0)
            {
                this.iCurrentLocation = mouse.x - this.iCurrentX;
            }
            else if(this.irotate == 1)
            {
                this.iCurrentLocation = (this.height - mouse.y) + (this.button.iCurrentHeight/2);
            }
            
            this.SetOriginLocation();
            this.UpdateCurrentLocation();
        }

        this.button.Down(mouse);
        if ( this.button.eButtonState == 2 )
        {
            this.bFocus = true;
            if(this.irotate == 0)
            {
                this.iOriginClickX  = mouse.x;
            }
            else if(this.irotate == 1)
            {
                this.iOriginClickY  = mouse.y;
            }
            
        }
        return true;
    }
  
    Up(mouse)
    {
        console.log(`MouseUp : Slider`);

        this.bFocus = false;

        this.button.Up(mouse);
    }

    Disable()
    {
    }

    Click(mouse, args) 
    {
        return false;
    }

    Render(ctx) 
    {
        ctx.drawImage(this.sprite, 0, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
        // ctx.fillStyle = "white";
        // ctx.font = '20px Spoqa Han Sans Neo';
        // ctx.textAlign = "center";

        this.button.Render(ctx);

        // ctx.fillText(this.iCurrentBar.toString(), this.iCurrentX+this.iCurrentWidth/2, this.iCurrentY+this.iCurrentHeight/2+(this.iCurrentHeight/6));
    }
}