export default class IGameMain{

    constructor(Game, socket, configDisplay, timer)
    {
        this.Game = Game;
        this.socket = socket;
        this.configDisplay = configDisplay;
        this.kTimer = timer;

        this.bRenderLoadingScreen = true;

        /*this.iTestOriginWidth = 163;
        this.iTestOriginHeight = 227;
        this.iTestWidth = 163;
        this.iTestHeight = 227;
        this.iTestX = 100;
        this.iTestY = 100;

        this.bTestDirection = 0;*/
    }

    Login()
    {
        if(account.strPassword != undefined)
        {
            console.log(`IGameMain::Login ${account.strID}, ${account.strPassword}, Avatar : ${account.iAvatar}`);
            this.socket.emit('CM_Login', account.strID, account.strNickname, account.strPassword, account.iAvatar, account.eUserType);
        }
    }

    JoinGame()
    {
        console.log(`CM_Join!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        console.log(account);
        this.socket.emit('CM_JoinGame', account.strID, account.strNickname, account.lUnique, account.iCoin, account.iAvatar, account.strOptionCode, account.strGroupID, account.iClass, account.eUserType);
    }

    
    Render(ctx) 
    {
        // //if ( true == this.bRenderLoadingScreen )
        // {
        //     ctx.fillStyle = 'black';
        //     ctx.fillRect(0,0,this.configDisplay.m_iCurrentWidth, this.configDisplay.m_iCurrentHeight);

        //     //                 ctx.drawImage(
        //     // imageLogo, 
        //     // 0, 
        //     // 0, 
        //     // 305, 
        //     // 114, 
        //     // 100, 
        //     // 100, 
        //     // 305, 
        //     // 114);
        // }
        this.Game.Render(ctx);
        // turn card animation.
        /*ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        if ( this.bTestDirection == 0 && this.iTestWidth < 20)
        {
            this.iTestWidth -= this.kTimer.GetElapsedTime()*80;

            this.iTestX = 100 + (this.iTestOriginWidth-this.iTestWidth)*0.5;
    
            this.iTestHeight = 227 + (this.iTestOriginWidth-this.iTestWidth) * 0.15;
    
            this.iTestY = 100 + (this.iTestOriginHeight-this.iTestHeight)*0.5;

            if ( this.iTestWidth <= 0 )
                this.bTestDirection = 1;
        }
        else if(this.bTestDirection == 0 && this.iTestWidth > 20){
            this.iTestWidth -= this.kTimer.GetElapsedTime()*300;

            this.iTestX = 100 + (this.iTestOriginWidth-this.iTestWidth)*0.5;
    
            this.iTestHeight = 227 + (this.iTestOriginWidth-this.iTestWidth) * 0.15;
    
            this.iTestY = 100 + (this.iTestOriginHeight-this.iTestHeight)*0.5;
            if ( this.iTestWidth <= 0 )
                this.bTestDirection = 1;
        }
        else if ( this.bTestDirection == 1 )
        {
            this.iTestWidth += this.kTimer.GetElapsedTime()*500;
            //this.iTestHeight += this.kTimer.GetElapsedTime()*10;
            if ( this.iTestWidth > this.iTestOriginWidth )
                this.iTestWidth = this.iTestOriginWidth;

            this.iTestX = 100 + (this.iTestOriginWidth-this.iTestWidth)*0.5;
    
            this.iTestHeight = 227 + (this.iTestOriginWidth-this.iTestWidth) * 0.15;
    
            this.iTestY = 100 + (this.iTestOriginHeight-this.iTestHeight)*0.5;

            if ( this.iTestWidth >= 163 )
                this.bTestDirection = 0;
        }

        let iTestIndex= 52;
        if ( this.bTestDirection != 0 )
            iTestIndex = 3;
                ctx.drawImage(
            imageCards[iTestIndex], 
            0, 
            0, 
            163, 
            227, 
            this.iTestX, 
            this.iTestY, 
            this.iTestWidth, 
            this.iTestHeight);*/
        // ctx.shadowColor = "rgba(0,0,0,0.5)";
        // ctx.shadowBlur = 5;
        // ctx.shadowOffsetX = 5;
        // ctx.shadowOffsetY = 5;

        // if ( this.bTest1Direction == 0 && this.iTest1Height <= 200)
        // {
        //     this.iTest1Height += this.kTimer.GetElapsedTime()*1000;
        //     this.iTest1X = 500 + (this.iTest1OriginWidth-this.iTest1Width)*0.5;
        //     this.iTest1Y = 200 + (this.iTest1OriginHeight-this.iTest1Height)*0.5;
        //     if ( this.iTest1Height >= 200 ){
        //         this.iTest1Height = 200;
        //         this.bTest1Direction = 1;
        //     }
        // }
        // else if(this.bTest1Direction == 1 && this.iTest1Height > 20)
        // {

        //     this.iTest1Height = 200 + (this.iTest1OriginWidth-this.iTest1Width) * 0.9
        //     this.iTest1X = 500 + (this.iTest1OriginWidth-this.iTest1Width)*0.5

        //     this.iTest1Y = 200 + (this.iTest1OriginHeight-this.iTest1Height)*0.5;

        //     this.iTest2Height = 200 + (this.iTest2OriginWidth-this.iTest2Width) * 0.9
        //     this.iTest2X = 500 + (this.iTest2OriginWidth-this.iTest2Width)*0.5

        //     this.iTest2Y = 200 + (this.iTest2OriginHeight-this.iTest2Height)*0.5;
        // }
        // else if(this.bTestDirection == 0 && this.iTestWidth > 20){
        //     this.iTestWidth -= this.kTimer.GetElapsedTime()*300;

        //     this.iTestX = 100 + (this.iTestOriginWidth-this.iTestWidth)*0.5;
    
        //     this.iTestHeight = 227 + (this.iTestOriginWidth-this.iTestWidth) * 0.15;
    
        //     this.iTestY = 100 + (this.iTestOriginHeight-this.iTestHeight)*0.5;
        //     if ( this.iTestWidth <= 0 )
        //         this.bTestDirection = 1;
        // }
        // else if ( this.bTestDirection == 1 )
        // {
        //     this.iTestWidth += this.kTimer.GetElapsedTime()*500;
        //     //this.iTestHeight += this.kTimer.GetElapsedTime()*10;
        //     if ( this.iTestWidth > this.iTestOriginWidth )
        //         this.iTestWidth = this.iTestOriginWidth;

        //     this.iTestX = 100 + (this.iTestOriginWidth-this.iTestWidth)*0.5;
    
        //     this.iTestHeight = 227 + (this.iTestOriginWidth-this.iTestWidth) * 0.15;
    
        //     this.iTestY = 100 + (this.iTestOriginHeight-this.iTestHeight)*0.5;

        //     if ( this.iTestWidth >= 163 )
        //         this.bTestDirection = 0;
        // }

        //if ( this.bTest1Direction == 0 )
    }

    Update()
    {
        this.Game.Update();
    }

    OnSize(fHR, fVR)
    {
        this.Game.OnSize(fHR, fVR);
    }

    async OnIO()
    {
        this.socket.on('disconnect', (reason) => {
            console.log(`연결이 끊어졌습니다: ${reason}`);
            if (reason == 'ping timeout') {
                console.log('서버로부터 응답이 오랫동안 없습니다.');
            }
        });
        
        this.socket.on('SM_RequestLogin', (data) => {

            console.log(`SM_RequestLogin`);

            this.Login();
        });

        this.socket.on('SM_Login', (data) => {
           
            console.log(`SM_Login`);
            console.log(data);
            this.socket.strID = data.strID;
            //this.socket.iCoin = data.iCoin;
            this.socket.iAvatar = data.iAvatar;
            this.socket.eUserType = data.eUserType;

        });

        this.socket.on('SM_EnterGame', (data) => {

            console.log('SM_EnterGame');
            console.log(data);

            this.socket.strID = data.strID;
            this.socket.iCoin = data.iCoin;
            this.socket.iCash = data.iCash;
            this.socket.iStartCash = data.iCoin;
            this.Game.iBlind = data.iBlind;

            // this.Game.UpdateGameInfo(data.strGameName, data.iBlind);
            // this.Game.UpdatePoint(parseInt(data.iCoin));
            this.socket.emit('CM_SelectLocation', data.iLocation);
        });

        this.socket.on('SM_LeaveGame', (objectPlayer) => {

            console.log('SM_LeaveGame');
            //console.log(data);

            //this.Game.RemoveUser(objectPlayer);

            //soundLeaveUser.play();
            // if ( data.result == 'OK' )
            // {
            //     this.Game.Initialize();
            //     window.close();
            //     window.opener.reload();
            // }
        });
        this.socket.on('SM_WindowClose', () => {
            console.log('SM_WindowClose');
            window.close();
            window.opener.reload();
        });
        
        this.socket.on('SM_JoinUser', (user) => {

        });

        this.socket.on('SM_JoinGame', (listPlayers, iMaxPlayer, iJackpot, listTableCard, eGameMode) => {

            console.log(`SM_JoinGame`);
            console.log(listPlayers);
            console.log(iJackpot);
            if(eGameMode != 0)
            {
                this.Game.bPlaying = true;
            }
            //console.log(this.Game);
            this.Game.SetMaxPlayer(iMaxPlayer);
            this.Game.ProcessLocation(listPlayers, iMaxPlayer);

            this.Game.SetTableCard(listTableCard);
            this.Game.SetPlayerType(listPlayers);
            this.Game.SetPlayerLastBetting(listPlayers);
            // this.Game.receiveNewJackpotValue(iJackpot);
        });

        this.socket.on('SM_RejoinGame', (listPlayers, iMaxPlayer, iJackpot, objectMe, listTableCard) => {

            console.log(`###### SM_RejoinGame`);
            console.log(listPlayers);
            console.log(iJackpot);
            console.log(objectMe);
            console.log(listTableCard);

            //console.log(this.Game);
            this.Game.SetMaxPlayer(iMaxPlayer);
            this.Game.ProcessLocation(listPlayers, iMaxPlayer);

            // this.Game.receiveNewJackpotValue(iJackpot);
            //
            this.socket.strID = objectMe.strID;
            this.socket.iCoin = objectMe.iCoin;
            this.socket.iCash = objectMe.iCash;
            this.socket.iStartCash = objectMe.iStartCash;
            this.socket.iAvatar = objectMe.iAvatar;
            this.socket.eUserType = objectMe.eUserType;
            this.socket.strNickname = objectMe.strNickname;

            this.Game.bPlaying = true;
            listPlayers.push(objectMe);
            // this.Game.UpdateGameInfo(objectMe.strGameName, objectMe.iBlind);
            if(objectMe.iLocation != -1)
            {
                this.Game.ProcessLocationComplete(this.socket.strID, this.socket.strNickname, objectMe.iCoin, objectMe.iLocation, objectMe.iAvatar, objectMe.eUserType, objectMe.listHandCard);
            }
            // this.Game.UpdatePoint(parseInt(objectMe.iCoin));
            this.Game.SetPlayerType(listPlayers);
            this.Game.SetPlayerLastBetting(listPlayers);
            this.Game.SetTableCard(listTableCard);
        });

