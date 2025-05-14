
import IUIImage from "../js/image.js";
import IUIText from "../js/text.js";
import IUIProgressBar from "../js/progressbar.js";
import ICardDealer from "../game/ICardDealer.js";
import IChipDealer from "../game/IChipDealer.js";
import { canPlay,isValidPlay,generateValidCombinations,isLowestCardValidPlay,isValidNextPlay,canNextPlay } from "../game/IBig2Solver.js"

export default class IUser{

    constructor(strID, strNickname, iScore, iLocation, iFxLocation, iAvatar, eUserType, kTimer, kSC, listHandCard)
    {
        console.log(`IUser::constructor : ${strID}, socre : ${iScore}, iLocation:${iLocation}, iFxLocation :${iFxLocation}, iAvatar : ${iAvatar}`);
        console.log("listhandcard : ", listHandCard);
        this.strID = strID;
        this.strNickname = strNickname;
        this.iScore = iScore;
        this.iLocation  = iLocation;
        this.iFxLocation = iFxLocation;
        this.iAvatar = parseInt(iAvatar);
        this.eUserType = eUserType;

        this.strPlayerType = '';
        this.bEnableRenderBettingType = false;
        this.iMaxPlayer = 0;
        this.iBettingType = -1;
        this.iBettingTypeRenderCounter = 0;
        this.listHandCard = [];
        if ( listHandCard.length )
        {
            for ( let i in listHandCard )
            {
                    const suit = Math.floor(listHandCard[i] / 13);// 0: spade, 1: heart, 2: club, 3: diamond
                    const num = listHandCard[i] % 13;
                    this.listHandCard.push({index:listHandCard[i], suit:suit, num:num, select:false});
            }
        }
        this.listSelectCard = [];
        this.strHand = '';
        this.bFocus = false;
        this.bWinner = false;
        this.bBettingMode = false;
        this.bAbstentionWin = false;

        this.iBettingTime = 0;
        this.iOriginBettingTime = 0;
        this.strLastBetting = '';
        this.bRenderFocusMine = false;
        this.fFocusMineElapsedTime = 0;

        this.listCardDealer = [];
        this.listFeeDealer = [];
        this.listCardSubmit = [];

        this.listCallCoin = [];

        this.listWinCards = [false, false];
        this.listTableCard = [];
        this.listSentCard = [];

        this.iAutoFoldCounter = 0;

        this.bplayuser = false;

        this.kSC = kSC;

        // this.x = cPlayerLocations[iFxLocation].x;
        // this.y = cPlayerLocations[iFxLocation].y;

        this.x = kSC.GetPosition(EPositionIndex.P1Table+iFxLocation).x;
        this.y = kSC.GetPosition(EPositionIndex.P1Table+iFxLocation).y;


        // this.x = this.ptLocations[iFxLocation].x;
        // this.y = this.ptLocations[iFxLocation].y;
        this.iCurrentX = this.x;
        this.iCurrentY = this.y;

        this.listImages = 
        [
            new IUIImage(this.iCurrentX, this.iCurrentY, 160, 160, imageOtherAvatarBase, 160, 160),
            new IUIImage(this.iCurrentX-6, this.iCurrentY-6, 172, 172, imageOtherAvatarPanel, 172, 172),
            new IUIImage(this.iCurrentX, this.iCurrentY, 160, 160, imageOtherfold, 160, 160),

            new IUIImage(this.iCurrentX-10, this.iCurrentY-10, 180, 180, imageOtherAvatarTimeline, 180, 180),
            new IUIImage(this.iCurrentX-23, this.iCurrentY+125, 200, 90, imageOtherBasePanel, 241, 102),

            new IUIImage(this.iCurrentX-70, this.iCurrentY+35, 305, 114, imageWinner, 500, 200),
            new IUIImage(this.iCurrentX+130, this.iCurrentY-45, 50, 50, imagePlayerReady, 137, 137),
            new IUIImage(this.iCurrentX+130, this.iCurrentY-45, 50, 50, imagePlayerStart, 137, 137),
        ];

        this.imagesPlayerType = new IUIImage(kSC.GetPosition(EPositionIndex.P1Type+iFxLocation).x, kSC.GetPosition(EPositionIndex.P1Type+iFxLocation).y, 50, 50, imagePlayerType, 137, 137);

        this.listImagesBettingType = [];

        for ( let i = 0; i < 4; ++ i )
        {
            let imageBettingType = new IUIImage(this.iCurrentX, this.iCurrentY+170, 160, 51, imageBettings[i], 160, 51);
            this.listImagesBettingType.push(imageBettingType);
        }

        this.listImagesCard = [];
        for ( let i = 0; i < 54; ++ i )
        {
            //let imageCard = new IUIImage(this.iCurrentX+160, this.iCurrentY+50, 70, 110, imageCards[i], 163, 227);
            let imageCard = new IUIImage(this.iCurrentX+160, this.iCurrentY+50, 115, 150, imageCards[i], 167, 231);
            this.listImagesCard.push(imageCard);
        }
        this.listImagesTableCard = [];
        for ( let i = 0; i < 54; ++ i )
        {
            //let imageCard = new IUIImage(this.iCurrentX+160, this.iCurrentY+50, 70, 110, imageCards[i], 163, 227);
            let imageCard = new IUIImage(this.iCurrentX+160, this.iCurrentY+50, 80, 110, imageCards[i], 167, 231);
            this.listImagesTableCard.push(imageCard);
        }
        this.listImageCardWinFrame = new IUIImage(this.iCurrentX+160, this.iCurrentY+50, 115, 150, imageCardFrames[0], 163, 227);

        // this.listImagesHand = [];
        // for ( let i = 0; i < 9; ++ i )
        // {
        //     //let image = new IUIImage(this.iCurrentX-155, this.iCurrentY-50, 300, 58, imagePokerHand[i], 300, 58);
        //     let image = new IUIImage(this.iCurrentX-70 , this.iCurrentY+65, 300, 58, imagePokerHand[i], 300, 58);

        //     this.listImagesHand.push(image);
        // }

        this.listImageAvatar = [];
        for ( let i = 0; i < 14; ++ i )
        {
            let image = new IUIImage(this.iCurrentX, this.iCurrentY, 160, 160, imageAvatar[i], 160, 160);

            this.listImageAvatar.push(image);
        }

        //this.labelCoin = new IUILabel(this.iCurrentX+ 80, this.iCurrentY + 130, 25, 25, 20, NumberImages, 124, 124, iGameCoin.toString(), 0);
        //this.textlCoin = new IUIText(this.iCurrentX+ 80, this.iCurrentY + 155, 20, iGameCoin.toLocaleString(), 0);
        this.textScore= new IUIText(this.iCurrentX+ 80, this.iCurrentY + 155, 20, iScore, 0);
        this.exitReserve = new IUIImage(this.iCurrentX+30, this.iCurrentY-40, 102, 47, imageExitReserve, 102, 47);

        this.progressTime = new IUIProgressBar(this.iCurrentX-27, this.iCurrentY+120, 208, 100, imageOtherAvatarProgress, 248, 109, kTimer);
        this.textName = new IUIText(this.iCurrentX+80, this.iCurrentY + 200, 20, strNickname, 0);
        
        this.m_fVR = 1;
        this.m_fHR = 1;

        this.kTimer = kTimer;
        this.iNumCards = 0;
        //this.iAvatar = Math.random()*2;

        this.fInterval = 0;
        this.bRender = false;
        this.bEnablePlay = false;

        this.bFold = false;
        this.bTrunStart = false;
        this.bHigherCard = false;
        this.bResult = false;
        this.bBig2Play = false;
        this.bBig2Start = false;
        this.ibettingCallCoin = 0;

        this.bCanPlay = false;
        //this.iScore = 0;
        this.bStarter = false;
        this.bFirstTurn = true;
        this.bReady = false;
        this.bStart = false;
        this.bGameStart = false;

        this.bReserveExit = false;

        this.bLoser = false;
        this.textWinnerCoin = new IUIText(this.iCurrentX+ 80, this.iCurrentY + 155, 30, "", 0);
		this.bWinnerCoin = false;

        this.bEmoticon = false;
        this.iEmoticon = -1;
        this.fEmoticonTime = 0;

        this.fResponse = 0;

        this.listEmoticon = [];
        for ( let i = 0; i < 8; ++ i )
        {
            let image = new IUIImage(this.iCurrentX+6, this.iCurrentY-6, 160, 160, imageEmoticon[i], 160, 160);

            this.listEmoticon.push(image);
        }
    }

