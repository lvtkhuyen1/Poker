function IsMobile()
{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let OnClickLeave = (game) => {

    // game.socket.emit('CM_LeaveGame');

    soundClick.play();
}

let OnClickGameStart = (game) => {

    game.listButtons[0].bEnable = false;

    game.socket.emit('CM_StartGame');

    soundClick.play();
}

// let OnClickGameChat = (game) => {

//     if (game.bEnableChat == false) {
//         //$('#chatting').show();
//         $('#game_log').hide();
//         game.bEnableChat = true;

//         soundClick.play();
//     }
// }

let OnClickGameEmoticon = (game) => {

    if (game.bEnableChat == false) {

        if(game.bEmoticon == true)
        {
            game.bEmoticon = false;
        }
        else
        {
            game.bEmoticon = true;
        }
        soundClick.play();
    }
}

let OnClickGamelog = (game) => {

    if (game.bEnableChat == false) {
        $('#game_log').show();
        game.bEnableChat = true;

        soundClick.play();
    }
}

let OnClickShowCard = (game) => {

    if(game.bAbstentionWin == true)
    {
        if(game.kMainUser.bShowCard == false && game.kMainUser.bAbstentionWin == true)
        {
            let player = game.FindUser(game.socket.strID);
            let objectData = {  strID:player.strID, 
                iCard1:player.listHandCard[0], 
                iCard2:player.listHandCard[1],
            };
            game.socket.emit('CM_ShowCard', objectData);

            soundClick.play();
        }
    }
}

let OnClickLocation1 = (game) => {

    game.socket.emit('CM_SelectLocation', 0);

    soundClick.play();
}

let OnClickLocation2 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 1);

    soundClick.play();
}

let OnClickLocation3 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 2);

    soundClick.play();
}

let OnClickLocation4 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 3);

    soundClick.play();
}

let OnClickLocation5 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 4);

    soundClick.play();
}

let OnClickLocation6 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 5);

    soundClick.play();
}

let OnClickLocation7 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 6);

    soundClick.play();
}

let OnClickLocation8 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 7);

    soundClick.play();
}

let OnClickLocation9 = (game) => {
    
    game.socket.emit('CM_SelectLocation', 8);

    soundClick.play();
}

let OnClickEmoticon0 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 0);
    game.bEmoticon = false;
}

let OnClickEmoticon1 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 1);
    game.bEmoticon = false;
}

let OnClickEmoticon2 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 2);
    game.bEmoticon = false;
}

let OnClickEmoticon3 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 3);
    game.bEmoticon = false;
}

let OnClickEmoticon4 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 4);
    game.bEmoticon = false;
}

let OnClickEmoticon5 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 5);
    game.bEmoticon = false;
}

let OnClickEmoticon6 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 6);
    game.bEmoticon = false;
}

let OnClickEmoticon7 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 7);
    game.bEmoticon = false;
}

let OnClickQuater = (game) => {

    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+((game.iCallCoin + game.iTotalBettingCoin) / 4));
    console.log(`##### Quater iAmount ${iAmount} player.iGameCoin : ${player.iGameCoin}`);
    let objectBetting = {};
    if(player.iGameCoin <= iAmount) 
    {
        objectBetting = {strBetting:'Allin', iAmount:player.iGameCoin};
    }
    else
    {
        objectBetting = {strBetting:'Quater', iAmount:iAmount};
    }
    game.SetRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //  Test
    
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }  

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;
    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;

    soundClick.play();
}

let OnClickHalf = (game) => {

    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+((game.iCallCoin + game.iTotalBettingCoin) / 2));

    console.log(`##### Half iAmount ${iAmount} player.iGameCoin : ${player.iGameCoin}`);
    let objectBetting = {};
    if(player.iGameCoin <= iAmount) 
    {
        objectBetting = {strBetting:'Allin', iAmount:player.iGameCoin};
    }
    else
    {
        objectBetting = {strBetting:'Half', iAmount:iAmount};
    }
    game.SetRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //
    //  Test
    
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;

    soundClick.play();
}

let OnClickFull = (game) => {

    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+(game.iCallCoin + game.iTotalBettingCoin));
    let objectBetting = {};
    if(player.iGameCoin <= iAmount) 
    {
        objectBetting = {strBetting:'Allin', iAmount:player.iGameCoin};
    }
    else
    {
        objectBetting = {strBetting:'Full', iAmount:iAmount};
    }
    
    console.log(`##### Full iAmount ${iAmount} player.icoin : ${player.iGameCoin}`);
    
    game.SetRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //
    //  Test
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;

    soundClick.play();
}

let OnClickAllin = (game) => {

    console.log(`Allin : ${game.socket.strID}`);

    let player = game.FindUser(game.socket.strID);

    console.log(`${player.strID}`);
    console.log(player);

    let objectBetting = {strBetting:'Allin', iAmount:player.iGameCoin};

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
}

