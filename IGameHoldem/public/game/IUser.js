import IUIImage from "../js/image.js";
import IUIText from "../js/text.js";
import IUIProgressBar from "../js/progressbar.js";
import ICardDealer from "../game/ICardDealer.js";
import IChipDealer from "../game/IChipDealer.js";

export default class IUser{

    constructor(strID, strNickname, iGameCoin, iLocation, iFxLocation, iAvatar, eUserType, kTimer, kSC, listHandCard, isMobile, strDeckcode, iMaxPlayer)
    {
        console.log(`IUser::constructor : ${strNickname}, Coin ${iGameCoin}, iLocation:${iLocation}, iFxLocation :${iFxLocation}, iAvatar : ${iAvatar}, eUserType: ${eUserType}, iMaxPlayer:${iMaxPlayer}`);
        this.strID = strID;
        this.strNickname = strNickname;
        this.iGameCoin = iGameCoin;
        // this.textCoin = '';
        this.iLocation  = iLocation;
        this.iFxLocation = iFxLocation;
        this.iAvatar = parseInt(iAvatar);
        this.eUserType = eUserType;
        this.strDeckcode = strDeckcode;

        this.strPlayerType = '';
        this.bEnableRenderBettingType = false;
        this.iMaxPlayer = iMaxPlayer;
        this.iBettingType = -1;
        this.iBettingTypeRenderCounter = 0;
        this.listHandCard = [];
        //this.listHandCard = listHandCard;
        if ( listHandCard.length )
        {
            for ( let i in listHandCard )
            {
                //this.listHandCard.push(listHandCard[i]);
                this.listHandCard.push(listHandCard[i]);
            }
        }
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

        this.listChipDealer = [];
        this.listCallCoin = [];

        this.listWinCards = [false, false];

        this.iAutoFoldCounter = 0;

        this.kSC = kSC;
        this.isMobile = isMobile;
        
        this.x = 0;
        this.y = 0;
        if(iMaxPlayer == 9)
        {
            this.x = kSC.GetPosition(EPositionIndex.Ring9Player1+iFxLocation).x;
            this.y = kSC.GetPosition(EPositionIndex.Ring9Player1+iFxLocation).y;
        }
        else
        {
            this.x = kSC.GetPosition(EPositionIndex.Ring6Player1+iFxLocation).x;
            this.y = kSC.GetPosition(EPositionIndex.Ring6Player1+iFxLocation).y;
        }
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
            // new IUIImage(this.iCurrentX-120, this.iCurrentY-40, 600, 250, imageWinnerWing, 1241, 560)
        ];

        // this.listResponse = [];
        // for ( let i = 0; i < 4; ++ i )
        // {
        //     let imageResponses = new IUIImage(this.iCurrentX-50, this.iCurrentY+170, 50, 50, imageResponse[i], 200, 200);
        //     this.listResponse.push(imageResponses);
        // }

        let position;
        if (iMaxPlayer == 9) {
            position = kSC.GetPosition(EPositionIndex.Ring9Type1 + iFxLocation);
        } else {
            position = kSC.GetPosition(EPositionIndex.Ring6Type1 + iFxLocation);
        }
        this.listImagesPlayerType = 
        [
            new IUIImage(position.x, position.y, 50, 50, imagePlayerType[0], 137, 137),
            new IUIImage(position.x, position.y, 50, 50, imagePlayerType[1], 137, 137),
            new IUIImage(position.x, position.y, 50, 50, imagePlayerType[2], 137, 137),
        ];

        this.listImagesBettingType = [];

        for ( let i = 0; i < 8; ++ i )
        {
            let imageBettingType = new IUIImage(this.iCurrentX+20, this.iCurrentY+70, 120, 50, imageBettings[i], 200, 100);
            this.listImagesBettingType.push(imageBettingType);
        }

        this.imageRebuyin = new IUIImage(this.iCurrentX, this.iCurrentY, 160, 160, imageOtherRebuyin, 160, 160);

        this.listImagesCard = [];
        this.listImagesTurnCard = [];
        this.listImageCardWinFrame = null;
        this.listImageCardFoldFrame = null;
        //const cardImage = (strDeckcode == 1) ? imageCardOpen1 : imageCardOpen2;
        this.listOpenCard1 = null;
        this.listOpenCard2 = null;
        //this.cardOpen1 = null;
        //this.cardOpen2 = null;
        // if (this.isMobile) {
            let cardWidth = 125; // 기본 카드 너비
            let cardHeight = 150; // 기본 카드 높이

            // 다른 유저들을 위한 작은 카드 크기 설정
            let smallCardWidth = cardWidth * 0.7; // 예시: 70% 크기
            let smallCardHeight = cardHeight * 0.7; // 예시: 70% 크기
            for (let i = 0; i < 55; ++i) {
                // 다른 유저들에 대한 카드 크기 조정 적용
                let imageCard = new IUIImage(this.iCurrentX + 50, this.iCurrentY + 55, smallCardWidth, smallCardHeight, imageCards[i], 167, 231);

                this.listImagesCard.push(imageCard);
            }
            for ( let i = 0; i < 55; ++ i )
            {
                let imageCard = new IUIImage(this.iCurrentX+50, this.iCurrentY+55, smallCardWidth, smallCardHeight, imageCards[i], 167, 231);
    
                this.listImagesTurnCard.push(imageCard);
            }
            this.listImageCardWinFrame = new IUIImage(this.iCurrentX+50, this.iCurrentY+55, 135*0.7, 160*0.7, imageCardFrames[0], 163, 227);
            this.listImageCardFoldFrame = new IUIImage(this.iCurrentX+50, this.iCurrentY+55, smallCardWidth, smallCardHeight, imageCardFrames[1], 163, 227);
            // this.listOpenCard1 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, smallCardWidth, smallCardHeight, cardImage, 163, 227);
            // this.listOpenCard2 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, smallCardWidth, smallCardHeight, cardImage, 163, 227);
            //this.cardOpen1 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, smallCardWidth, smallCardHeight, imageCardOpen, 163, 227);
            //this.cardOpen2 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, smallCardWidth, smallCardHeight, imageCardOpen, 163, 227);
        // } else {
            // 자기 자신에 대한 기본 카드 크기 설정
            // for (let i = 0; i < 55; ++i) {
            //     let imageCard = new IUIImage(this.iCurrentX + 160, this.iCurrentY + 65, 115, 135, imageCards[i], 167, 231);