    Initialize()
    {
        this.strPlayerType = '';
        this.bEnableRenderBettingType = false;
        this.iBettingType = -1;
        this.iBettingTypeRenderCounter = 0;
        this.listHandCard = [];
        this.listSelectCard = [];
        this.strHand = '';
        this.bFocus = false;
        this.bWinner = false;
        this.bAbstentionWin = false;
        this.bBettingMode = false;

        this.iNumCards = 0;
        //this.listTempHandCard = [];
        this.listCardDealer = [];
        this.listFeeDealer = [];
        this.listCardSubmit = [];
        this.strLastBetting = '';
        this.ibettingCallCoin = 0;
        this.bCanPlay = false;
        this.listTableCard = [];
        this.listSentCard = [];
        this.bStarter = false;
        this.bFirstTurn = true;

        this.progressTime.bEnable = false;
        this.progressTime.UpdateTime(0);
    }

    Render(ctx) 
    {
        for ( let i in this.listImages )
        {
            if ( i == 3 )
                continue;
            if ( i == 4 )
                continue;
            if ( i == 5 )
                continue;
            if ( i == 6 )
                continue;

            if ( i == 7 )
                continue;

            this.listImages[i].Render(ctx);
        }
        this.listImages[0].Render(ctx);
        this.listImageAvatar[this.iAvatar].Render(ctx);
        //

        if ( this.fInterval >= 0 )
        {
            this.fInterval -= this.kTimer.GetElapsedTime();
            if ( this.fInterval <= 0 )
            {
                this.bRender = !this.bRender;
                this.fInterval = 0.5;
            }
        }
        
        if ( this.bFold == true )
        {
            //this.bFold = true;
            this.listImages[2].Render(ctx);
            //this.listImagesBettingType[5].Render(ctx);
        }
        if( this.bReady == true && this.bStart == false )
        {
            this.listImages[6].Render(ctx);
        }
        if( this.bReady == true && this.bStart == true && this.bBig2Start == false)
        {
            this.listImages[7].Render(ctx);
        }
        if (this.listHandCard.length > 0 && this.bBig2Play == true) {
            for (let i in this.listHandCard) {
                const card = this.listHandCard[i];

                if (!card || !card.index == undefined || card.length == 0) {
                    continue;
                }

                // console.log(`IUser Handcards ${i}, ${this.listHandCard[i].index}`);
                const iOffset = this.iFxLocation == 0 ? 60 : 20;
                let iOffsetY = 0;

                if (card.select == true) {
                    iOffsetY = -50;
                }

                let tx = 0;
                let ty = 0;

                if (this.iFxLocation == 0) {
                    tx = this.x + 150 + (i * iOffset);
                    ty = this.y + iOffsetY;
                    this.listImagesCard[card.index].RenderLS(ctx, tx, ty, 1);
                }
                else if (this.iFxLocation == 1) {
                    tx = this.x + 140;
                    ty = this.y - 110 + (i * iOffset);
                    this.listImagesCard[card.index].RenderLSR(ctx, tx, ty, 1, 90);
                }
                else if (this.iFxLocation == 2) {
                    tx = this.x - 110 + (i * iOffset);
                    ty = this.y + 30;
                    this.listImagesCard[card.index].RenderLS(ctx, tx, ty, 1);
                }
                else if (this.iFxLocation == 3) {
                    tx = this.x - 95;
                    ty = this.y - 110 + (i * iOffset);
                    this.listImagesCard[card.index].RenderLSR(ctx, tx, ty, 1, 270);
                }
            }
        }
        if ( this.bBig2Play == false && this.bBig2Start == true && this.bLoser == true)
        {
            this.bFold = true;
            this.listImages[2].Render(ctx);
        }
        if ( this.bFocus == true )
        {
            // if ( this.iFxLocation == 0 )
            // {
                this.fFocusMineElapsedTime -= this.kTimer.GetElapsedTime();
                if ( this.fFocusMineElapsedTime < 0 )
                {
                    this.bRenderFocusMine = !this.bRenderFocusMine;
                    this.fFocusMineElapsedTime = 0.5;
                }

                if ( this.bRenderFocusMine == true)
                    this.listImages[3].Render(ctx);
            // }
            // else
            // {
            //     this.listImages[2].Render(ctx);
            // }
        }

        // if ( this.bFocus == true )
        // {
        //     if ( this.iFxLocation == 0 )
        //     {
        //         this.fFocusMineElapsedTime -= this.kTimer.GetElapsedTime();
        //         if ( this.fFocusMineElapsedTime < 0 )
        //         {
        //             this.bRenderFocusMine = !this.bRenderFocusMine;
        //             this.fFocusMineElapsedTime = 0.5;
        //         }

        //         if ( this.bRenderFocusMine == true )
        //             this.listImages[2].Render(ctx);
        //     }
        //     else
        //     {
        //         this.listImages[2].Render(ctx);
        //     }
        // }
        if(this.bFold == false && this.bBettingMode == true && this.bFocus == true)
        {
            this.progressTime.Render(ctx);
            // this.progressTime.StartAnimation(ctx);
        }
        this.listImages[4].Render(ctx);

        this.textScore.Render(ctx);
        //this.labelCoin.Render(ctx);
        this.textName.Render(ctx);

        if(this.bReserveExit == true)
        {
            this.exitReserve.Render(ctx);
        }
  
        if ( this.bWinner == true )
        {
            this.listImages[5].Render(ctx);
        }

        if ( this.strPlayerType == 'Dealer' )
        {
            this.imagesPlayerType.Render(ctx);
        }

        if ( this.iFxLocation == 0 && this.strLastBetting == 'Fold' )
        {
            //const cOffset = parseInt(50 * this.fVR);
            //this.listImagesBettingType[5].Render(ctx);
        }

        // if ( this.strHand != '')
        // {
        //     switch ( this.strHand )
        //     {
        //         case 'Pair':
        //             this.listImagesHand[0].Render(ctx);
        //             break;
        //         case 'Two Pair':
        //             this.listImagesHand[1].Render(ctx);
        //             break;
        //         case 'Three of a Kind':
        //             this.listImagesHand[2].Render(ctx);
        //             break;
        //         case 'Straight':
        //             this.listImagesHand[3].Render(ctx);
        //             break;
        //         case 'Flush':
        //             this.listImagesHand[4].Render(ctx);
        //             break;
        //         case 'Full House':
        //             this.listImagesHand[5].Render(ctx);
        //             break;
        //         case 'Four of a Kind':
        //             this.listImagesHand[6].Render(ctx);
        //             break;
        //         case 'Straight Flush':
        //             this.listImagesHand[7].Render(ctx);
        //             break;
        //         case 'Royal Flush':
        //             this.listImagesHand[8].Render(ctx);
        //             break;
        //     }
        // }

        //this.listImagesBettingType[0].Render(ctx);
        if( this.listSentCard.length > 0 )
        {
            for (let i in this.listSentCard) {
                //console.log(`IUser listSentCard ${i}, ${this.listSentCard[i].index}`);

                let tx = 0;
                let ty = 0;

                if (this.iFxLocation == 0) {
                    tx = this.x + 300 + (i * 80);
                    ty = this.y - 150;
                }
                else if (this.iFxLocation == 1) {
                    tx = this.x + 290 + (i * 80);
                    ty = this.y;
                }
                else if (this.iFxLocation == 2) {
                    tx = this.x - 100 + (i * 80);
                    ty = this.y + 220;
                }
                else if (this.iFxLocation == 3) {
                    tx = this.x - 200 - (i * 80);
                    ty = this.y;
                }
                this.listImagesTableCard[this.listSentCard[i].index].RenderLS(ctx, tx, ty, 1);
            }
        }
        for ( let i in this.listCardDealer )
        {
            this.listCardDealer[i].Render(ctx);
        }
        for ( let i in this.listCardSubmit )
        {
            this.listCardSubmit[i].Render(ctx);
        }
        if ( this.iBettingType != -1 && this.bWinner == false && this.bBettingMode == true)
        {
            this.listImagesBettingType[this.iBettingType].Render(ctx);
        }

        if(this.bEmoticon == true)
        {
            this.listEmoticon[this.iEmoticon].RenderShake(ctx,1.5,-20,20);
        }
        for ( let i in this.listFeeDealer )
        {
            this.listFeeDealer[i].Render(ctx);
        }
    }