        //  Game
        this.socket.on('SM_SelectLocation', (objectData) => {

            console.log(`SM_SelectLocation ${objectData.eResult}, ${objectData.iLocation}`);
            //console.log(this.socket);
            console.log(objectData);

            if ( true == objectData.eResult )
            {
                this.Game.ProcessLocationComplete(this.socket.strID, objectData.strNickname, objectData.iCoin, objectData.iLocation, objectData.iAvatar, objectData.eUserType,[]);
                // this.Game.UpdatePoint(parseInt(objectData.iCash));
            }
        });

        this.socket.on('SM_Rejoin', (listPlayers, iMaxPlayer, objectData) => {


            console.log(`SM_Rejoin`);
            console.log(objectData);

            this.socket.strID = objectData.strID;
            this.socket.iCoin = objectData.iCoin;
            this.socket.iCash = objectData.iCash;

            // this.Game.UpdateGameInfo(objectData.strGameName, objectData.iBlind);
            //this.Game.UpdatePoint(parseInt(objectData.iCoin));

            this.Game.SetMaxPlayer(iMaxPlayer);
            this.Game.ProcessLocation(listPlayers, iMaxPlayer);
            this.Game.ProcessLocationComplete(this.socket.strID, this.socket.strNickname, objectData.iCoin, objectData.iLocation, objectData.iAvatar, objectData.eUserType, objectData.listHandCard);
            // this.Game.UpdatePoint(parseInt(objectData.iCash));
            this.Game.SetTableCard(objectData.listTableCard);
        })

