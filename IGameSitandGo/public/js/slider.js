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

        this.iCurrentLocation = 0;
        this.iCurrentLocationMin = 0;

        this.iCurrentLocationMax = 0;
        this.iOriginLocation = 0;
        this.iCurrentBar = 0;

        this.irotate = irotate;

        this.locationRatio = 0;

        this.UpdateCurrentLocation();
        this.fHR = 1;
        this.fVR = 1;
    }

    InitLocation()
    {
        this.iCurrentLocation = this.iCurrentLocationMin;
        this.UpdateCurrentLocation();
    }

    UpdateCurrentLocation()
    {
        if(this.button && this.button !== ''){ // Button exists and is not an empty string
            if(this.irotate == 0)
            {
                this.button.iCurrentX = this.iCurrentX + this.iCurrentLocation - Math.floor(this.button.iCurrentWidth / 2);
                this.button.iCurrentY = this.iCurrentY - Math.floor(this.button.iCurrentHeight / 2) + Math.floor(this.iCurrentHeight/2);
            }
            else if(this.irotate == 1)
            {
                this.button.iCurrentX = this.iCurrentX - Math.floor(this.button.iCurrentWidth / 2) + Math.floor(this.iCurrentWidth/2);
                this.button.iCurrentY = this.iCurrentY + (this.iCurrentLocationMax - this.iCurrentLocation) - Math.floor(this.button.iCurrentHeight / 2);
                //this.button.iCurrentY = this.iCurrentY + this.iCurrentLocation - Math.floor(this.button.iCurrentHeight / 2);
            }
        }
        else { // No button or button is an empty string
            // Here we'll calculate the proportion of the current location to the maximum location
            // and store it in a new instance variable.
            this.locationRatio = this.iCurrentLocation / this.iCurrentLocationMax;
        }
        console.log(`this.iCurrentLocationMax : ${this.iCurrentLocationMax}, this.iCurrentLocation : ${this.iCurrentLocation}`);
        let value = 100 / this.iCurrentLocationMax;
        let delta = Math.floor(this.iCurrentLocation*value);
        console.log(value);
        this.iCurrentBar = Math.floor(delta);
        console.log(`this.iCurrentBar : ${this.iCurrentBar}`);
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

        if(this.button && this.button !== ''){
            this.button.OnSize(fHR, fVR);
        }

        this.UpdateCurrentLocation();

       // console.log(`OnSize : ${this.iCurrentWidth}, this.iCurrentLocationMax : ${this.iCurrentLocationMax}`);
    }

    In(mouse)
    {
        const buttonHalfWidth = this.button.iCurrentWidth / 2;
        const buttonHalfHeight = this.button.iCurrentHeight / 2;
        if (this.iCurrentX - buttonHalfWidth < mouse.x && this.iCurrentX + this.iCurrentWidth + buttonHalfWidth > mouse.x 
            && this.iCurrentY - buttonHalfHeight < mouse.y && this.iCurrentY + this.iCurrentHeight + buttonHalfHeight > mouse.y) {
            return true;
        }
        return false;
    }

    Over(mouse)
    {
        //if (this.In(mouse) == true) {
            if(this.button && this.button !== ''){
                this.button.Over(mouse);
                if ( this.bFocus == true )
                {
                    console.log(`MouseOver : Slider`);
                    let current = 0;
                    if(this.irotate == 0){
                        current = mouse.x - this.iOriginClickX;
                        this.iCurrentLocation += current;
                        this.iOriginClickX = mouse.x;
                        this.SetOriginLocation();
                        if ( this.iCurrentLocation < this.iCurrentLocationMin )
                        {
                            this.iCurrentLocation = this.iCurrentLocationMin;
                        }
                        else if ( this.iCurrentLocation > this.iCurrentLocationMax )
                        {
                            this.iCurrentLocation = this.iCurrentLocationMax;                            
                        }
                    }
                    else if(this.irotate == 1) 
                    {
                        //alert('모바일 레이즈바 터치');
                        console.log(`touch.y : ${mouse.y}, this.iOriginClickY : ${this.iOriginClickY}`);
                        current = mouse.y - this.iOriginClickY;
                        this.iCurrentLocation -= current;
                        this.iOriginClickY = mouse.y;
                        this.SetOriginLocation();
                        if ( this.iCurrentLocation < this.iCurrentLocationMin )
                        {
                            this.iCurrentLocation = this.iCurrentLocationMin;
                            //this.bFocus = false;
                        }
                        else if ( this.iCurrentLocation > this.iCurrentLocationMax )
                        {
                            this.iCurrentLocation = this.iCurrentLocationMax;
                            //this.bFocus = false;
                        }
                    }
                    this.UpdateCurrentLocation(); 
                    return true;
                }
                else
                {
                    this.bFocus = false;
                }
                return false;
            }
            else {
                if ( this.bFocus == true )
                {               
                    let mouseY = mouse.y - this.iCurrentY; // Adjust mouse Y position relative to the slider
        
                    let delta = (this.iCurrentLocationMax - this.iCurrentLocationMin) / this.iCurrentHeight; // Calculate the change in location per pixel
                    
                    let newLocation = this.iCurrentLocationMax - Math.round(mouseY * delta); // Calculate the new location based on the mouse Y position
                    
                    if (newLocation < this.iCurrentLocationMin) {
                    this.iCurrentLocation = this.iCurrentLocationMin;
                    this.bFocus = false;
                    } else if (newLocation > this.iCurrentLocationMax) {
                    this.iCurrentLocation = this.iCurrentLocationMax;
                    this.bFocus = false;
                    } else {
                    this.iCurrentLocation = newLocation;
                    }
                    
                    this.SetOriginLocation();
                    this.UpdateCurrentLocation();
                    
                    return true;
                }
                else
                {
                    this.bFocus = false;
                }
            }
            return false;
        // }
        // else
        // {
        //     return false;
        // }
    }
    Touch(touch) {
        if (this.In(touch) == true) {
            console.log(`MouseTouch : Slider`);
            if (this.button && this.button !== '') {
                this.button.Touch(touch);
                let current = 0;
                if (this.irotate == 0) {
                    current = touch.x - this.iOriginClickX;
                    this.iCurrentLocation += current;
                    this.iOriginClickX = touch.x;
                    this.SetOriginLocation();
                    if (this.iCurrentLocation < this.iCurrentLocationMin) {
                        this.iCurrentLocation = this.iCurrentLocationMin;
                        this.UpdateCurrentLocation();

                    }
                    else if (this.iCurrentLocation > this.iCurrentLocationMax) {
                        this.iCurrentLocation = this.iCurrentLocationMax;
                        this.UpdateCurrentLocation();

                    }
                    else {
                        this.UpdateCurrentLocation();
                    }
                }
                else if (this.irotate == 1) {
                    //alert('모바일 레이즈바 터치');
                    console.log(`touch.y : ${touch.y}, this.iOriginClickY : ${this.iOriginClickY}`);
                    current = touch.y - this.iOriginClickY;
                    this.iCurrentLocation -= current;
                    this.iOriginClickY = touch.y;
                    this.SetOriginLocation();
                    if (this.iCurrentLocation < this.iCurrentLocationMin) {
                        this.iCurrentLocation = this.iCurrentLocationMin;
                        this.UpdateCurrentLocation();

                    }
                    else if (this.iCurrentLocation > this.iCurrentLocationMax) {
                        this.iCurrentLocation = this.iCurrentLocationMax;
                        this.UpdateCurrentLocation();

                    }
                    else {
                        this.UpdateCurrentLocation();
                    }
                }
                return true;
            }
            else {
                if (this.bFocus == true) {
                    let touchY = touch.y - this.iCurrentY; // Adjust mouse Y position relative to the slider

                    let delta = (this.iCurrentLocationMax - this.iCurrentLocationMin) / this.iCurrentHeight; // Calculate the change in location per pixel

                    let newLocation = this.iCurrentLocationMax - Math.round(touchY * delta); // Calculate the new location based on the mouse Y position

                    if (newLocation < this.iCurrentLocationMin) {
                        this.iCurrentLocation = this.iCurrentLocationMin;
                        this.bFocus = false;
                    } else if (newLocation > this.iCurrentLocationMax) {
                        this.iCurrentLocation = this.iCurrentLocationMax;
                        this.bFocus = false;
                    } else {
                        this.iCurrentLocation = newLocation;
                    }

                    this.SetOriginLocation();
                    this.UpdateCurrentLocation();

                    return true;
                }
                else {
                    this.bFocus = false;
                }
            }
            return false;
        }
        else
        {
            return false;
        }
    }

    Down(mouse)
    {
        if ( this.In(mouse) == true )
        {
            console.log(`MouseDown : Slider`);
            if(this.irotate == 0)
            {
                this.iCurrentLocation = mouse.x - this.iCurrentX;
            }
            else if(this.irotate == 1)
            {
                this.iCurrentLocation = this.iCurrentY + this.iCurrentLocationMax - mouse.y;
            }
            
            this.SetOriginLocation();
            this.iOriginClickX = mouse.x;
            this.iOriginClickY = mouse.y;
            this.bFocus = true;
            if(this.button && this.button !== ''){
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
            }
            this.UpdateCurrentLocation();
            return true;
        }
        else
        {
            this.bFocus = false;
            return false;
        }
    }
  
    Up(mouse)
    {
        if ( this.In(mouse) == true )
        {
            console.log(`MouseUp : Slider`);

            this.bFocus = false;

            if(this.button && this.button !== ''){
                this.button.Up(mouse);
            }
            return true;
        }
        else
        {
            this.bFocus = false;
            return false;
        }
    }

    Leave()
    {
        this.bFocus = false;
        this.SetOriginLocation();
        this.UpdateCurrentLocation();
    }

    Disable()
    {
    }

    Click(mouse, args) 
    {
        return false;
    }

    SetLocation(x, y)
    {
        this.x = x;
        this.y = y;

        this.iCurrentX = x;
        this.iCurrentY = y;
    }

    SetButtonToTop() {
        this.iCurrentLocation = this.iCurrentLocationMax;
        this.UpdateCurrentLocation();
    }
    
    SetButtonToBottom() {
        this.iCurrentLocation = this.iCurrentLocationMin;
        this.UpdateCurrentLocation();
    }
    
    Render(ctx) 
    {
        if(this.button && this.button !== ''){
            ctx.drawImage(this.sprite, 0, 0, this.iSpriteWidth, this.iSpriteHeight, this.iCurrentX, this.iCurrentY, this.iCurrentWidth, this.iCurrentHeight);
            this.button.Render(ctx);
        }
        else
        {
            // No button or button is an empty string
            // We'll use locationRatio to only draw a portion of the sprite from the bottom up.
            let srcHeight = this.iSpriteHeight * this.locationRatio;
            let tgtHeight = this.iCurrentHeight * this.locationRatio;
            let tgtY = this.iCurrentY + this.iCurrentHeight - tgtHeight;
            
            ctx.drawImage(
                this.sprite,                 // image source
                0,                           // source x
                this.iSpriteHeight - srcHeight, // source y
                this.iSpriteWidth,           // source width
                srcHeight,                   // source height
                this.iCurrentX,              // target x
                tgtY,                        // target y
                this.iCurrentWidth,          // target width
                tgtHeight                    // target height
            );
        }
    }
}