    handleCardSelection(i, mouse) {
        const iOffset = this.iFxLocation == 0 ? 60 : 20;
        const isSelected = this.listHandCard[i].select;

        const x = (this.x + 150 + (i * iOffset)) * this.m_fHR;
        const y = (this.y - (isSelected ? 50 : 0)) * this.m_fVR;
        const width = ((this.x + 150 + (i * iOffset)) + (parseInt(i) + 1 == this.listHandCard.length ? 115 : 50)) * this.m_fHR;
        const height = ((this.y - (isSelected ? 50 : 0)) + 150) * this.m_fVR;

        if (mouse.x > x && mouse.x < width && mouse.y > y && mouse.y < height) {
            this.listHandCard[i].select = !this.listHandCard[i].select;
            if (this.GetSelectCount() > 5) {
                this.listHandCard[i].select = false;
                return;
            }
            if (this.listHandCard[i].select == true) {
                this.listSelectCard.push(this.listHandCard[i].index);
            }
            else {
                this.listSelectCard = this.listSelectCard.filter(card => card !== this.listHandCard[i].index);
            }
            this.UpdateCanPlayStatus();
        }
    }

    UpdateCanPlayStatus() {
        console.log("UpdateCanPlayStatus");
        console.log(this.listTableCard);
        if(this.bStarter == true && this.bFirstTurn == true)
        {
            //console.log(this.listSelectCard);
            const indexArray = this.listHandCard.map(card => card.index);
            //console.log(indexArray);
            if(isLowestCardValidPlay(indexArray, this.listSelectCard))
            {
                this.bCanPlay = true;
                console.log("유효한 카드 조합입니다.");
            }
            else
            {
                this.bCanPlay = false;
                console.log("유효하지 않은 카드 조합입니다.");
            }
        }
        else if(this.bHigherCard == true)
        {
            if (this.listTableCard.length != 0)
            {
                if (canNextPlay(this.listSelectCard, this.listTableCard, this.listHandCard)) {
                    this.bCanPlay = true;
                    console.log("카드를 놓을 수 있습니다.");
                }
                else {
                    this.bCanPlay = false;
                    console.log("카드를 놓을 수 없습니다.");
                }
            }
            else 
            {
                if(isValidNextPlay(this.listSelectCard, this.listHandCard))
                {
                    this.bCanPlay = true;
                    console.log("유효한 카드 조합입니다.");
                }
                else
                {
                    this.bCanPlay = false;
                    console.log("유효하지 않은 카드 조합입니다.");
                }
            }
        }
        else
        {
            if (this.listTableCard.length != 0) {
                console.log(this.listSelectCard);
                console.log(this.listTableCard);
                if (canPlay(this.listSelectCard, this.listTableCard)) {
                    this.bCanPlay = true;
                    console.log("카드를 놓을 수 있습니다.");
                }
                else {
                    this.bCanPlay = false;
                    console.log("카드를 놓을 수 없습니다.");
                }
            }
            else {
                console.log(this.listSelectCard);
                if (isValidPlay(this.listSelectCard)) {
                    this.bCanPlay = true;
                    console.log("유효한 카드 조합입니다.");
                }
                else {
                    this.bCanPlay = false;
                    console.log("유효하지 않은 카드 조합입니다.");
                }
            }
        }
    }

