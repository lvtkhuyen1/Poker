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
        console.log(`IGameMain::Login ${account.strID}, ${account.strPassword}, Avatar : ${account.iAvatar}`);
        this.socket.emit('CM_Login', account.strID, account.strNickname, account.strPassword, account.iAvatar, account.eUserType);
    }

    JoinGame()
    {
        console.log(`CM_Join`);
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
        this.socket.on('SM_RequestLogin', () => {

            console.log(`SM_RequestLogin`);

            this.Login();
        });

        this.socket.on('SM_Login', (data) => {
           
            console.log(`SM_Login`);
            console.log(data);
            this.socket.strID = data.strID;
            this.socket.iCoin = data.iCoin;
            this.socket.iAvatar = data.iAvatar;

        });

        this.socket.on('SM_EnterGame', (data) => {

            console.log('SM_EnterGame');
            console.log(data);

            this.socket.strID = data.strID;
            this.socket.iCoin = data.iCoin;
            this.socket.iCash = data.iCash;

            this.Game.UpdateGameInfo(data.strGameName, data.iBlind);
            console.log(data.iCoin);
            this.Game.UpdatePoint(parseInt(data.iCoin));
        });

        this.socket.on('SM_LeaveGame', (data) => {

            console.log('SM_LeaveGame');
            console.log(data);

            if ( data.result == 'OK' )
            {
                this.Game.Initialize();
                window.close();
                window.opener.reload();
            }
        });

        this.socket.on('SM_JoinUser', (user) => {

        });

        this.socket.on('SM_JoinGame', (listPlayers, iMaxPlayer) => {

            console.log(`SM_JoinGame`);
            console.log(listPlayers);

            //console.log(this.Game);
            this.Game.SetMaxPlayer(iMaxPlayer);
            this.Game.ProcessLocation(listPlayers);
        });

        //  Game
        this.socket.on('SM_SelectLocation', (objectData) => {

            console.log(`SM_SelectLocation ${objectData.eResult}, ${objectData.iLocation}`);
            console.log(objectData);
            if ( true == objectData.eResult )
            {
                let cCoin = objectData.iCoin - objectData.iDefaultCoin;
                this.Game.ProcessLocationComplete(this.socket.strID, objectData.strNickname, objectData.iScore, objectData.iLocation, objectData.iAvatar, objectData.eUserType,[]);
                this.Game.UpdatePoint(parseInt(cCoin));
                this.Game.SetPlayerFee(this.socket.strID, objectData.iDefaultCoin);
            }
        });

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

        this.socket.on('SM_FullBroadcastFoldUser', (listData) => {

            console.log(`SM_FullBroadcastFoldUser`);

            this.Game.SetPlayerFold(listData);
            //soundLeaveUser.play();
        });
        // this.socket.on('SM_FullBroadcastPlaceUser', (objectPlayer) => {

        //     console.log(`SM_FullBroadcastPlaceUser`);
        //     console.log(objectPlayer);

        //     //this.Game.ProcessLocationSingle(objectPlayer);
        //     this.Game.ProcessLocationComplete(this.socket.strID, objectPlayer.iCoin, objectPlayer.iLocation);
        // });
        this.socket.on('SM_EnableReadyGame', () => {

            console.log(`SM_EnableReadyGame`);

            //this.Game.listButtons[1].bEnable = true;
            
            this.Game.SetReadyButton(this.socket.strID);
            
            //this.Game.listButtons[1].bEnable = true;

            //soundEnableStartGame.play();
        });

        this.socket.on('SM_DisableStartGame', () => {

            console.log(`SM_DisableStartGame`);

            //if()
            //this.Game.listButtons[1].bEnable = true;
            this.Game.listButtons[0].bEnable = false;
            this.Game.SetPlayerStart(this.socket.strID);
            //soundEnableStartGame.play();
        });

        this.socket.on('SM_ChatSend', (tag) => {

            console.log(`SM_ChatSend`);
            console.log(tag.tag.tag);

            var chatElement = $('#chat');
            chatElement.append(tag.tag.tag);
            soundClick.play();

            // ä�� ����� ��ũ�� ��ġ�� ���� �Ʒ��� ����
            chatElement.scrollTop(chatElement.prop("scrollHeight"));
        });

        this.socket.on('SM_Exit', () => {

            console.log(`SM_ChatClose`);
            this.Game.SetPlayerExit(this.socket.strID);
        });

        this.socket.on('SM_ChatClose', () => {

            console.log(`SM_ChatClose`);
            this.Game.bEnableChat = false;
        });
        
        this.socket.on('SM_ChatOpen', () => {
                    
            console.log(`SM_ChatOpen`);
            this.Game.bEnableChat = true;
        });

        this.socket.on('SM_EnableStartGame', () => {

            console.log(`SM_EnableStartGame`);

            //if()
            this.Game.listButtons[1].bEnable = false;
            this.Game.listButtons[0].bEnable = true;

            soundEnableStartGame.play();
        });

        this.socket.on('SM_StartGame', (iPrize) => {
            
            console.log(`SM_StartGame!! `);
            console.log(iPrize);
            //this.Game.EnableUserList(objectData.listUser);

            this.Game.StartGame(iPrize);

            soundGameStart.play();
        });

        this.socket.on('SM_StartBig2', (objectData) => {
            
            console.log(`SM_StartBig2 : eResult : ${objectData.eResult}`);
            console.log(objectData.listUser);
            this.Game.EnableUserList(objectData.listUser);
            this.Game.bBig2Start = true;
            this.socket.emit('CM_StartBig2');
        });

        this.socket.on('SM_RejoinGame', (listPlayers, iMaxPlayer, objectMe, listTableCard, strRecentPlayerID) => {

            console.log(`###### SM_RejoinGame`);
            console.log(listPlayers);
            console.log(objectMe);
            console.log(listTableCard);

            //console.log(this.Game);
            this.Game.SetMaxPlayer(iMaxPlayer);
            this.Game.ProcessLocation(listPlayers, iMaxPlayer);
            //
            this.socket.strID = objectMe.strID;
            this.socket.iCoin = objectMe.iCoin;
            this.socket.iCash = objectMe.iCash;
            this.socket.iAvatar = objectMe.iAvatar;
            this.socket.eUserType = objectMe.eUserType;
            this.socket.strNickname = objectMe.strNickname;
            this.socket.iScore = objectMe.iScore;

            this.Game.bPlaying = true;
            listPlayers.push(objectMe);
            this.Game.UpdateGameInfo(objectMe.strGameName, objectMe.iBlind);
            if(objectMe.iLocation != -1)
            {
                this.Game.ProcessLocationComplete(this.socket.strID, this.socket.strNickname, objectMe.iScore, objectMe.iLocation, objectMe.iAvatar, objectMe.eUserType, objectMe.listHandCard);
            }
            this.Game.UpdatePoint(parseInt(objectMe.iCoin));
            this.Game.SetPlayerType(listPlayers);
            this.Game.SetPlayerLastBetting(listPlayers);
            this.Game.SetTableCard(strRecentPlayerID, listTableCard);
            this.Game.SetHandCard(objectMe.listHandCard);
            this.Game.SetRejoin(objectMe, listPlayers);
        });

        this.socket.on('SM_FullBroadcastLeaveLocation', () => {
            
            console.log(`SM_FullBroadcastLeaveLocation`);
            //console.log(objectData.listUser);
            //this.Game.EnableUserList(objectData.listUser);

            this.Game.ProcessLocationLeave();
            //soundGameStart.play();
            soundLeaveUser.play();
        })

        this.socket.on('SM_FullBroadcastPlayerReady', (listData) => {

            console.log(`SM_FullBroadcastPlayerReady`);
            console.log(listData);

            this.Game.SetPlayerReady(listData);
        });

        this.socket.on('SM_FullBroadcastPlayerType', (listData) => {

            console.log(`SM_FullBroadcastPlayerType`);
            console.log(listData);

            this.Game.SetPlayerType(listData);
            this.Game.SetSortCard();
        });

        this.socket.on('SM_FullBroadcastBetting', (listData) => {

            console.log(`SM_FullBroadcastBetting`);
            console.log(listData);

            this.Game.SetPlayerBetting(listData);
            //this.Game.UpdateTotalBettingCoin(listData.iTotalBettingCoin);
        });

        this.socket.on('SM_EnableSubmitCard', (objectData) => {

            console.log(`SM_EnableSubmitCard : iBettingTime ${objectData.iBettingTime}`);
            console.log(`SM_EnableSubmitCard : nextPlayer.listHandcard ${objectData.nPlayerHandCard}`);
            //console.log(objectData.listEnableBettingType);

            this.Game.EnableBetting(this.socket.strID, objectData);
            this.Game.Focus(this.socket.strID, objectData.iBettingTime);
            //this.Game.bSort = true;

            soundEnableBetting.play();
        });

        this.socket.on('SM_Focus', (objectPlayer) => {

            console.log(`SM_Focus : ${objectPlayer.strID}`);
            
            this.Game.Focus(objectPlayer.strID, objectPlayer.iBettingTime);
        });

        this.socket.on('SM_Mode', (objectData) => {

            console.log(`SM_Mode : ${objectData.eMode}`);
            //console.log(this.socket);
            //console.log(objectData.bFold);
            //this.Game.SetPlayerFold(this.socket.strID,objectData.bFold);
            switch ( objectData.eMode )
            {
            case 'Standby':
                this.Game.Initialize();
                break;
            case 'PrizeResult':
                this.Game.bPrizeResult = true;
                this.Game.bWin = false;
                break;
            case 'GameInit':
                this.Game.GameInit();
                break;
            }
        });


        // this.socket.on('SM_Betting', (objectData) => {

        //     console.log(`SM_Betting : ${objectData.strBetting}`);

        //     this.Game.SetPlayerBetting(this.socket.strID, objectData.iCoin, objectData.iBettingCoin, objectData.strBetting);
        // });

        this.socket.on('SM_FullBroadcastSubmit', (objectData) => {

            console.log(`SM_FullBroadcastSubmit`);
            console.log(objectData);

            //this.Game.SetPlayerTurn(objectData.strID, objectData.strBetting, objectData.listCards);
            this.Game.SetPlayerBettingDelete();
            this.Game.SetTableCard(objectData.strID, objectData.list);
            this.Game.SetPlayerTurn(objectData.strID, objectData.strBetting, objectData.list);
            if(objectData.bpass == true)
            {
                this.Game.SetTableReset();
            }
            //this.Game.SetTableCard(objectData.listCards);
            //this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
            if(objectData.strBetting == 'Pass')
            {
                soundPass.play();
            }
        });

        this.socket.on('SM_HandCard', (listCard, listPots) => {

            console.log(`SM_HandCard`);
            console.log(listCard);
            console.log(listPots);

            this.Game.SetHandCard(listCard);
            this.Game.UpdateTotalBettingCoin();
            //this.Game.SetSortCard();
            this.Game.bSort = true;
        });

        this.socket.on('SM_Result', (listResult, cPlayingUser, bSetGame) => {

            console.log(`SM_Result`);
            //let tag = `${listResult.}`;
            //$('#game_log').append();
            
            this.Game.ProcessResult(listResult, cPlayingUser, bSetGame);
            this.Game.bSort = false;
            
            soundGameWin.play();
        });

        this.socket.on('SM_ResultPrize', (objectPlayer) => {

            console.log(`SM_ResultPrize`);
            console.log(objectPlayer);

            let objectData = {strID:objectPlayer.strID, strNickname:objectPlayer.strNickname, iAmount:objectPlayer.iAmount}

            this.Game.UpdatePoint(parseInt(objectPlayer.iAmount));
            this.socket.iCoin = objectPlayer.iAmount;
            this.Game.SetPrizeResult(objectPlayer.iPrize)
            console.log(objectPlayer.iAmount);
            this.socket.emit('CM_Result', objectData);
            console.log(`CM_Result`);
            soundGameWin.play();
        });

        this.socket.on('SM_GameLog', (objectPrize) => {

            console.log(`SM_GameLog`);
            console.log(objectPrize);
            var logElement = $('#output_log');
            const strNickname = objectPrize.strNickname;
            let tag = `<p>${objectPrize.roundUnique}round - ${strNickname} Win. Prize : ${objectPrize.iPrize}</p><hr>`;
            logElement.append(tag);

            logElement.scrollTop(logElement.prop("scrollHeight"));

            soundGameWin.play();
        });

        this.socket.on('SM_RebuyIn', (listObject) => {

            console.log(`SM_RebuyIn`);
            console.log(listObject);

            this.Game.ProcessRebuyIn(listObject);

            soundGameEnd.play();
        });

        this.socket.on('SM_Error', (objectError) => {

            console.log(`SM_Error`);

            console.log(objectError);

        });

        this.socket.on('SM_FullBroadcastEmoticon', (objectData) => {

            console.log(`SM_FullBroadcastEmoticon`);
            console.log(objectData);

            this.Game.SetPlayerEmoticon(objectData.strID, objectData.iEmoticon);
        });

        this.socket.on('SM_FullBroadcastExit', (objectData) => {
            console.log(`SM_FullBroadcastExit`);
            this.Game.SetPlayerExit(objectData);
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

    OnTouchMove(mouse)
    {
        this.Game.OnTouchMove(mouse);
    }

    // OnMouseLeave()
    // {
    //     this.Game.OnMouseLeave();
    // }
}