let OnClickCall = (game) => {

    let iAmount = game.iCallCoin;

    //let objectBetting = {strBetting:'Call', iAmount:iAmount};

    let player = game.FindUser(game.socket.strID);

    let objectBetting = {strBetting:'Call', iAmount:iAmount};

    console.log(`OnClickCall : ${player.strID}, coin : ${player.iGameCoin}`);
    if ( player != null )
    {
        console.log(`Found`);
        if ( player.iGameCoin <= iAmount )
        {
            console.log(`player : ${player.iCoin}, raise : ${iAmount}`);
            objectBetting.iAmount = player.iGameCoin;
            objectBetting.strBetting = 'Allin';
        }        
    }

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    // game.kMainUser.iAutoFoldCounter = 0;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
}

let OnClickFold = (game) => {

    let objectBetting = {strBetting:'Fold', iAmount:0};

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    //game.kMainUser.iAutoFoldCounter = 0;
}

let OnClickCheck = (game) => {

    let objectBetting = {strBetting:'Check', iAmount:0};

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;

    // game.kMainUser.iAutoFoldCounter = 0;
}

let OnClickMobileQuater = (game) => {

    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+((game.iCallCoin + game.iTotalBettingCoin) / 4));
    console.log(`##### Quater iAmount ${iAmount} player.iGameCoin : ${player.iGameCoin}`);
    if(player.iGameCoin < iAmount) iAmount = player.iGameCoin;
    //game.SetRaiseButton();
    game.SetMobileRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //  Test
    
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }    

    // let player = game.FindUser(game.socket.strID);

    // let objectBetting = {strBetting:'Quater', iAmount:iAmount};

    // console.log(`OnClickQuater : ${player.strID}, coin : ${player.iGameCoin}`);
    // if ( player != null )
    // {
    //     console.log(`Found`);
    //     if ( player.iGameCoin < iAmount )
    //     {
    //         console.log(`player : ${player.iCoin}, raise : ${iAmount}`);
    //         objectBetting.iAmount = player.iGameCoin;
    //         objectBetting.strBetting = 'Allin';
    //     }        
    // }

    // game.socket.emit('CM_Betting', objectBetting);

    // game.bEnableBetting = false;
    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    // game.kMainUser.iAutoFoldCounter = 0;
    soundClick.play();
}

let OnClickMobileHalf = (game) => {

    // let iAmount = (game.iCallCoin + (game.iCallCoin + game.iTotalBettingCoin)) / 2;

    // let objectBetting = {strBetting:'Half', iAmount:iAmount};

    // game.socket.emit('CM_Betting', objectBetting);

    // game.bEnableBetting = false;
    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+((game.iCallCoin + game.iTotalBettingCoin) / 2));

    console.log(`##### Half iAmount ${iAmount} player.iGameCoin : ${player.iGameCoin}`);
    if(player.iGameCoin < iAmount) iAmount = player.iGameCoin;
    //game.SetRaiseButton();
    game.SetMobileRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //
    //  Test
    
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }
    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    // game.kMainUser.iAutoFoldCounter = 0;
    soundClick.play();
}

let OnClickMobileFull = (game) => {

    // let iAmount = (game.iCallCoin + (game.iCallCoin + game.iTotalBettingCoin));

    // let objectBetting = {strBetting:'Full', iAmount:iAmount};

    // game.socket.emit('CM_Betting', objectBetting);

    // game.bEnableBetting = false;
    console.log(`##### Call ${game.iCallCoin}, Total : ${game.iTotalBettingCoin}`);
    let player = game.FindUser(game.socket.strID);
    let iAmount = Math.floor(game.iCallCoin+(game.iCallCoin + game.iTotalBettingCoin));
    if(player.iGameCoin < iAmount) iAmount = player.iGameCoin;
    
    console.log(`##### Full iAmount ${iAmount} player.icoin : ${player.iGameCoin}`);
    
    //game.SetRaiseButton();
    game.SetMobileRaiseButton();
    //game.CheckBettingCoin(iAmount);
    //
    //  Test
    if ( null != player )
    {
        let iValue = player.iGameCoin-game.iCallCoin;
        if ( iValue > 0 )
        {
            let delta = iAmount / iValue;

            game.slider.iCurrentLocation = Math.floor(delta*game.slider.iCurrentLocationMax);
            if ( game.slider.iCurrentLocation > game.slider.iCurrentLocationMax )
                game.slider.iCurrentLocation = game.slider.iCurrentLocationMax;

            game.slider.UpdateCurrentLocation();
        }        
    }
    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    // game.kMainUser.iAutoFoldCounter = 0;
    soundClick.play();
}