        this.socket.on('SM_BroadcastJoinUser', (objectPlayer) => {

            console.log(`SM_BroadcastJoinUser`);
            console.log(objectPlayer);
        });

        this.socket.on('SM_BroadcastLeaveUser', (objectPlayer) => {

            console.log(`SM_BroadcastLeaveUser`);
            console.log(objectPlayer);

            this.Game.RemoveUser(objectPlayer);

            soundLeaveUser.play();
        });

        this.socket.on('SM_BroadcastPlaceUser', (objectPlayer) => {

            console.log(`SM_BroadcastPlaceUser`);
            console.log(objectPlayer);

            this.Game.ProcessLocationSingle(objectPlayer);

            soundPlaceUser.play();
        });

        // this.socket.on('SM_FullBroadcastPlaceUser', (objectPlayer) => {

        //     console.log(`SM_FullBroadcastPlaceUser`);
        //     console.log(objectPlayer);

        //     //this.Game.ProcessLocationSingle(objectPlayer);
        //     this.Game.ProcessLocationComplete(this.socket.strID, objectPlayer.iCoin, objectPlayer.iLocation);
        // });

        this.socket.on('SM_EnableStartGame', () => {

            console.log(`SM_EnableStartGame`);

            //this.Game.listButtons[1].bEnable = true;
            this.Game.listButtons[0].bEnable = true;

            soundEnableStartGame.play();
        });

