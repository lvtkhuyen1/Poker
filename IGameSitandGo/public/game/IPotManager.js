import IUIImage from "../js/image.js";

import IObjectDealer from "./IObjectDealer.js";

export default class IPotManager
{
    constructor(x, y, kTimer, iImageWidth, iImageHeight, fHR, fVR)
    {
        this.list = [];
        this.listChips = [];

        this.iImageWidth = iImageWidth;
        this.iImageHeight = iImageHeight;

        this.x = x;
        this.y = y;
        this.iCurrentX = x;
        this.iCurrentY = y;

        this.kTimer = kTimer;

        this.fElapsedTime = 0;

        this.fHR = fHR;
        this.fVR = fVR;
    }

    UpdatePot(iAmount)
    {
        this.CalculateChipList(iAmount);

        this.list = [];
        // for ( let i in this.listChips )
        // {
        //     let x = this.iCurrentX + Math.floor(i/5) * 50;
        //     let y = this.iCurrentY - Math.floor(i%5) * 10;

        //     let image = new IUIImage(x, y, 50, 50, imageChips[this.listChips[i]], 44, 46);

        //     this.list.push(image);
        // }
    }

    Update()
    {
        this.fElapsedTime += this.kTimer.GetElapsedTime();

        if ( this.fElapsedTime > 0.1)
        {
            if ( this.listChips.length > 0 )
            {
                let i = this.list.length;

                let x = this.iCurrentX + Math.floor(i/5) * this.iImageWidth;
                let y = this.iCurrentY - Math.floor(i%5) * 10;
    
                let image = new IUIImage(x, y, this.iImageWidth, this.iImageHeight, imageChips[this.listChips[0]], 44, 46);

                image.OnSize(this.fHR, this.fVR);
                console.log(`##### ${this.fHR}`);
    
                this.list.push(image);
                this.listChips.splice(0, 1);  
            }
            this.fElapsedTime = 0;
        }
    }

    Render(ctx)
    {
        for ( let i in this.list )
        {
            this.list[i].Render(ctx);
        }
    }

    OnSize(fHR, fVR)
    {
        for ( let i in this.list )
        {
            this.list[i].OnSize(fHR, fVR);
        }
    }

    CalculateChipList(iAmount)
    {
        console.log(iAmount);

        let aAmount = iAmount;
        const cChips = [100000000, 10000000, 1000000, 
                        500000, 100000, 50000, 10000,
                        1000, 500, 100, 10, 5, 1];
        
        for ( let i in cChips )
        {
            if ( aAmount >= cChips[i])
            {
                let value = Math.floor(aAmount / cChips[i]);

                aAmount -= (value*cChips[i]);

                console.log(`${cChips[i]} : count (${value})`);

                for ( let j = 0; j < value; ++ j )
                    this.listChips.push(cChips.length-1-i);
            }
        }

        console.log(this.listChips);
    }
};