            //     this.listImagesCard.push(imageCard);
            // }
            // for ( let i = 0; i < 55; ++ i )
            // {
            //     let imageCard = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, imageCards[i], 167, 231);
    
            //     this.listImagesTurnCard.push(imageCard);
            // }
            // this.listImageCardWinFrame = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 125, 145, imageCardFrames[0], 163, 227);
            // this.listImageCardFoldFrame = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, imageCardFrames[1], 163, 227);
            // this.listOpenCard1 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, cardImage, 163, 227);
            // this.listOpenCard2 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, cardImage, 163, 227);
            // this.cardOpen1 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, imageCardOpen, 163, 227);
            // this.cardOpen2 = new IUIImage(this.iCurrentX+160, this.iCurrentY+65, 115, 135, imageCardOpen, 163, 227);
        // }

        this.renderCard1 = true;
        this.renderCard2 = true;
        this.isCardClicked = false;
        //this.selectedCardIndex = null; // 0: OpenCard1, 1: OpenCard2
        this.mouse1Y = 0;
        this.mouse2Y = 0;

        this.listImageAvatar = [];
        for ( let i = 0; i < 41; ++ i )
        {
            let image = new IUIImage(this.iCurrentX, this.iCurrentY, 160, 160, imageAvatar[i], 160, 160);

            this.listImageAvatar.push(image);
        }
        this.displayedCoin = iGameCoin;
        // this.progressTime = new IUIProgressBar(this.iCurrentX-23, this.iCurrentY+125, 210, 100, imageOtherAvatarProgress, 248, 109, kTimer);
        this.progressTime = new IUIProgressBar(this.iCurrentX-27, this.iCurrentY+120, 208, 100, imageOtherAvatarProgress, 248, 109, kTimer);
        // this.listProgressBar = [];
        // for ( let i = 0; i < 3; ++ i )
        // {
        //     let progressBar = new IUIProgressBar(this.iCurrentX+5, this.iCurrentY+165, 160, 15, imageProgressBar[i], 200, 34, kTimer);
        //     this.listProgressBar.push(progressBar);
        // }
        //this.textName = new IUIText(this.iCurrentX + -80, this.iCurrentY + 200, 15, strID, 0);
        this.textlCoin = new IUIText(this.iCurrentX+ 80, this.iCurrentY + 200, 32, this.formatCurrencyToKoreanWon(iGameCoin), 0, 'aqua');
        this.textName = new IUIText(this.iCurrentX+80, this.iCurrentY + 155, 22, strNickname, 0, 'white');
        this.textHand = new IUIText(this.iCurrentX+80, this.iCurrentY + 260, 30, '', 0, 'white');
        let coinPosition;
        if (iMaxPlayer == 9) {
            coinPosition = kSC.GetPosition(EPositionIndex.Ring9Coin1 + iFxLocation);
        } else {
            coinPosition = kSC.GetPosition(EPositionIndex.Ring6Coin1 + iFxLocation);
        }
        this.textCallCoin = new IUIImage(coinPosition.x, coinPosition.y, 160, 80, imageRaiseText, 100, 50, 25);
        //this.textCallCoin = new IUIImage(this.iCurrentX, this.iCurrentY, 200, 100, imageRaiseTextR, 100, 50, 25);
        this.exitReserve = new IUIImage(this.iCurrentX+30, this.iCurrentY-40, 102, 47, imageExitReserve, 102, 47);
        
        this.m_fVR = 1;
        this.m_fHR = 1;

        this.kTimer = kTimer;
        this.iNumCards = 0;

        this.fInterval = 0;
        this.bRender = false;
        this.bEnablePlay = false;

        this.bFold = false;
        this.bResult = false;
        this.ibettingCallCoin = 0;

        this.bReserveExit = false;
        this.bSpectator = true;
        this.bHandCardTurn = false;
        this.bShowCard = false;
        this.bShowDown = false;
        this.bJackpot = false;

        this.animatingCoin = false;
        this.textWinnerCoin = new IUIText(this.iCurrentX+ 80, this.iCurrentY + 200, 32, "", 0, 'aqua');
        this.textRebuyinCoin = new IUIText(this.iCurrentX+ 80, this.iCurrentY + 200, 32, "", 0, "rgba(20, 255, 36, 0.8)");
        this.bWinnerCoin = false;
        this.bRebuyinCoin = false;

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
        this.bFocus = false;
        this.bWinner = false;
        this.bAbstentionWin = false;
        this.bBettingMode = false;
        this.bFold = false;

        this.bHandCardTurn = false;
        this.bShowCard = false;
        this.bShowDown = false;
        this.bJackpot = false;
        this.bResult = false;

        this.iNumCards = 0;
        //this.listTempHandCard = [];
        this.listCardDealer = [];
        this.listChipDealer = [];
        this.strLastBetting = '';
        this.textHand.UpdateCaption('');
        //this.textCallCoin.UpdateCaption('');
        this.ibettingCallCoin = 0;