        this.socket.on('SM_FullBroadcastExit', (objectData) => {
            console.log(`SM_FullBroadcastExit`);
            this.Game.SetPlayerExit(objectData);
        });

        this.socket.on('SM_ChatSend', (tag) => {

            console.log(`SM_ChatSend`);
            console.log(tag.tag.tag);

            var chatElement = $('#chat');
            chatElement.append(tag.tag.tag);
            soundClick.play();

            chatElement.scrollTop(chatElement.prop("scrollHeight"));
        });

        this.socket.on('SM_ChangeOptionCode', (objectData) => {

            console.log(`SM_ChangeOptionCode`);
            console.log(objectData);

            this.Game.SetBg(objectData.strOptionCode);

            soundClick.play();
        });

        this.socket.on('SM_ChatClose', () => {

            console.log(`SM_ChatClose`);
            this.Game.bEnableChat = false;
        });
        
        this.socket.on('SM_ChatOpen', () => {
                    
            console.log(`SM_ChatOpen`);
            this.Game.bEnableChat = true;
        });

        this.socket.on('SM_MenuClose', () => {

            console.log(`SM_MenuClose`);
            this.Game.bEnableMenu = false;
        });
        
        this.socket.on('SM_MenuOpen', () => {
                    
            console.log(`SM_MenuOpen`);
            this.Game.bEnableMenu = true;
        });

        this.socket.on('SM_StartGame', (objectData) => {
            
            //console.log(`SM_StartGame : eResult : ${objectData.eResult}`);
            console.log(objectData.listUser);
            this.Game.EnableUserList(objectData.listUser);

            this.Game.StartGame();

            soundGameStart.play();
        });

        this.socket.on('SM_JackPot', (objectData) => {
            
            console.log(`SM_JackPot`);
            console.log(objectData);
            if(objectData.iJackpotLevel == 1)
            {
                soundJackpot1.play();
            }
            else if(objectData.iJackpotLevel == 2)
            {
                soundJackpot2.play();
            }
            else if(objectData.iJackpotLevel == 3)
            {
                soundJackpot3.play();
            }
            this.Game.SetJackpot(objectData.iAmount, objectData.iJackpotRound, objectData.jackpotInfo);
        });

        this.socket.on('SM_FullBroadcastShowCard', (objectData) => {
            
            console.log(`SM_FullBroadcastShowCard : objectDatacard : ${objectData.iCard1},${objectData.iCard2}`);

            this.Game.ShowCard(objectData);

            soundClick.play();
        });
        
        this.socket.on('SM_HandName', () => {
            
            console.log(`SM_HandName`);
            console.log(this.socket.strID);

            this.Game.UpdateStrHandName();

            soundClick.play();
        });

