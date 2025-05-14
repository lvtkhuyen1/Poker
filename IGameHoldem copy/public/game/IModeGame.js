import IUILabel from "../js/label.js";
import IUIImage from "../js/image.js";
import IUser from "../game/IUser.js";
import ICardDealer from "../game/ICardDealer.js";
import IUIText from "../js/text.js";
import IPotManager from "../game/IPotManager.js";
import IWaveEffect from "./IWaveEffect.js";
// import IFireEffect from "./IFireEffect.js";
import IRainEffectManager from "./IRainEffectManager.js";
import IChipDealer from "./IChipDealer.js";

export default class IModeGame {
    // constructor(socket, listButtons, listBgs, listImages, listLocations, kSC, kTimer, isMobile, strLobbyAddress) {
    constructor(socket, listButtons, listBgs, listLocations, kSC, kTimer, isMobile, strLobbyAddress) {

        this.socket = socket;
        this.listButtons = listButtons;
        this.listBgs = listBgs;
        // this.listImages = listImages;
        this.listLocations = listLocations;

        this.listPlayers = [];
        this.strOptionCode = 0;
        this.strDeckcode = 0;
        this.cMaxPlayer = 0;
        this.strLobbyAddress = strLobbyAddress;

        this.iTotalBettingCoin = 0;
        this.iBettingCoin = 0;
        this.iCallCoin = 0;
        this.iStartCoinText = new IUIText(30, 40, 25, '수익 : 0', 1),
        //  Jackpot

        // this.listLabels = [
        //     new IUILabel(kSC.GetPosition(EPositionIndex.TotalBettingCoinLabel).x, kSC.GetPosition(EPositionIndex.TotalBettingCoinLabel).y,28,35,23,NumberImages4,150,150,this.iTotalBettingCoin.toString(),2),
        //     new IUILabel(kSC.GetPosition(EPositionIndex.CallCoinLabel).x, kSC.GetPosition(EPositionIndex.CallCoinLabel).y,28, 35, 23,NumberImages4,150,150,this.iCallCoin.toString(),2),
        //     new IUILabel(kSC.GetPosition(EPositionIndex.RaiseCoinLabel).x, kSC.GetPosition(EPositionIndex.RaiseCoinLabel).y, 28, 35, 23, NumberImages0, 150, 180, this.iCallCoin.toString(),2),

        //     new IUILabel(kSC.GetPosition(EPositionIndex.JackpotCoinLabel).x, kSC.GetPosition(EPositionIndex.JackpotCoinLabel).y, 35, 35, 23, NumberImages4, 150, 150, this.iCallCoin.toString(),2),
        // ];
        this.textTotalBettingcoin = new IUIText(kSC.GetPosition(EPositionIndex.TotalBettingCoinLabel).x, kSC.GetPosition(EPositionIndex.TotalBettingCoinLabel).y, 30, "0", 0,'yellow');
        // this.listTexts = [
        //     new IUIText(350, 53, 25, "B", 2),
        //     new IUIText(350, 113, 25, "1000000", 2),
        // ];
        // this.listDot = [
        //     new IUIImage(1120, 455, 10, 9, imageModeStandbyDot, 105, 90),
        //     new IUIImage(1135, 455, 10, 9, imageModeStandbyDot, 105, 90),
        //     new IUIImage(1150, 455, 10, 9, imageModeStandbyDot, 105, 90),
        // ];
        
        this.listBettingButtons = [];
        this.listReservebet = [];
        this.listLocationButtons = [];
        // this.listLocationArrow = [];
        this.listTablePanel = [];
        this.listJackpotPanel = [];
        this.listCardDeck = [];
        this.listJackpotDeck = [];
        this.bEnableBetting = false;
        this.bReserveBetStart = false;
        this.bReserveBet = false;
        this.bPreFlopStart = false;
        this.bEnableLocation = false;

        this.listDisableLocations = [];

        this.kSC = kSC;
        this.isMobile = isMobile;

        //this.listButtons[1].bEnable = false;
        //this.listButtons[0].bEnable = false;

        this.bEnableDealingHandCard = false;
        this.fDealingCardElapsedTime = 0;
        this.iLastDealingCardLocation = 0;
        this.listHandCard = [];
        this.strHand = '';

        this.bEnableDealingFlop = false;
        this.bEnableDealingTurn = false;
        this.bEnableDealingRiver = false;
        this.bEnableDealingCard = false;
        this.fDealingFlopTime = 0;
        this.fDealingTurnTime = 0;
        this.fDealingRiverTime = 0;
        this.listTableCard = [];
        this.listTableCardTemp = [];

        this.listImagesCard = [];
        for (let i = 0; i < 55; ++i) {
            let resource = new IUIImage(0, 0, 130, 160, imageCards[i], 167, 231);

            this.listImagesCard.push(resource);
        }
        this.listImagesCardFrame = new IUIImage(0,0,140,170,imageCardFrames[0],163,227);
        // this.gameWinCeremony = new IUIImage(kSC.GetPosition(EPositionIndex.WinCeremony).x, kSC.GetPosition(EPositionIndex.WinCeremony).y,1241,560,imageWinCeremony,1241,560);
        // this.gameAbstentionWin = new IUIImage(kSC.GetPosition(EPositionIndex.AbstentionWin).x, kSC.GetPosition(EPositionIndex.AbstentionWin).y,950,403,imageAbstentionWin,1241,560);
        // this.gamewinMadePanel = new IUIImage(kSC.GetPosition(EPositionIndex.WinMadePanel).x, kSC.GetPosition(EPositionIndex.WinMadePanel).y,350,65,imageWinMadePanel,130,30);

        this.kTimer = kTimer;
        this.listCardDealer = [];
        this.iNumCards = 0;

        this.slider = [];
        this.sliderBG = new IUIImage(kSC.GetPosition(EPositionIndex.MobileSliderBar).x, kSC.GetPosition(EPositionIndex.MobileSliderBar).y, 170, 420, imageSliderBg, 170, 420);
        // this.raiseActive = new IUIImage(kSC.GetPosition(EPositionIndex.RaiseActive).x, kSC.GetPosition(EPositionIndex.RaiseActive).y, 190,110,RaiseActive,526,272);

        // this.emoticonBG = null;
        // this.emoticonButtons = [];
        // this.bEmoticon = false;
        
        this.listPotManager = [];
        this.listTempPot = [];
        this.kMainUser = null;

        this.iBlind = 0;
        this.listWinCards = [false, false, false, false, false];
        this.fInterval = 0;
        this.bRender = false;
        this.fInterval2 = 0;
        this.iRender = 0;
        this.strWinnerHand = "";
        this.strWinnerDescr = [];
        this.iCurrentX = 0;
        this.iCurrentY = 0;

        this.listImagesHand = [];
        for (let i = 0; i < 11; ++i) {
            //let image = new IUIImage(this.iCurrentX-155, this.iCurrentY-50, 300, 58, imagePokerHand[i], 300, 58);
            let image = new IUIImage(0, 0, 600, 100, imagePokerHand[i], 1000, 171);

            this.listImagesHand.push(image);
        }
        // this.listImagesHigh = [];
        // for (let i = 0; i < 13; ++i) {
        //     let image = new IUIImage(0, 0, 600, 600, imageHighNum[i], 600, 600);

        //     this.listImagesHigh.push(image);
        // }
        // this.imageComma = new IUIImage(0, 0, 600, 600, imageComma, 600, 600);
        this.showdownbg = new IUIImage(0,0,1920,1080,imageShowdownBg,1920,1080);
        this.showdown = new IWaveEffect(480,400,1000,160,30,1,1.8,3.2,kTimer,imageShowdown);
        // this.fireEffect = new IFireEffect(100, 300, 100, 60, 30, kSC.m_iCurrentWidth, kSC.m_iCurrentHeight);

        this.jackpotAction3 = new IRainEffectManager(
            imageJackpotAction[2],
            30, // 생성할 이미지 개수
            kSC.m_iCurrentWidth, kSC.m_iCurrentHeight,
            { min: 2, max: 5 }, // 속도 범위 (px per frame)
            { min: 0.5, max: 1.0 }, // 스케일 범위
            0.01 // 회전 속도 (radians per frame)
        );
        this.jackpotAction2 = new IRainEffectManager(
            imageJackpotAction[1],
            30, // 생성할 이미지 개수
            kSC.m_iCurrentWidth, kSC.m_iCurrentHeight,
            { min: 2, max: 5 }, // 속도 범위 (px per frame)
            { min: 0.5, max: 1.0 }, // 스케일 범위
            0.01 // 회전 속도 (radians per frame)
        );
        this.jackpotAction1 = new IRainEffectManager(
            imageJackpotAction[0],
            30, // 생성할 이미지 개수
            kSC.m_iCurrentWidth, kSC.m_iCurrentHeight,
            { min: 2, max: 5 }, // 속도 범위 (px per frame)
            { min: 0.5, max: 1.0 }, // 스케일 범위
            0.01 // 회전 속도 (radians per frame)
        );
        this.JackpotLevelLeft = new IUILabel(kSC.GetPosition(EPositionIndex.JackpotLevelLeft).x, kSC.GetPosition(EPositionIndex.JackpotLevelLeft).y, 50, 50, 35, NumberImages4, 150, 180, 'X50',2,1);
        this.JackpotLevelRight = new IUILabel(kSC.GetPosition(EPositionIndex.JackpotLevelRight).x, kSC.GetPosition(EPositionIndex.JackpotLevelRight).y, 50, 50, 35, NumberImages4, 150, 180, 'X50',2,1);
        this.jackpotCoinLabel = new IUILabel(kSC.GetPosition(EPositionIndex.JackpotAmountLabel).x, kSC.GetPosition(EPositionIndex.JackpotAmountLabel).y, 35, 35, 23, NumberImages4, 150, 150, this.iCallCoin.toString(),2);

        this.bPlaying = false;
        this.bShowdown = false;
        this.fShowDownElapsedTime = 0;
        this.bJackpot = false;
        this.bLevel1 = false;
        this.bLevel2 = false;
        this.bLevel3 = false;
        this.bJackpotAction = false;

        // this.resultpot = new IUILabel(kSC.GetPosition(EPositionIndex.ResultPot).x, kSC.GetPosition(EPositionIndex.ResultPot).y,28,35,23,NumberImages3,163,227,"0",0);
        this.bwin = false;
        this.bAbstentionWin = false;
        this.bRaiseButton = false;
        this.bMobileRaiseButton = false;

        this.bReserveButton = false;
        
        this.bEnableChat = false;
        this.bEnableMenu = false;
        this.bRebuyTurn = false;

        this.currentJackpot = 0; // 현재 잭팟 금액을 0으로 초기화
        this.animating = false; // 애니메이션이 실행 중인지 여부

        this.listWinCoin = [];
        // this.sliderButtonRenderFlags = [false, false, false, false];

        if(isMobile)
        {
            // this.sliderLabel.width = 70;
            // this.sliderLabel.height = 46;
            // this.sliderLabel.iStepTerm = 49;
            // this.listLabels[3].iStepTerm = 28;
            //this.listTexts[0].SetLocation(370,1570);
            //this.listTexts[1].SetLocation(370,1607);
            // this.listDot[0].SetLocation(700,775);
            // this.listDot[1].SetLocation(715,775);
            // this.listDot[2].SetLocation(730,775);
            // this.raiseActive.width = 340;
            // this.raiseActive.height = 170;
            this.sliderBG.width = 230;
            this.sliderBG.height = 600;
            this.showdownbg = new IUIImage(0,0,1080,1920,imageShowdownBg,1920,1080);
            this.showdown = new IWaveEffect(30,740,1000,160,30,1,1.8,3.5,kTimer,imageShowdown);
        }
    }