        this.renderCard1 = true;
        this.renderCard2 = true;
        this.isCardClicked = false;
        // this.selectedCardIndex = null; // 0: OpenCard1, 1: OpenCard2
        this.mouse1Y = 0;
        this.mouse2Y = 0;

        this.listWinCards = [false, false];

        for(let i in this.listImagesTurnCard)
        {
            this.listImagesTurnCard[i].iDirection = 0;
        }   
        // const cardImage = (this.strDeckcode == 1) ? imageCardOpen1 : imageCardOpen2;
        // this.listOpenCard1.sprite = cardImage;
        // this.listOpenCard2.sprite = cardImage;

        this.animatingCoin = false;
        this.progressTime.bEnable = false;
        this.progressTime.UpdateTime(0);
		// for( let i in this.listProgressBar)
        // {
        //     this.listProgressBar[i].bEnable = false;
        //     this.listProgressBar[i].UpdateTime(0);
        // }

        this.bWinnerCoin = false;
        this.bRebuyinCoin = false;

        this.textWinnerCoin.Clear();
        this.textRebuyinCoin.Clear();
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
            // if ( i == 6 )
            //     continue;

            this.listImages[i].Render(ctx);
        }

        this.listImageAvatar[this.iAvatar].Render(ctx);

        if ( this.fInterval >= 0 )
        {
            this.fInterval -= this.kTimer.GetElapsedTime();
            if ( this.fInterval <= 0 )
            {
                this.bRender = !this.bRender;
                this.fInterval = 0.5;
            }
        }

        // if (this.fResponse >= 2000) {
        //     // 매우 높은 지연 시간
        //     this.listResponse[0].Render(ctx);
        // } else if (this.fResponse >= 1300) {
        //     // 높은 지연 시간
        //     this.listResponse[1].Render(ctx);
        // } else if (this.fResponse >= 500) {
        //     // 보통 지연 시간
        //     this.listResponse[2].Render(ctx);
        // } else {
        //     // 낮은 지연 시간
        //     this.listResponse[3].Render(ctx);
        // }
        if (this.bFocus == true) {
            this.fFocusMineElapsedTime -= this.kTimer.GetElapsedTime();
            if (this.fFocusMineElapsedTime < 0) {
                this.bRenderFocusMine = !this.bRenderFocusMine;
                this.fFocusMineElapsedTime = 0.5;
            }

            if (this.bRenderFocusMine == true)
                this.listImages[3].Render(ctx);
        }
        // this.listImagesPlayerType[0].Render(ctx);
        // for (let i = 0; i < 2; i++)
        // {
        //     let x = this.x + (i*125) - 45;
        //     let y = this.y-60;
        //     this.listImagesCard[52].RenderLocation(ctx, x, y); 
        // }
        // this.listImages[5].Render(ctx);
        if ( this.strPlayerType == 'Dealer' )
        {
            this.listImagesPlayerType[0].Render(ctx);
        }
        else if ( this.strPlayerType == 'SB' )
        {
            this.listImagesPlayerType[1].Render(ctx);
        }
        else if ( this.strPlayerType == 'BB' )
        {
            this.listImagesPlayerType[2].Render(ctx);
        }
      
        if ( this.listHandCard.length > 0 )
        {
            if ( this.iFxLocation != 0 && this.strLastBetting == 'Fold' )
            {
                this.bFold = true;
                this.listImages[2].Render(ctx);
                this.listImagesBettingType[5].Render(ctx);
            }
            else if(this.bHandCardTurn == true && this.iFxLocation == 0)
            {
                for (let i in this.listHandCard) {
                    const x = this.x + (i * 125) - 45;
                    let y = this.y;

                    this.listImagesCard[this.listHandCard[i]].RenderLocation(ctx, x, y);

                    // if (i == 0 && this.renderCard1 == true) {
                    //     if(this.mouse1Y) y = this.mouse1Y;
                    //     this.listOpenCard1.RenderLocation(ctx, x, y);
                    //     if(this.bRender == true)
                    //         this.cardOpen1.RenderLocation(ctx,x,y);
                    // } else if (i == 1 && this.renderCard2 == true) {
                    //     if(this.mouse2Y) y = this.mouse2Y;
                    //     this.listOpenCard2.RenderLocation(ctx, x, y);
                    //     if(this.bRender == true)
                    //         this.cardOpen2.RenderLocation(ctx,x,y);
                    // }
                    if(this.renderCard1 == false && this.renderCard2 == false)
                    {
                        this.bHandCardTurn = false;
                    }
                }
            }
            else
            {
                for ( let i in this.listHandCard )
                {
                    let x = this.x + (i*125) - 45;
                    let y = this.y-60;

                    if( this.iFxLocation != 0)
                    {
                        x = this.x + (i*88) - 5;
                        y = this.y-20;
                    }

                    if(this.bShowCard == true || this.bShowDown == true)
                    {
                        this.listImagesTurnCard[this.listHandCard[i]].CardRenderTurn(ctx, x, y, this.kTimer,3,this.strDeckcode,this.bJackpot);
                    }
                    else if(this.bAbstentionWin == true && this.iFxLocation != 0 && this.bShowCard == false )
                    {
                        if( this.iFxLocation != 0)
                        {
                            x = this.x + (i*88) - 5;
                            y = this.y + 45;
                        }
                        else
                        {
                            x = this.x + (i*125) - 45;
                            y = this.y;
                        }
                        if(this.bJackpot)
                        {
                            this.listImagesCard[54].RenderLocation(ctx, x, y);
                        }
                        else if(this.strDeckcode == 1)
                        {
                            this.listImagesCard[52].RenderLocation(ctx, x, y);
                        }
                        else if(this.strDeckcode == 2)
                        {
                            this.listImagesCard[53].RenderLocation(ctx, x, y);
                        }
                    }
                    else
                    {
                        if(this.bResult == true && this.bAbstentionWin == false)
                        {
                            this.listImagesTurnCard[this.listHandCard[i]].CardRenderTurn(ctx, x, y, this.kTimer,3,this.strDeckcode,this.bJackpot);
                            if (i == 0) {
                                if (this.bWinner == true && this.listWinCards[0] == true) //&& this.bRender == true )
                                    this.listImageCardWinFrame.RenderLocation(ctx, x-7, y-5);
                            }
                            else {
                                if (this.bWinner == true && this.listWinCards[1] == true) //&& this.bRender == true )
                                    this.listImageCardWinFrame.RenderLocation(ctx, x-7, y-5);                   
                            }
                        }
                        else
                        {
                            if( this.iFxLocation != 0)
                            {
                                x = this.x + (i*88) - 5;
                                y = this.y + 45;
                            }
                            else
                            {
                                x = this.x + (i*125) - 45;
                                y = this.y - 20;
                            }
                            this.listImagesCard[this.listHandCard[i]].RenderLocation(ctx, x, y);
                            if(this.iFxLocation == 0 && this.strLastBetting == 'Fold')
                            {
                                this.bFold = true;
                                this.listImageCardFoldFrame.RenderLocation(ctx, x, y);
                            }
                            
                            if (i == 0) {
                                if (this.bWinner == true && this.listWinCards[0] == true) //&& this.bRender == true )
                                    this.listImageCardWinFrame.RenderLocation(ctx, x-7, y-5);
                            }
                            else {
                                if (this.bWinner == true && this.listWinCards[1] == true) //&& this.bRender == true )
                                    this.listImageCardWinFrame.RenderLocation(ctx, x-7, y-5);                   
                            }
                        }
                    }
                }
            }
        }
        
        if(this.bFold == false && this.bBettingMode == true && this.bFocus == true)
        {
            this.progressTime.Render(ctx);
            // this.progressTime.StartAnimation(ctx);
        }
        this.listImages[4].Render(ctx);

        //this.labelCoin.Render(ctx);
        this.textName.Render(ctx);
        this.textHand.Render(ctx);

        if(this.bRebuyinCoin)
        {
            this.imageRebuyin.Render(ctx);
        }

        if(this.bReserveExit == true)
        {
            this.exitReserve.Render(ctx);
        }

        if ( this.iFxLocation == 0 && this.strLastBetting == 'Fold' )
        {
            //const cOffset = parseInt(50 * this.fVR);
            this.listImagesBettingType[5].Render(ctx);
        }
        if ( this.strLastBetting == 'Allin' )
        {
            this.listImagesBettingType[3].Render(ctx);
        }
        if ( this.bWinner == true && this.bRebuyinCoin == false)
        {
            // this.listImages[6].Render(ctx);
            this.listImages[5].Render(ctx);
        }
        for ( let i in this.listChipDealer )
        {
            this.listChipDealer[i].Render(ctx);
        }
        // 플랍, 리버, 턴 모드일때만 보이는거.
        if ( this.bEnableRenderBettingType && this.bRebuyinCoin == false) 
        {
            if ( this.iBettingType != -1 && this.bWinner == false && this.bBettingMode == true)
            {
                this.listImagesBettingType[this.iBettingType].Render(ctx);
            }
        }
        if(this.ibettingCallCoin != 0 && this.bResult == false)
        {
            this.textCallCoin.RenderText(ctx,this.ibettingCallCoin.toLocaleString());
        }
        if(this.bWinnerCoin == false && this.bRebuyinCoin == false)
        {
            this.textlCoin.Render(ctx);
        }
        if(this.bWinnerCoin == true)
        {
            if(this.textWinnerCoin.RenderLocationUp(ctx,this.iCurrentY+20, 0.2) == false)
            {
                this.bWinnerCoin = false;
            }
            //this.textWinnerCoin.Render(ctx);
        }
        if(this.bRebuyinCoin == true)
        {
            if(this.textRebuyinCoin.RenderLocationUp(ctx,this.iCurrentY+20, 0.2) == false)
            {
                this.bRebuyinCoin = false;
            }
            // this.textRebuyinCoin.RenderLocationUp(ctx,this.iCurrentY-30, 0.7);
            // this.textRebuyinCoin.Render(ctx);
        } 
        
        // for ( let i in this.listProgressBar )
        // {
        //     if(this.bFold == false && this.bBettingMode == true && this.bFocus == true)
        //         this.listProgressBar[i].Render(ctx);
        // }

        for ( let i in this.listCardDealer )
        {
            this.listCardDealer[i].Render(ctx);
        }

        if(this.bEmoticon == true)
        {
            this.listEmoticon[this.iEmoticon].RenderShake(ctx,1.5,-20,20);
        }
    }

    Update()
    {
        if ( this.iBettingTime > 0 )
        {
            this.iBettingTime -= this.kTimer.GetElapsedMilliTime();
            let iValue = this.iBettingTime;
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
        for (let i in this.listCardDealer) {
            this.listCardDealer[i].Update();
            if (this.listCardDealer[i].iCompleteStep == 1) {
                soundPlaceCard.play();

                this.listHandCard.push(this.listCardDealer[i].iCardIndex);
                //this.listHandCard.push(this.listTempHandCard[i]);
                this.listCardDealer[i].iCompleteStep = 2;
                //this.listTempHandCard.splice(0, 1);
                this.listCardDealer.splice(0, 1);
            }
        }
        for (let i in this.listChipDealer) {
            this.listChipDealer[i].Update();
            if (this.bBettingMode == false)
                this.listChipDealer.splice(i, 1);
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

        for ( let i in this.listImagesPlayerType )
        {
            this.listImagesPlayerType[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listImagesBettingType )
        {
            this.listImagesBettingType[i].OnSize(fHR, fVR);
        }
        // for ( let i in this.listResponse )
        // {
        //     this.listResponse[i].OnSize(fHR, fVR);
        // }
        for ( let i in this.listImagesCard )
        {
            this.listImagesCard[i].OnSize(fHR, fVR);
        }
        for ( let i in this.listImagesTurnCard )
        {
            this.listImagesTurnCard[i].OnSize(fHR, fVR);
        }

        this.listImageCardWinFrame.OnSize(fHR, fVR);
        this.listImageCardFoldFrame.OnSize(fHR, fVR);

        // this.listOpenCard1.OnSize(fHR, fVR);
        // this.listOpenCard2.OnSize(fHR, fVR);
        // this.cardOpen1.OnSize(fHR, fVR);
        // this.cardOpen2.OnSize(fHR, fVR);
        this.imageRebuyin.OnSize(fHR, fVR);
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
        this.progressTime.OnSize(fHR, fVR);
        // for( let i in this.listProgressBar )
        // {
        //     this.listProgressBar[i].OnSize(fHR, fVR);
        // }
        // for ( let i in this.listCardDealer )
        // {
        //     this.listCardDealer[i].OnSize(fHR, fVR);
        // }
        // if(this.bSpectator == false)
        // {
        //     for ( let i in this.listChipDealer )
        //     {
        //         this.listChipDealer[i].OnSize(fHR, fVR);
        //     }
        // }
        this.iCurrentX = this.x * fHR;
        this.iCurrentY = this.y * fVR;

        this.textlCoin.OnSize(fHR, fVR);
        this.textName.OnSize(fHR, fVR);
        this.textHand.OnSize(fHR, fVR);
        this.textCallCoin.OnSize(fHR,fVR);
        this.textWinnerCoin.OnSize(fHR,fVR);
        this.textRebuyinCoin.OnSize(fHR,fVR);
        this.exitReserve.OnSize(fHR,fVR);
    }

    Locate(iFxLocation)
    {
        this.iFxLocation = iFxLocation;

        let position;
        let typePosition;
        let coinPosition;
    
        if(this.iMaxPlayer == 9)
        {
            position = this.kSC.GetPosition(EPositionIndex.Ring9Player1+iFxLocation);
            typePosition = this.kSC.GetPosition(EPositionIndex.Ring9Type1+iFxLocation);
            coinPosition = this.kSC.GetPosition(EPositionIndex.Ring9Coin1+iFxLocation);
        }
        else
        {
            position = this.kSC.GetPosition(EPositionIndex.Ring6Player1+iFxLocation);
            typePosition = this.kSC.GetPosition(EPositionIndex.Ring6Type1+iFxLocation);
            coinPosition = this.kSC.GetPosition(EPositionIndex.Ring6Coin1+iFxLocation);
        }
        this.x = position.x;
        this.y = position.y;

        this.iCurrentX = this.x;
        this.iCurrentY = this.y;

        this.listImages[0].SetLocation(this.iCurrentX, this.iCurrentY);
        this.listImages[1].SetLocation(this.iCurrentX-6, this.iCurrentY-6);
        this.listImages[2].SetLocation(this.iCurrentX, this.iCurrentY);
        //this.listImages[2].SetLocation(this.iCurrentX-19, this.iCurrentY+120-24);
        this.listImages[3].SetLocation(this.iCurrentX-10, this.iCurrentY-10);
        this.listImages[4].SetLocation(this.iCurrentX-23, this.iCurrentY+125);
        this.listImages[5].SetLocation(this.iCurrentX-70, this.iCurrentY+35);
        // this.listImages[6].SetLocation(this.iCurrentX-120, this.iCurrentY-40);

        for ( let i in this.listImagesPlayerType )
        {
            this.listImagesPlayerType[i].SetLocation(typePosition.x, typePosition.y);
        }

        for ( let i in this.listImagesBettingType )
        {
            this.listImagesBettingType[i].SetLocation(this.iCurrentX+20, this.iCurrentY+70);
        }

        // for ( let i in  this.listResponse )
        // {
        //     this.listResponse[i].SetLocation(this.iCurrentX-50, this.iCurrentY+170);
        // }

        // for ( let i in this.listImagesHand )
        // {
        //     //this.listImagesHand[i].SetLocation(this.iCurrentX - 155, this.iCurrentY - 50);
        //     this.listImagesHand[i].SetLocation(this.iCurrentX - 70, this.iCurrentY + 65);
        // }
        for ( let i in this.listImageAvatar )
        {
            this.listImageAvatar[i].SetLocation(this.iCurrentX, this.iCurrentY);
        }

        for ( let i in this.listEmoticon )
        {
            this.listEmoticon[i].SetLocation(this.iCurrentX+6, this.iCurrentY-6);
        }

        this.imageRebuyin.SetLocation(this.iCurrentX, this.iCurrentY);
        this.textName.SetLocation(this.iCurrentX+80, this.iCurrentY + 155);
        this.progressTime.SetLocation(this.iCurrentX-27, this.iCurrentY+120);
        // for ( let i in this.listProgressBar )
        // {
        //     this.listProgressBar[i].SetLocation(this.iCurrentX+5, this.iCurrentY+165);
        // }
        this.textlCoin.SetLocation(this.iCurrentX+ 80, this.iCurrentY + 200);
        
        this.textHand.SetLocation(this.iCurrentX+80, this.iCurrentY + 250);
        this.textCallCoin.SetLocation(coinPosition.x, coinPosition.y);
        this.exitReserve.SetLocation(this.iCurrentX+30, this.iCurrentY-40);

        this.textWinnerCoin.SetLocation(this.iCurrentX + 80, this.iCurrentY + 200);
        this.textRebuyinCoin.SetLocation(this.iCurrentX + 80, this.iCurrentY + 200);
        
        this.OnSize(this.m_fHR, this.m_fVR);
    }

    SetMobileCard()
    {
        console.log(`IUser :: SetMobileCard ${this.isMobile}`);
        // if(this.isMobile)
        // {
            for (let i = 0; i < 55; ++i) {
                this.listImagesCard[i].width = 125;
                this.listImagesCard[i].height = 150;
            }
            for ( let i = 0; i < 55; ++ i )
            {
                this.listImagesTurnCard[i].width = 125;
                this.listImagesTurnCard[i].height = 150;
            }
            this.listImageCardWinFrame.width = 135;
            this.listImageCardWinFrame.height = 160;
            this.listImageCardFoldFrame.width = 125;
            this.listImageCardFoldFrame.height = 150;
            // this.listOpenCard1.width = 115;
            // this.listOpenCard1.height = 135;
            // this.listOpenCard2.width = 115;
            // this.listOpenCard2.height = 135;
            // this.cardOpen1.width = 115;
            // this.cardOpen1.height = 135;
            // this.cardOpen2.width = 115;
            // this.cardOpen2.height = 135;
        // }
    }

    SetPlayerType(strPlayerType)
    {
        console.log(`IUser :: playerType = ${strPlayerType}`);
        this.strPlayerType = strPlayerType;
    }

    SetPlayerLastBetting(strBettingType)
    {
        console.log(`IUser :: strLastBetting = ${strBettingType}`);
        this.strLastBetting = strBettingType;
    }

    SetPlayerExit(bReserveExit)
    {
        console.log(`IUser :: SetPlayerExit = ${bReserveExit}`);
        this.bReserveExit = bReserveExit;
    }

    SetPlayerResponse(latency)
    {
        this.fResponse = latency;
    }

    SetPlayerEmoticon(iEmoticon)
    {
        this.bEmoticon = true;
        this.fEmoticonTime = 0;
        this.iEmoticon = iEmoticon;
    }

    SetWinCoin(iWinCoin)
    {
        console.log(`IUser::SetWinCoin = ${iWinCoin}`);
        this.bWinnerCoin = true;
        const sWinCoin = `+${this.formatCurrencyToKoreanWon(iWinCoin)}`;
        this.textWinnerCoin.UpdateCaption(sWinCoin);
    }

    SetJackpotCoin(iJackpot)
    {
        this.textWinnerCoin.Clear();
        console.log(`IUser::SetJackpotCoin = ${iJackpot}`);
        this.bWinnerCoin = true;
        const sWinCoin = `잭팟 ${this.formatCurrencyToKoreanWon(iJackpot)}!`;
        this.textWinnerCoin.UpdateCaption(sWinCoin);
    }

    SetRebuyInCoin(iCoin)
    {
        this.bRebuyinCoin = true;
        const sRebuyinCoin = `+${this.formatCurrencyToKoreanWon(iCoin)}`;
        this.textRebuyinCoin.UpdateCaption(sRebuyinCoin);
    }

    SetJackpot()
    {
        this.bJackpot = true;
        // this.listOpenCard1.sprite = imageCardOpen3;
        // this.listOpenCard2.sprite = imageCardOpen3;
    }

    UpdateMyCoin(targetCoin) {
        this.iGameCoin = targetCoin; // Immediately update the internal coin value
        console.log(targetCoin);
        if (!this.animatingCoin) { // Check if an animation is already in progress
            this.animatingCoin = true;
            let animatedCoin = this.displayedCoin || 0; // Use a separate variable for the animated value
            let increment = Math.ceil((targetCoin - animatedCoin) / 50); // Calculate increment

            const updateCoinFrame = () => {
                if (animatedCoin < targetCoin) {
                    animatedCoin += increment; // Increment the animated coin amount
                    if (animatedCoin > targetCoin) {
                        animatedCoin = targetCoin; // Prevent overshooting the target
                    }
                    let formattedCoin = this.formatCurrencyToKoreanWon(animatedCoin);
                    this.textlCoin.UpdateCaption(formattedCoin); // Update UI
                    requestAnimationFrame(updateCoinFrame); // Schedule next frame
                } else {
                    this.textlCoin.UpdateCaption(this.formatCurrencyToKoreanWon(targetCoin)); // Final update to target value
                    this.displayedCoin = targetCoin; // Update the displayed coin variable to match the target
                    this.animatingCoin = false; // End animation
                }
            };

            updateCoinFrame(); // Start the animation
        }
    }

    formatCurrencyToKoreanWon(value) {
        // 만원 단위와 그 이하를 분리
        // console.log(`formatCurrencyToKoreanWon`);
        // console.log(value);
        const units = Math.floor(value / 10000);
        const remainder = value % 10000;

        // 만원 단위 포맷팅: 3자리마다 콤마 추가
        const unitsFormat = units.toLocaleString('ko-KR');

        // 나머지 포맷팅: 3자리마다 콤마 추가
        const remainderFormat = remainder > 0 ? remainder.toLocaleString('ko-KR') : '';

        // "만" 단위와 "천 원" 단위를 조합
        let formattedValue = '';
        if (units > 0) {
            formattedValue += `${unitsFormat}만`;
        }
        if (remainder > 0) {
            formattedValue += units > 0 ? ` ${remainderFormat}` : remainderFormat;
        }
        // console.log(formattedValue);
        // 최종 결과 반환
        return formattedValue;
    }

    SetBettingTime(iTime)
    {
        this.iBettingTime = iTime*1000;
        this.iOriginBettingTime = parseInt(iTime);

        if ( iTime > 0)
        {
            this.progressTime.UpdateTime(0);
            this.progressTime.SetBettingTime(parseInt(iTime));
            this.progressTime.bEnable = true;
            // this.progressTime.StartAnimation();
            // for( let i in this.listProgressBar)
            // {
            //     this.listProgressBar[i].UpdateTime(0);
            //     this.listProgressBar[i].SetBettingTime(parseInt(iTime));
            //     this.listProgressBar[i].bEnable = true;
            // }
        }
    }

    Betting(strBetting, iCoin, iMyCoin)
    {
        // console.log(this.bEnablePlay,this.bSpectator);
        // if(this.bEnablePlay == true && this.bSpectator == false)
        // {
            this.UpdateMyCoin(iMyCoin);
            this.SetBettingType(strBetting, iMyCoin);
            this.ibettingCallCoin += parseInt(iCoin);
            //this.textCallCoin.UpdateCaption(this.ibettingCallCoin.toLocaleString());
            this.progressTime.UpdateTime(0);
            this.progressTime.bEnable = false;

            const tx = this.x + 0;
            const ty = this.y + 20;

            let chipPosition;
            if(this.iMaxPlayer == 9)
            {
                chipPosition = this.kSC.GetPosition(EPositionIndex.Ring9Chip1+this.iFxLocation);
            }
            else
            {
                chipPosition = this.kSC.GetPosition(EPositionIndex.Ring6Chip1+this.iFxLocation);
            }
            let x = chipPosition.x;
            let y = chipPosition.y;

            let dealer = new IChipDealer(tx, ty, x, y, this.m_fHR, this.m_fVR, this.kTimer, 40, 40, iCoin, 1);
            console.log(dealer);
            this.listChipDealer.push(dealer);

            soundChipThrow.play();
        // }
    }

    SetBettingType(strBettingType, iMyCoin)
    {
        this.bEnableRenderBettingType = true;
        //this.iBettingTypeRenderCounter  = 1000;
        this.strLastBetting = strBettingType;

        switch ( strBettingType )
        {
            case 'Quater':
                this.iBettingType = 0;
                break;
            case 'Half':
                this.iBettingType = 1;
                break;
            case 'Full':
                this.iBettingType = 2;
                break;
            case 'Allin':
                this.iBettingType = 3;
                break;
            case 'Call':
                this.iBettingType = 4;
                break;
            case 'Fold':
                this.iBettingType = 5;
                break;
            case 'Check':
                this.iBettingType = 6;
                break;
            case 'Raise':
                this.iBettingType = 7;
                break;
            default:
                this.iBettingType = -1;
                break;
        }
        if ( this.iBettingType >= 0 && this.iBettingType <= 7 )
        {
            if(iMyCoin == 0 && (this.iBettingType == 7 || this.iBettingType == 4)) soundBettingType[3].play();
            else soundBettingType[this.iBettingType].play();
        }
    }

    AddHandCard(iCard, strdeckcode)
    {
        console.log(`################################################################# AddHandCard ${iCard}`);

        this.bHandCardTurn = true;

        let index = this.iNumCards;

        const tx = this.x + (index*100) - 25;
        const ty = this.y - 20;

        let fAngle = 0;

        let dealer = new ICardDealer(this.kSC.GetPosition(EPositionIndex.Dealer).x,this.kSC.GetPosition(EPositionIndex.Dealer).y, tx, ty, this.m_fHR, this.m_fVR, this.kTimer, 115, 135, iCard, strdeckcode, fAngle);

        this.listCardDealer.push(dealer);

        ++ this.iNumCards;
    }

    SetWinCards(listWinCards)
    {
        console.log(`User WinCards`);
        console.log(listWinCards);
        console.log(this.listHandCard);

        this.listWinCards = [false, false];
        for (let i in this.listHandCard) {
            for (let j in listWinCards) {
                if (listWinCards[j] == this.listHandCard[i]) this.listWinCards[i] = true;
            }
        }
        console.log(this.listWinCards);
    }

    Leave()
    {
        // 카드 선택이 되어 있다면, 모든 선택 상태와 위치를 초기화합니다.
        if (this.isCardClicked) {
            // if (this.selectedCardIndex == 0) {
            //     // 카드 1의 위치를 초기화
            //     this.mouse1Y = this.y;
            // } else if (this.selectedCardIndex == 1) {
            //     // 카드 2의 위치를 초기화
            //     this.mouse2Y = this.y;
            // }

            // 카드의 렌더링 상태 초기화
            this.renderCard1 = false;
            this.renderCard2 = false;

            // 선택 상태 초기화
            this.isCardClicked = false;
            // this.selectedCardIndex = null;
        }
    }
    
    // Down(mouse) {  
    //     if(this.bHandCardTurn == true) {
    //         if(this.renderCard1 == true || this.renderCard2 == true) {
    //             this.selectCard(mouse);
    //             this.initialMouseY = mouse.y;  // 마우스의 초기 Y 좌표 저장
    //         }
    //     }
    // }
    
    // Over(mouse) {
    //     // 카드가 클릭된 상태인지 확인
    //     if (this.isCardClicked) {
    //         const yOffset = mouse.y - this.initialMouseY;  // 움직인 거리 계산
    //         let cardMoved = false;  // 카드가 움직였는지 여부를 추적하는 변수
    
    //         // 선택된 카드의 인덱스에 따라 yOffset이 양수일 경우에만 위치를 업데이트
    //         if (yOffset > 0) {
    //             if (this.selectedCardIndex == 0) {
    //                 // 카드 1이 마우스 범위 내에 있는지 확인
    //                 if (this.isInsideBounds(mouse, this.getCardBounds(0))) {
    //                     this.mouse1Y = this.y + yOffset;
    //                     cardMoved = true;
    //                 }
    //             } else if (this.selectedCardIndex == 1) {
    //                 // 카드 2가 마우스 범위 내에 있는지 확인
    //                 if (this.isInsideBounds(mouse, this.getCardBounds(1))) {
    //                     this.mouse2Y = this.y + yOffset;
    //                     cardMoved = true;
    //                 }
    //             }
    //         }
    
    //         // 카드가 움직이지 않았다면, 원래 위치로 돌려놓기
    //         if (!cardMoved) {
    //             if (this.selectedCardIndex == 0) {
    //                 this.mouse1Y = this.y; // 카드 1을 원래 위치로
    //             } else if (this.selectedCardIndex == 1) {
    //                 this.mouse2Y = this.y; // 카드 2를 원래 위치로
    //             }
    //         }
    //     }
    // }

    //Touch(touch)
    //{
        // if (this.isCardClicked) {
        //     const yOffset = touch.y - this.initialMouseY;  // 움직인 거리 계산
        //     // yOffset이 양수일 경우에만 위치를 업데이트
        //     if (yOffset > 0) {
        //         if (this.selectedCardIndex == 0) {
        //             this.mouse1Y = this.y + yOffset;
        //         } else if (this.selectedCardIndex == 1) {
        //             this.mouse2Y = this.y + yOffset;
        //         }
        //     }
        // }
    //}
    
    //Over(mouse) {
        // if (this.isCardClicked) {
        //     const yOffset = mouse.y - this.initialMouseY;  // 움직인 거리 계산
    
        //     // yOffset이 양수일 경우에만 위치를 업데이트
        //     if (yOffset > 0) {
        //         if (this.selectedCardIndex == 0) {
        //             this.mouse1Y = this.y + yOffset;
        //         } else if (this.selectedCardIndex == 1) {
        //             this.mouse2Y = this.y + yOffset;
        //         }
        //     }
        // }
    //}
    
    //Up(mouse) {
        // if (this.isCardClicked) {
        //     // 마우스 버튼을 떼었을 때만 범위 검사를 수행
        //     const bounds1 = this.getCardBounds(0);
        //     const bounds2 = this.getCardBounds(1);
            
        //     if (this.selectedCardIndex == 0 && !this.isInsideBounds(mouse, bounds1)) {
        //         // 카드 1의 위치를 초기화
        //         this.mouse1Y = this.y;
        //     } else if (this.selectedCardIndex == 1 && !this.isInsideBounds(mouse, bounds2)) {
        //         // 카드 2의 위치를 초기화
        //         this.mouse2Y = this.y;
        //     }
            
        //     // 나머지 Up 로직
        //     if (this.selectedCardIndex == 0) {
        //         this.renderCard1 = false;
        //     } else if (this.selectedCardIndex == 1) {
        //         this.renderCard2 = false;
        //     }
            
        //     this.isCardClicked = false; // 플래그 초기화
        //     this.selectedCardIndex = null; // 선택된 카드 초기화
        // }
    //}

    // getCardBounds(i) {
    //     let offsetX = 0;
    //     let offsetY = 0;
    //     let cardWidth = 100; // 카드 기본 너비
        
    //     if (i == 0) {
    //         if (this.mouse1Y > 0) {
    //             offsetY = this.mouse1Y - this.y;  // Y 변화량 계산
    //         }
    //         cardWidth -= 5; // i가 0일 때 카드 너비를 20px 줄임
    //     } else if (i == 1 && this.mouse2Y > 0) {
    //         offsetY = this.mouse2Y - this.y;  // Y 변화량 계산
    //     }
    
    //     const x = ((this.x - 25 + (i * 100)) + offsetX) * this.m_fHR;
    //     const y = ((this.y - 20) + offsetY) * this.m_fVR;
    //     const width = (this.x - 25 + (i * 100) + cardWidth) * this.m_fHR;
    //     const height = (this.y - 20 + 100) * this.m_fVR;
    
    //     return {
    //         x: x,
    //         y: y,
    //         width: width,
    //         height: height
    //     };
    // }

    // isInsideBounds(mouse, bounds) {
    
    //     return mouse.x > bounds.x && 
    //            mouse.x < bounds.width && 
    //            mouse.y > bounds.y && 
    //            mouse.y < bounds.height;
    // }
    
    // selectCard(mouse) {
    //     const bounds1 = this.getCardBounds(0);
    //     const bounds2 = this.getCardBounds(1);
        
    //     if (this.isInsideBounds(mouse, bounds1)) {
    //         this.selectedCardIndex = 0;
    //         this.isCardClicked = true;
    //         this.renderCard1 = true;
    //     } else if (this.isInsideBounds(mouse, bounds2)) {
    //         this.selectedCardIndex = 1;
    //         this.isCardClicked = true;
    //         this.renderCard2 = true;
    //     } else {
    //         this.isCardClicked = false;
    //     }
    // }
}