    OnMouseDown(mouse)
    {
        //console.log(`IUser OnMouseDown : ${mouse.x}, ${mouse.y}`);
        if ( this.listHandCard.length > 0 )
        {
            for ( let i in this.listHandCard )
            {
                //if(this.bTrunStart == true)
                this.handleCardSelection(i,mouse);
            }
        }
    }
    GetSelectCount()
    {
        let iCount = 0;
        for( let i in this.listHandCard )
        {
            if(this.listHandCard[i].select == true)
            {
                iCount++;
            }
        } 
        return iCount;
    }

    Update()
    {
        if ( this.iBettingTime > 0 )
        {
            this.iBettingTime -= this.kTimer.GetElapsedTime();
            let iValue = parseInt(this.iBettingTime);
            if ( iValue < 0 )
                iValue = 0;
            else
            {
                this.progressTime.UpdateTime(iValue);
            }
        }

        // if ( this.iBettingTypeRenderCounter > 0 )
        // {
        //     -- this.iBettingTypeRenderCounter;
        //     if ( this.iBettingTypeRenderCounter <= 0 )
        //     {
        //         this.bEnableRenderBettingType = false;
        //         this.iBettingType = -1;
        //     }
        // }
        if(this.bEmoticon == true)
        {
            this.fEmoticonTime += this.kTimer.GetElapsedTime();

            if(this.fEmoticonTime > 2.5)
            {
                this.bEmoticon = false;
            }
        }
        
        for (let i in this.listFeeDealer) {
            this.listFeeDealer[i].Update();
            if (this.bBig2Start) {
                this.listFeeDealer.splice(i, 1);
            }
        }

        for ( let i in this.listCardDealer )
        {
            this.listCardDealer[i].Update(10,10);
            if ( this.listCardDealer[i].iCompleteStep == 1 )
            {
                soundPlaceCard.play();
                const suit = Math.floor(this.listCardDealer[i].iCardIndex / 13);// 0: spade, 1: heart, 2: club, 3: diamond
                const num = this.listCardDealer[i].iCardIndex % 13;

                this.listHandCard.push({index:this.listCardDealer[i].iCardIndex, suit:suit, num:num, select:false});
                this.listCardDealer[i].iCompleteStep = 2;
                this.listCardDealer.splice(0, 1);
            }
        }

        for (let i = this.listCardSubmit.length - 1; i >= 0; i--)
        {
            this.listCardSubmit[i].Update(1,5);
            if ( this.listCardSubmit[i].iCompleteStep == 1 )
            {
                soundPlaceCard.play();
                //console.log(this.listCardSubmit[i].iCardIndex);
                this.listSentCard.push({index:this.listCardSubmit[i].iCardIndex});
                this.listCardSubmit[i].iCompleteStep = 2;
                this.listCardSubmit.splice(i, 1); // Use 'i' instead of '0'
            }
        }
    }