let OnClickMobileCall = (game) => {

    let iAmount = game.iCallCoin;

    //let objectBetting = {strBetting:'Call', iAmount:iAmount};

    let player = game.FindUser(game.socket.strID);

    let objectBetting = {strBetting:'Call', iAmount:iAmount};

    console.log(`OnClickCall : ${player.strID}, coin : ${player.iGameCoin}`);
    if ( player != null )
    {
        console.log(`Found`);
        if ( player.iGameCoin <= iAmount )
        {
            console.log(`player : ${player.iCoin}, raise : ${iAmount}`);
            objectBetting.iAmount = player.iGameCoin;
            objectBetting.strBetting = 'Allin';
        }        
    }

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;
    game.bMobileRaiseButton = false;
    game.bRaiseButton = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    // game.kMainUser.iAutoFoldCounter = 0;
}

let OnClickMobileFold = (game) => {

    let objectBetting = {strBetting:'Fold', iAmount:0};

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;
    game.bMobileRaiseButton = false;
    game.bRaiseButton = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    //game.kMainUser.iAutoFoldCounter = 0;
}

let OnClickMobileCheck = (game) => {

    let objectBetting = {strBetting:'Check', iAmount:0};

    game.socket.emit('CM_Betting', objectBetting);

    game.bEnableBetting = false;
    game.bMobileRaiseButton = false;
    game.bRaiseButton = false;

    soundClick.play();

    game.kMainUser.bHandCardTurn = false;
    game.kMainUser.renderCard1 = false;
    game.kMainUser.renderCard2 = false;
    // game.kMainUser.iAutoFoldCounter = 0;
}

let OnclickMobileRaise = (game) => {
    if (game.bMobileRaiseButton == true) {
        let iAmount = game.listLabels[2].strCaption;
        console.log(`raise click : ${iAmount}`);
        if (iAmount <= 0) {
            game.bRaiseButton = false;
            game.bMobileRaiseButton = false;
        }
        else {
            game.bRaiseButton = false;
            game.bMobileRaiseButton = false;

            let player = game.FindUser(game.socket.strID);

            let objectBetting = { strBetting: 'Raise', iAmount: iAmount };

            console.log(`OnclickMobileRaise : ${player.strID}, coin : ${player.iGameCoin}`);
            if (player != null) {
                console.log(`Found`);
                if (player.iGameCoin <= iAmount) {
                    console.log(`player : ${player.iCoin}, raise : ${iAmount}`);
                    objectBetting.iAmount = player.iGameCoin;
                    objectBetting.strBetting = 'Allin';
                }
                else {

                }
            }

            game.socket.emit('CM_Betting', objectBetting);

            game.bEnableBetting = false;

            game.kMainUser.bHandCardTurn = false;
            game.kMainUser.renderCard1 = false;
            game.kMainUser.renderCard2 = false;
            // game.kMainUser.iAutoFoldCounter = 0;
        }
    }
    else {
        game.SetMobileRaiseButton();
    }
    soundClick.play();
}

let OnClickPlus = (game) => {
    let currentAmount = parseInt(game.listLabels[2].strCaption);

    // minCoin 계산 (game.iCallCoin * 2의 올림 처리)
    let minCoin = Math.ceil(game.iCallCoin * 2 / 10) * 10;

    // iCallCoin이 0보다 크고 현재 금액이 minCoin보다 작은 경우, currentAmount를 minCoin으로 설정
    if(game.iCallCoin > 0 && currentAmount < minCoin) {
        currentAmount = minCoin;
    } else if (currentAmount % 10 != 0) {
        // 현재 금액이 10 단위가 아닌 경우, 올림
        currentAmount = Math.ceil(currentAmount / 10) * 10;
    } else {
        // 이미 10 단위인 경우, 10 추가
        currentAmount += 10;
    }

    currentAmount = Math.min(currentAmount, game.kMainUser.iGameCoin);

    // 슬라이더 위치 업데이트
    let newLocation = (currentAmount / game.kMainUser.iGameCoin) * game.slider.iCurrentLocationMax;
    game.slider.iCurrentLocation = Math.min(Math.floor(newLocation), game.slider.iCurrentLocationMax);

    game.listLabels[2].UpdateCaption(currentAmount.toString());
    game.slider.UpdateCurrentLocation();
}

let OnClickMinus = (game) => {
    let currentAmount = parseInt(game.listLabels[2].strCaption);

    // minCoin 계산 (game.iCallCoin * 2의 올림 처리)
    let minCoin = Math.ceil(game.iCallCoin * 2 / 10) * 10;

    if(game.iCallCoin > 0 && currentAmount <= minCoin)
    {
        currentAmount = 0;
    }
    else if (currentAmount % 10 != 0) {
        // 현재 금액이 10원 단위가 아닌 경우, 내림
        currentAmount = Math.floor(currentAmount / 10) * 10;
    } else {
        currentAmount -= 10;
    }

    // 슬라이더 위치 업데이트
    let newLocation = (currentAmount / game.kMainUser.iGameCoin) * game.slider.iCurrentLocationMax;
    game.slider.iCurrentLocation = Math.max(Math.floor(newLocation), 0);

    game.listLabels[2].UpdateCaption(currentAmount.toString());
    game.slider.UpdateCurrentLocation();
}