    //  When i am in a game alone
    Initialize() {
        this.iTotalBettingCoin = 0;
        this.iBettingCoin = 0;
        this.iCallCoin = 0;
        this.textTotalBettingcoin.UpdateCaption("0");
        // this.listLabels[0].UpdateCaption("0");
        // this.listLabels[1].UpdateCaption("0");
        // this.listLabels[2].UpdateCaption("0");
        //this.listLabels[3].UpdateCaption("231320");
        this.bEnableBetting = false;
        this.bReserveBetStart = false;
        this.bReserveBet = false;
        //this.listButtons[1].bEnable = false;
        // this.listButtons[0].bEnable = false;

        this.bEnableDealingHandCard = false;
        this.fDealingCardElapsedTime = 0;
        this.iLastDealingCardLocation = 0;
        this.listHandCard = [];
        this.bPreFlopStart = false;
        this.bEnableDealingFlop = false;
        this.bEnableDealingTurn = false;
        this.bEnableDealingRiver = false;
        this.bEnableDealingCard = false;
        this.fDealingFlopTime = 0;
        this.fDealingTurnTime = 0;
        this.fDealingRiverTime = 0;
        this.listTableCard = [];
        this.listTableCardTemp = [];
        this.iNumCards = 0;
        this.listWinCards = [false, false, false, false, false];
        for(let i in this.listImagesCard)
        {
            this.listImagesCard[i].iDirection = 0;
        }   

        for (let i in this.listPlayers) {
            this.listPlayers[i].Initialize();
        }

        this.listPotManager = [];
        this.listTempPot = [];

        this.strWinnerHand = "";
        this.strWinnerDescr = [];

        this.bPlaying = false;

        this.bRebuyTurn = false;

        this.bShowdown = false;
        this.fShowDownElapsedTime = 0;
        this.bJackpot = false;
        this.bLevel1 = false;
        this.bLevel2 = false;
        this.bLevel3 = false;
        this.bJackpotAction = false;

        this.bwin = false;
        this.bAbstentionWin = false;
        this.bRaiseButton = false;
        this.bMobileRaiseButton = false;
        this.bReserveButton = false;

        this.listWinCoin = [];
        // this.sliderButtonRenderFlags = [false, false, false, false];
    }

    //  When leave the game
    Cleanup() {
        this.Initialize();
        this.listPlayers = [];
        this.socket.iLocation = 0;
    }

    StartGame() {
        this.bPlaying = true;
    }

    SetJackpot(iAmount, iJackpotRound, jackpotInfo)
    {
        console.log(iJackpotRound);
        console.log(jackpotInfo);
        this.bJackpot = true;
        this.bJackpotAction = true;
        this.jackpotCoinLabel.UpdateCaption(iAmount.toLocaleString());
        if (iJackpotRound == jackpotInfo.iLevel1Round) {
            this.bLevel1 = true;
            this.JackpotLevelLeft.UpdateCaption('X50');
            this.JackpotLevelRight.UpdateCaption('X50');
        } else if (iJackpotRound == jackpotInfo.iLevel2Round) {
            this.bLevel2 = true;
            this.JackpotLevelLeft.UpdateCaption('X100');
            this.JackpotLevelRight.UpdateCaption('X100');
        } else if (iJackpotRound == jackpotInfo.iLevel3Round) {
            this.bLevel3 = true;
            this.JackpotLevelLeft.UpdateCaption('X200');
            this.JackpotLevelRight.UpdateCaption('X200');
        }
        for (let i in this.listPlayers) {
            this.listPlayers[i].SetJackpot();
        }
    }

    SetBettingButtons(buttons) {
        this.listBettingButtons = buttons;
    }

    SetBetReserveButtons(button)
    {
        this.listReservebet = button;
    }

    SetSliderBar(slider, sliderLabel) {
        this.slider = slider;
        this.sliderLabel = sliderLabel;
    }

    // SetEmoticon(emoticonbg, emoticonbuttons)
    // {
    //     this.emoticonBG = emoticonbg;
    //     this.emoticonButtons = emoticonbuttons;
    // }

    SetMaxPlayer(maxplayer) {
        this.cMaxPlayer = maxplayer;
        this.SetLocationButtons();
    }

    SetLocationButtons() {
        if(this.cMaxPlayer == 9)
        {
            for (var i = 0; i < 9; ++i) {
                this.listLocationButtons.push(this.listLocations[i]);
            }
        }
        else
        {
            for (var i = 9; i < 15; ++i) {
                this.listLocationButtons.push(this.listLocations[i]);
            }
        }
    }

    SetTablePanel(image, jackpotimage) {
        this.listTablePanel = image;
        this.listJackpotPanel = jackpotimage;
    }

    SetBg(optioncode) {
        this.strOptionCode = optioncode;
    }

    SetDeck(deckcode, image) {
        this.strDeckcode = deckcode;
        this.listCardDeck = [];
        if (this.strDeckcode == 1) {
            for (var i of [0, 1, 4]) {
                this.listCardDeck.push(image[i]);
            }
        }
        else if (this.strDeckcode == 2) {
            for (var i of [0, 2, 4]) {
                this.listCardDeck.push(image[i]);
            }
        }
        for (var i of [0, 3, 4]) {
            this.listJackpotDeck.push(image[i]);
        }
    }

    AddUser(strID, strNickname, iCoin, iLocation, iFxLocation, iAvatar, eUserType, listHandCard, strDeckcode, iMaxPlayer) {
        let user = new IUser(strID,strNickname,iCoin,iLocation,iFxLocation,iAvatar,eUserType,this.kTimer,this.kSC,listHandCard,this.isMobile, strDeckcode, iMaxPlayer);
        console.log("AddUser bSpectator!!!!!");
        console.log(user.bSpectator);
    
        this.listPlayers.push(user);

        if (this.socket.strID == strID) {
            this.kMainUser = user;
            this.kMainUser.SetMobileCard();
        }
        user.OnSize(
            this.kSC.m_fWidthRate,
            this.kSC.m_fHeightRate
        );
    }

    FindUser(strID) {
        for (let i in this.listPlayers) {
            if (this.listPlayers[i].strID == strID) return this.listPlayers[i];
        }
        return null;
    }

    FindUserFromPlayerType(strPlayerType) {
        for (let i in this.listPlayers) {
            if (this.listPlayers[i].strPlayerType == strPlayerType)
                return this.listPlayers[i];
        }
        return null;
    }

    SortLocationList(list, target) {
        for (let i = 0; i < list.length; ++i) {
            if (list[0] < target) {
                let value = list[0];
                list.shift();
                list.push(value);
            }
        }
    }