    OnSize(fHR, fVR)
    {
        this.m_fHR = fHR;
        this.m_fVR = fVR;
        //console.log("------------------------------this.m_fHRthis.m_fHR : " + this.m_fHR + " this.m_fVR.m_fVR : " + this.m_fVR);
        for ( let i in this.listImages )
        {
            this.listImages[i].OnSize(fHR, fVR);
        }
        
        for ( let i in this.listImagesBettingType )
        {
            this.listImagesBettingType[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listImagesCard )
        {
            this.listImagesCard[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listImagesTableCard )
        {
            this.listImagesTableCard[i].OnSize(fHR, fVR);
        }

        this.imagesPlayerType.OnSize(fHR, fVR);
        this.listImageCardWinFrame.OnSize(fHR, fVR);
        this.progressTime.OnSize(fHR, fVR);
        // for ( let i in this.listImagesHand )
        // {
        //     this.listImagesHand[i].OnSize(fHR, fVR);
        // }
        for ( let i in this.listEmoticon )
        {
            this.listEmoticon[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listImageAvatar )
        {
            this.listImageAvatar[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listCardDealer )
        {
            this.listCardDealer[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listCardSubmit )
        {
            this.listCardSubmit[i].OnSize(fHR, fVR);
        }

        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.textScore.OnSize(fHR, fVR);
        //this.labelCoin.OnSize(fHR, fVR);
        this.textName.OnSize(fHR, fVR);
        this.exitReserve.OnSize(fHR,fVR);
    }

    Locate(iFxLocation)
    {
        this.iFxLocation = iFxLocation;
        // this.x = this.ptLocations[iFxLocation].x;
        // this.y = this.ptLocations[iFxLocation].y;
        this.x = this.kSC.GetPosition(EPositionIndex.P1Table+iFxLocation).x;
        this.y = this.kSC.GetPosition(EPositionIndex.P1Table+iFxLocation).y;
        let typePosition = this.kSC.GetPosition(EPositionIndex.P1Type+iFxLocation);

        this.iCurrentX = this.x;
        this.iCurrentY = this.y;
        this.listImages[0].SetLocation(this.iCurrentX, this.iCurrentY);
        this.listImages[1].SetLocation(this.iCurrentX-6, this.iCurrentY-6);
        this.listImages[2].SetLocation(this.iCurrentX, this.iCurrentY);
        this.listImages[3].SetLocation(this.iCurrentX-10, this.iCurrentY-10);
        this.listImages[4].SetLocation(this.iCurrentX-23, this.iCurrentY+125);
        this.listImages[5].SetLocation(this.iCurrentX-70, this.iCurrentY+35);
        this.listImages[6].SetLocation(this.iCurrentX+130, this.iCurrentY-45);
        this.listImages[7].SetLocation(this.iCurrentX+130, this.iCurrentY-45);

        this.imagesPlayerType.SetLocation(typePosition.x, typePosition.y);

        for ( let i in this.listImagesBettingType )
        {
            this.listImagesBettingType[i].SetLocation(this.iCurrentX, this.iCurrentY+170);
        }

        // for ( let i in this.listImagesHand )
        // {
        //     //this.listImagesHand[i].SetLocation(this.iCurrentX - 155, this.iCurrentY - 50);
        //     this.listImagesHand[i].SetLocation(this.iCurrentX - 70, this.iCurrentY + 65);
        // }
        for ( let i in this.listImageAvatar )
        {
            this.listImageAvatar[i].SetLocation(this.iCurrentX, this.iCurrentY);
        }
        // this.labelCoin = new IUILabel(this.iCurrentX+ 80, this.iCurrentY + 130, 30, 30, 15, NumberImages, 114, 114, iGameCoin.toString(), 0);
        // this.textName = new IUIText(this.iCurrentX + -80, this.iCurrentY + 200, 15, this.strID, 0);
		for ( let i in this.listEmoticon )
        {
            this.listEmoticon[i].SetLocation(this.iCurrentX+6, this.iCurrentY-6);
        }
        this.textScore.SetLocation(this.iCurrentX+ 80, this.iCurrentY + 155);
        //this.labelCoin.SetLocation(this.iCurrentX+ 80, this.iCurrentY + 130);
        //this.labelTime.SetLocation(this.iCurrentX- 25, this.iCurrentY + 180);
        //this.textName.SetLocation(this.iCurrentX + -80, this.iCurrentY + 200);
        this.textName.SetLocation(this.iCurrentX+80, this.iCurrentY + 200);
        this.exitReserve.SetLocation(this.iCurrentX+30, this.iCurrentY-40);
        this.progressTime.SetLocation(this.iCurrentX-27, this.iCurrentY+120);

        this.OnSize(this.m_fHR, this.m_fVR);
    }

    SetPlayerType(strPlayerType,bSetGame)
    {
        this.strPlayerType = strPlayerType;
        console.log("SetPlayerType!!!!!!!!!!");
        console.log(bSetGame);
        if(bSetGame == false)
        {
            if(strPlayerType == 'Dealer')
            {
                this.bStarter = true;
            }
        }
    }

    SetPlayerLastBetting(strBettingType)
    {
        console.log(`IUser :: strLastBetting = ${strBettingType}`);
        this.strLastBetting = strBettingType;
    }

    SetPlayerReady(bReady)
    {
        this.bReady = bReady;
    }

    SetPlayerExit(bReserveExit)
    {
        console.log(`IUser :: SetPlayerExit = ${bReserveExit}`);
        this.bReserveExit = bReserveExit;
    }

    SetSentReset()
    {
        this.listSentCard = [];
        this.listTableCard = [];
    }

	SetPlayerEmoticon(iEmoticon)
    {
        this.bEmoticon = true;
        this.fEmoticonTime = 0;
        this.iEmoticon = iEmoticon;
    }
    AddSentCard( listCard, strdeckcode, i)
    {
        if(listCard != null)
        {
            //this.listTableCard = [];
            this.listSentCard = [];
            //this.listSentCard.push(list);
            //this.listTableCard.push(listCard);
            //console.log(`Addsentcard : ${listCard}`);
        }
        else
        {
            this.listSentCard = [];
        }
        console.log(`################################################################# AddSentCard ${listCard}`);
        console.log(listCard);

        let tx = 0;
        let ty = 0;

        if ( this.iFxLocation == 0 )
        {
            tx = this.x + 300 + (i*80);
            ty = this.y - 200;
        }
        else if( this.iFxLocation == 1 )
        {
            tx = this.x + 290 + (i*80);
            ty = this.y;
        }
        else if( this.iFxLocation == 2 )
        {
            tx = this.x - 100 + (i*80);
            ty = this.y + 200;
        }
        else if( this.iFxLocation == 3 )
        {
            tx = this.x - 200 - (i*80);
            ty = this.y;
        }

        const fAngle = 0;
        
        let submit = new ICardDealer(this.x, this.y, tx, ty, this.m_fHR, this.m_fVR, this.kTimer, 80, 110, listCard, strdeckcode, fAngle);
        this.listCardSubmit.push(submit);
    }

    UpdateMyCoin(iCoin)
    {
        // this.iGameCoin = iCoin;
        // this.textlCoin.UpdateCaption(this.iGameCoin.toLocaleString());
    }

    UpdateMyScore(iScore)
    {
        this.iScore = iScore;
        this.textScore.UpdateCaption(this.iScore);
    }

    SetBettingTime(iTime)
    {
        this.iBettingTime = iTime;
        this.iOriginBettingTime = parseInt(iTime);

        if ( iTime > 0)
        {
            this.progressTime.UpdateTime(0);
            this.progressTime.SetBettingTime(parseInt(iTime));
            this.progressTime.bEnable = true;
        }
    }

    ResetProgressbar()
    {
        this.progressTime.UpdateTime(0);
        this.progressTime.bEnable = true;
    }

    RemoveCard(index)
    {
        for ( let i in this.listHandCard )
        {
            if ( this.listHandCard[i].index == index )
            {
                this.listHandCard.splice(i, 1);
                return;
            }
        }
    }

    Betting(iCoin, iMyCoin)
    {
        this.UpdateMyCoin(iMyCoin);
        //this.ibettingCallCoin += parseInt(iCoin);
    }

    MyTurn(strBetting, listCards)
    {
        // this.UpdateMyCoin(iMyCoin);
        //this.SetBettingType(strBetting);
        // this.ibettingCallCoin += parseInt(iCoin);        
        for( let i in this.listProgressBar)
        {
           this.listProgressBar[i].bEnable = false;
           this.listProgressBar[i].UpdateTime(0);
        }

        if ( this.iFxLocation == 0 )
        {
            for ( let i in listCards )
            {
                this.RemoveCard(listCards[i].index);
            }
        }
        else
        {
            this.listHandCard.splice(0, listCards.length);
        }
    }

    BettingFee(iFee) {
        const tx = this.x + 0;
        const ty = this.y + 20;

        let chipPosition = this.kSC.GetPosition(EPositionIndex.P1Chip + this.iFxLocation);

        let dealer = new IChipDealer(tx, ty, chipPosition.x, chipPosition.y, this.m_fHR, this.m_fVR, this.kTimer, 40, 40, iFee, 1);
        this.listFeeDealer.push(dealer);

        soundChipThrow.play();
    }

    SetBettingType(strBettingType)
    {
        this.bEnableRenderBettingType = true;
        //this.iBettingTypeRenderCounter  = 1000;
        this.strLastBetting = strBettingType;
        
        switch ( strBettingType )
        {
            case 'Submit':
                this.iBettingType = 0;
                break;
            case 'Pass':
                this.iBettingType = 1;
                break;
        }
    }

    AddHandCard(iCard, strdeckcode)
    {
        console.log(`################################################################# AddHandCard ${iCard}`);
        // if(iCard == null)
        // {
        //     return;
        // }
        let index = this.iNumCards;

        const iOffset = this.iFxLocation == 0 ? 60 : 20;

        let tx = 0;
        let ty = 0;
        let fAngle = 0;

        if ( this.iFxLocation == 0 )
        {
            tx = this.x + 150 + (index*iOffset);
            ty = this.y;
        }
        else if(this.iFxLocation == 1)
        {
            tx = this.x + 150;
            ty = this.y - 60 + (index*iOffset);
            fAngle = 90;
        }
        else if ( this.iFxLocation == 2 )
        {
            tx = this.x - 90 + (index*iOffset);
            ty = this.y + 30;
        }
        else if(this.iFxLocation == 3)
        {
            tx = this.x - 95;
            ty = this.y - 110 + (index*iOffset);
            fAngle = 270;
        }
        
        let dealer = new ICardDealer(this.kSC.GetPosition(EPositionIndex.Dealer).x, this.kSC.GetPosition(EPositionIndex.Dealer).y, tx, ty, this.m_fHR, this.m_fVR, this.kTimer, 80, 110, iCard, strdeckcode, fAngle);
        this.listCardDealer.push(dealer);

        this.iNumCards++;
    }

    SetWinCards(listWinCards)
    {
        console.log(`User WinCards`);
        console.log(listWinCards);
        console.log(this.listHandCard);

        this.listWinCards = [false, false];
        for (let i in this.listHandCard) {
            for (let j in listWinCards) {
            //if (listWinCards[j] == this.listHandCard[i]) this.listWinCards[i] = true;
            if (listWinCards[j] == this.listHandCard[i].index) this.listWinCards[i] = true;
            }
        }
        console.log(this.listWinCards);
        }
}