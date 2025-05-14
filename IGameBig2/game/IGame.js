// let ISocketList = require('./ISocketList');
let IUser = require('./IUser');
let IUserList = require('./IUserList');
let E = require('./IEnum');
let db = require('../db');

let big2solver = require('./IBig2Solver');

class IGame
{
    //constructor(strGameName, iDefaultCoin)
    constructor(strGameName, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers)
    {
        this.listUsers = new IUserList();
        this.strGameName = strGameName;
        this.eGameType = eGameType;
        this.strPassword = strPassword;//New
        this.iDefaultCoin = iDefaultCoin;
        this.iPrize = 0;
        //this.iBuyIn = iBuyIn;//New
        this.iBettingTime = iBettingTime;//New
        this.eGameMode = E.EGameMode.Standby;
        this.iElapsedTime = 0;
        this.lUnique = Math.floor(Math.random()*100000);

        do {
            this.lUnique = Math.floor(Math.random() * 100000);
        } while (globalUniqueNumbers.has(this.lUnique));
    
        // Register the unique number
        globalUniqueNumbers.add(this.lUnique);

        this.cMinEnablePlayer   = 2;
        //this.cMaxPlayer = 9;
        this.cMaxPlayer = iMaxPlayers;//New
        this.iDealerIndex = -1;
        this.iBettingLocationLast = -1;
        this.iDealerLocationLast = -1;
        
        this.iRecentPlayersBettingCoin = 0;
        this.iTotalBettingCoin = 0;

        this.listCardDeck = [];
        this.iCurrentDeckIndex = 0;
        this.listTableCard = [];

        this.listEnableBettingType = [];

        this.listPots = [];

        this.listWinCards = [];

        this.listDBUpdate = [];

        this.listReservationMode = [];
        this.iDelayTime = 0;

        this.bNewGame = true;
        this.bBig2Start = false;
        this.bSetGame = false;
        this.bBetting = false;
        this.bResult = false;
        this.iPasscount = 0;
        this.dealerLocation = 0;

        this.roundUnique = '';
        this.iRound = 0;

        this.strRecentPlayerID = '';
        this.strCurrentBettingPlayerID = '';
    }

    async GetOdds(strID)
    {
        let user = await db.Users.findOne({ where: { strID: strID } });

        const [list] = await db.sequelize.query(
        `SELECT  t1.fBig2R AS fAdminR,
        t1.strID as strAdminID,
        t2.fBig2R AS fPAdminR,
        t2.strID as strPAdminID,
        t3.fBig2R AS fVAdminR,
        t3.strID as strVAdminID,
        t4.fBig2R AS fAgentR,
        t4.strID as strAgentID,
        t5.fBig2R AS fShopR,
        t5.strID as strShopID,
        t6.fBig2R AS fUserR,
        t6.strID as strUserID

        FROM Users AS t1
        LEFT JOIN Users AS t2 ON t2.iParentID = t1.id
        LEFT JOIN Users AS t3 ON t3.iParentID = t2.id
        LEFT JOIN Users AS t4 ON t4.iParentID = t3.id
        LEFT JOIN Users AS t5 ON t5.iParentID = t4.id
        LEFT JOIN Users AS t6 ON t6.iParentID = t5.id
        WHERE t6.strID='${strID}';`);

        let object = {fAdmin:0, fPAdmin:0, fVAdmin:0, fAgent:0, fShop:0, fUser:0,strAdminID:'', strPAdminID:'', strVAdminID:'', strAgentID:'', strShopID:'', strUserID:strID, eUserType:user.eUserType, strGroupID:user.strGroupID};
        if ( list.length > 0 )
        {
            object = {
                fAdmin: list[0].fAdminR - (list[0].fPAdminR > 0 ? list[0].fPAdminR : 0), 
                fPAdmin: list[0].fPAdminR - (list[0].fVAdminR > 0 ? list[0].fVAdminR : 0), 
                fVAdmin: list[0].fVAdminR - (list[0].fAgentR > 0 ? list[0].fAgentR : 0),
                fAgent: list[0].fAgentR - (list[0].fAgentR > 0 ? list[0].fShopR : 0),
                fShop:list[0].fShopR-list[0].fUserR,
                fUser:list[0].fUserR,
                strAdminID:list[0].strAdminID,
                strPAdminID:list[0].strPAdminID,
                strVAdminID:list[0].strVAdminID,
                strAgentID:list[0].strAgentID,
                strShopID:list[0].strShopID,
                strUserID:list[0].strUserID,
                eUserType:user.eUserType, 
                strGroupID:user.strGroupID
            };
        }
        return object;
    }

    async UpdateDB()
    {
        //for ( let i in this.listDBUpdate )
        for ( let i = 0; i < this.listDBUpdate.length; ++ i )
        {
            const element = this.listDBUpdate[i];

            if ( element.iProcessingID == this.iProcessingID )
                return;

            this.iProcessingID = element.iProcessingID;

            //console.log(`IGame: dbUpdate element : `);
            //console.log(element);
             // Check if element is not undefined
            if (!element) {
                console.error('Encountered undefined element in listDBUpdate at index: ' + i);
                continue; // Skip to the next iteration
            }
            try{
                switch ( element.iDB )
                {
                case E.EDBType.Users:
                    switch ( element.iSubDB )
                    {
                    case E.EUserDBType.UpdateCash:
                        await db.Users.update({iCash:element.iCash}, {where:{strID:element.strID}});
                        this.listDBUpdate.splice(i, 1);
                        -- i;
                        break;
                    case E.EUserDBType.UpdateRolling:
                        {
                            await db.Users.update({iCash:element.iCash}, {where:{strID:element.strID}});
                            //싯앤고 처음 참가비 낼때 딜비 계산
                            const cID = element.strID;
                            const cAmount = parseFloat(element.iAmount);
                                
                            let odds = await this.GetOdds(cID);
                            const cRollingAdmin = parseInt(odds.fAdmin * cAmount * 0.01);
                            const cRollingPAdmin = parseInt(odds.fPAdmin * cAmount * 0.01);
                            const cRollingVAdmin = parseInt(odds.fVAdmin * cAmount * 0.01);
                            const cRollingAgent = parseInt(odds.fAgent * cAmount * 0.01);
                            const cRollingShop = parseInt(odds.fShop * cAmount * 0.01);
                            const cRollingUser = parseInt(odds.fUser * cAmount * 0.01);

                            await db.Rollings.create({
                                strID:cID,
                                iClass:5,
                                strGroupID:odds.strGroupID,
                                iAmount:cAmount,
                                iWinCoin:0,
                                iRollingAdmin:cRollingAdmin,
                                iRollingPAdmin:cRollingPAdmin,
                                iRollingVAdmin:cRollingVAdmin,
                                iRollingAgent:cRollingAgent,
                                iRollingShop:cRollingShop,
                                iRollingUser:cRollingUser,
                                eGameType:this.eGameType
                            });
                            await db.Users.increment({ iRolling: cRollingAdmin }, { where: { strID: odds.strAdminID } });
                            await db.Users.increment({ iRolling: cRollingPAdmin }, { where: { strID: odds.strPAdminID } });
                            await db.Users.increment({ iRolling: cRollingVAdmin }, { where: { strID: odds.strVAdminID } });
                            await db.Users.increment({ iRolling: cRollingAgent }, { where: { strID: odds.strAgentID } });
                            await db.Users.increment({ iRolling: cRollingShop }, { where: { strID: odds.strShopID } });
                            await db.Users.increment({ iRolling: cRollingUser }, { where: { strID: odds.strUserID } });
                        }
                        this.listDBUpdate.splice(i, 1);
                        -- i;
                        break;
                    }
                    break;
                case E.EDBType.RecodrdGames:
                    switch ( element.iSubDB )
                    {
                        case E.ERecordResultBType.Create:
                        {
                            await db.ResultBig2s.create({lUnique:element.lUnique, iRound:element.roundUnique, strWinner:element.strWinner, strDesc:element.strDesc, strStartCoin:element.strStartCoin, strHand:element.strHand, strTablecard:element.strTablecard, iJackpot:element.iJackpot, eGameType:this.eGameType});
                            this.listDBUpdate.splice(i, 1);
                            -- i;
                            break;
                        }
                        case E.ERecordResultBType.PrizeCreate:
                        {
                            await db.ResultBig2s.create({lUnique:element.lUnique, iRound:element.roundUnique, strWinner:element.strWinner, strDesc:element.strDesc, strStartCoin:element.strStartCoin, strHand:element.strHand, strTablecard:element.strTablecard, iJackpot:element.iJackpot, eGameType:this.eGameType});
                            this.listDBUpdate.splice(i, 1);
                            -- i;
                            break;
                        }
                    }
                    break;
                }
            }
            catch(error)
            {
                console.error('Error updating DB for element:', element, error);
            }
        }
    }