    FindNextPlayer(cLocation, cDealerLocation) {
        let list = [];
        for ( let i = 0; i < this.cMaxPlayer; ++ i ){
        //for (let i = 0; i < 9; ++i) {
            const cLoc = (cLocation + i) % this.cMaxPlayer;
            //const cLoc = (cLocation + i) % 9;
            if (cLoc != cLocation && cLoc != cDealerLocation) list.push(cLoc);
        }
        // console.log(`IGame::FindNextPlayer cLocation : ${cLocation}, cDealerLocation : ${cDealerLocation}`);
        this.SortLocationList(list, cDealerLocation);
        //console.log(list);

        // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        //     console.log(`Player Location ${this.listUsers.GetSocket(i).strID}, ${this.listUsers.GetSocket(i).iLocation}`);

        for (let j in list) {
            //for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            for (let i in this.listPlayers) {
                //if ( this.listUsers.GetSocket(i).iLocation == list[j] ) {
                //if ( this.listPlayers[i].iLocation == list[j] )
                if (
                    this.listPlayers[i].iLocation == list[j] &&
                    true == this.listPlayers[i].bEnablePlay
                ) {
                    // console.log(
                    //     `F.N.P : ${this.listPlayers[i].strID}, ${this.listPlayers[i].iLocation}`
                    // );
                    return this.listPlayers[i];
                }
            }
        }
        return null;
    }

    IsCompleteHandCard() {
        //for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        for (let i in this.listPlayers) {
            //let player = this.listUsers.GetSocket(i);
            //if ( player.listHandCard.length != 2 )
            //if ( this.listPlayers[i].listHandCard.length != 2 )
            if (this.listPlayers[i].iNumCards != 2) {
                return false;
            }
        }
        return true;
    }

    RemoveUser(objectPlayer) {
        console.log(`RemoveUser : Length(${this.listPlayers.length})`);

        //this.socket.emit('CM_LeaveGame', objectPlayer.strID);
        
        for (let i in this.listPlayers) {
            console.log(
                `RemoveUser : ${objectPlayer.strID}, ${this.listPlayers[i].strID}`
            );
            if (this.listPlayers[i].strID == objectPlayer.strID) {
                this.listPlayers.splice(i, 1);
                console.log(`RemoveUser Length : ${this.listPlayers.length}`);

                if (true == this.bEnableLocation) {
                    for (let j in this.listDisableLocations) {
                        if (this.listDisableLocations[j] == objectPlayer.iLocation) {
                            this.listDisableLocations.splice(j, 1);
                        }
                    }
                }

                return;
            }
        }
    }

    RenderBG(ctx)
    {
        const cOptionCode = parseInt(this.strOptionCode);
        //console.log(`cOptionCode : ${cOptionCode}, ${this.listBgs.length}`);

        switch ( cOptionCode )
        {
        case 1:
            if(this.isMobile == true)
            {
                this.listBgs[2].Render(ctx);
            }
            else
            {
                this.listBgs[0].Render(ctx);
            }
            
            // this.listTablePanel[1].Render(ctx);
            break;
        case 2:
            if(this.isMobile == true)
            {
                this.listBgs[3].Render(ctx);
            }
            else
            {
                this.listBgs[1].Render(ctx);
            }
            // this.listTablePanel[2].Render(ctx);
            // this.listTablePanel[3].Render(ctx);
            break;
        }

        if(this.iBlind == 500)
        {
            this.listBgs[4].Render(ctx);
        }
        else if(this.iBlind == 1000)
        {
            this.listBgs[5].Render(ctx);
        }
        else
        {
            this.listBgs[6].Render(ctx);
        }
        if(this.bJackpot == true)
        {
            for (let i in this.listJackpotDeck) {
                this.listJackpotDeck[i].Render(ctx);
            }
        }
        else
        {
            for (let i in this.listCardDeck) {
                this.listCardDeck[i].Render(ctx)
            }
        }
        this.listTablePanel[0].Render(ctx);
    }

    Render(ctx) {
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, 1920, 1080);
        this.RenderBG(ctx);
        
        // for (let i in this.listImages) {
        //     //if ( i == 5 && this.kMainUser.iLocation != -1 )
        //     // if (i == 1 && this.bPlaying == true && this.kMainUser != null && this.kMainUser.iLocation == -1) continue;
        //     if (i == 1 && this.kMainUser == null) continue;
        //     if (i == 1 && this.bPlaying == true) continue;
        //     // if (i == 1 && this.bSpectator == true && this.kMainUser != null && this.kMainUser.iLocation != -1) continue;
        //     //if(i == 0 && this.isMobile == true) continue;
        //     this.listImages[i].Render(ctx);
        // }
        // if ( this.bPlaying == false && this.kMainUser != null ) {
        //     this.listDot[this.iRender].Render(ctx);
        // }
        if(this.kMainUser != null)
        {
            this.listButtons[0].Render(ctx);
            if(this.bwin && this.kMainUser.bAbstentionWin && this.bRebuyTurn == false)
            {
                this.listButtons[1].Render(ctx);
            }
        }

        if (true == this.bEnableLocation) {
            for (let i in this.listLocationButtons) {
                if (true == this.IsEnableLocation(i)) {
                    // this.fArrowElapsedTime -= this.kTimer.GetElapsedTime();
                    // if ( this.fArrowElapsedTime < 0 )
                    // {
                    //     this.bRenderArrow = !this.bRenderArrow;
                    //     this.fArrowElapsedTime = 0.5;
                    // }
                    // if ( this.bRenderArrow == true ){}

                    this.listLocationButtons[i].Render(ctx);
                    // if(this.bRender == true){
                    //   this.listLocationArrow[i].Render(ctx);
                    // }
                }
            }
        }
        this.iStartCoinText.Render(ctx);
        // for (let i in this.listTexts) {
        //     //if(this.isMobile == false)
        //         this.listTexts[i].Render(ctx);
        // }

        this.textTotalBettingcoin.Render(ctx);

        for (let i in this.listPlayers) {
            this.listPlayers[i].Render(ctx);
        }
        for (let i in this.listPotManager) {
            this.listPotManager[i].Render(ctx);
        }
        if (this.fInterval >= 0) {
            this.fInterval -= this.kTimer.GetElapsedTime();
            if (this.fInterval <= 0) {
                this.bRender = !this.bRender;
                this.fInterval = 0.4;
            }
        }

        // for(let i = 0; i < 5; i++)
        // {
        //     this.listImagesCardFrame.RenderLocation(ctx,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).x-7,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).y-5);
        // }

        if (this.fInterval2 >= 0) {
            this.fInterval2 += this.kTimer.GetElapsedTime();
            if (this.fInterval2 >= 0 && this.fInterval2 < 0.2) {
                this.iRender = 0;
            }
            else if (this.fInterval2 > 0.2 && this.fInterval2 < 0.4) {
                this.iRender = 1;
            }
            else if (this.fInterval2 > 0.4 && this.fInterval2 < 0.6) {
                this.iRender = 2;
            }
            else if (this.fInterval2 > 0.6) {
                this.fInterval2 = 0;
            }
        }
        if (this.listTableCard.length > 0) {
            for (let i in this.listTableCard) {
                this.listImagesCard[this.listTableCard[i]].CardRenderTurn(ctx,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).x,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).y,this.kTimer,i,this.strDeckcode,this.bJackpot);

                    if (this.listWinCards[i] == true && this.bAbstentionWin == false) {
                        this.listImagesCardFrame.RenderLocation(ctx,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).x-7,this.kSC.GetPosition(EPositionIndex.TableCard1 + parseInt(i)).y-5);
                    }
            }
        }
        if(this.bJackpot == true)
        {
            this.JackpotLevelRight.Render(ctx);
            this.JackpotLevelLeft.Render(ctx);
            if(this.bLevel1 == true) this.listJackpotPanel[0].Render(ctx);
            if(this.bLevel2 == true) this.listJackpotPanel[1].Render(ctx);
            if(this.bLevel3 == true) this.listJackpotPanel[2].Render(ctx);
            this.listJackpotPanel[3].Render(ctx);
            this.jackpotCoinLabel.Render(ctx);
        }
        // if (this.bwin == true) {
        //     this.fireEffect.Render(ctx);
        // }
        // if (this.bwin == true && this.bAbstentionWin == false) {
        //     this.gamewinMadePanel.Render(ctx);
        // }
        
        if (this.bAbstentionWin == true) {
            // this.gameAbstentionWin.Render(ctx);
        }

        // if (this.bwin == true) {
        //     this.gameWinCeremony.Render(ctx);
        //     this.resultpot.Render(ctx);
        // }

        for (let i in this.listCardDealer) {
            this.listCardDealer[i].Render(ctx);
        }

        for( let i in this.listWinCoin)
        {
            this.listWinCoin[i].Render(ctx);
        }
        //test
        // this.gamewinMadePanel.Render(ctx);
        //  this.gameWinCeremony.Render(ctx);
        //  this.resultpot.Render(ctx);
        //  this.listImagesHand[0].RenderLocation(ctx, 330, 285);
        // this.gameAbstentionWin.Render(ctx);
        // this.listImagesCardFrame1.Render(ctx);
        // this.listImagesCardFrame2.Render(ctx);
        // this.listImagesCardFrame3.Render(ctx);
        // this.listImagesCardFrame4.Render(ctx);
        // this.listImagesCardFrame5.Render(ctx);       

        if (this.bShowdown == true) {
            this.showdownbg.Render(ctx);
            this.showdown.Render(ctx);
        }
        if (this.strWinnerHand != "") {
            switch (this.strWinnerHand) {
                case "High Card":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[0].RenderLocation(ctx, 240, 970);
                    }
                    else 
                    {
                        this.listImagesHand[0].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Pair":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[1].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[1].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Two Pair":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[2].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[2].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Three of a Kind":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[3].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[3].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Straight":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[4].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {    
                        this.listImagesHand[4].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Mountain":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[5].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[5].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Flush":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[6].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[6].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Full House":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[7].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[7].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Four of a Kind":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[8].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[8].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Straight Flush":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[9].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[9].RenderLocation(ctx, 670, 570);
                    }
                    break;
                case "Royal Flush":
                    if(this.isMobile == true)
                    {
                        this.listImagesHand[10].RenderLocation(ctx, 240, 970);
                    }
                    else
                    {
                        this.listImagesHand[10].RenderLocation(ctx, 670, 570);
                    }
                    break;
            }
        }
        
        // if (this.strWinnerDescr[0] != '' && this.strWinnerHand != 'Mountain') {
        //     for (let i in this.strWinnerDescr) {

        //         switch (this.strWinnerDescr[i]) {
        //             case "Ac":
        //                 this.listImagesHigh[0].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "Ad":
        //                 this.listImagesHigh[0].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "As":
        //                 this.listImagesHigh[0].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "Ah":
        //                 this.listImagesHigh[0].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "A":
        //                 this.listImagesHigh[0].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "2":
        //                 this.listImagesHigh[1].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "3":
        //                 this.listImagesHigh[2].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "4":
        //                 this.listImagesHigh[3].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "5":
        //                 this.listImagesHigh[4].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "6":
        //                 this.listImagesHigh[5].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "7":
        //                 this.listImagesHigh[6].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "8":
        //                 this.listImagesHigh[7].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "9":
        //                 this.listImagesHigh[8].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "10":
        //                 this.listImagesHigh[9].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "J":
        //                 this.listImagesHigh[10].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "Q":
        //                 this.listImagesHigh[11].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case "K":
        //                 this.listImagesHigh[12].RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY);
        //                 break;
        //             case ",":
        //                 this.imageComma.RenderLocation(ctx, this.iCurrentX + (i * 40), this.iCurrentY+14);
        //                 break;
        //         }
        //     }
        // }
        // this.listLabels[0].Render(ctx);
        // this.listLabels[1].Render(ctx);
        // this.listLabels[3].Render(ctx);
        //this.jackpotAction1.Render(ctx);
        //this.jackpotAction2.Render(ctx);
        //this.jackpotAction3.Render(ctx);

        // if(this.bEmoticon)
        // {
        //     this.emoticonBG.Render(ctx);
        //     for(let i in this.emoticonButtons)
        //     {
        //         this.emoticonButtons[i].Render(ctx);
        //     }
        // }

        // if(this.bJackpot)
        // {
        //     if(this.bLevel1 && this.bJackpotAction)
        //     {
        //         this.jackpotAction1.Render(ctx);
        //     }
        //     else if(this.bLevel2 && this.bJackpotAction)
        //     {
        //         this.jackpotAction2.Render(ctx);
        //     }
        //     else if(this.bLevel3 && this.bJackpotAction)
        //     {
        //         this.jackpotAction3.Render(ctx);
        //     }
        // }
        // this.sliderBG.Render(ctx);
        // this.slider.Render(ctx);
        // this.sliderLabel.Render(ctx);
        // for (let i in this.listBettingButtons) {
        //     this.listBettingButtons[i].Render(ctx);
        // }
        // this.listBettingButtons[0].UpdateAmount(this.formatCurrencyToKoreanWon(15000));

        if (true == this.bEnableBetting) {
            if (this.bMobileRaiseButton == true) {
                this.sliderBG.Render(ctx);
                this.slider.Render(ctx);
                // this.listLabels[2].Render(ctx);
                this.sliderLabel.Render(ctx);
                // for (let i = 0; i < this.sliderButton.length; i++) {
                //     if (i % 2 === 0) { // 버튼 렌더링
                //         this.sliderButton[i].Render(ctx);
                //     }
                //     else if(i == 8 || i == 9)
                //     {
                //         this.sliderButton[i].Render(ctx);
                //     } 
                //     else { // 이미지 렌더링
                //         if (this.sliderButtonRenderFlags[(i - 1) / 2]) {
                //             this.sliderButton[i].Render(ctx);
                //         }
                //     }
                // }
            }
            for (let i in this.listBettingButtons) {
                // let iAmount = parseInt(this.listLabels[2].strCaption);
                this.listBettingButtons[i].Render(ctx);
                //레이즈바에 코인이 0보다 크면 레이즈 버튼 활성화 하는곳.
                // if(iAmount > 0)
                // {
                //     // console.log(`IModeGame :: raisebutton!!!`);
                //     // console.log(iAmount);
                //     this.raiseActive.Render(ctx);
                // }
            }
        }
        else
        {  
            if (this.kMainUser != null && this.kMainUser.bFold == false && this.bReserveBetStart == true) {
                //console.log(`${this.kMainUser.bFold}, bReserveBet : ${this.bReserveBet}, iBettingcoin : ${this.iBettingCoin}`);
                if(this.bReserveBet == true && this.iBettingCoin > 0){
                    this.listReservebet[0].Render(ctx);
                }
                else if(this.bReserveBet == false && this.iBettingCoin > 0)
                {
                    this.listReservebet[1].Render(ctx);
                }
                else if(this.bReserveBet == true && this.iBettingCoin <= 0)
                {
                    this.listReservebet[2].Render(ctx);
                }
                else if(this.bReserveBet == false && this.iBettingCoin <= 0)
                {
                    this.listReservebet[3].Render(ctx);
                }
            }
        }
    }

    Update() {
        for (let i in this.listPlayers) {
            this.listPlayers[i].Update();
        }

        for (let i in this.listPotManager) {
            this.listPotManager[i].Update();
        }

        if (this.listTempPot.length > 0) {
            let bUpdate = true;
            for (let i in this.listPlayers) {
                if (this.listPlayers[i].listChipDealer.length > 0) bUpdate = false;
            }

            if (true == bUpdate) {
                this.listPotManager = [];
                for (let i in this.listTempPot) {
                    let k = '';
                    if(this.isMobile == true)
                    {
                        k = new IPotManager(300 + i * 200,950,this.kTimer,40,40,this.kSC.m_fWidthRate,this.kSC.m_fHeightRate);
                    }
                    else
                    {
                        k = new IPotManager(650 + i * 200,620,this.kTimer,40,40,this.kSC.m_fWidthRate,this.kSC.m_fHeightRate);
                    }
                    k.UpdatePot(this.listTempPot[i].iPotAmount);
                    this.listPotManager.push(k);
                }

                this.listTempPot = [];
            }
        }

        //  Hand Card
        if (true == this.bEnableDealingHandCard) {
            //++ this.fDealingCardElapsedTime;
            this.fDealingCardElapsedTime += this.kTimer.GetElapsedTime();

            //if ( this.fDealingCardElapsedTime > 30 )
            if (this.fDealingCardElapsedTime > 0.05) {
                let player = this.FindNextPlayer(this.iLastDealingCardLocation, -1);
                if (player) {
                    //if ( player.listHandCard.length < 2 )
                    //if ( player.listTempHandCard.length < 2 )
                    if (player.iNumCards < 2) {
                        this.fDealingCardElapsedTime = 0;

                        if (player.strID == this.socket.strID) {
                            //player.listHandCard.push(this.listHandCard[player.listHandCard.length]);

                            console.log(`player.AddHandCard() : ${this.listHandCard.length}`);
                            console.log(player.iNumCards);
                            console.log(this.listHandCard);

                            player.AddHandCard(this.listHandCard[player.iNumCards], this.strDeckcode);
                        }
                        else if(this.bJackpot) player.AddHandCard(54, this.strDeckcode);
                        else if (this.strDeckcode == 1) player.AddHandCard(52, this.strDeckcode);
                        else if (this.strDeckcode == 2) player.AddHandCard(53, this.strDeckcode);
                        

                        this.iLastDealingCardLocation = player.iLocation;

                        if (true == this.IsCompleteHandCard()) {
                            this.bEnableDealingHandCard = false;
                        }
                    }
                }
            }
        }
        if (this.bShowdown == true) {
            this.fShowDownElapsedTime += this.kTimer.GetElapsedTime();

            if (this.fShowDownElapsedTime > 0.3 && this.fShowDownElapsedTime < 0.5)
                soundShowDown.play();
            else if (this.fShowDownElapsedTime > 0.5 && this.fShowDownElapsedTime < 1.0)
                soundHertBeat.play();
            else if (this.fShowDownElapsedTime > 3.2) {
                this.fShowDownElapsedTime = 0;
                this.bShowdown = false;
                this.showdown.Clear();
            }
        } else {
            // ++ this.fDealingCardElapsedTime;
            if (this.listTableCardTemp.length > 0) {
                if (this.bEnableDealingCard == true) {
                    this.fDealingCardElapsedTime += this.kTimer.GetElapsedTime();
                    if (this.fDealingCardElapsedTime > 0.2) {
                        this.fDealingCardElapsedTime = 0;

                        //let dealer = new ICardDealer(1080, 500, listX[this.iNumCards], 520+50, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate, this.kTimer, 130, 170, this.listTableCardTemp[0]);
                        //let dealer = new ICardDealer(cDealerLocation.x, cDealerLocation.y, cTableCardLocations[this.iNumCards].x+20, cTableCardLocations[this.iNumCards].y+50, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate, this.kTimer, 130, 170, this.listTableCardTemp[0]);
                        let dealer = new ICardDealer(this.kSC.GetPosition(EPositionIndex.Dealer).x,this.kSC.GetPosition(EPositionIndex.Dealer).y,this.kSC.GetPosition(EPositionIndex.TableCard1 + this.iNumCards).x,this.kSC.GetPosition(EPositionIndex.TableCard1 + this.iNumCards).y,this.kSC.m_fWidthRate,this.kSC.m_fHeightRate,this.kTimer,130,160, this.listTableCardTemp[0], this.strDeckcode, this.bJackpot);
                        //let dealer = new ICardTurnAnim(cDealerLocation.x, cDealerLocation.y, cTableCardLocations[this.iNumCards].x, cTableCardLocations[this.iNumCards].y, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate, this.kTimer, 130, 170, this.listTableCardTemp[0]);
                        this.listCardDealer.push(dealer);

                        this.listTableCardTemp.shift();

                        ++this.iNumCards;

                        //if ( this.listTableCard.length == 3 )
                        //if ( this.listTableCard.length == this.listTableCardTemp.length )
                        if (this.listTableCardTemp.length == 0) {
                            this.bEnableDealingCard = false;
                            this.bEnableDealingFlop = false;
                            this.bEnableDealingTurn = false;
                            this.bEnableDealingRiver = false;
                        }
                    }
                }
            }
            for (let i in this.listCardDealer) {
                this.listCardDealer[i].Update();
                if (this.listCardDealer[i].iCompleteStep == 1) {
                    soundPlaceCard.play();
                    console.log("this.listTableCard!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log(`iCardIndex : ${this.listCardDealer[i].iCardIndex}`);
                    this.listTableCard.push(this.listCardDealer[i].iCardIndex);
                    this.listCardDealer[i].iCompleteStep = 2;
                    this.listCardDealer.splice(0, 1);
                }
            }
        }

        if (this.bEnableDealingFlop == true) {
            this.fDealingFlopTime += this.kTimer.GetElapsedTime();

            if (this.fDealingFlopTime < 0.7 && this.fDealingFlopTime > 0.5) {
                soundcardflop.play();
                //console.log(this.fDealingFlopTime);
            }
            else if (this.fDealingFlopTime > 1) {
                this.bEnableDealingCard = true;
                this.SetPlayerBettingDelete();
            }
        }
        if (this.bEnableDealingTurn == true) {
            this.fDealingTurnTime += this.kTimer.GetElapsedTime();

            if (this.fDealingTurnTime < 0.7 && this.fDealingTurnTime > 0.5) {
                soundcardturn.play();
                //console.log(this.fDealingTurnTime);
            }
            else if (this.fDealingTurnTime > 1) {
                this.bEnableDealingCard = true;
                this.SetPlayerBettingDelete();
            }
        }
        if (this.bEnableDealingRiver == true) {
            this.fDealingRiverTime += this.kTimer.GetElapsedTime();

            if (this.fDealingRiverTime < 0.7 && this.fDealingRiverTime > 0.5) {
                soundcardriver.play();
                //console.log(this.fDealingRiverTime);
            }
            else if (this.fDealingRiverTime > 1) {
                this.bEnableDealingCard = true;
                this.SetPlayerBettingDelete();
            }
        }

        if (this.kMainUser != null) {
            if (this.kMainUser.bFocus == true &&this.kMainUser.iBettingTime <= 0 &&this.bEnableBetting == true) {
                console.log(`Auto Fold ${this.iCallCoin}`);
                if (this.iCallCoin == 0) {
                    OnClickCheck(this);
                } 
                else {
                    OnClickFold(this);
                }
                this.kMainUser.iAutoFoldCounter++;
                if (this.kMainUser.iAutoFoldCounter >= 3) {
                    //this.RemoveUser(this.kMainUser);
                    window.close();
                }
            }
            if($('#game_log').is(':hidden')) {
                // chatting 요소와 game_log 요소가 모두 숨겨져 있는 경우에 실행할 코드를 여기에 작성합니다.
                this.bEnableChat = false;
            } else {
                // chatting 요소와 game_log 요소 중 하나라도 보이는 경우에 실행할 코드를 여기에 작성합니다.
                this.bEnableChat = true;
            }
        }
        
        let exitText = $("#exit").text();
        // 0109 폴드 했을때 나가기 예약 했을때 나가는거 수정요청 안나가지게 게임 끝날때까지.
        // if (!this.bReserveButton && 
        //     ((this.kMainUser && (this.kMainUser.bFold == true && this.kMainUser.bReserveExit == true) 
        //     || ( this.kMainUser && this.kMainUser.bSpectator == true && exitText == '나가기 예약')) 
        //     || ((this.bPlaying == false || this.bRebuyTurn == true) && exitText == '나가기 예약'))) {
        if (!this.bReserveButton
            && ((this.kMainUser && this.kMainUser.bSpectator == true && exitText == '나가기 예약') 
            || ((this.bPlaying == true && this.bRebuyTurn == true) && exitText == '나가기 예약')
            || (!this.kMainUser && exitText == '나가기 예약')
            || (this.listPlayers.length <= 1 && exitText == '나가기 예약'))) {
            // || (!this.kMainUser && exitText == '나가기 예약')
            // || (this.bPlaying == false && exitText == '나가기 예약'))) {
            this.bReserveButton = true;

            console.log(this.strLobbyAddress);
            
            window.location.href = this.strLobbyAddress;
        }

        for ( let i in this.listWinCoin )
        {
            this.listWinCoin[i].Update();
        }
        if(this.bJackpot)
        {
            this.jackpotAction1.update();
            this.jackpotAction2.update();
            this.jackpotAction3.update();
        }
    }

    ProcessLocation(listPlayers,iMaxPlayer) {
        this.bEnableLocation = true;
        this.cMaxPlayer = iMaxPlayer;

        this.listDisableLocations = [];

        for (let i in listPlayers) {
            if (listPlayers[i].iLocation != -1) {
                //const objectPlayer = {strID:listPlayers[i].strID, iLocation:listPlayers[].iLocation}

                //this.ProcessLocationSingle(listPlayers[i]);
                this.listDisableLocations.push(listPlayers[i].iLocation);
                //let listHandCard = [];
        
                console.log(
                    `############# ${listPlayers[i].strID}, ${listPlayers[i].iLocation}`
                );
                this.AddUser(
                    listPlayers[i].strID,
                    listPlayers[i].strNickname,
                    listPlayers[i].iCoin,
                    listPlayers[i].iLocation,
                    listPlayers[i].iLocation,
                    listPlayers[i].iAvatar,
                    listPlayers[i].eUserType,
                    listPlayers[i].listHandCard,
                    this.strDeckcode,
                    this.cMaxPlayer
                );
            }
        }
        console.log(`ProcessLocation`);
        console.log(this.listDisableLocations);
    }

    ProcessLocationSingle(objectPlayer) {
        console.log(objectPlayer);
        console.log(
            `ProcessLocationSingle ${objectPlayer.strID}, ${objectPlayer.iLocation}, MyPlace : ${this.socket.iLocation}, Avatar : ${objectPlayer.iAvatar}`
        );

        let iMyLocation = 0;
        if (this.socket.iLocation != undefined) iMyLocation = this.socket.iLocation;
        this.listDisableLocations.push(objectPlayer.iLocation);

        console.log(`MyLocation : ${iMyLocation}`);
        let iFx = (objectPlayer.iLocation - iMyLocation + parseInt(this.cMaxPlayer)) % parseInt(this.cMaxPlayer);

        this.AddUser(objectPlayer.strID,objectPlayer.strNickname,objectPlayer.iCoin,objectPlayer.iLocation,iFx,objectPlayer.iAvatar, objectPlayer.eUserType, [],this.strDeckcode,this.cMaxPlayer);
    }

    ProcessLocationComplete(strID, strNickname, iCoin, iLocation, iAvatar, eUserType, listHandCard) {
        this.bEnableLocation = false;

        this.socket.iLocation = iLocation;
        console.log(`MyLocation On C : ${this.socket.iLocation}`);
        let currentHandcard = listHandCard;
        for (let i in this.listPlayers) {
            let iFx = (this.listPlayers[i].iLocation - iLocation + parseInt(this.cMaxPlayer)) % parseInt(this.cMaxPlayer);
            console.log(
                `Target iFx : ${iFx}, Mine : ${iLocation}, Target Origin : ${this.listPlayers[i].iLocation}, ${this.listPlayers[i].bSpectator}`
            );

            this.listPlayers[i].Locate(iFx);
            this.listPlayers[i].OnSize(this.kSC.m_fWidthRate, this.kSC.m_fHeightRate);
        }
        
        this.AddUser(strID, strNickname, iCoin, iLocation, 0, iAvatar, eUserType, currentHandcard, this.strDeckcode, this.cMaxPlayer);
    }

    IsEnableLocation(iLocation) {
        for (let i in this.listDisableLocations) {
            if (iLocation == this.listDisableLocations[i]) return false;
        }
        return true;
    }

    SetDefaultAnte(listPlayers)
    {
        for (let i in listPlayers) {
            console.log(`${listPlayers[i].strID}`);
            let player = this.FindUser(listPlayers[i].strID);
            if (player) {
                console.log(`SetDefaultAnte : ${listPlayers[i].iBettingCoin}`);
                player.bBettingMode = true;
                player.Betting('', listPlayers[i].iBettingCoin, listPlayers[i].iCoin);
            }
        }
    }

    SetPlayerType(listData) {
        console.log(`SetPlayerType : ${listData.length}`);

        for (let i in listData) {
            console.log(`${listData[i].strID}, ${listData[i].strPlayerType}`);
            let player = this.FindUser(listData[i].strID);
            //console.log(player);
            if (player) {
                console.log(`SetPlayerType : ${listData[i].strPlayerType}`);
                player.SetPlayerType(listData[i].strPlayerType);
                player.bEnablePlay = true;
            }
        }
    }

    SetPlayerLastBetting(listData)
    {
        console.log(`SetPlayerLastBetting : ${listData.length}`);

        for (let i in listData) {
            console.log(`${listData[i].strID}, ${listData[i].strLastBettingAction}`);
            let player = this.FindUser(listData[i].strID);
            //console.log(player);
            if (player) {
                console.log(`strLastBettingAction : ${listData[i].strLastBettingAction}`);
                player.SetPlayerLastBetting(listData[i].strLastBettingAction);
                //player.bEnablePlay = true;
            }
        }
    }

    SetPlayerBetting(strID, iCoin, iBettingCoin, strBetting) {
        this.iBettingCoin = iBettingCoin;
        let player = this.FindUser(strID);
        //player.bBettingMode = true;
        if (player) {
            player.Betting(strBetting, iBettingCoin, iCoin);
            if(iBettingCoin > 0)
            {
                this.bReserveBetStart = false;
                this.bReserveBet = false;
            }
        }
    }

    SetPlayerBettingDelete() {
        for (let i in this.listPlayers) {
            this.listPlayers[i].bBettingMode = false;
            this.listPlayers[i].ibettingCallCoin = 0;
        }
    }

    SetPlayerExit(objectData) {
        console.log(`SetPlayerExit`);
        console.log(objectData);
        let player = this.FindUser(objectData.strID);
        if(player)
        {
            player.SetPlayerExit(objectData.bReserveExit);
        }
        else
        {
            return;
        }
    }

    SetPlayerResponse(latency,strID)
    {
        let player = this.FindUser(strID);
        if(player)
        {
            player.SetPlayerResponse(latency);
        }
        else
        {
            return;
        }
    }

    SetPlayerEmoticon(strID, iEmoticon)
    {
        let player = this.FindUser(strID);
        player.SetPlayerEmoticon(iEmoticon);
    }

    SetWinnerHighText(descr, strHandName) {
        let array = descr.split(', ');
        let array2 = [];

        if (strHandName == 'High Card') {
            array2 = descr.replace(' High', ''); // ' High' 문자열을 제거합니다.
        }
        else
        {
            let string = array[1];
            let index = string.indexOf(" & ");
            if (index != -1) {
                array2 = string.split(' ');
            }
            else {
                index = string.indexOf(" over ");
                if (index != -1) {
                    array2 = string.split(' ');
                }
                else {
                    array2.push(string);
                }
            }
            for (let i in array2) {
                array2[i] = array2[i].replace(' ', '');
                array2[i] = array2[i].replace("'s", '');
                array2[i] = array2[i].replace("d High", '');
                array2[i] = array2[i].replace("h High", '');
                array2[i] = array2[i].replace("c High", '');
                array2[i] = array2[i].replace("s High", '');
                array2[i] = array2[i].replace("High", '');
                array2[i] = array2[i].replace("over", ',');
                array2[i] = array2[i].replace("&", ',');
            }
        }
        
        if (strHandName != "") {
            switch (strHandName) {
                case "High Card":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 560;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Pair":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 570;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Two Pair":
                    if (this.isMobile == true) {
                        this.iCurrentX = 110;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 500;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Three of a Kind":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 500;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Straight":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 580;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Mountain":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 580;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Flush":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 580;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Full House":
                    if (this.isMobile == true) {
                        this.iCurrentX = 110;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 500;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Four of a Kind":
                    if (this.isMobile == true) {
                        this.iCurrentX = 110;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 500;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Straight Flush":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 580;
                        this.iCurrentY = 71;
                    }
                    break;
                case "Royal Flush":
                    if (this.isMobile == true) {
                        this.iCurrentX = 160;
                        this.iCurrentY = 285;
                    }
                    else {
                        this.iCurrentX = 580;
                        this.iCurrentY = 71;
                    }
                    break;
            }
        }
        return array2;
    }

    UpdateTotalBettingCoin(iCoin) {
        this.iTotalBettingCoin = iCoin;
        // this.listLabels[0].UpdateCaption(this.iTotalBettingCoin.toLocaleString());
        this.textTotalBettingcoin.UpdateCaption(this.formatCurrencyToKoreanWon(iCoin));
    }

    // UpdateJackpot(targetJackpot) {
    //     if (!this.animating) { // 이미 애니메이션 중이 아닐 때만 실행
    //         this.animating = true;
    //         let increment = 0;
           
    //         const updateFrame = () => {
    //             if (this.currentJackpot < targetJackpot) {
    //                 if(parseInt(this.currentJackpot) < parseInt(targetJackpot*0.99))
    //                 {
    //                     increment = Math.ceil((targetJackpot - this.currentJackpot) / 100); // 적절한 increment 계산
    //                 }
    //                 else
    //                 {
    //                     increment = Math.ceil((targetJackpot - this.currentJackpot) / 1000000000); // 적절한 increment 계산
    //                 }    
    //                 this.currentJackpot += increment; // 잭팟 금액을 점차 증가시킵니다.
    //                 if (this.currentJackpot > targetJackpot) {
    //                     this.currentJackpot = targetJackpot; // overshoot 방지
    //                 }
    //                 let formattedJackpot = this.currentJackpot.toLocaleString(); // 콤마를 포함한 문자열 형식으로 변환합니다.
    //                 this.listLabels[3].UpdateCaption(formattedJackpot); // UI 업데이트 함수
    //                 requestAnimationFrame(updateFrame); // 다음 프레임을 위해 애니메이션을 예약합니다.
    //             } else {
    //                 this.listLabels[3].UpdateCaption(targetJackpot.toLocaleString()); // 최종 값으로 업데이트합니다.
    //                 this.animating = false; // 애니메이션 종료 상태로 설정합니다.
    //             }
    //         };

    //         updateFrame(); // 애니메이션 시작
    //     }
    // }

    // receiveNewJackpotValue(newJackpotValue) {
    //     if (newJackpotValue == null) {
    //         return; // null 또는 undefined일 경우 여기서 함수 실행을 중단
    //     }    
    //     this.UpdateJackpot(newJackpotValue);
    // }

    // UpdateGameInfo(strGameName, iBlind) {
    //     //this.listTexts[1].UpdateCaption(`${strGameName}   ${parseInt(iBlind)/1000}K / ${parseInt(iBlind)*2/1000}K`);
    //     //this.listTexts[1].UpdateCaption(strGameName);
    //     if(iBlind > 1000)
    //     {
    //         this.listTexts[0].UpdateCaption(
    //             `${parseInt(iBlind) / 1000}K / ${(parseInt(iBlind) * 2) / 1000}K`
    //         );
    //     }
    //     else
    //     {
    //         this.listTexts[0].UpdateCaption(
    //             `${parseInt(iBlind)} / ${parseInt(iBlind) * 2}`
    //         );
    //     }
    //     this.iBlind = parseInt(iBlind);
    // }

    // UpdatePoint(iPoint) {
    //     this.listTexts[1].UpdateCaption(iPoint.toLocaleString());
    // }

    UpdateStrHandName() {
        if(this.kMainUser != null)
        {
            if(this.kMainUser.bEnablePlay == true)
            {
                this.kMainUser.textHand.UpdateCaption(this.strHand);
            }
        }
    }

    CheckBettingCoin() {
        this.sliderLabel.UpdateCaption('0');
        //console.log(`Raise iCoin : ${iCoin}`);
        this.slider.InitLocation();
    }
    SetRaiseButton() {
        this.bRaiseButton = true;
        this.bMobileRaiseButton = true;
    }
    SetMobileRaiseButton() {
        this.bMobileRaiseButton = true;
        this.bRaiseButton = true;
    }

    SetPreFlop()
    {
        this.bReserveBetStart = true;
        this.bPreFlopStart = true;
        this.bJackpotAction = false;
    }

    EnableBetting(objectData) {
        console.log(`IModeGame::EnableBetting ${objectData.iCallAmount}`);
        console.log(objectData.listEnableBettingType);

        this.bEnableBetting = true;
        this.kMainUser.bBettingMode = true;
       
        // if(this.isMobile) 
        // {
        //     this.bRaiseButton = false;
        //     this.bMobileRaiseButton = false;
        // }
        // else 
        // {
        //     this.bMobileRaiseButton = true;
        //     this.bRaiseButton = true;
        // }

        this.iCallCoin = objectData.iCallAmount;
        // this.CheckBettingCoin();
        

        for (let i in this.listBettingButtons) {
            this.listBettingButtons[i].bEnable = false;
        }

        for (let i in objectData.listEnableBettingType) {
            let iCurrentCoin = 0;
            switch (objectData.listEnableBettingType[i]) {
                case "Quater":
                    this.listBettingButtons[0].bEnable = true;
                    iCurrentCoin = Math.floor(parseInt(objectData.iCallAmount) + (parseInt(objectData.iCallAmount) + parseInt(this.iTotalBettingCoin)) / 4);
                    this.listBettingButtons[0].UpdateAmount(this.formatCurrencyToKoreanWon(iCurrentCoin));
                    break;
                case "Half":
                    this.listBettingButtons[1].bEnable = true;
                    iCurrentCoin = Math.floor(parseInt(objectData.iCallAmount) + (parseInt(objectData.iCallAmount) + parseInt(this.iTotalBettingCoin)) / 2);
                    this.listBettingButtons[1].UpdateAmount(this.formatCurrencyToKoreanWon(iCurrentCoin));
                    break;
                case "Full":
                    this.listBettingButtons[2].bEnable = true;
                    iCurrentCoin = Math.floor(parseInt(objectData.iCallAmount) + (parseInt(objectData.iCallAmount) + parseInt(this.iTotalBettingCoin)));
                    this.listBettingButtons[2].UpdateAmount(this.formatCurrencyToKoreanWon(iCurrentCoin));
                    break;
                case "Allin":
                    this.listBettingButtons[6].bEnable = true;
                    iCurrentCoin = objectData.iCoin;
                    this.listBettingButtons[6].UpdateAmount(this.formatCurrencyToKoreanWon(iCurrentCoin));
                    break;
                case "Call":
                    this.listBettingButtons[3].bEnable = true;
                    if(objectData.iCoin < objectData.iCallAmount)
                        this.listBettingButtons[3].UpdateAmount(this.formatCurrencyToKoreanWon(objectData.iCoin));
                    else
                        this.listBettingButtons[3].UpdateAmount(this.formatCurrencyToKoreanWon(objectData.iCallAmount));
                    break;
                case "Fold":
                    this.listBettingButtons[4].bEnable = true;
                    break;
                case "Check":
                    this.listBettingButtons[5].bEnable = true;
                    break;
                case "Raise":
                    this.listBettingButtons[7].bEnable = true;
                    break;
            }
        }
    }

    Focus(strID, iBettingTime) {
        for (let i in this.listPlayers) {
            this.listPlayers[i].bFocus = false;
            if(this.bPreFlopStart == true && this.bwin == false)
            {
                this.listPlayers[i].bBettingMode = true;
            }
            //this.listPlayers[i].iBettingTime = 0;
            this.listPlayers[i].SetBettingTime(0);
        }

        let player = this.FindUser(strID);
        if (player) {
            player.bFocus = true;
            //player.iBettingTime = parseInt(iBettingTime);
            player.SetBettingTime(iBettingTime);
            //this.UpdateStrHandName();
        }
    }

    SetHandCard(listCard, strHand) {
        let player = this.FindUserFromPlayerType("Dealer");
        //player.listHandCard = listCard;
        this.bEnableDealingHandCard = true;
        this.iLastDealingCardLocation = player.iLocation;
        this.listHandCard = listCard;
        this.strHand = strHand;
        // let mainuser = this.FindUser(this.socket.strID);
        // mainuser.strHand.UpdateCaption(strHand);
        //this.kMainUser.textHand.UpdateCaption(strHand);
    }

    SetFlopCard(listCard, strHand) {
        this.bReserveBetStart = false;
        this.bReserveBet = false;
        this.iBettingCoin = 0;
        console.log(this.bReserveBetStart);
        this.bEnableDealingFlop = true;
        this.fDealingFlopTime = 0;
        this.listTableCardTemp = listCard;
        this.strHand = strHand;
        console.log(`IModeGame::SetFlopCard listTableCard ${listCard}`);
        for (let i in this.listPlayers) {
            this.listPlayers[i].bEnableRenderBettingType = false;
        }
        //this.kMainUser.textHand.UpdateCaption(strHand);
    }
    SetTurnCard(listCard, strHand) {
        //this.listTableCard.push(listCard[3]);
        this.bReserveBetStart = false;
        this.bReserveBet = false;
        this.iBettingCoin = 0;
        console.log(this.bReserveBetStart);
        this.bEnableDealingTurn = true;
        this.fDealingTurnTime = 0;
        this.listTableCardTemp.push(listCard[3]);
        this.strHand = strHand;
        for (let i in this.listPlayers) {
            this.listPlayers[i].bEnableRenderBettingType = false;
        }
        //this.kMainUser.textHand.UpdateCaption(strHand);
        console.log(`IModeGame::SetTurnCard listTableCard ${listCard}`);
    }

    SetRiverCard(listCard, strHand) {
        //this.listTableCard.push(listCard[4]);
        this.bReserveBetStart = false;
        this.bReserveBet = false;
        this.iBettingCoin = 0;
        console.log(this.bReserveBetStart);
        this.bEnableDealingRiver = true;
        this.fDealingRiverTime = 0;
        this.listTableCardTemp.push(listCard[4]);
        this.strHand = strHand;
        for (let i in this.listPlayers) {
            this.listPlayers[i].bEnableRenderBettingType = false;
        }
        //this.kMainUser.textHand.UpdateCaption(strHand);
        console.log(`IModeGame::SetRiverCard listTableCard ${listCard}`);
    }

    ShowCard(objectData)
    {
        console.log(objectData.iCard1);
        console.log(objectData.iCard2);
        let player = this.FindUser(objectData.strID);
        if (player) {
            console.log(
                `player Location : ${player.iLocation}, ID : ${player.strID}`
            );
            player.listHandCard[0] = objectData.iCard1;
            player.listHandCard[1] = objectData.iCard2;
            player.bShowCard = true;
        }
    }

    SetTableCard(listCard)
    {
        this.listTableCard = listCard;
        this.iNumCards = listCard.length;
    }

    ProcessShowDown() {
        this.bShowdown = true;
    }

    ProcessShowDownTurnCard(listData) {
        for (let i in listData) {
            let player = this.FindUser(listData[i].strID);
            if (player) {
                console.log(
                    `player Location : ${player.iLocation}, ID : ${player.strID}`
                );

                player.listHandCard[0] = listData[i].iCard1;
                player.listHandCard[1] = listData[i].iCard2;
                player.bShowDown = true;
                player.bHandCardTurn = false;
                player.renderCard1 = false;
                player.renderCard2 = false;
            }
        }
    }

    ProcessResult(listResult, listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser) {
        console.log(`ProcessResult : NumWinners ${listResult.length} cPlayingUser : ${cPlayingUser}`);
    
        this.bReserveBetStart = false;
        this.bwin = true;
        this.UpdateStrHandName();
    
        if (cPlayingUser == 1) {
            this.bAbstentionWin = true;
        }
    
        // 모든 플레이어에 대한 초기 상태 설정
        for (let i in this.listPlayers) {
            this.listPlayers[i].bFocus = false;
            this.listPlayers[i].bHandCardTurn = false;
            this.listPlayers[i].renderCard1 = false;
            this.listPlayers[i].renderCard2 = false;
            this.listPlayers[i].bShowDown = false;
            this.listPlayers[i].bResult = true;
            this.listPlayers[i].bBettingMode = false;
        }
    
        // 무승부 처리를 위해 iRank를 기준으로 정렬
        listResult.sort((a, b) => a.iRank - b.iRank);
    
        // 가장 낮은 iRank 찾기
        const lowestRank = listResult[0].iRank;
        // 가장 낮은 순위의 플레이어 수를 찾기
        let lowestRankPlayersCount = listResult.filter(result => result.iRank == lowestRank).length;
        // 잭팟 금액 계산 (모든 결과에서 동일하므로 하나를 선택)
        console.log(`1등 몇명? : `);
        console.log(lowestRankPlayersCount);
        let jackpotPerPlayer = 0;
        if (lowestRankPlayersCount > 0 && listResult[0].iJackpot > 0) {
            jackpotPerPlayer = listResult[0].iJackpot / lowestRankPlayersCount;
        }

        let winnerWinCoin = 0;
        // 가장 낮은 iRank와 동일한 모든 player를 승자로 처리 그들의 iWinCoin 업데이트
        listResult.forEach(result => {
            if (result.iRank == lowestRank) {
                let player = this.FindUser(result.strID);
                if (player) {
                    player.bWinner = true;
                    player.iWinCoin = result.iWinCoin;
                    if (winnerWinCoin == 0) { // 아직 1등 상금을 저장하지 않았다면
                        if(result.iJackpot > 0)
                            winnerWinCoin = player.iWinCoin - jackpotPerPlayer;
                        else
                            winnerWinCoin = player.iWinCoin; // 1등 상금 저장
                    }
                }
            }
        });

        // 실제 iWinCoin 연출이 필요한 유저 수 계산
        let winCoinCount = listResult.filter(result => result.iWinCoin > 0).length;
        let totalWinCoinDelay = winCoinCount * 1000;
        // iWinCoin 연출에 대한 총 지연 시간 계산 ( Jackpot 연출에 필요한 시간 계산.)
        if(winCoinCount < 4)
        {
            totalWinCoinDelay = 4000;
        }
        
        // 개별 player 처리 로직
        for (let i in listResult) {
            let player = this.FindUser(listResult[i].strID);
            if (player) {
                console.log(`Winner Location : ${player.iLocation}, ID : ${player.strID}`);

                if (cPlayingUser > 1 && this.bAbstentionWin == false) {
                    player.listHandCard[0] = listResult[i].iCard1;
                    player.listHandCard[1] = listResult[i].iCard2;
                    player.strHand = listResult[i].strHand;
                    player.SetWinCards(listWinCards);
                }
                else
                {
                    player.bAbstentionWin = true;
                }
                // winCoin 처리 부분에 대한 지연 로직
                if (listResult[i].iWinCoin > 0) {
                    setTimeout(() => {
                        let x = 800;
                        let y = 500;
                        if (this.isMobile) {
                            x = 500;
                            y = 900;
                        }
                        let dealer = new IChipDealer(x, y, player.x + 60, player.y + 40, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate, this.kTimer, 40, 40, listResult[i].iWinCoin, 2);
                        this.listWinCoin.push(dealer);
                        if(listResult[i].iJackpot > 0)
                        {
                            player.SetWinCoin(winnerWinCoin);
                        }
                        else
                        {
                            player.SetWinCoin(listResult[i].iWinCoin);
                        }
                        // this.resultpot.UpdateCaption(winnerWinCoin.toString());
                    }, 1000 * i); // i를 사용하여 각 player별로 1초씩 지연
                }
                if (listResult[i].iJackpot > 0 && player.bWinner == true)
                {
                    setTimeout(() => {
                        let x = 800;
                        let y = 500;
                        if (this.isMobile) {
                            x = 500;
                            y = 900;
                        }
                        let dealer = new IChipDealer(x, y, player.x + 60, player.y + 40, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate, this.kTimer, 40, 40, listResult[i].iJackpot, 2);
                        this.listWinCoin.push(dealer);
                        player.SetJackpotCoin(jackpotPerPlayer);
                        // this.resultpot.UpdateCaption(jackpotPerPlayer.toString());
                    }, totalWinCoinDelay);
                }
                player.UpdateMyCoin(listResult[i].iCoin);
            }
        }
    
        if (this.bAbstentionWin == false) {
            this.SetWinCards(listWinCards);
            this.strWinnerHand = strWinnerHand;
            if(strWinnerHand != 'Mountain' || strWinnerHand != 'Straight Flush' || strWinnerHand != 'Royal Flush')
            {
                this.strWinnerDescr = this.SetWinnerHighText(strWinnerDescr,strWinnerHand);
                console.log(`IModeGame:: before -> strWinnerDescr = ${strWinnerDescr}`);
                console.log(`IModeGame:: after -> strWinnerDescr = ${this.strWinnerDescr}`);
            }
            else
            {
                this.strWinnerDescr = []; 
            }
        }
    }

    ProcessRebuyIn(listObject) {
        this.bRebuyTurn = true;
        for (let i in listObject) {
            let player = this.FindUser(listObject[i].strID);
            if (player) {
                player.UpdateMyCoin(listObject[i].iCoin);
                if(listObject[i].iRebuyinCoin > 0)
                {
                    player.SetRebuyInCoin(listObject[i].iRebuyinCoin);
                }
                console.log(`ProcessRebuyIn : strID : ${this.socket.strID}`);

                //if ( listObject[i].strID == this.socket.strID && listObject[i].iCoin == 0 )
                if (listObject[i].strID == this.socket.strID) {
                    if (listObject[i].bQuit == true) {
                        $('#popup_message').show();

                        let tag = '리바인 금액이 부족하거나 리바인 옵션이 꺼져있어서 게임을 더 이상 진행할 수 없습니다.';
                    
                        $('#message').empty();
                        $('#message').append(tag);
                    }
                    //else this.UpdatePoint(listObject[i].iCash);
                    let iCash = (parseInt(listObject[i].iCash) + parseInt(listObject[i].iCoin)) - this.socket.iStartCash;
                    this.iStartCoinText.UpdateCaption("수익 : " + iCash.toLocaleString());
                }
            }
        }
    }

    UpdatePot(listPots) {
        this.listTempPot = [];

        for (let i in listPots) this.listTempPot.push(listPots[i]);

        console.log(`### UpdatePot`);
        console.log(listPots);

        // this.listPotManager = [];

        // for ( let i in listPots )
        // {
        //     let k = new IPotManager(650 + (i * 200), 600, this.kTimer, 50, 50, this.kSC.m_fWidthRate, this.kSC.m_fHeightRate);
        //     k.UpdatePot(listPots[i].iPotAmount);
        //     this.listPotManager.push(k);
        // }
    }

    OnSize(fHR, fVR) {
        this.showdown.OnSize(fHR, fVR);
        this.showdownbg.OnSize(fHR, fVR);
        // this.gameWinCeremony.OnSize(fHR, fVR);
        // this.gameAbstentionWin.OnSize(fHR, fVR);
        // this.gamewinMadePanel.OnSize(fHR, fVR);
        // this.resultpot.OnSize(fHR, fVR);
        // this.imageComma.OnSize(fHR, fVR);
        this.slider.OnSize(fHR, fVR);
        this.slider.button.Label.OnSize(fHR, fVR);
        this.sliderBG.OnSize(fHR, fVR);
        // this.raiseActive.OnSize(fHR, fVR);
        // this.fireEffect.OnSize(fHR, fVR);
        this.textTotalBettingcoin.OnSize(fHR, fVR);
        // this.jackpotAction1.OnSize(fHR, fVR, this.kSC.m_iCurrentWidth, this.kSC.m_iCurrentHeight);
        // this.jackpotAction2.OnSize(fHR, fVR, this.kSC.m_iCurrentWidth, this.kSC.m_iCurrentHeight);
        // this.jackpotAction3.OnSize(fHR, fVR, this.kSC.m_iCurrentWidth, this.kSC.m_iCurrentHeight);
        // this.emoticonBG.OnSize(fHR, fVR);
        // this.jackpotCoinLabel.OnSize(fHR, fVR);
        // this.JackpotLevelLeft.OnSize(fHR, fVR);
        // this.JackpotLevelRight.OnSize(fHR, fVR);
        //test
        // this.listImagesCardFrame1.OnSize(fHR, fVR);
        // this.listImagesCardFrame2.OnSize(fHR, fVR);
        // this.listImagesCardFrame3.OnSize(fHR, fVR);
        // this.listImagesCardFrame4.OnSize(fHR, fVR);
        // this.listImagesCardFrame5.OnSize(fHR, fVR);

        //this.ptDealerLocation.x = cDealerLocation.x * fHR;
        //this.ptDealerLocation.y = cDealerLocation.y * fVR;

        this.sliderLabel.OnSize(fHR, fVR);
        this.iStartCoinText.OnSize(fHR, fVR);
        // for (let i in this.emoticonButtons) {
        //     this.emoticonButtons[i].OnSize(fHR, fVR);
        // }
        for (let i in this.listBgs) {
            this.listBgs[i].OnSize(fHR, fVR);
        }
        for (let i in this.listCardDeck) {
            this.listCardDeck[i].OnSize(fHR, fVR);
        }
        // for (let i in this.listJackpotDeck) {
        //     this.listJackpotDeck[i].OnSize(fHR, fVR);
        // }
        for (let i in this.listTablePanel) {
            this.listTablePanel[i].OnSize(fHR, fVR);
        }
        // for (let i in this.listJackpotPanel) {
        //     this.listJackpotPanel[i].OnSize(fHR, fVR);
        // }
        // for (let i in this.listImages) {
        //     this.listImages[i].OnSize(fHR, fVR);
        // }

        for (let i in this.listButtons) {
            this.listButtons[i].OnSize(fHR, fVR);
        }

        for (let i in this.listBettingButtons) {
            this.listBettingButtons[i].OnSize(fHR, fVR);
        }

        for (let i in this.listReservebet) {
            this.listReservebet[i].OnSize(fHR, fVR);
        }

        for (let i in this.listLocationButtons) {
            this.listLocationButtons[i].OnSize(fHR, fVR);
        }
        
        for(let i in this.listLocations)
        {
            this.listLocations[i].OnSize(fHR, fVR);
        }
        // for (let i in this.listLocationArrow) {
        //   this.listLocationArrow[i].OnSize(fHR, fVR);
        // }
        for (let i in this.listPlayers) {
            this.listPlayers[i].OnSize(fHR, fVR);
        }

        for (let i in this.listLabels) {
            this.listLabels[i].OnSize(fHR, fVR);
        }
        // for (let i in this.listDot) {
        //     this.listDot[i].OnSize(fHR, fVR);
        // }
        // for (let i in this.listTexts) {
        //     this.listTexts[i].OnSize(fHR, fVR);
        // }

        for (let i in this.listImagesCard) {
            this.listImagesCard[i].OnSize(fHR, fVR);
        }
        this.listImagesCardFrame.OnSize(fHR, fVR);

        for (let i in this.listCardDealer) {
            this.listCardDealer[i].OnSize(fHR, fVR);
        }

        for (let i in this.listPotManager) {
            this.listPotManager[i].OnSize(fHR, fVR);
        }

        for (let i in this.listImagesHand) {
            this.listImagesHand[i].OnSize(fHR, fVR);
        }
        // for (let i in this.listImagesHigh) {
        //     this.listImagesHigh[i].OnSize(fHR, fVR);
        // }

    }

    OnClick(mouse) {
        for (let i in this.listButtons) {
            this.listButtons[i].Click(mouse, this);
        }

        if(this.bEmoticon)
        {
            for (let i in this.emoticonButtons)
            {
                this.emoticonButtons[i].Click(mouse, this);
            }
        }

        if (true == this.bEnableBetting) {
            for (let i in this.listBettingButtons)
            {
                this.listBettingButtons[i].Click(mouse, this);
            }
            if(this.bRaiseButton == true)
            {
                // for (let i in this.sliderButton)
                // {
                //     if (i % 2 === 0) { // 버튼 렌더링
                //         this.sliderButton[i].Click(mouse,this);
                //     }
                //     else if(i == 8 || i == 9)
                //     {
                //         this.sliderButton[i].Click(mouse,this);
                //     } 
                // }
            }
        }
        else
        {
            if(this.bReserveBetStart == true)
            {
                if(this.bReserveBet == true && this.iBettingCoin > 0){
                    this.listReservebet[0].Click(mouse, this);
                }
                else if(this.bReserveBet == false && this.iBettingCoin > 0)
                {
                    this.listReservebet[1].Click(mouse, this);
                }
                else if(this.bReserveBet == true && this.iBettingCoin <= 0)
                {
                    this.listReservebet[2].Click(mouse, this);
                }
                else if(this.bReserveBet == false && this.iBettingCoin <= 0)
                {
                    this.listReservebet[3].Click(mouse, this);
                }
            }
        }

        if (true == this.bEnableLocation) {
            for (let i in this.listLocationButtons) {
                if (true == this.IsEnableLocation(i))
                    this.listLocationButtons[i].Click(mouse, this);
            }
        }
    }

    OnMouseMove(mouse) {
        if (this.isMobile == false) {
            // for (let i in this.listPlayers) {
            //     this.listPlayers[i].Over(mouse);
            // }

            for (let i in this.listButtons) {
                this.listButtons[i].Over(mouse);
            }

            if (true == this.bEnableBetting) {
                // 먼저 Betting Buttons에 대해 Over를 호출합니다.
                for (let i in this.listBettingButtons)
                    this.listBettingButtons[i].Over(mouse);
            
                // Raise 버튼이 활성화 되어 있고, sliderButton이 Over 상태일 때만 처리합니다.
                if(this.bRaiseButton == true) {
                    // for (let i in this.sliderButton) {
                    //     // sliderButton Over 체크
                    //     if (i % 2 == 0 && this.sliderButton[i].Over(mouse) && i < 7) { // 짝수 인덱스의 버튼에 대해 오버 체크
                    //         this.sliderButtonRenderFlags[i / 2] = true; // 해당 버튼에 대응하는 이미지의 플래그 설정
                    //     }
                    //     else if(i == 8 || i == 9)
                    //     {
                    //         this.sliderButton[i].Over(mouse);
                    //     }
                    //     else
                    //     {
                    //         this.sliderButtonRenderFlags[i / 2] = false;
                    //     }
                    //     if (this.sliderButton[i].Over(mouse)) { // .Over()가 boolean을 반환한다고 가정합니다.
                    //         let iCurrentCoin = 0;
                    //         let player = this.FindUser(this.socket.strID);
            
                    //         // 여기서 iCurrentCoin을 결정합니다.
                    //         if (i == 0) { // 올인
                    //             iCurrentCoin = player.iGameCoin;
                    //         } else if (i == 2) { // 풀
                    //             iCurrentCoin = Math.floor(parseInt(this.iCallCoin)+(parseInt(this.iCallCoin) + parseInt(this.iTotalBettingCoin)));
                    //         } else if (i == 4) { // 하프
                    //             iCurrentCoin = Math.floor(parseInt(this.iCallCoin)+((parseInt(this.iCallCoin) + parseInt(this.iTotalBettingCoin)) / 2));
                    //         } else if (i == 6) { // 쿼터
                    //             iCurrentCoin = Math.floor(parseInt(this.iCallCoin)+((parseInt(this.iCallCoin) + parseInt(this.iTotalBettingCoin)) / 4));
                    //         }
                    //         else
                    //         {
                    //             break;
                    //         }

                    //          // 이미지의 strCaption 업데이트
                    //         if (i < 7) {
                    //             this.sliderButton[parseInt(i) + 1].strCaption = iCurrentCoin.toString();
                    //         }
                    //         console.log(iCurrentCoin);
                    //         // Over가 sliderButton에만 적용되었을 때만 UpdateCaption을 호출합니다.
                    //         //this.listLabels[2].UpdateCaption(iCurrentCoin.toString());
                    //         break; // Over가 확인되면 루프를 빠져나옵니다.
                    //     }
                    // }
                }
            }
            else
            {
                if(this.bReserveBetStart == true)
                {
                    if(this.bReserveBet == true && this.iBettingCoin > 0){
                        this.listReservebet[0].Over(mouse);
                    }
                    else if(this.bReserveBet == false && this.iBettingCoin > 0)
                    {
                        this.listReservebet[1].Over(mouse);
                    }
                    else if(this.bReserveBet == true && this.iBettingCoin <= 0)
                    {
                        this.listReservebet[2].Over(mouse);
                    }
                    else if(this.bReserveBet == false && this.iBettingCoin <= 0)
                    {
                        this.listReservebet[3].Over(mouse);
                    }
                }
            }

            if (true == this.bEnableLocation) {
                for (let i in this.listLocationButtons) {
                    this.listLocationButtons[i].Over(mouse);
                }
            }

            if(this.bEmoticon)
            {
                for (let i in this.emoticonButtons)
                {
                    this.emoticonButtons[i].Over(mouse);
                }
            }
            
            if ((true == this.slider.Over(mouse) && this.bRaiseButton == true)) {
                let player = this.FindUser(this.socket.strID);
                if (player != null) {
                    let maxCoin = player.iGameCoin;
                    let minCoin = 0;
                    let coinPercentage = 0;
                    if(this.iCallCoin > 0)
                    {
                        minCoin = Math.round(((Number(this.iCallCoin) * 2)) / 1000) * 1000;
                    }
                    else
                    {
                        minCoin = Math.round(((Number(this.iBlind) * 2)) / 1000) * 1000;
                    }
                    
                    if (minCoin >= maxCoin) {
                        // 슬라이더의 위치에 따라 0 또는 100으로 설정
                        if (this.slider.iCurrentBar < 20 && this.slider.iCurrentBar > 3) { // 20보다 작고 5보다 클때
                            this.sliderLabel.UpdateCaption(maxCoin.toString());
                            this.slider.SetButtonToTop();
                            this.slider.button.Label.UpdateCaption("100%");
                        }
                        else if(this.slider.iCurrentBar < 97 && this.slider.iCurrentBar > 80)
                        {
                            this.sliderLabel.UpdateCaption("0");
                            this.slider.button.Label.UpdateCaption("취소");
                            this.slider.SetButtonToBottom();
                        }
                    }
                    else {
                        let deadZoneThreshold = 3; // The slider position threshold for the dead zone
                        let range = maxCoin - minCoin;
                        let steps = range / (this.iBlind * 2); // Calculate the number of increments
                    
                        // If the slider's current bar is below the dead zone threshold, set to 0
                        if (this.slider.iCurrentBar <= deadZoneThreshold) {
                            this.sliderLabel.UpdateCaption('0');
                            this.slider.button.Label.UpdateCaption("취소");
                        }
                        // If the slider's current bar is just above the dead zone threshold, set to minCoin
                        else if (this.slider.iCurrentBar <= deadZoneThreshold + 1) {
                            coinPercentage = Math.round((minCoin / maxCoin) * 100);
                            this.sliderLabel.UpdateCaption(minCoin.toString());
                            this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                        }
                        else {
                            // Calculate the bet amount proportionally above the dead zone
                            let adjustedCurrentBar = this.slider.iCurrentBar - deadZoneThreshold;
                            let adjustedMaxBar = 100 - deadZoneThreshold; // Adjusted max bar value considering the dead zone
                            let stepValue = adjustedCurrentBar / (adjustedMaxBar - 1); // Proportional step value
                            let currentStep = Math.floor(stepValue * steps);
                            let iCurrentCoin = minCoin + (this.iBlind * 2 * currentStep);
                            // Ensure iCurrentCoin does not fall below minCoin or exceed maxCoin
                            iCurrentCoin = Math.min(Math.max(iCurrentCoin, minCoin), maxCoin);
                    
                            // 현재 코인 금액의 퍼센트 계산
                            coinPercentage = Math.round((iCurrentCoin / maxCoin) * 100);
                            // Update the display with the current coin value
                            this.sliderLabel.UpdateCaption(iCurrentCoin.toString());
                            this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                        }
                    }
                }
            }
        }
    }
    OnTouchMove(touch) {
        if (this.isMobile == true) {
            // for (let i in this.listPlayers) {
            //     this.listPlayers[i].Touch(touch);
            // }
            if ((true == this.slider.Touch(touch) && this.bRaiseButton == true) ) {
                let player = this.FindUser(this.socket.strID);
                if (player != null) {
                    let maxCoin = player.iGameCoin;
                    let minCoin = 0;
                    let coinPercentage = 0;
                    if(this.iCallCoin > 0)
                    {
                        minCoin = Math.round(((Number(this.iCallCoin) * 2)) / 1000) * 1000;
                    }
                    else
                    {
                        minCoin = Math.round(((Number(this.iBlind) * 2)) / 1000) * 1000;
                    }
                    
                    if (minCoin >= maxCoin) {
                        // 슬라이더의 위치에 따라 0 또는 100으로 설정
                        if (this.slider.iCurrentBar < 20 && this.slider.iCurrentBar > 3) { // 20보다 작고 5보다 클때
                            this.sliderLabel.UpdateCaption(maxCoin.toString());
                            this.slider.SetButtonToTop();
                            this.slider.button.Label.UpdateCaption("100%");
                        }
                        else if(this.slider.iCurrentBar < 97 && this.slider.iCurrentBar > 80)
                        {
                            this.sliderLabel.UpdateCaption("0");
                            this.slider.button.Label.UpdateCaption("취소");
                            this.slider.SetButtonToBottom();
                        }
                    }
                    else {
                        let deadZoneThreshold = 3; // The slider position threshold for the dead zone
                        let range = maxCoin - minCoin;
                        let steps = range / (this.iBlind * 2); // Calculate the number of increments
                    
                        // If the slider's current bar is below the dead zone threshold, set to 0
                        if (this.slider.iCurrentBar <= deadZoneThreshold) {
                            this.sliderLabel.UpdateCaption('0');
                            this.slider.button.Label.UpdateCaption("취소");
                        }
                        // If the slider's current bar is just above the dead zone threshold, set to minCoin
                        else if (this.slider.iCurrentBar <= deadZoneThreshold + 1) {
                            coinPercentage = Math.round((minCoin / maxCoin) * 100);
                            this.sliderLabel.UpdateCaption(minCoin.toString());
                            this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                        }
                        else {
                            // Calculate the bet amount proportionally above the dead zone
                            let adjustedCurrentBar = this.slider.iCurrentBar - deadZoneThreshold;
                            let adjustedMaxBar = 100 - deadZoneThreshold; // Adjusted max bar value considering the dead zone
                            let stepValue = adjustedCurrentBar / (adjustedMaxBar - 1); // Proportional step value
                            let currentStep = Math.floor(stepValue * steps);
                            let iCurrentCoin = minCoin + (this.iBlind * 2 * currentStep);
                    
                            // Ensure iCurrentCoin does not fall below minCoin or exceed maxCoin
                            iCurrentCoin = Math.min(Math.max(iCurrentCoin, minCoin), maxCoin);
                            coinPercentage = Math.round((iCurrentCoin / maxCoin) * 100);
                            // Update the display with the current coin value
                            this.sliderLabel.UpdateCaption(iCurrentCoin.toString());
                            this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                        }
                    }
                }
            }
        }
    }

    OnTouchEnd(touch)
    {
        if (this.isMobile == true) {
            // for (let i in this.listPlayers) {
            //     this.listPlayers[i].Up(touch);
            // }
        }
    }

    OnTouchStart(touch)
    {
        if(this.isMobile == true)
        {
            // for (let i in this.listPlayers) {
            //     this.listPlayers[i].Down(touch);
            // }
        }
    }

    OnMouseDown(mouse) {
        // for (let i in this.listPlayers) {
        //     this.listPlayers[i].Down(mouse);
        // }

        for (let i in this.listButtons) {
            this.listButtons[i].Down(mouse);
        }

        if (this.bEmoticon) {
            for (let i in this.emoticonButtons) {
                this.emoticonButtons[i].Down(mouse);
            }
        }

        if (true == this.bEnableBetting) {
            for (let i in this.listBettingButtons)
                this.listBettingButtons[i].Down(mouse);
            if(this.bRaiseButton == true )
            {
                if ((this.slider.Down(mouse))) {
                    let player = this.FindUser(this.kMainUser.strID);
                    if (player != null) {
                        let maxCoin = player.iGameCoin;
                        let minCoin = 0;
                        let coinPercentage = 0;
                        if(this.iCallCoin > 0)
                        {
                            minCoin = Math.round(((Number(this.iCallCoin) * 2)) / 1000) * 1000;
                        }
                        else
                        {
                            minCoin = Math.round(((Number(this.iBlind) * 2)) / 1000) * 1000;
                        }
                        if (minCoin >= maxCoin) {
                            // 슬라이더의 위치에 따라 0 또는 100으로 설정
                            if (this.slider.iCurrentBar < 50 && this.slider.iCurrentBar > 0) { 
                                this.sliderLabel.UpdateCaption("0");
                                this.slider.SetButtonToBottom();
                                this.slider.button.Label.UpdateCaption("취소");
                            }
                            else if(this.slider.iCurrentBar < 100 && this.slider.iCurrentBar > 50)
                            {
                                this.sliderLabel.UpdateCaption(maxCoin.toString());
                                this.slider.button.Label.UpdateCaption("100%");
                                this.slider.SetButtonToTop();
                            }
                        }
                        else {
                            let deadZoneThreshold = 5; // The slider position threshold for the dead zone
                            let range = maxCoin - minCoin;
                            let steps = range / (this.iBlind * 2); // Calculate the number of increments
                        
                            // If the slider's current bar is below the dead zone threshold, set to 0
                            if (this.slider.iCurrentBar <= deadZoneThreshold) {
                                this.sliderLabel.UpdateCaption('0');
                                this.slider.button.Label.UpdateCaption("취소");
                            }
                            // If the slider's current bar is just above the dead zone threshold, set to minCoin
                            else if (this.slider.iCurrentBar <= deadZoneThreshold + 1) {
                                coinPercentage = Math.round((minCoin / maxCoin) * 100);
                                this.sliderLabel.UpdateCaption(minCoin.toString());
                                this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                            }
                            else {
                                // Calculate the bet amount proportionally above the dead zone
                                let adjustedCurrentBar = this.slider.iCurrentBar - deadZoneThreshold;
                                let adjustedMaxBar = 100 - deadZoneThreshold; // Adjusted max bar value considering the dead zone
                                let stepValue = adjustedCurrentBar / (adjustedMaxBar - 1); // Proportional step value
                                let currentStep = Math.floor(stepValue * steps);
                                let iCurrentCoin = minCoin + (this.iBlind * 2 * currentStep);
                        
                                // Ensure iCurrentCoin does not fall below minCoin or exceed maxCoin
                                iCurrentCoin = Math.min(Math.max(iCurrentCoin, minCoin), maxCoin);
                                coinPercentage = Math.round((iCurrentCoin / maxCoin) * 100);
                                // Update the display with the current coin value
                                this.sliderLabel.UpdateCaption(iCurrentCoin.toString());
                                this.slider.button.Label.UpdateCaption(coinPercentage + "%");
                            }
                        }
                    }
                }
            }
        }
        else
        {
            if(this.bReserveBetStart == true)
            {
                if(this.bReserveBet == true && this.iBettingCoin > 0){
                    this.listReservebet[0].Down(mouse);
                }
                else if(this.bReserveBet == false && this.iBettingCoin > 0)
                {
                    this.listReservebet[1].Down(mouse);
                }
                else if(this.bReserveBet == true && this.iBettingCoin <= 0)
                {
                    this.listReservebet[2].Down(mouse);
                }
                else if(this.bReserveBet == false && this.iBettingCoin <= 0)
                {
                    this.listReservebet[3].Down(mouse);
                }
            }
        }

        if (true == this.bEnableLocation) {
            for (let i in this.listLocationButtons) {
                this.listLocationButtons[i].Down(mouse);
            }
        }
        //this.slider.Down(mouse);
        
    }

    OnMouseUp(mouse) {
        // for (let i in this.listPlayers) {
        //     this.listPlayers[i].Up(mouse);
        // }

        for (let i in this.listButtons) {
            this.listButtons[i].Up(mouse);
        }

        if (this.bEmoticon) {
            for (let i in this.emoticonButtons) {
                this.emoticonButtons[i].Up(mouse);
            }
        }

        if (true == this.bEnableBetting) {
            for (let i in this.listBettingButtons)
                this.listBettingButtons[i].Up(mouse);

            if (this.bRaiseButton == true) {
                let player = this.FindUser(this.kMainUser.strID);
                if (player != null) {
                    this.slider.Up(mouse);
                    let iAmount = this.sliderLabel.strCaption;

                    console.log(`raise up : ${iAmount}`);
                    console.log(`label : ${this.slider.button.Label.strCaption}`);
                    if (iAmount <= 0 || this.slider.button.Label.strCaption == "취소") {
                        console.log(`취소!!`);
                        this.bRaiseButton = false;
                        this.bMobileRaiseButton = false;
                        this.listBettingButtons[7].bEnable = true;
                    }
                    else {
                        this.bRaiseButton = false;
                        this.bMobileRaiseButton = false;

                        let objectBetting = { strBetting: 'Raise', iAmount: iAmount, timestamp: Date.now() };
                       
                        if (player.iGameCoin <= iAmount) {
                            console.log(`player : ${player.iCoin}, raise : ${iAmount}`);
                            objectBetting.iAmount = player.iGameCoin;
                            objectBetting.strBetting = 'Allin';
                        }
                        console.log(`player : ${objectBetting.strBetting}, raise : ${objectBetting.iAmount}`);
                        this.socket.emit('CM_Betting', objectBetting);

                        this.bEnableBetting = false;

                        this.kMainUser.bHandCardTurn = false;
                        this.kMainUser.renderCard1 = false;
                        this.kMainUser.renderCard2 = false;
                        this.kMainUser.iAutoFoldCounter = 0;
                    }
                }
            }
        }
        else
        {
            if(this.bReserveBetStart == true)
            {
                if(this.bReserveBet == true && this.iBettingCoin > 0){
                    this.listReservebet[0].Up(mouse);
                }
                else if(this.bReserveBet == false && this.iBettingCoin > 0)
                {
                    this.listReservebet[1].Up(mouse);
                }
                else if(this.bReserveBet == true && this.iBettingCoin <= 0)
                {
                    this.listReservebet[2].Up(mouse);
                }
                else if(this.bReserveBet == false && this.iBettingCoin <= 0)
                {
                    this.listReservebet[3].Up(mouse);
                }
            }
        }

        if (true == this.bEnableLocation) {
            for (let i in this.listLocationButtons) {
                this.listLocationButtons[i].Up(mouse);
            }
        }
    }

    OnMouseLeave()
    {
        // for (let i in this.listPlayers) {
        //     this.listPlayers[i].Leave();
        // }
        this.slider.Leave();
    }

    SetWinCards(listWinCards) {
        console.log(`SetWinCards`);
        console.log(this.listTableCard);
        console.log(listWinCards);

        this.listWinCards = [false, false, false, false, false];
        for (let i in this.listTableCard) {
            for (let j in listWinCards) {
                if (listWinCards[j] == this.listTableCard[i])
                    this.listWinCards[i] = true;
            }
        }
    }

    EnableUserList(listUser) {
        for (let i in listUser) {
            let player = this.FindUser(listUser[i]);
            if (player) 
            {
                player.bEnablePlay = true;
                if(player.iLocation != -1)
                {
                    player.bSpectator = false;
                }
                else
                {
                    player.bSpectator = true;
                }
            }
        }
    }

    formatCurrencyToKoreanWon(value) {
        // 만원 단위와 그 이하를 분리
        console.log(`formatCurrencyToKoreanWon`);
        console.log(value);
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
        console.log(formattedValue);
        // 최종 결과 반환
        return formattedValue;
    }
}