        this.socket.on('SM_FullBroadcastPlayerType', (listData) => {

            console.log(`SM_FullBroadcastPlayerType`);
            console.log(listData);

            this.Game.SetPlayerType(listData);
        });

        this.socket.on('SM_DefaultAnteSB', (objectData) => {

            console.log(`SM_DefaultAnteSB`);
            console.log(objectData);

            this.socket.emit('CM_DefaultAnteSB', objectData);

            this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            //this.Game.UpdatePot(objectData.listPots);
        });
        
        this.socket.on('SM_DefaultAnte', (listPlayers,iTotalBettingCoin) => {

            console.log(`SM_DefaultAnte`);
            console.log(listPlayers);
            console.log(iTotalBettingCoin);

            this.Game.SetDefaultAnte(listPlayers);
            //this.Game.SetPlayerBetting(objectPlayer.strID, objectPlayer.iCoin, objectPlayer.iBettingCoin, '');
            this.Game.UpdateTotalBettingCoin(iTotalBettingCoin);
            //this.Game.UpdatePot(objectData.listPots);

            soundGameStart2.play();
        });

        this.socket.on('SM_BroadcastDefaultAnteSB', (objectData) => {

            console.log(`SM_BroadcastDefaultAnteSB`);
            console.log(objectData);

            this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            //this.Game.UpdateCallCoin(objectData.iCallAmount);
            //this.Game.UpdatePot(objectData.listPots);
        });

        this.socket.on('SM_DefaultAnteBB', (objectData) => {

            console.log(`SM_DefaultAnteBB`);
            console.log(objectData);

            this.socket.emit('CM_DefaultAnteBB', objectData);

            //this.Game.UpdateTotalBettingCoin(objectData.iCoin);
            this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            //this.Game.UpdatePot(objectData.listPots);
        });

        this.socket.on('SM_BroadcastDefaultAnteBB', (objectData) => {

            console.log(`SM_BroadcastDefaultAnteBB`);
            console.log(objectData);

            //this.Game.UpdateTotalBettingCoin(objectData.iCoin);
            this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            //this.Game.UpdatePot(objectData.listPots);
        });

        this.socket.on('SM_EnableBetting', (objectData) => {

            //console.log(`SM_EnableBetting : Call ${objectData.iCallAmount}`);
            console.log(objectData.listEnableBettingType);

            this.Game.EnableBetting(objectData);
            this.Game.Focus(this.socket.strID, objectData.iBettingTime);

            soundEnableBetting.play();
        });

        this.socket.on('SM_ReserveBet', (bReserveBetStart,bReserveBet) => {
            console.log(`SM_ReserveBet : ${bReserveBetStart}, ${bReserveBet}`);
            
            if(bReserveBet == null)
            {
                this.Game.bReserveBetStart = bReserveBetStart;
                this.Game.bReserveBet = false;
            }
            else
            {
                this.Game.bReserveBetStart = bReserveBetStart;
                this.Game.bReserveBet = bReserveBet;
            }
            //this.Game.EnableReserveBet();
            soundClick.play();
        });

        this.socket.on('SM_CallAmoutUpdate', (iCallAmount) => {

            console.log(`SM_CallAmoutUpdate : Call ${iCallAmount}`);


            //soundEnableBetting.play();
        });
        

        this.socket.on('SM_Focus', (objectPlayer) => {

            console.log(`SM_Focus : ${objectPlayer.strID}`);
            
            this.Game.Focus(objectPlayer.strID, objectPlayer.iBettingTime);
        });

        this.socket.on('SM_Mode', (objectData) => {

            console.log(`SM_Mode : ${objectData.eMode}`);

            switch ( objectData.eMode )
            {
            case 'Standby':
                this.Game.Initialize();
                break;
            case 'PreFlop':
                this.Game.SetPreFlop();
                break;
            }
        });


        // this.socket.on('SM_Betting', (objectData) => {

        //     console.log(`SM_Betting : ${objectData.strBetting}`);

        //     this.Game.SetPlayerBetting(this.socket.strID, objectData.iCoin, objectData.iBettingCoin, objectData.strBetting);
        // });

