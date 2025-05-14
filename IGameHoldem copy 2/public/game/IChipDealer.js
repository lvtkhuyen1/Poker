import IObjectDealer from "./IObjectDealer.js";

export default class IChipDealer
{
    constructor(x, y, tx, ty, fHR, fVR, timer, iImageWidth, iImageHeight, iAmount, iState)
    {
        this.list = [];

        this.listChips = [];

        this.CalculateChipList(iAmount);

        this.iComplete = 0;

        let delay = 0;
        const delayIncrement = 0.1; // 각 칩 사이의 지연 시간 증가량

        //for ( let i = 0; i < 10; ++ i )
        for ( let i in this.listChips )
        {
            let ax = tx + Math.random() * 100;
            let ay = ty + 30 + Math.random() * 30;
            if(iState == 1)
            {
                this.list.push(new IObjectDealer(x, y, ax, ay, fHR, fVR, timer, iImageWidth, iImageHeight, 44, 46, imageChips[this.listChips[i]], iState, delay));
            }
            else if(iState == 2)
            {
                ax = tx;
                ay = ty;
                this.list.push(new IObjectDealer(x, y, ax, ay, fHR, fVR, timer, iImageWidth, iImageHeight, 44, 46, imageChips[this.listChips[i]], iState, delay));
            }
            delay += delayIncrement;
        }

        this.fElapsedTime = 0;
        this.kTimer = timer;
        this.iState = iState;
    }

    Update()
    {
        for ( let i in this.list )
        {
            this.list[i].Update();
        }

        if ( this.iComplete == 1 )
        {
            this.fElapsedTime += this.kTimer.GetElapsedTime();
            if ( this.fElapsedTime > 2 )
                this.iComplete = 2;
        }
    }
    Render(ctx)
    {
        for ( let i in this.list )
        {
            if(this.iState == 2)
            {
                if(this.list[i].iCompleteStep != 1)
                {
                    this.list[i].RenderRotation(ctx);
                }
            }
            else
            {
                this.list[i].RenderRotation(ctx);
            }
        }

        let iCompleteCount = 0;
        for ( let i in this.list )
        {
            if ( this.list[i].iCompleteStep == 1 )
                iCompleteCount++;
        }

        if ( iCompleteCount == this.list.length )
        {
            this.iComplete  = 1;
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