    GetProcessingID()
    {
        let timePart = new Date().getTime();
        let randomPart = Math.floor(Math.random() * 10000);
        return `${timePart}${randomPart}`;
    }

    Initialize()
    {
        this.iRecentPlayersBettingCoin = 0;
        this.strRecentPlayerID = '';
        this.strCurrentBettingPlayerID = '';

        this.listCardDeck = [];
        this.iCurrentDeckIndex = 0;
        this.listTableCard = [];
        this.listWinCards = [];

        this.listReservationMode = [];
        this.iDelayTime = 0;
        
        // this.bSetGame = false;
        // this.bBetting = false;
        // this.bResult = false;
        this.iPasscount = 0;

        this.bNewGame = true;
        let player = [];

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            player = this.listUsers.GetUser(i);

            //player.iTotalBettingCoin = 0;
            //player.iBettingCoin = 0;
            player.iStartCoin = player.iCoin;
            player.strLastBettingAction = '';
            player.listHandCard = [];
            player.strHand = '';
            //player.iWinCoin = 0;
            player.iRank = 4;
            //player.bSpectator = false;
            player.strDescr = '';
            player.bMenualRebuyin = false;
            player.bShowReady = false;
            player.bShowStart = false;
            if(this.bSetGame == false)
            {
                console.log("bsetgame false !!!!!!!!!!!!!!!!!!!!!!");
                player.bReady = false;
                player.bBig2Play = false;
                player.bFold = false;
                player.iScore = 0;
            }
            if(this.GetScoreUserCount() > 0)
            {
                if(player.bSpectator == true)
                {

                    console.log(`getscoreusercount!!!!!!!!! : ${player.strID}, ${player.bSpectator}`)
                    player.bFold = true;
                }
            }
            else 
            {
                player.bSpectator = false;
            }

            player.socket.emit('SM_Mode', {eMode:'Standby', bFold:player.bFold});
        }
    }

    Join(objectUserData)
    {
        console.log(`IGame::Join ${objectUserData.strID}, ${objectUserData.strNickname}, Length : ${this.listUsers.GetLength()}`);
        let user = new IUser(objectUserData.socket);

        let listPlayers = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const cUser = this.listUsers.GetUser(i);

            if ( cUser.strID == objectUserData.strID )
                continue;

            let objectPlayer = {
                strID:cUser.strID, 
                strNickname:cUser.strNickname, 
                iCoin:cUser.iCoin,
                iScore:cUser.iScore, 
                iLocation:cUser.iLocation, 
                iAvatar:cUser.iAvatar, 
                eUserType:cUser.eUserType,
                strPlayerType:cUser.strPlayerType,
                strLastBettingAction:cUser.strLastBettingAction,
                listHandCard:cUser.listHandCard
            };
            listPlayers.push(objectPlayer);
            user.iStartCoin = cUser.iCoin;
            if(i == 1) user.bNewPlaying = false;
            else user.bNewPlaying = true;
        }

        user.strID = objectUserData.strID;
        user.strNickname = objectUserData.strNickname;
        user.iAvatar = objectUserData.iAvatar;
        user.eStage = 'GAME';
        user.lUnique = this.lUnique;
        user.iLocation = -1;
        user.iTotalBettingCoin = 0;
        user.iBettingCoin = 0;
        user.listHandCard = [];
        user.listTipCard = [];
        user.strDescr = '';
        user.iWinCoin = 0;
        user.iRank = 4;
        user.bEnable = false;
        user.iBlind = this.iDefaultCoin;
        user.bSpectator = true;
        user.iScore = 0;
        user.bFold = false;
        user.iStartCoin = objectUserData.iCoin;
        user.bReady = false;
        user.bBig2Play = false; 
        user.bShowReady = false;
        user.bShowStart = false;

        user.eUserType = objectUserData.eUserType;
        user.strGroupID = objectUserData.strGroupID;
        user.iClass = objectUserData.iClass;
        user.strOptionCode = objectUserData.strOptionCode;
        user.iCoin = objectUserData.iCoin;

        // let cCoin = (parseInt(objectUserData.iBuyIn)*parseInt(this.iDefaultCoin));
        // let cCash = parseInt(objectUserData.iCoin)-cCoin;
        // if(this.iDefaultCoin == 1000)
        // {
        //     if(cCash < 0)
        //     {
        //         cCoin = parseInt(objectUserData.iCoin);
        //         cCash = 0;
        //     }
        // }
        // user.iCoin = cCoin;
        // user.iCash = cCash;
        
        this.AddUser(user);

        user.socket.emit('SM_JoinGame', listPlayers , this.cMaxPlayer);

        this.BroadcastJoinUser(user);
    }

    Rejoin(strID, socket)
    {
        let listPlayers = [];
        console.log("IGame::Rejoin : ");
        let objectMe = {strID:'', 
                        strNickname:'', 
                        iCoin:0, 
                        iLocation:-1, 
                        iAvatar:0, 
                        eUserType:'',
                        bSpectator:false,
                        strPlayerType:'',
                        iScore:0,
                        strLastBettingAction:'',
                        strOptionCode:'',
                        listHandCard:[], 
                        iBlind:this.iDefaultCoin,
                        strGameName:this.strGameName};

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {       
            let cUser = this.listUsers.GetUser(i);
            console.log(cUser.iCoin);
            if ( cUser.strID == strID )
            {
                cUser.socket = socket;
                cUser.bConnection = true;

                objectMe.strID = cUser.strID;
                objectMe.strNickname = cUser.strNickname;
                objectMe.iCoin = cUser.iCoin;
                objectMe.iLocation = cUser.iLocation;
                objectMe.iAvatar = cUser.iAvatar;
                objectMe.eUserType = cUser.eUserType;
                objectMe.bSpectator = cUser.bSpectator;
                objectMe.strPlayerType = cUser.strPlayerType;
                objectMe.iScore = cUser.iScore;
                objectMe.strLastBettingAction = cUser.strLastBettingAction;
                objectMe.strOptionCode = cUser.strOptionCode;
                objectMe.bFold = cUser.bFold;
                objectMe.bBig2Play = cUser.bBig2Play;
                for ( let c in cUser.listHandCard )
                    objectMe.listHandCard.push(cUser.listHandCard[c]);
            }
        }         

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let cUser = this.listUsers.GetUser(i);
            if(cUser.strID == strID) continue;
            let listHandCard = [];
            if(this.eGameMode != 0)
            {
                for ( let c in cUser.listHandCard ){
                    if(objectMe.strOptionCode[3] == 1)
                    {
                        listHandCard.push(52);
                    }
                    else
                    {
                        listHandCard.push(53);
                    }
                }
            }
            
            let objectPlayer = {
                strID:cUser.strID, 
                strNickname:cUser.strNickname, 
                iCoin:cUser.iCoin, 
                iScore:cUser.iScore,
                iLocation:cUser.iLocation, 
                iAvatar:cUser.iAvatar, 
                eUserType:cUser.eUserType,
                strPlayerType:cUser.strPlayerType,
                strLastBettingAction:cUser.strLastBettingAction,
                listHandCard:listHandCard,
                bFold:cUser.bFold,
                bBig2Play:cUser.bBig2Play
            };
            listPlayers.push(objectPlayer);
        }

        let listTableCard = this.listTableCard;
        
        console.log(this.listTableCard);
        console.log(this.strRecentPlayerID);

        socket.emit('SM_RejoinGame', listPlayers , this.cMaxPlayer, objectMe, listTableCard,  this.strRecentPlayerID);
    }

    GetNumConnetion()
    {
        let count = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if(this.listUsers.GetUser(i).bConnection == false)
            {
                count++;
            }
        }
        let num = parseInt(this.listUsers.GetLength()) - parseInt(count);
        return num;
    }

    LeaveSetting(user)
    {
        if ( this.eGameMode == E.EGameMode.SubmitCard )
        {
            if ( this.strCurrentBettingPlayerID != '' )
            {
                console.log(`IGame::LeaveSetting (BetUser : ${this.strCurrentBettingPlayerID}), (LeaveUser : ${user.strID})`);
                if ( this.strCurrentBettingPlayerID == user.strID )
                {
                    if(user.listTipCard.length == 0)
                    {
                        const objectBetting = {strBetting:'Pass', list:[]};
                        this.ProcessSubmit(user, objectBetting);
                    }
                    else
                    {
                        let tip = user.listTipCard[user.listTipCard.length - 1];
                        let list = [];
                        for (let i = 0; i < tip.cards.length; i++) {
                            list.push({ index: tip.cards[i] });
                        }
                        const objectBetting = {strBetting:'Submit', list:list};
                        this.ProcessSubmit(user, objectBetting);
                    }
                }
            }
        }
        return this.GetNumConnetion();
    }

    Leave(user)
    {
        return this.RemoveUser(user);
    }

    GetNumUsers()
    {
        return this.listUsers.GetLength();
    }

    GetEnableUserList()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if ( player.iLocation != -1 && player.bEnable == true && player.strLastBettingAction != 'Fold' )
                list.push(player.strID);
        }
        return list;
    }

    GetGameUserList()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if ( player.iLocation != -1 && player.bEnable == true && player.bSpectator == false)
                list.push(player.strID);
        }
        return list;
    }

    GetScoreUserCount()
    {
        let count = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++i)
        {
            const player = this.listUsers.GetUser(i);
            if(player.iScore > 0)
            {
                count++;
            }
        }
        return count;
    }

    GetNumReadyUser()
    {
        let iNumUsers = 0;
        //for ( let i in this.listUsers )
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            //console.log(this.listUsers.GetSocket(i));
            if ( this.listUsers.GetUser(i).bReady == true )
                ++ iNumUsers;
        }

        return iNumUsers;
    }

    GetNumStartUser()
    {
        let iNumUsers = 0;
        //for ( let i in this.listUsers )
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            //console.log(`strID: ${this.listUsers.GetSocket(i).strID} bstart : ${this.listUsers.GetSocket(i).bStart}`);
            if ( this.listUsers.GetUser(i).bBig2Play == true )
                ++ iNumUsers;
        }

        return iNumUsers;
    }

    GetNumPlacedUser()
    {
        let iNumUsers = 0;
        //for ( let i in this.listUsers )
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).iLocation != -1 )
                ++ iNumUsers;
        }

        return iNumUsers;
    }

    GetNumPlayingUser()
    {
        console.log(`IGame::GetNumPlayingUser ${this.listUsers.GetLength()}`);

        let iNumUsers = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            console.log(`strID : ${player.strID}, bFold : ${player.bFold}, bEnable : ${player.bEnable}, iLocation : ${player.iLocation}`);

            if ( player.iLocation != -1 && player.bFold == false && player.bEnable == true && player.bSpectator == false && player.bBig2Play == true)
                ++ iNumUsers;
        }
        return iNumUsers;
    }

    GetNumResultUser()
    {
        //console.log(`IGame::GetNumPlayingUser ${this.listUsers.GetLength()}`);

        let iNumUsers = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            //console.log(`strID : ${player.strID}, bFold : ${player.bFold}, bEnable : ${player.bEnable}, bSpectator : ${player.bSpectator}`);

            //if ( this.listUsers.GetSocket(i).iLocation != -1 && this.listUsers.GetSocket(i).strLastBettingAction != 'Fold')
            //if ( this.listUsers.GetSocket(i).iLocation != -1 && this.listUsers.GetSocket(i).strLastBettingAction != 'Fold' && this.listUsers.GetSocket(i).bEnable == true )
            if ( player.iLocation != -1 && player.bEnable == true &&  player.bSpectator == false)
                ++ iNumUsers;
        }
        return iNumUsers;
    }

    SetBig2StartPlacedUser()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).iLocation != -1 )
            {
                this.listUsers.GetUser(i).bBig2Play = true;
                this.listUsers.GetUser(i).bEnable = true;
            }
        }
    }

    //const EnumGameMode = Object.freeze({"Standby":0, "Start":1, "DefaultAnte":2, "BettingPreFlop":3, "Plob":4, "BettingFlop":5, "Turn":6, "BettingTurn":7, "River":8, "RiverBetting":9, "Result":10, "Celebration":11});
    Update() {
        ++this.iElapsedTime;

        switch (this.eGameMode) {
            case E.EGameMode.Standby:
                {
                    //console.log(`cReadyUser: ${cReadyUser} , cStartUser : ${cPlaceUser}`);
                    if (this.bBig2Start == false && this.bSetGame == false) {
                        const cReadyUser = this.GetNumReadyUser();
                        //console.log(`IGame::Update : Standby : PlayingUsers = ${cPlayingUser}`);
                        const cPlaceUser = this.GetNumPlacedUser();
                        
                        const cStartUser = this.GetNumStartUser();
                        for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                            if (this.listUsers.GetUser(i).bFold == false && this.listUsers.GetUser(i).bReady == false && this.listUsers.GetUser(i).bShowReady == false && this.listUsers.GetUser(i).iLocation != -1) {
                                this.listUsers.GetUser(i).bShowReady = true;
                                this.listUsers.GetUser(i).socket.emit('SM_EnableReadyGame');
                            }
                            if (this.cMinEnablePlayer <= cReadyUser && cPlaceUser == cReadyUser) {
                                if (this.listUsers.GetUser(i).bFold == false && this.listUsers.GetUser(i).bReady == true && this.listUsers.GetUser(i).bBig2Play == false && this.listUsers.GetUser(i).bShowStart == false) {
                                    this.listUsers.GetUser(i).bShowStart = true;
                                    this.listUsers.GetUser(i).socket.emit('SM_EnableStartGame');
                                    //this.listUsers.GetSocket(i).emit('SM_ReadyGame');
                                }
                            }
                        }
                        if (this.cMinEnablePlayer <= cStartUser && cReadyUser == cStartUser) {
                            console.log("start Big2!!!!!");
                            this.bBig2Start = true;
                            //this.bSetGame = true;
                            this.SetBig2StartPlacedUser();

                            let list = this.GetEnableUserList();
                            for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                                console.log(this.listUsers.GetUser(i).strID);
                                if (this.listUsers.GetUser(i).bFold == false) {
                                    this.listUsers.GetUser(i).bSpectator = false;
                                    this.listUsers.GetUser(i).socket.emit('SM_StartBig2',{listUser:list});
                                    this.listDBUpdate.push({ iProcessingID:this.GetProcessingID(), iDB: E.EDBType.Users, iSubDB: E.EUserDBType.UpdateRolling, strID: this.listUsers.GetUser(i).strID, iCash: this.listUsers.GetUser(i).iCoin, iAmount: this.iDefaultCoin });
                                }
                            }
                        }
                    }
                    else {
                        const cPlayingUser = this.GetNumPlayingUser();
                        if(cPlayingUser == 1)
                        {
                            //this.bSetGame = false;
                            // 우승 플레이어에게 상금 지급
                            this.SetMode(E.EGameMode.PrizeResult);
                            // for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                            //     this.listUsers.GetUser(i).bReady = false;
                            //     this.listUsers.GetUser(i).bShowStart = false;
                            //     this.listUsers.GetUser(i).bStart = false;
                            //     this.listUsers.GetUser(i).bShowStart = false;
                            //     this.listUsers.GetUser(i).bFold = false;
                            //     this.listUsers.GetUser(i).iScore = 0;
                            // }
                            // return;
                        }
                        else if( this.cMinEnablePlayer <= cPlayingUser )
                        {
                            console.log(`##### cPlayingUser : ${cPlayingUser}`);
    
                            this.SetMode(E.EGameMode.Start);
                            this.iPrize = parseInt(this.iDefaultCoin * cPlayingUser)-parseInt(this.iDefaultCoin * cPlayingUser * global.fBig2 * 0.01);
                            for (let i = 0; i < this.listUsers.GetLength(); ++i)
                            {
                                this.listUsers.GetUser(i).socket.emit('SM_StartGame',this.iPrize);
                                // this.listUsers.GetUser(i).socket.emit('SM_DisableStartGame');
                            }
                        }
                    }
                }
                break;
            case E.EGameMode.Start:
                if (this.iElapsedTime > E.EGameTime.Start) {
                    this.SetMode(E.EGameMode.HandCard);
                }
                break;
            case E.EGameMode.HandCard:
                if (this.iElapsedTime > E.EGameTime.HandCard) {
                    this.SetMode(E.EGameMode.BuildPlayerType);
                }
                break;
            case E.EGameMode.BuildPlayerType:
                if (this.iElapsedTime > E.EGameTime.BuildPlayerType) {
                    this.SetMode(E.EGameMode.SubmitCard);
                }
                break;
            case E.EGameMode.SubmitCard:
                break;
            case E.EGameMode.Result:
                if (this.iElapsedTime > E.EGameTime.Result) {
                    console.log("this.bSetGame : ", this.bSetGame);
                    if(this.bSetGame == false)
                    {
                        this.SetMode(E.EGameMode.PrizeResult);
                    }
                    else
                    {
                        this.SetMode(E.EGameMode.Standby);
                    }  
                }
                break;
            case E.EGameMode.PrizeResult:
                if (this.iElapsedTime > E.EGameTime.PrizeResult) {
                    this.SetMode(E.EGameMode.Standby);
                }
                break;
        }
    }

    SetMode(eGameMode)
    {
        console.log(`IGame::SetMode ${eGameMode}`);
        switch ( eGameMode )
        {
        case E.EGameMode.Standby:
            this.Initialize();
            break;
        case E.EGameMode.Start:
            this.Start();
            break;
        case E.EGameMode.HandCard:
            this.SetHandCard();
            break;
        case E.EGameMode.BuildPlayerType:
            this.BuildPlayerType();
            break;
        case E.EGameMode.SubmitCard:
            this.StartSubmitCard();
            break;
        case E.EGameMode.Result:
            this.ProcessResult();
            break;
        case E.EGameMode.PrizeResult:
            this.ProcessPrizeResult();
            break;
        }
        this.eGameMode = eGameMode;
        this.iElapsedTime = 0;
        console.log(eGameMode);
    }

    Broadcast(user, strEvent, objectData)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).strID != user.strID ) 
            {
                this.listUsers.GetUser(i).socket.emit(strEvent, objectData);

                console.log(`Event ${strEvent}, strID : ${this.listUsers.GetUser(i).strID}`);
            }                
        }
    }

    FullBroadcast(strEvent, objectData)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.GetUser(i).socket.emit(strEvent, objectData);
            console.log(objectData);
        }
    }

    BroadcastJoinUser(user)
    {
        console.log(`BroadcastJoinUser : ${this.listUsers.GetLength()}`);

        let objectPlayer = {strID:user.strID, iLocation:user.iLocation};

        this.Broadcast(user, 'SM_BroadcastJoinUser', objectPlayer);
    }

    BroadcastLeaveUser(user)
    {
        console.log(`BroadcastLeaveUser : ${this.listUsers.GetLength()}`);

        let objectPlayer = {strID:user.strID, iLocation:user.iLocation};

        this.Broadcast(user, 'SM_BroadcastLeaveUser', objectPlayer);
    }

    BroadcastPlaceUser(user)
    {
        console.log(`BroadcastPlaceUser`);
        
        let objectPlayer = {strID:user.strID, strNickname:user.strNickname, iScore:user.iScore, iLocation:user.iLocation, iAvatar:user.iAvatar};
        console.log(objectPlayer);
        this.Broadcast(user, 'SM_BroadcastPlaceUser', objectPlayer);
    }

    FullBroadcastPlayerReady()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);

            let objectPlayer = {strID:player.strID, bReady:player.bReady};
            list.push(objectPlayer);
        }

        this.FullBroadcast('SM_FullBroadcastPlayerReady', list);
    }

    FullBroadcastPlayerType()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);

            let objectPlayer = {strID:player.strID, strPlayerType:player.strPlayerType, bSetGame:this.bSetGame};
            list.push(objectPlayer);
        }

        this.FullBroadcast('SM_FullBroadcastPlayerType', list);
        // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        // {
        //     this.listUsers.GetUser(i).emit('SM_FullBroadcastPlayerType', list);
        // }
    }

    PlayerBetting()
    {
        let list = [];
        //this.iTotalBettingCoin = this.listUsers.GetLength()*this.iDefaultCoin;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            const iPlayerCoin = parseInt( player.iCoin - this.iDefaultCoin);

            player.iCoin = iPlayerCoin;
            let objectPlayer = {strID:player.strID, iCash:player.iCoin ,iBettingCoin:this.iDefaultCoin};
            this.iTotalBettingCoin += parseInt(this.iDefaultCoin);
            console.log(`this.iTotalBettingCoin : ${this.iTotalBettingCoin}, iPlayerCoin : ${iPlayerCoin}`);
            list.push(objectPlayer);
        }

        //this.FullBroadcast('SM_FullBroadcastBetting', list);
        // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        // {
        //     this.listUsers.GetUser(i).emit('SM_FullBroadcastPlayerType', list);
        // }
    }

    //FullBroadcastSubmit(socket, iCoin, iBettingCoin, strBetting, iTotalBettingCoin)
    FullBroadcastSubmit(user, strBetting, list, bpass)
    {
        let objectPlayer = {strID:user.strID, list:list, strBetting:strBetting, bpass:bpass};
        console.log(objectPlayer.list);
        console.log(list);
        this.FullBroadcast('SM_FullBroadcastSubmit', objectPlayer);
    }

    FullBroadcastFoldUser(listPlayers)
    {
        this.FullBroadcast('SM_FullBroadcastFoldUser', listPlayers);
    }

    FullBroadcastLeaveLocation()
    {
        this.FullBroadcast('SM_FullBroadcastLeaveLocation');
    }

    BroadcastFocus(user, strID)
    {
        let objectPlayer = {strID:strID, iBettingTime:this.iBettingTime};

        this.Broadcast(user, 'SM_Focus', objectPlayer);
    }

    FullBroadcastFocus(strID)
    {
        let objectPlayer = {strID:strID, iBettingTime:this.iBettingTime};
        
        this.FullBroadcast('SM_Focus', objectPlayer);
    }

    FullBroadcastShowdown()
    {
        let listData = [];
        
        this.FullBroadcast('SM_ShowDown', listData);
    }

	FullBroadcastEmoticon(user, iEmoticon)
    {
        let objectPlayer = {strID:user.strID, iEmoticon:iEmoticon}
        this.FullBroadcast('SM_FullBroadcastEmoticon', objectPlayer);
    }

    FullBroadcastExit(user, bReserveExit)
    {
        if(this.eGameMode == E.EGameMode.RebuyIn)
        {
            return;
        }
        let objectPlayer = {strID:user.strID, bReserveExit:bReserveExit}
        this.FullBroadcast('SM_FullBroadcastExit', objectPlayer);
    }

    FullBroadcastHandCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.bEnable == true && player.iLocation != -1 && player.strLastBettingAction != 'Fold' )
            {
                let listCards = this.listUsers.GetUser(i).listHandCard;

                this.listUsers.GetUser(i).socket.emit('SM_HandCard', listCards, this.listPots);
            }
        }
    }

    FullBroadcastResult()
    {
        let listResult = [];
        // let strWinnerHand = '';
        // let strWinnerDescr = '';
        const cResultUser = this.GetNumResultUser();
        console.log(cResultUser);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            console.log(`-------------------- result : ${[player.iScore]}`);
            if ( player.iLocation == -1 || player.bEnable == false || player.bSpectator == true )
                continue;

            let objectData = {  
                strID:player.strID, 
                iRank:player.iRank,
                iWinCoin:player.iWinCoin,
                iCoin:player.iCoin,
                iAvatar:player.iAvatar,
                iScore:player.iScore,
                listHandCard:player.listHandCard,
                bFold:player.bFold
            };

            listResult.push(objectData);

            if ( player.iRank == 1 )
            {
                this.dealerLocation = player.iLocation;
                // strWinnerHand = player.strHand;
                // strWinnerDescr = player.strDescr;
            }
            console.log(objectData);
        }

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if( player.iLocation != -1 )
            {
                player.socket.emit('SM_Result', listResult, cResultUser, this.bSetGame);
            }
            if( this.bSetGame == false)
            {
                //player.bFold = false;
                player.iScore = 0;
            }
        }
    }

    AddUser(user)
    {
        this.listUsers.Add(user);
        this.PrintRoomUsers();
    }

    RemoveUser(user)
    {
        this.listUsers.Remove(user);
        this.PrintRoomUsers();

        return this.listUsers.GetLength();
    }

    SetLocation(user, iLocation)
    {
        if ( this.eGameMode != E.EGameMode.Standby )
            return false;
        for ( let i = 0; i < this.listUsers.GetLength(); ++i )
        {
            if ( this.listUsers.GetUser(i).iLocation == iLocation )
                return false;
        }
        user.iLocation = iLocation;
        user.bEnable = true;

        this.BroadcastPlaceUser(user);
        //this.FullBroadcastPlaceUser();

        return true;
    }

    FindPlayer(strID)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( strID == this.listUsers.GetUser(i).strID )
                return this.listUsers.GetUser(i);
        }
        return null;
    }

    FindPlayerNewPlaying()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).bNewPlaying == true )
                return this.listUsers.GetUser(i);
        }
        return null;
    }

    FindPlayerInLocation(iLocation)
    {
        console.log(`IGame::FindPlayerInLocation : ${iLocation}`);

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            console.log(`iLocation ${iLocation}, socket Location : ${this.listUsers.GetUser(i).iLocation}`);
            if ( iLocation == this.listUsers.GetUser(i).iLocation )
                return this.listUsers.GetUser(i);
        }
        return null;
    }

    SortLocationList(list, target)
    {
        for ( let i = 0; i < list.length; ++i )
        {
            if ( list[0] < target )
            {
                let value = list[0];
                list.shift();        
                list.push(value);
            }
        }
    }

    FindNextPlayer(cLocation, cDealerLocation)
    {
        let list = [];
        for ( let i = 0; i < 4; ++ i )
        {
            const cLoc = Math.floor((cLocation - i + 4) % 4); // 반시계방향으로 해주는 수식
            // const cLoc = Math.floor((cLocation+i)%4); // 시계방향
            if ( cLoc != cLocation && cLoc != cDealerLocation )
                list.push(cLoc);
        }
        this.SortLocationList(list, cDealerLocation);
        console.log(`IGame::FindNextPlayer cLocation : ${cLocation}, cDealerLocation : ${cDealerLocation}`);
        console.log(list);

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            console.log(`Player Location ${this.listUsers.GetUser(i).strID}, ${this.listUsers.GetUser(i).iLocation}`);

        for ( let j in list )
        {
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                    if ( this.listUsers.GetUser(i).iLocation == list[j] && 
                            this.listUsers.GetUser(i).bFold == false && 
                            this.listUsers.GetUser(i).bEnable == true &&
                            this.listUsers.GetUser(i).bSpectator == false) 
                    {

                    console.log(`FindNextUser : ${list[j]}, socket : ${this.listUsers.GetUser(i).strID}`);

                    return this.listUsers.GetUser(i);
                }
            }     
        }
        return null;
    }

    GetPlayerLowestCard(player)
    {
        let objectCard = {iNumber:13, iSuit:0};

        for ( let i in player.listHandCard )
        {
            const number = player.listHandCard[i]%13;
            const suit = Math.floor(player.listHandCard[i] / 13);

            if (number != 0 && number != 1) {
                if (number < objectCard.iNumber) {
                    objectCard.iNumber = number;
                    objectCard.iSuit = suit;
                } else if (number === objectCard.iNumber && suit > objectCard.iSuit) {
                    objectCard.iSuit = suit;
                }
            }
        }
        return objectCard;
    }

    CalculateLowestCardPlayer() {
        console.log("CalculateLowestCardPlayer() ");
        let tPlayer = null;
        let objectCurrent = null;

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if ( i == 0 )
            {
                tPlayer = player;
                objectCurrent = this.GetPlayerLowestCard(player);
            }
            else
            {
                let objectResult = this.GetPlayerLowestCard(player);
                console.log(objectCurrent);
                console.log(objectResult);
                if ( objectResult.iNumber < objectCurrent.iNumber )
                {
                    tPlayer = player;
                    objectCurrent = objectResult;
                }                
                else if ( objectResult.iNumber == objectCurrent.iNumber )
                {
                    if ( objectResult.iSuit > objectCurrent.iSuit )
                    {
                        console.log(objectCurrent);
                        console.log(objectResult);
                        tPlayer = player;
                        objectCurrent = objectResult;
                    }
                }
            }
        }
        return tPlayer.iLocation;
    }

    BuildPlayerType() {
        console.log(`IGame::BuildPlayerType`);
  
        // 플레이어 수
        const cNumPlayers = this.listUsers.GetLength();
        let cPlayerType = 'Dealer'; // 딜러 선정 변수
        let listLocations = [];
        // 모든 플레이어의 strPlayerType과 bSpectator 초기화
        for (let i = 0; i < cNumPlayers; ++i) {
            this.listUsers.GetUser(i).strPlayerType = '';
        }

        // 플레이어들의 위치를 배열에 담기
        for (let i = 0; i < cNumPlayers; ++i) {
            const player = this.listUsers.GetUser(i);
            listLocations.push(player.iLocation);
        }

        let idealerlocation = 0;
        console.log(this.bSetGame);
        if (this.bSetGame == false) {
            // 딜러 선정
            idealerlocation = this.CalculateLowestCardPlayer();
        }
        else {
            idealerlocation = this.dealerLocation;
        }
        const dealer = this.FindPlayerInLocation(idealerlocation);
        if (dealer !== null) {
            dealer.strPlayerType = cPlayerType;
            dealer.bNewPlaying = false;
            console.log(`IGame::BuildPlayerType : Player in location ${idealerlocation} is ${dealer.strID}`);
        } else {
            console.log(`IGame::BuildPlayerType : There is no user in the index ${idealerlocation}`);
        }
        if(this.GetScoreUserCount() == 0)
        {
            this.PlayerBetting();
        }
        
        this.FullBroadcastPlayerType();
        this.bSetGame = true;
    }

    FindPlayerFromPlayerType(strType)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            if ( player.strPlayerType == strType )
            {
                return player;
            }
        }
        return null;
    }

    GetDealerLocation()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strPlayerType == 'Dealer' )
            {
                return player.iLocation;
            }
        }
        return -1;
    }

    GetBBLocation()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strPlayerType == 'BB' )
            {
                return player.iLocation;
            }
        }
        return -1;
    }

    StartSubmitCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            console.log(`strID : ${this.listUsers.GetUser(i).strID}, strPlayerType : ${this.listUsers.GetUser(i).strPlayerType}`);

            console.log(`Betting Amount : ${this.listUsers.GetUser(i).strID}, ${this.listUsers.GetUser(i).iTotalBettingCoin}`);
            this.listUsers.GetUser(i).strLastBettingAction = '';
        }
        let player = null;
        if(this.bNewGame == true)
        {
            this.bNewGame = false;
            this.iBettingLocationLast = this.GetDealerLocation();
            player = this.FindPlayerInLocation(this.iBettingLocationLast);
        }
        else
        {
            player = this.FindNextPlayer(this.iBettingLocationLast, -1);
        }
        
        if ( null != player )
        {
            console.log(`iGame::StartSubmitCard : ${player.strID}`);
            this.iBettingLocationLast = player.iLocation;
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                let tplay = this.listUsers.GetUser(i);
                
                if (tplay.strID == player.strID) {
                    let nplay = this.FindNextPlayer(tplay.iLocation, -1);
                    let bHigherCard = false;
                    let tableCards = [];
                    this.strCurrentBettingPlayerID = tplay.strID;
                    if (nplay.listHandCard.length == 1) {
                        bHigherCard = true;
                    }
                    // for (let i = 0; i < this.listTableCard.length; i++) {
                    //     tableCards.push(this.listTableCard[i].index);
                    // }
                    tplay.listTipCard = big2solver.generateValidCombinations(tplay.listHandCard, tableCards, bHigherCard);
                    if(tplay.bConnection == false)
                    {
                        if(tplay.listTipCard.length == 0)
                        {
                            const objectBetting = {strBetting:'Pass', list:[]};
                            this.ProcessSubmit(tplay, objectBetting);
                        }
                        else
                        {
                            let tip = tplay.listTipCard[tplay.listTipCard.length - 1];
                            let list = [];
                            for (let i = 0; i < tip.cards.length; i++) {
                                list.push({ index: tip.cards[i] });
                            }
                            const objectBetting = {strBetting:'Submit', list:list};
                            this.ProcessSubmit(tplay, objectBetting);
                        }
                    }
                    else
                    {
                        tplay.socket.emit('SM_EnableSubmitCard', {iBettingTime:this.iBettingTime, nPlayerHandCard:nplay.listHandCard});
                    } 
                    console.log(`-----------------------------------------------------------------tipCard : ${tplay.strID}`);
                    console.log(tplay.listTipCard);
                }
                else
                {
                    tplay.socket.emit('SM_Focus', {strID:player.strID, iBettingTime:this.iBettingTime});
                }
            }
        }
        console.log(`Last Betting Location : ${this.iBettingLocationLast}`);
    }

    IsBettingComplete()
    {
        let listCheck = [];

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            //console.log(`#IsBettingComplete : ${player.strID} : BetCoin : ${player.iTotalBettingCoin}, MaxBetCoin on Table : ${this.iRecentPlayersBettingCoin}`);

            if ( player.iLocation == -1 )
                continue;

            if ( player.bEnable == false )
                continue;

            //  Not bet yet
            if ( player.strLastBettingAction == '' )
            {
                listCheck.push(`IsBettingComplete index : ${i}, not bet`);
                return false;
            }
        }
        return true;
    }

    IsGameEnd()
    {
        console.log(`####################################################### IsGameEnd`);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            console.log(`${player.strID}, ${player.bEnable}, ${player.strLastBettingAction}`);

            // if ( player.iLocation != -1 && player.bEnable != false && player.strLastBettingAction != 'Fold' )
            //     continue;

            console.log(`##### IsGameEnd ${player.strID}, iNumCards : ${player.listHandCard.length}`);

            if ( player.listHandCard.length == 0 && player.bFold == false && player.bSpectator == false)
                return true;
        }


        return false;
    }

    ProcessNextBetting()
    {
        let player = this.FindNextPlayer(this.iBettingLocationLast, -1);
        console.log(`iGame::ProcessNextBetting : ${player.strID}`);
        if ( null != player )
        {
            this.iBettingLocationLast = player.iLocation;
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                let tplay = this.listUsers.GetUser(i);

                if ( tplay.strID == player.strID )
                {
                    let nplay = this.FindNextPlayer(tplay.iLocation, -1);
                    let bHigherCard = false;
                    let tableCards = [];
                    this.strCurrentBettingPlayerID = tplay.strID;
                    if (nplay.listHandCard.length == 1) {
                        bHigherCard = true;
                    }
                    for (let i = 0; i < this.listTableCard.length; i++) {
                        tableCards.push(this.listTableCard[i].index);
                    }
                    tplay.listTipCard = big2solver.generateValidCombinations(tplay.listHandCard, tableCards, bHigherCard);
                    if(tplay.bConnection == false)
                    {
                        console.log(tplay.strID);
                        console.log(tplay.listTipCard.length);
                        if(tplay.listTipCard.length == 0)
                        {
                            const objectBetting = {strBetting:'Pass', list:[]};
                            this.ProcessSubmit(tplay, objectBetting);
                        }
                        else
                        {
                            let tip = tplay.listTipCard[tplay.listTipCard.length - 1];
                            let list = [];
                            for (let i = 0; i < tip.cards.length; i++) {
                                list.push({ index: tip.cards[i] });
                            }
                            const objectBetting = {strBetting:'Submit', list:list};
                            this.ProcessSubmit(tplay, objectBetting);
                        }
                    }
                    else
                    {
                        tplay.socket.emit('SM_EnableSubmitCard', {iBettingTime:this.iBettingTime, nPlayerHandCard:nplay.listHandCard});
                    }
                }
                else
                    tplay.socket.emit('SM_Focus', {strID:player.strID, iBettingTime:this.iBettingTime});
            }
        }
        console.log(`Last Betting Location : ${this.iBettingLocationLast}`);
    }

    Betting(user, strBetting)
    {
        user.strLastBettingAction = strBetting;
    }

    RemoveCards(user, listCards)
    {
        console.log(`########## RemoveCards : ${user.strID}`);
        console.log(listCards);
        console.log('Mine');
        console.log(user.listHandCard);

        for ( let i in listCards )
        {
            this.RemoveCard(user, listCards[i]);
        }
        console.log('After');
        console.log(user.listHandCard);
    }

    RemoveCard(user, listcards)
    {
        for ( let i in user.listHandCard )
        {
            console.log(`RemoveCard Compare : ${listcards.index} and ${user.listHandCard[i]}`);
            if ( user.listHandCard[i] == listcards.index )
            {
                console.log(`Removed ${listcards.index}`);
                user.listHandCard.splice(i, 1);
                return;
            }
        }
    }

    ProcessSubmit(user, objectBetting)
    {
        console.log("IGame::!!!!");
        console.log(objectBetting);
        user.strLastBettingAction = objectBetting.strBetting;
        let bpass = false;

        //this.CalculateBettingAmount(user, objectBetting);
        
        if ( user.strLastBettingAction == 'Submit' )
        {
            this.RemoveCards(user, objectBetting.list);
            this.listTableCard = objectBetting.list;
            this.strRecentPlayerID = user.strID;
            this.iPasscount = 0;
        }
        if( objectBetting.strBetting == 'Pass')
        {
            this.iPasscount++;
        }
        const cEnablePlayer = this.GetNumPlayingUser();
        if( this.iPasscount == cEnablePlayer-1)
        {
            bpass = true
        }
        this.FullBroadcastSubmit(user, objectBetting.strBetting, objectBetting.list, bpass);
        console.log(`##### ProcessSubmit : NumEnableUser ${cEnablePlayer} to Result`);
        if ( true == this.IsGameEnd() )
        {
            console.log(`##### isgameend()`);
            this.SetMode(E.EGameMode.Result);
        }
        else if ( true == this.IsBettingComplete() )
        {
            this.SetMode(E.EGameMode.SubmitCard);
        }
        else
        {
            this.ProcessNextBetting();
        }
    }
    
    SetEmoticon(user, iEmoticon)
    {
        this.FullBroadcastEmoticon(user,iEmoticon);
    }

    SetExit(user, bReserveExit)
    {
        if(this.listUsers.GetLength() > 1)
        {
            if(user.bSpectator == true && user.iLocation != -1)
            {
                this.BroadcastLeaveUser(user);
                this.RemoveUser(user);
            }
            if(user.iLocation == -1)
            {
                this.RemoveUser(user);
            }
            if(user.iLocation != -1)
            {
                this.FullBroadcastExit(user,bReserveExit);
            }
        }
        else
        {
            return;
        } 
    }

    Start()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            player.bSpectator = false;
            console.log(`IGame::Start strID : ${player.strID}`);
            if ( this.listUsers.GetUser(i).iLocation != -1 )
            {
                console.log(`IGame::Start strID : ${player.strID} Enabled`);
                this.listUsers.GetUser(i).bEnable = true;
            }                
        }
        this.Shuffle();
        this.startNewRound();
        return true;
    }

    SetHandCard()
    {
        let iStartLocation = null;
        for(let i in this.listUsers.GetLength())
        {
            if(this.listUsers.GetUser(i).bFold == true)
            {
                continue;
            }
            else 
            {
                iStartLocation = this.listUsers.GetUser(i).iLocation;
            }
        }

        let iCount = 0;
        //while(1)
        while ( iCount < 100 )
        {
            //let player = this.FindNextPlayer(-1, iStartLocation);
            let player = this.FindNextPlayer(iStartLocation, -1);
            if ( player != null )
            {
                console.log(`##### SendHandCard NextPlayer : ${player.strID}, CardLength : ${player.listHandCard.length}`);
                //if ( player.listHandCard.length < 2 )
                if ( player.listHandCard.length < 13 && player.bFold == false && player.bSpectator == false )
                {
                    const iCard = this.listCardDeck[this.iCurrentDeckIndex];
                    ++ this.iCurrentDeckIndex;
    
                    player.listHandCard.push(iCard);

                    iStartLocation = player.iLocation;
        
                    if ( true == this.IsCompleteHandCard() )
                    {
                        iCount = 100;
                        console.log(`################################################# Success`);
                        break;
                    }                        
                }
            }
            ++ iCount;
        }

        this.FullBroadcastHandCard();
    }

    ConvertCardIndex(index)
    {
        const cSuit = ['s', 'h', 'd', 'c'];
        const cRank = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

        let suit = Math.floor(index / 13);
        let rank = Math.floor(index % 13);

        let result = cRank[rank]+cSuit[suit];
        return result;
    }

    ConvertCardList(list)
    {
        let result = [];
        for ( let i in list )
        {
            let data = this.ConvertCardIndex(list[i]);
            result.push(data)
        }
        return result;
    }

    ProcessResult()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            player.bNewPlaying = false;
        }

        this.ProcessWinner();

        console.log(`this.bSetGame : ${this.bSetGame}`);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).iLocation == -1 )
                continue;
            if ( this.listUsers.GetUser(i).bEnable == false )
                continue;
            // if( this.bSetGame == false )
            // {
            //     const cCash = parseInt(this.listUsers.GetUser(i).iCash) + parseInt(this.listUsers.GetUser(i).iCoin);
            //     console.log(`${cCash} : ${this.listUsers.GetUser(i).iCash} : ${this.listUsers.GetUser(i).iCoin}`);
            //     this.listDBUpdate.push({iProcessingID:this.GetProcessingID(), iDB:E.EDBType.Users, iSubDB:E.EUserDBType.UpdatePoint, strID:this.listUsers.GetUser(i).strID, iCash:cCash});
            //     //this.listUsers.GetUser(i).bFold = false;
            //     //this.listUsers.GetUser(i).iScore = 0;
            // }
        }
        this.FullBroadcastResult();
    }

    ProcessPrizeResult()
    {
        /*
            올인 플레이어 탈락 처리 (등수 계산)
            올인 플레이어 기립 (Player.bSitGoPlay false)
            플레이어 인원수 부족 == 싯앤고 끝 (싯앤고 끝 연출 패킷 + this.bSitGoStart false)
        */
        console.log(`IGame::ProcessPrizeResult`);
        let Big2Player = 0;
        let Big2Winner = null;
        let listPlayers = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            //if(player.iCoin < iBlind )
            if(player.bBig2Play == false )
            {
                // 여기에다가 탈락 이미지 연출 해주기.
                listPlayers.push({strID:player.strID, bBig2Play:player.bBig2Play});                
                //this.listDBUpdate.push({ iDB: E.EDBType.Users, iSubDB: E.EUserDBType.UpdateRolling, strID: player.strID, iCash: player.iCash, iAmount: this.iDefaultCoin, strMessage:"testtest"});
            }
        } 
        if (listPlayers.length > 0) {
            this.FullBroadcastFoldUser(listPlayers);
        }
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.GetUser(i).socket.emit('SM_Mode',{eMode:'PrizeResult'});
            if( this.listUsers.GetUser(i).bBig2Play == true )
            {
                ++Big2Player;
                Big2Winner = this.listUsers.GetUser(i);
            }
        }
        console.log("Big2Player : ",Big2Player);
        if(Big2Player == 1)
        {
            // 1등한테 상금 지급
            const cCash = parseInt(Big2Winner.iCoin) + parseInt(this.iPrize);

            console.log(`IGame :: ProcessPrizeResult! prize : ${this.iPrize}, cCash : ${cCash}`);
            
            Big2Winner.bBig2Play = false;

            this.bBig2Start = false;
            
            // 싯앤고 상금 주기 연출 패킷
            console.log(`IGame :: ProcessPrizeResult ID : ${Big2Winner.strID}`);
            Big2Winner.socket.emit('SM_ResultPrize',{strID:Big2Winner.strID, strNickname:Big2Winner.strNickname, iAmount:cCash, iPrize:this.iPrize});
            let objectPrize = {
                strID:Big2Winner.strID, 
                strNickname:Big2Winner.strNickname, 
                iPrize:this.iPrize,
                roundUnique:this.roundUnique
            }

            this.bSetGame = false;

            let strStartCoin =''; 
            let strResultCoin = '';
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                let player = this.listUsers.GetUser(i);
                if(player.bSpectator == false)
                {
                    if(strStartCoin != '') strStartCoin += ',';
                    if(strResultCoin != '') strResultCoin += '';
                    if(player.strID == Big2Winner.strID)
                    {
                        const prizeCash = parseInt(player.iCoin) + parseInt(this.iPrize);
                        strResultCoin += `${player.strID}:${prizeCash}`;
                    }
                    else
                    {
                        strResultCoin += `${player.strID}:${player.iCoin}`;
                    }
                    strStartCoin +=`${player.strID}:${player.iStartCoin}:0`;
                }
                player.iLocation = -1;
                player.bEnable = false;
                player.socket.emit('SM_Mode',{eMode:'GameInit'});
                player.socket.emit('SM_GameLog',objectPrize);
            }
            console.log("!!!!!!!!!!!@!@!@!@!@!@!@!@!@!@!@!@");
            this.FullBroadcastLeaveLocation();
            this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.Users, iSubDB: E.EUserDBType.UpdateCash, strID:Big2Winner.strID, iCash:cCash});
            this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecodrdGames, iSubDB:1, lUnique:this.lUnique, roundUnique:this.roundUnique, strWinner:Big2Winner.strID, strDesc:this.iPrize, strStartCoin:strStartCoin, strResultCoin:strResultCoin, strHand:'', strTablecard:'', iJackpot:'0', strGroupID:Big2Winner.strGroupID});
        }

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if(this.listUsers.GetUser(i).bConnection == false)
            {
                let player = this.listUsers.GetUser(i);
                this.BroadcastLeaveUser(player);
                this.RemoveUser(player);
            }
        }

        this.iPrize = 0;
    }

    ProcessWinner()
    {
        this.CalculateRank();
        console.log(`CalculateRank : after ${this.GetPlayerFoldCount()}`);

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            console.log(`ProcessWinner : ${player.strID}, #Rank : ${player.iRank}, $Win : ${player.iWinCoin}, $Coin : ${player.iCoin}`);
        }
    }

    CalculateRank()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if ( player.iLocation == -1 || player.bEnable == false || player.bFold == true || player.bSpectator == true)
                continue;
            list.push({strID:player.strID, iNumCards:player.listHandCard.length});
        }

        let result = list.sort( (a, b) => {
            return a.iNumCards-b.iNumCards;
        });

        for ( let i in result )
        {
            const player = this.FindPlayer(result[i].strID);
            if ( player )
            {
                player.iRank = parseInt(i)+1;
                if(player.listHandCard.length >= 10)
                {
                    player.iScore += parseInt(20);
                }
                else 
                {
                    player.iScore += parseInt( player.listHandCard.length );
                }
            }
            if(player.iScore >= 31)
            // if(player.iScore >= 20)
            {
                player.bFold = true;
                player.bBig2Play = false;
            }
            console.log(`playerID : ${player.strID},result iRank : ${player.iRank}, iScore: ${player.iScore}, bFold : ${player.bFold}, GetPlayerFoldcount() : ${this.GetPlayerFoldCount()}`)
        }
        if(this.GetPlayerFoldCount() == 1)
        {
            console.log("############# bSetGame false!!!");
            this.bSetGame = false;
        }
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            console.log(`##### ${player.strID}, iRank : # ${player.iRank}`);
        }
    }
    GetPlayerFoldCount()
    {
        let count = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if(this.listUsers.GetUser(i).bFold == false)
            {
                count++;
            }
        }
        return count;
    }

    IsSameCard(cards1, cards2)
    {
        if ( cards1.length == cards2.length )
        {
            for ( let i in cards1 )
            {
                if ( cards1[i].value != cards2[i].value )                
                    return false;
            }

            return true;
        }
        return false;
    }

    RemoveWinnerList(list, objectHand)
    {
        for ( let i = 0; i < list.length;)
        {
            if ( true == this.IsSameCard(list[i].cards, objectHand.cards) )
            {
                list.splice(i, 1);
            }                
            else 
                ++ i;
        }
    }

    Shuffle()
    {
        this.listCardDeck = [];
        //this.listCardDeck = [0,25,12,21,50,36,9,1,29,30,40,10];
        for ( let i = 0; i < 52; ++ i )
            this.listCardDeck.push(i);
        
        for ( let index = this.listCardDeck.length-1; index > 0; -- index )
        {
            const random = Math.floor(Math.random() * (index+1));
            const temp = this.listCardDeck[index];
            this.listCardDeck[index] = this.listCardDeck[random];
            this.listCardDeck[random] = temp;
        }

        console.log(this.listCardDeck);
    }

    IsCompleteHandCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' || player.iLocation == -1 || player.bEnable == false )
                continue;

            if ( player.listHandCard.length != 13 )
            {
                console.log(`IGame::IsCompleteHandCard => HandCard Length : ${player.listHandCard.length}`);
                return false;
            }
        }
        return true;
    }

    ReadyGame()
    {
        // const player = this.FindPlayer(strID);
        // player.bReady = true;
        this.FullBroadcastPlayerReady();
    }

    StartGame()
    {
        //this.Shuffle();
        //this.Start();
        console.log(`IGame::StartGame`);

        //const cPlayingUser = this.GetNumPlacedUser();
        //const cPlayingUser = this.GetNumPlayingUser();
        // const cReadyUser = this.GetNumReadyUser();
        // const cStartUser = this.GetNumStartUser();
        // console.log(`IGame::StartGame => cReadyUser : ${cReadyUser}, cStartUser: ${cStartUser}, GameMode ${this.eGameMode}`);
        // if ( cReadyUser == cStartUser && this.eGameMode == E.EGameMode.Start )
        // {
        //     this.SetMode(E.EGameMode.HandCard);
        //     return true;
        // } 

        //return false;
    }

    PrintRoomUsers()
    {
        console.log(`################################################## Room ${this.strGameName}, iCoin ${this.iDefaultCoin} : Users`);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            console.log(`strID : ${this.listUsers.GetUser(i).strID}, eStage : ${this.listUsers.GetUser(i).eStage}, eLocation : ${this.listUsers.GetUser(i).iLocation}`);
        }
    }

    // Method to start a new round
    startNewRound() {
        this.iRound++;
        this.updateRoundUnique();
    }

    // Method to update the round-specific unique identifier
    updateRoundUnique() {
        // Directly append the round number to lUnique
        this.roundUnique = this.lUnique + this.iRound.toString();
        //console.log(`iGame:: updateRoundUnique roundUnique : ${this.roundUnique}`);
    }
}
module.exports = IGame;