        this.socket.on('SM_FullBroadcastBetting', (objectData) => {

            console.log(`SM_FullBroadcastBetting`);
            console.log(objectData);

            this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, objectData.strBetting);
            this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            this.Game.SetPlayerResponse(objectData.latency,objectData.strID);
            //this.Game.UpdatePot(objectData.listPots);
        });

        this.socket.on('SM_HandCard', (listCard, strHand, listPots) => {

            console.log(`SM_HandCard`);
            console.log(listCard);
            console.log(strHand);
            console.log(listPots);

            this.Game.SetHandCard(listCard, strHand);
            this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_FlopCard', (listCard, strHand, listPots, iRecentTotalBettingCoin, iTotalBettingCoin) => {

            console.log(`SM_FlopCard`);
            console.log(listCard);
            console.log(strHand);

            this.Game.SetFlopCard(listCard, strHand);
            if(iRecentTotalBettingCoin < iTotalBettingCoin)
            {
                this.Game.UpdatePot(listPots);
            }
        });

        this.socket.on('SM_TurnCard', (listCard, strHand, listPots, iRecentTotalBettingCoin, iTotalBettingCoin) => {

            console.log(`SM_TurnCard`);
            console.log(listCard);
            console.log(strHand);

            this.Game.SetTurnCard(listCard, strHand);
            if(iRecentTotalBettingCoin < iTotalBettingCoin)
            {
                this.Game.UpdatePot(listPots);
            }
        });

        this.socket.on('SM_RiverCard', (listCard, strHand, listPots, iRecentTotalBettingCoin, iTotalBettingCoin) => {

            console.log(`SM_RiverCard`);
            console.log(listCard);
            console.log(strHand);

            this.Game.SetRiverCard(listCard, strHand);
            if(iRecentTotalBettingCoin < iTotalBettingCoin)
            {
                this.Game.UpdatePot(listPots);
            }
        });

        this.socket.on('SM_Result', (listResult, listTableCard, listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser, listPots, roundUnique, iRecentTotalBettingCoin, iTotalBettingCoin) => {

            console.log(`SM_Result`);
            console.log(listResult);
            console.log(listTableCard);
            console.log(listWinCards);
            console.log(strWinnerHand);
            console.log(strWinnerDescr);
            console.log(cPlayingUser);
            console.log(listPots);

            let tag =``;
            var logElement = $('#output_log');
            let strNickname = '';
            //let cCash = 0;
            if(cPlayingUser == 1)
            {
                strNickname = listResult[0].strNickname;
                //cCash = parseInt(listResult[0].iCoin) + parseInt(listResult[0].iCash);
                if(listResult[0].iJackpot > 0)
                {
                    tag = `<p>${roundUnique}라운드 - ${listResult[0].strNickname} 기권승. 잭팟금액 : ${listResult[0].iJackpot}, 이긴 금액 : ${listResult[0].iWinCoin}</p><hr>`;
                }
                else {
                    tag = `<p>${roundUnique}라운드 - ${listResult[0].strNickname} 기권승. 이긴 금액 : ${listResult[0].iWinCoin}</p><hr>`;
                }
                logElement.append(tag);
            }
            else
            {
                for(let i in listResult)
                {
                    if(listResult[i].iRank == 1)
                    {
                        strNickname = listResult[i].strNickname;
                        //cCash = parseInt(listResult[i].iCoin) + parseInt(listResult[i].iCash);
                        if(listResult[i].iJackpot > 0)
                        {
                            tag = `<p style="display: flex; white-space: nowrap;">${roundUnique}라운드-${listResult[i].strNickname} 승리. 잭팟금액 : ${listResult[i].iJackpot}, 이긴 금액 : ${listResult[i].iWinCoin}, 핸드카드 : <img src = "img/cards/${"card"+String(listResult[i].iCard1).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listResult[i].iCard2).padStart(2, '0')}.png" width = "35" height = "70">, table card : <img src = "img/cards/${"card"+String(listTableCard[0]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[1]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[2]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[3]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[4]).padStart(2, '0')}.png" width = "35" height = "70"></p>`;
                        }
                        else
                        {
                            tag = `<p style="display: flex; white-space: nowrap;">${roundUnique}라운드-${listResult[i].strNickname} 승리. 이긴 금액 : ${listResult[i].iWinCoin}, 핸드카드 : <img src = "img/cards/${"card"+String(listResult[i].iCard1).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listResult[i].iCard2).padStart(2, '0')}.png" width = "35" height = "70">, table card : <img src = "img/cards/${"card"+String(listTableCard[0]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[1]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[2]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[3]).padStart(2, '0')}.png" width = "35" height = "70"> <img src = "img/cards/${"card"+String(listTableCard[4]).padStart(2, '0')}.png" width = "35" height = "70"></p>`;
                        }
                        logElement.append(tag);
                    }
                }
                logElement.append(`<hr>`);
            }
            //logElement.append(tag.tag.tag);

            logElement.scrollTop(logElement.prop("scrollHeight"));
            
            this.Game.ProcessResult(listResult, listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser);
            if(iRecentTotalBettingCoin < iTotalBettingCoin)
            {
                this.Game.UpdatePot(listPots);
            }

            //let objectData = {strNickname:strNickname,iAmount:cCash}

            //this.socket.emit('CM_Result', objectData);
            soundGameEnd.play();
            soundGameWin.play();
        });

        this.socket.on('SM_ResultUpdateCoin', (listResult, cPlayingUser) => {

            console.log(`SM_ResultUpdateCoin`);
            console.log(listResult);

            let strNickname = '';
            let cCash = 0;
            if(cPlayingUser == 1)
            {
                strNickname = listResult[0].strNickname;
                cCash = parseInt(listResult[0].iCoin) + parseInt(listResult[0].iCash);
            }
            else
            {
                for(let i in listResult)
                {
                    if(listResult[i].iRank == 1)
                    {
                        strNickname = listResult[i].strNickname;
                        cCash = parseInt(listResult[i].iCoin) + parseInt(listResult[i].iCash);
                    }
                }
            }

            let objectData = {strNickname:strNickname,iAmount:cCash}

            this.socket.emit('CM_Result', objectData);

            // soundGameEnd.play();
            // soundGameWin.play();
        });

        this.socket.on('SM_RebuyIn', (listObject) => {

            console.log(`SM_RebuyIn`);
            console.log(listObject);

            this.Game.ProcessRebuyIn(listObject);

            // soundGameEnd.play();
        });

        this.socket.on('SM_ShowDown',(listData) => {
            console.log(`SM_ShowDown`);
            //console.log(objectData);
            this.Game.ProcessShowDown();

            //soundShowDown.play();
        });

        this.socket.on('SM_ShowDownTurnCard',(listData) => {
            console.log(`SM_ShowDownTurnCard`);
            console.log(listData);

            this.Game.ProcessShowDownTurnCard(listData);

            soundPlaceCard.play();
        });

        this.socket.on('SM_Error', (objectError) => {

            console.log(`SM_Error`);

            console.log(objectError);
            if(objectError.error == 'NotEnoughCoin')
            {
                alert("보유머니가 충분하지 않습니다. 확인을 누르면 창이 닫힙니다.");
            }
            else
            {
                alert("서버와의 연결이 끊어졌습니다. 확인을 누르면 창이 닫힙니다.");
            }
            
            window.location.href = objectError.strLobbyAddress;
        });

        this.socket.on('SM_FullBroadcastEmoticon', (objectData) => {

            console.log(`SM_FullBroadcastEmoticon`);
            console.log(objectData);

            this.Game.SetPlayerEmoticon(objectData.strID, objectData.iEmoticon);
        });

        this.socket.on('SM_JackpotUpdate', (objectData) => {

            // console.log(`SM_JackpotUpdate`);
            // console.log(objectData);

            // this.Game.receiveNewJackpotValue(objectData.iJackpot);
        });
    }

    OnClick(mouse)
    {
        this.Game.OnClick(mouse);
    }

    OnMouseMove(mouse)
    {
        this.Game.OnMouseMove(mouse);
    }

    OnTouchStart(touch)
    {
        this.Game.OnTouchStart(touch);
    }

    OnTouchMove(touch)
    {
        this.Game.OnTouchMove(touch);
    }

    OnTouchEnd(touch)
    {
        this.Game.OnTouchEnd(touch);
    }

    OnMouseDown(mouse)
    {
        this.Game.OnMouseDown(mouse);
    }

    OnMouseUp(mouse)
    {
        this.Game.OnMouseUp(mouse);
    }

    OnTouchStart(mouse)
    {
        this.Game.OnTouchStart(mouse);
    }

    OnMouseLeave()
    {
        this.Game.OnMouseLeave();
    }
}