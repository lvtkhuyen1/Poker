//let ISocketList = require('./ISocketList');
let IUser = require('./IUser');
let IUserList = require('./IUserList');
let E = require('./IEnum');
let poker = require('pokersolver').Hand;
let db = require('../db');

class IGame
{
    //constructor(strGameName, iDefaultCoin)
    constructor(strGameName, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers)
    {
        //this.listUsers = new ISocketList();
        this.listUsers = new IUserList();
        this.strGameName = strGameName;
        this.eGameType = eGameType;
        this.strPassword = strPassword;//New
        this.iDefaultCoin = iDefaultCoin;
        //this.iBuyIn = iBuyIn;//New
        this.iBettingTime = iBettingTime;//New
        this.eGameMode = E.EGameMode.Standby;
        this.iElapsedTime = 0;

        this.lUnique = Math.floor(Math.random() * 100000);
        do {
            this.lUnique = Math.floor(Math.random() * 100000);
        } while (globalUniqueNumbers.has(this.lUnique));
    
        // Register the unique number
        globalUniqueNumbers.add(this.lUnique);
        //this.lUnique = Math.floor(Math.random()*100000);

        this.cMinEnablePlayer = 2;
        //this.cMaxPlayer = 9;
        this.cMaxPlayer = iMaxPlayers;//New
        this.iDealerIndex = -1;
        this.iBettingLocationLast = -1;
        this.iDealerLocationLast = -1;
        
        this.iRecentPlayersBettingCoin = 0;
        this.iTotalBettingCoin = 0;
        this.iRecentTotalBettingCoin = 0;
        this.iCallAmount = 0;

        this.listCardDeck = [];
        this.iCurrentDeckIndex = 0;
        this.listTableCard = [];
        this.listOriginalTableCard = [];

        this.listEnableBettingType = [];

        this.listPots = [];

        this.listWinCards = [];

        this.listDBUpdate = [];

        this.bShowdown = false;
        this.listReservationMode = [];
        this.iDelayTime = 0;

        this.iCurrentBettingID = '';

        // For Rolling
        this.listBet    = [];
        this.strIDjoker = '';
        this.eState = '';
        this.tableCards = [];

        //  
        this.strCurrentBettingPlayerID = '';

        this.iRound = 0;
        this.iJackpot1Round = 0;
        this.iJackpot2Round = 0;
        this.iJackpot3Round = 0;
        this.iJackpotLevel = 0;
        this.roundUnique = '';

        this.iJackpotAmount = 0;
        this.jackpotInfo = null;
        this.jackpotRounds = null;

        // this.eProcessingDBID = -1;
        // this.eProcessingSubDBID = -1;
        this.eProcessingDBID = -1;
        this.iNumPlayingUser = 0;
        this.bRequestJackpotRound = false;
    }
    
    async GetOdds(strID)
    {
        let user = await db.Users.findOne({ where: { strID: strID } });

        const [list] = await db.sequelize.query(
        `SELECT  t1.fHoldemR AS fAdminR,
        t1.strID as strAdminID,
        t2.fHoldemR AS fPAdminR,
        t2.strID as strPAdminID,
        t3.fHoldemR AS fVAdminR,
        t3.strID as strVAdminID,
        t4.fHoldemR AS fAgentR,
        t4.strID as strAgentID,
        t5.fHoldemR AS fShopR,
        t5.strID as strShopID,
        t6.fHoldemR AS fUserR,
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

    async UpdateJackpotRound()
    {
        //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
        
        let attr = null;

        await db.JackpotRounds.increment({'iLevel1':1,'iLevel2':1, 'iLevel3':1}, {where:{strGame:'HOLDEM',iBlind:parseInt(this.iDefaultCoin)}});
        attr = await db.JackpotRounds.findOne({ attributes: [['iLevel1', 'iRound1'],['iLevel2', 'iRound2'],['iLevel3', 'iRound3'],['iJackpot1', 'iJackpot1'],['iJackpot2', 'iJackpot2'],['iJackpot3', 'iJackpot3']], where: { strGame: 'HOLDEM', iBlind: parseInt(this.iDefaultCoin) } });

        //console.log(`iRound1 : ${attr.dataValues.iRound1}, iRound2 : ${attr.dataValues.iRound2}, iRound3 : ${attr.dataValues.iRound3}`);
        //console.log(`iJackpot1 : ${attr.dataValues.iJackpot1}, iJackpot2 : ${attr.dataValues.iJackpot2}, iJackpot3 : ${attr.dataValues.iJackpot3}`);

        if (attr.dataValues.iRound1 > this.jackpotInfo.iLevel1Round && attr.dataValues.iJackpot1 == 1) {
            await db.JackpotRounds.update({ 'iLevel1': 1, 'iJackpot1':0}, { where: { strGame: 'HOLDEM', iBlind: parseInt(this.iDefaultCoin) } });
            this.iJackpot1Round = 1;
        }
        else {
            this.iJackpot1Round = parseInt(attr.dataValues.iRound1);
        }
        if (attr.dataValues.iRound2 > this.jackpotInfo.iLevel2Round && attr.dataValues.iJackpot2 == 1) {
            await db.JackpotRounds.update({ 'iLevel2': 1, 'iJackpot2':0}, { where: { strGame: 'HOLDEM', iBlind: parseInt(this.iDefaultCoin) } });
            this.iJackpot2Round = 1;
        }
        else {
            this.iJackpot2Round = parseInt(attr.dataValues.iRound2);
        }
        if (attr.dataValues.iRound3 > this.jackpotInfo.iLevel3Round && attr.dataValues.iJackpot3 == 1) {
            await db.JackpotRounds.update({ 'iLevel3': 1, 'iJackpot3':0 }, { where: { strGame: 'HOLDEM', iBlind: parseInt(this.iDefaultCoin) } });
            this.iJackpot3Round = 1;
        }
        else {
            this.iJackpot3Round = parseInt(attr.dataValues.iRound3);
        }

        //console.log(this.iJackpot1Round);
        //console.log(this.iJackpot2Round);
        //console.log(this.iJackpot3Round);
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
                        await db.Users.update({iCash:element.iCash, lastActive: new Date()}, {where:{strID:element.strID}});
                        this.listDBUpdate.splice(i, 1);
                        -- i;
                        break;
                    }
                    break;
                case E.EDBType.RecordBets:
                    switch (element.iSubDB) {
                        case E.ERecordBetDBType.Create:
                            {
                                await db.RecordBets.create({
                                    strID: element.strID,
                                    iClass: element.iClass,
                                    strGroupID: element.strGroupID,
                                    iAmount: element.iAmount,
                                    strBet: element.strBetting,
                                    eGameType:this.eGameType
                                });

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
                            await db.ResultHoldems.create({lUnique:element.lUnique, iRound:element.roundUnique, strWinner:element.strWinner, strDesc:element.strDesc, strStartCoin:element.strStartCoin, strResultCoin:element.strResultCoin, strHand:element.strHand, strTablecard:element.strTablecard, iJackpot:element.iJackpot, eGameType:this.eGameType, iFeeAmount:element.iFeeAmount, iJackpotFeeAmount:element.iJackpotFeeAmount, iBlind:this.iDefaultCoin});
                            
                            const arrayTemp = element.strStartCoin.split(',');
                            const arrayTempWinner = element.strWinner.split(',');
                            let totalBreakages = 0;
                            let iWinCoin = 0;
                            for ( let i in arrayTemp )
                            {
                                const arrayAccount = arrayTemp[i].split(':');
                                const cAmount = parseFloat(arrayAccount[2]);

                                iWinCoin += cAmount;
                            }
                            
                            for ( let i in arrayTemp )
                            {
                                const arrayAccount = arrayTemp[i].split(':');
                                const cID = arrayAccount[0];
                                const cAmount = parseFloat(arrayAccount[2]);
                                
                                let odds = await this.GetOdds(cID);
                                const cRollingAdmin = parseInt(odds.fAdmin * cAmount * 0.01);
                                const cRollingPAdmin = parseInt(odds.fPAdmin * cAmount * 0.01);
                                const cRollingVAdmin = parseInt(odds.fVAdmin * cAmount * 0.01);
                                const cRollingAgent = parseInt(odds.fAgent * cAmount * 0.01);
                                const cRollingShop = parseInt(odds.fShop * cAmount * 0.01);
                                const cRollingUser = parseInt(odds.fUser * cAmount * 0.01);

                                const cBreakageAdmin = (odds.fAdmin * cAmount * 0.01) % 1;
                                const cBreakagePAdmin = (odds.fPAdmin * cAmount * 0.01) % 1;
                                const cBreakageVAdmin = (odds.fVAdmin * cAmount * 0.01) % 1;
                                const cBreakageAgent = (odds.fAgent * cAmount * 0.01) % 1;
                                const cBreakageShop = (odds.fShop * cAmount * 0.01) % 1;
                                const cBreakageUser = (odds.fUser * cAmount * 0.01) % 1;

                                //console.log(`cBreakageAdmin : ${cBreakageAdmin}`);
                                //console.log(`cBreakagePAdmin : ${cBreakagePAdmin}`);
                                //console.log(`cBreakageVAdmin : ${cBreakageVAdmin}`);
                                //console.log(`cBreakageAgent : ${cBreakageAgent}`);
                                //console.log(`cBreakageShop : ${cBreakageShop}`);
                                //console.log(`cBreakageUser : ${cBreakageUser}`);
                                
                                let winCoin = 0;         
                                for( let j in arrayTempWinner)
                                {
                                    const arrayWinner = arrayTempWinner[j].split(':');
                                    const cWinnerID = arrayWinner[0]
                                    if(cWinnerID == cID)
                                    {
                                        winCoin = (parseInt(iWinCoin) - parseInt(iWinCoin * global.fHoldemFee * 0.01) - parseInt(iWinCoin * global.fJackpotFee * 0.01)) / arrayTempWinner.length;
                                        totalBreakages += parseFloat(((iWinCoin * global.fJackpotFee * 0.01) / arrayTempWinner.length) % 1)
                                        //console.log(`winCoin : ${winCoin}`);  
                                    }
                                }                     
                                 

                                await db.Rollings.create({
                                    strID:cID,
                                    iClass:5,
                                    strGroupID:odds.strGroupID,
                                    iAmount:cAmount,
                                    iWinCoin:winCoin,
                                    iRollingAdmin:cRollingAdmin,
                                    iRollingPAdmin:cRollingPAdmin,
                                    iRollingVAdmin:cRollingVAdmin,
                                    iRollingAgent:cRollingAgent,
                                    iRollingShop:cRollingShop,
                                    iRollingUser:cRollingUser,
                                    eGameType:this.eGameType
                                });

                                totalBreakages += parseFloat(cBreakageAdmin) + parseFloat(cBreakagePAdmin) + parseFloat(cBreakageVAdmin) + parseFloat(cBreakageAgent) + parseFloat(cBreakageShop) + parseFloat(cBreakageUser);
                               
                                await db.Users.increment({ iRolling: cRollingAdmin }, { where: { strID: odds.strAdminID } });
                                await db.Users.increment({ iRolling: cRollingPAdmin }, { where: { strID: odds.strPAdminID } });
                                await db.Users.increment({ iRolling: cRollingVAdmin }, { where: { strID: odds.strVAdminID } });
                                await db.Users.increment({ iRolling: cRollingAgent }, { where: { strID: odds.strAgentID } });
                                await db.Users.increment({ iRolling: cRollingShop }, { where: { strID: odds.strShopID } });
                                await db.Users.increment({ iRolling: cRollingUser }, { where: { strID: odds.strUserID } });
                            }
                            //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
                            //console.log(`totalBreakages : ${totalBreakages}`);
                            await db.Users.increment({ fBreakage: totalBreakages }, { where: { strID: 'admin' } });
                        }
                        
                        //const cNumPlayingUser = this.GetNumPlayingUser();
                        //console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`);
                        //console.log(`cNumPlayingUser : ${this.iNumPlayingUser}, iBlind : ${this.iDefaultCoin}`);
                        if ( this.iNumPlayingUser >= 7 ) // 7명 이상일때 jackpotround 올리기.
                        {
                            await this.UpdateJackpotRound();
                        }
                        this.listDBUpdate.splice(i, 1);
                        -- i;
                        break;
                    }
                    break;
                case E.EDBType.RecordJackpot:
                    switch ( element.iSubDB )
                    {
                        case E.EJackpotDBType.Increment:
                            await db.Jackpots.increment({iJackpot:element.iAmount}, {where:{strGame:this.eGameType}});
                            this.listDBUpdate.splice(i, 1);
                            -- i;
                            break;
                        case E.EJackpotDBType.Decrement:
                            await db.Jackpots.decrement({iJackpot:element.iJackpot}, {where:{strGame:this.eGameType}});
                            this.listDBUpdate.splice(i, 1);
                            -- i;
                            break;
                    }
                    break;
                case E.EDBType.RecordJackpotRounds:
                    switch ( element.iSubDB )
                    {
                        case E.EJackpotRoundDBType.Update:
                            if(element.iJackpotLevel == 1)
                            {
                                await db.JackpotRounds.update({iJackpot1:element.iJackpot1}, {where:{strGame:this.eGameType, iBlind:parseInt(this.iDefaultCoin)}});
                            }
                            else if(element.iJackpotLevel == 2)
                            {
                                await db.JackpotRounds.update({iJackpot2:element.iJackpot2}, {where:{strGame:this.eGameType, iBlind:parseInt(this.iDefaultCoin)}});
                            }
                            else if(element.iJackpotLevel == 3)
                            {
                                await db.JackpotRounds.update({iJackpot3:element.iJackpot3}, {where:{strGame:this.eGameType, iBlind:parseInt(this.iDefaultCoin)}});
                            }
                            this.listDBUpdate.splice(i, 1);
                            -- i;
                            break;
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

    IsEnableGame()
    {
        
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const cUser = this.listUsers.GetUser(i);
            if ( cUser.bConnection == true )
            {
                //console.log(`IsEnableGame : true`);
                return true;
            }
        }
        //console.log(`IsEnableGame : false`);
        return false;
    }

    Initialize()
    {
        this.iRecentPlayersBettingCoin = 0;
        this.iTotalBettingCoin = 0;
        this.iRecentTotalBettingCoin = 0; 
        this.iCallAmount = 0;

        this.listCardDeck = [];
        this.iCurrentDeckIndex = 0;
        this.listTableCard = [];
        this.listOriginalTableCard = [];
        this.listWinCards = [];

        this.bShowdown = false;
        this.listReservationMode = [];
        this.iDelayTime = 0;

        this.listBet = [];
        this.strIDjoker = '';

        this.strCurrentBettingPlayerID = '';

        // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        // {
        //     if(this.listUsers.GetUser(i).bConnection == false)
        //     {
        //         this.BroadcastLeaveUser(this.listUsers.GetUser(i));
        //         this.RemoveUser(this.listUsers.GetUser(i));
        //     }
        // }

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            if(player.iLocation == -1)
            {
                player.bSpectator = true;
            }

            player.iTotalBettingCoin = 0;
            player.iBettingCoin = 0;
            player.iStartCoin = player.iCoin;
            player.strLastBettingAction = '';
            player.listHandCard = [];
            player.strHand = '';
            player.iWinCoin = 0;
            player.iRank = 9;
            player.isimulRank = 9;
            player.iRealBettingCoin = 0;
            player.strDescr = '';
            player.bMenualRebuyin = false;
            player.bRejoin = false;
            player.bReserveBet = false;
            //player.bReserveExit = false;

            player.socket.emit('SM_Mode', {eMode:'Standby'});
        }
    }

    Join(objectUserData)
    {
        //console.log(`IGame::Join ${objectUserData.strID}, ${objectUserData.strNickname}, Length : ${this.listUsers.GetLength()}`);

        let user = new IUser(objectUserData.socket);

        let listPlayers = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const cUser = this.listUsers.GetUser(i);
            let listHandCard = [];
            
            if ( cUser.strID == objectUserData.strID )
                continue;
            
            if(this.eGameMode != 0)
            {
                if(objectUserData.strOptionCode[3] == 1)
                {
                    listHandCard = [52,52];
                }
                else
                {
                    listHandCard = [53,53];
                }
            }
            // for ( let i in user.listHandCard )
            //     listHandCard.push(52);
            
            let objectPlayer = {
                strID:cUser.strID, 
                strNickname:cUser.strNickname, 
                iCoin:cUser.iCoin, 
                iLocation:cUser.iLocation, 
                iAvatar:cUser.iAvatar, 
                eUserType:cUser.eUserType,
                strPlayerType:cUser.strPlayerType,
                strLastBettingAction:cUser.strLastBettingAction,
                listHandCard:listHandCard
            };
            listPlayers.push(objectPlayer);
            user.iStartCoin = cUser.iCoin;
            if(i == 1) 
                user.bNewPlaying = false;
            else 
                user.bNewPlaying = true;
        }

        //console.log(`this.listPlayers = #################################################################################################`);
        //console.log(listPlayers);

        user.strID = objectUserData.strID;
        user.strNickname = objectUserData.strNickname;
        user.iAvatar = objectUserData.iAvatar;
        user.eStage = 'GAME';
        user.lUnique = this.lUnique;
        user.roundUnique = this.roundUnique;
        user.iLocation = -1;
        user.iTotalBettingCoin = 0;
        user.iBettingCoin = 0;
        user.strLastBettingAction = '';
        user.listHandCard = [];
        user.strHand = '';
        user.strDescr = '';
        user.iWinCoin = 0;
        user.iRank = 9;
        user.isimulRank = 9;
        user.iRealBettingCoin = 0;
        user.bEnable = false;
        user.bSpectator = true;
        user.bMenualRebuyin = false;
        user.bRejoin = false;
        user.iStartCoin = objectUserData.iCoin;
        user.iStartCash = objectUserData.iCoin;
        user.bReserveBet = false;
        user.bReserveExit = false;

        let cCoin = (parseInt(objectUserData.iBuyIn)*parseInt(this.iDefaultCoin));
        let cCash = parseInt(objectUserData.iCoin)-cCoin;
        if(this.iDefaultCoin == 500)
        {
            if(cCash < 0)
            {
                cCoin = parseInt(objectUserData.iCoin);
                cCash = 0;
            }
        }

        user.iCoin = cCoin;
        user.iCash = cCash;
        user.eUserType = objectUserData.eUserType;
        user.strGroupID = objectUserData.strGroupID;
        user.iClass = objectUserData.iClass;
        user.strOptionCode = objectUserData.strOptionCode;
        //user.eUserType = user.eUserType;
        
        this.AddUser(user);

        user.socket.emit('SM_JoinGame', listPlayers , this.cMaxPlayer, global.iJackpot, this.listTableCard, this.eGameMode);

        this.BroadcastJoinUser(user);
    }

    Rejoin(strID, socket)
    {
        let listPlayers = [];

        let objectMe = {strID:'', 
                        strNickname:'', 
                        iCoin:0, 
                        iLocation:-1, 
                        iAvatar:0, 
                        eUserType:'', 
                        listHandCard:[], 
                        iBlind:this.iDefaultCoin,
                        strGameName:this.strGameName};

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {       
            let cUser = this.listUsers.GetUser(i);
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
                objectMe.strLastBettingAction = cUser.strLastBettingAction;
                objectMe.strOptionCode = cUser.strOptionCode;
                objectMe.iStartCash = cUser.iStartCash;
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
                if(objectMe.strOptionCode[3] == 1)
                {
                    listHandCard = [52,52];
                }
                else
                {
                    listHandCard = [53,53];
                }
            }
            
            let objectPlayer = {
                strID:cUser.strID, 
                strNickname:cUser.strNickname, 
                iCoin:cUser.iCoin, 
                iLocation:cUser.iLocation, 
                iAvatar:cUser.iAvatar, 
                eUserType:cUser.eUserType,
                strPlayerType:cUser.strPlayerType,
                strLastBettingAction:cUser.strLastBettingAction,
                listHandCard:listHandCard
            };
            listPlayers.push(objectPlayer);
        }

        let listTableCard = this.listTableCard;

        socket.emit('SM_RejoinGame', listPlayers , this.cMaxPlayer, global.iJackpot, objectMe, listTableCard);
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
        if ( this.eGameMode == E.EGameMode.BettingPreFlop || this.eGameMode == E.EGameMode.BettingFlop || this.eGameMode == E.EGameMode.BettingTurn || this.eGameMode == E.EGameMode.BettingRiver )
        {
            if ( this.strCurrentBettingPlayerID != '' )
            {
                //console.log(`IGame::LeaveSetting (BetUser : ${this.strCurrentBettingPlayerID}), (LeaveUser : ${user.strID})`);
                if ( this.strCurrentBettingPlayerID == user.strID )
                {
                    const objectBetting = {strBetting:'Fold', iAmount:0};
                    this.ProcessBetting(user, objectBetting);
                }
            }
        }
        //return this.GetNumConnetion();
    }

    DeleteListUser()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.Remove(this.listUsers.GetUser(i));
        }
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
            if ( player.iLocation != -1 && player.bEnable == true && player.strLastBettingAction != 'Fold' && player.iCoin > 0)
            {
                player.bSpectator = false;
                list.push(player.strID);
            }
            else
            {
                player.bSpectator = true;
            }
        }
        return list;
    }

    GetPlacedUser()
    {
        let availableLocations = [];
        let existingLocations = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            existingLocations.push(this.listUsers.GetUser(i).iLocation);
        }
        for (let i = 0; i < this.cMaxPlayer; i++) {
            if (!existingLocations.includes(i)) {
                availableLocations.push(i);
                console.log(`availableLocations : ${i}`);
            }
        }

        if (availableLocations.length > 0) {
            let randomIndex = Math.floor(Math.random() * availableLocations.length);
            return availableLocations[randomIndex];
        }
    }

    GetNumPlacedUser()
    {
        let iNumUsers = 0;
        //for ( let i in this.listUsers )
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            //console.log(this.listUsers.GetSocket(i));
            if ( this.listUsers.GetUser(i).iLocation != -1 )
                ++ iNumUsers;
        }

        return iNumUsers;
    }

    GetNumPlayingUser()
    {
        //console.log(`IGame::GetNumPlayingUser ${this.listUsers.GetLength()}`);

        let iNumUsers = 0;
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if ( player.iLocation != -1 && player.strLastBettingAction != 'Fold' && player.bEnable == true && player.bSpectator == false)
            {
                //console.log(`strID : ${player.strID}, eUserType : ${player.eUserType}, strLastBettingAction : ${player.strLastBettingAction}, bEnable : ${player.bEnable}, iLocation : ${player.iLocation}`);
                ++ iNumUsers;
            }
        }
        return iNumUsers;
    }

    GetPlayingUser()
    {
        let playerlist = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            if(player.iLocation != -1 && player.bSpectator == false && player.iCoin > 0 )
            {
                //console.log(`IGame:::GetPlayingUser ---- strID : ${player.strID}, eUserType : ${player.eUserType}`);
                playerlist.push(player);
            }
        }
        return playerlist;
    }

    //const EnumGameMode = Object.freeze({"Standby":0, "Start":1, "DefaultAnte":2, "BettingPreFlop":3, "Plob":4, "BettingFlop":5, "Turn":6, "BettingTurn":7, "River":8, "RiverBetting":9, "Result":10, "Celebration":11});
    Update()
    {
        ++ this.iElapsedTime;

        if ( this.listReservationMode.length > 0 ){
            this.iDelayTime--;
            if ( this.iDelayTime <= 0 )
            {
                //console.log("listReservationMode : " + this.listReservationMode[0]);
                this.FullBroadcastShowdownTurncard();
                this.SetMode(this.listReservationMode[0]);
                this.listReservationMode = [];
                this.iDelayTime = 0;

            }
        }
        switch ( this.eGameMode )
        {
        case E.EGameMode.Standby:
            {
                const cPlayingUser = this.GetNumPlacedUser();
                //console.log(`IGame::Update : Standby : PlayingUsers = ${cPlayingUser}`);

                if ( this.cMinEnablePlayer <= cPlayingUser )
                {
                    this.SetMode(E.EGameMode.Start);

                    //let ret = this.StartGame();
                    let list = this.GetEnableUserList();

                    for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                        this.listUsers.GetUser(i).socket.emit('SM_StartGame', {listUser:list});
                    //this.listUsers.GetSocket(0).emit('SM_EnableStartGame');
                }
            }
            break;
        case E.EGameMode.Start:
            //this.Start();
            if ( this.iElapsedTime > E.EGameTime.Start )
            {
                this.SetMode(E.EGameMode.BuildPlayerType);
            }
            break;
        case E.EGameMode.BuildPlayerType:
            if ( this.iElapsedTime > E.EGameTime.BuildPlayerType )
            {
                this.SetMode(E.EGameMode.DefaultAnte);
                // if ( this.listUsers.GetLength() > 2 )
                //     this.SetMode(E.EGameMode.DefaultAnteSB);
                // else
                //     this.SetMode(E.EGameMode.DefaultAnteBB);
            }                
            break;
        case E.EGameMode.DefaultAnte:
            if ( this.iElapsedTime > E.EGameTime.DefaultAnte )
            {
                this.SetMode(E.EGameMode.HandCard);
            }
            break;
        case E.EGameMode.HandCard:
            if ( this.iElapsedTime > E.EGameTime.HandCard )
            {
                if(this.bShowdown == true) this.SetMode(E.EGameMode.Flop);
                else this.SetMode(E.EGameMode.BettingPreFlop);
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                        this.listUsers.GetUser(i).socket.emit('SM_Mode', {eMode:'PreFlop'});
            }
            break;
        case E.EGameMode.BettingPreFlop:
            break;
        case E.EGameMode.Flop:
            if ( this.iElapsedTime > E.EGameTime.Flop )
            {
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                    this.listUsers.GetUser(i).socket.emit('SM_HandName');
                if(this.bShowdown == true) 
                {
                    this.SetMode(E.EGameMode.Turn);
                }
                else this.SetMode(E.EGameMode.BettingFlop);
            }
            break;
        case E.EGameMode.BettingFlop:
            break;
        case E.EGameMode.Turn:
            if ( this.iElapsedTime > E.EGameTime.Turn )
            {
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                    this.listUsers.GetUser(i).socket.emit('SM_HandName');
                if(this.bShowdown == true) 
                {      
                    this.SetMode(E.EGameMode.River);
                }
                else
                this.SetMode(E.EGameMode.BettingTurn);
            }
            break;
        case E.EGameMode.BettingTurn:
            break;
        case E.EGameMode.River:
            if ( this.iElapsedTime > E.EGameTime.River )
            {
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                    this.listUsers.GetUser(i).socket.emit('SM_HandName');
                if(this.bShowdown == true) 
                {
                    this.SetMode(E.EGameMode.Result);
                }
                else this.SetMode(E.EGameMode.BettingRiver);
            }
            break;
        case E.EGameMode.BettingRiver:
            break;    
        case E.EGameMode.Result:
            if ( this.iElapsedTime > E.EGameTime.Result )
            {
                //this.SetMode(E.EGameMode.Standby);
                this.SetMode(E.EGameMode.RebuyIn);
            }
            break;
        case E.EGameMode.RebuyIn:
            if ( this.iElapsedTime > E.EGameTime.RebuyIn )
            {
                this.SetMode(E.EGameMode.Standby);
            }
            break;
        }
    }

    SetMode(eGameMode)
    {
        console.log(`IGame::SetMode ${eGameMode}`);
        this.iCurrentBettingID = '';
        switch ( eGameMode )
        {
        case E.EGameMode.Standby:
            this.Initialize();
            break;
        case E.EGameMode.Start:
            //this.Start();
            this.StartGame();
            break;
        case E.EGameMode.BuildPlayerType:
            this.BuildPlayerType();
            //console.log(`=>BuildPlayerType`);
            break;
        case E.EGameMode.DefaultAnte:
            this.DefaultAnte();
            break;
        // case E.EGameMode.DefaultAnteSB:
        //     this.DefaultAnteSB();
        //     break;
        // case E.EGameMode.DefaultAnteBB:
        //     this.DefaultAnteBB();
        //     break;
        case E.EGameMode.HandCard:
            this.SetHandCard();
            break;
        case E.EGameMode.BettingPreFlop:
            this.StartBetting(true);
            break;
        case E.EGameMode.Flop:
            this.SetFlopCard();
            break;
        case E.EGameMode.BettingFlop:
            this.StartBetting(false);
            break;
        case E.EGameMode.Turn:
            this.SetTurnCard();
            break;
        case E.EGameMode.BettingTurn:
            this.StartBetting(false);
            break;
            case E.EGameMode.River:
            this.SetRiverCard();
            break;
        case E.EGameMode.BettingRiver:
            this.StartBetting(false);
            break;
        case E.EGameMode.Result:
            this.ProcessResult();
            break;
        case E.EGameMode.RebuyIn:
            this.ProcessRebuyIn();
            break;
        }
        this.eGameMode = eGameMode;
        this.iElapsedTime = 0;
        //console.log(eGameMode);
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
        }
    }

    BroadcastJoinUser(user)
    {
        //console.log(`BroadcastJoinUser : ${this.listUsers.GetLength()}`);

        let objectPlayer = {strID:user.strID, iLocation:user.iLocation};

        this.Broadcast(user, 'SM_BroadcastJoinUser', objectPlayer);
    }

    BroadcastLeaveUser(user)
    {
        //console.log(`BroadcastLeaveUser : ${this.listUsers.GetLength()}`);

        let objectPlayer = {strID:user.strID, iLocation:user.iLocation};

        this.Broadcast(user, 'SM_BroadcastLeaveUser', objectPlayer);
    }

    BroadcastPlaceUser(user)
    {
        //console.log(`BroadcastPlaceUser`);

        let objectPlayer = {strID:user.strID, strNickname:user.strNickname, iCoin:user.iCoin, iLocation:user.iLocation, iAvatar:user.iAvatar};

        this.Broadcast(user, 'SM_BroadcastPlaceUser', objectPlayer);
    }

    // FullBroadcastPlaceUser(socket)
    // {
    //     console.log(`FullBroadcastPlaceUser`);

    //     let objectPlayer = {strID:socket.strID, iCoin:socket.iCoin, iLocation:socket.iLocation};

    //     this.FullBroadcast('SM_FullBroadcastPlaceUser', objectPlayer);
    // }

    FullBroadcastPlayerType()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);

            let objectPlayer = {strID:player.strID, strPlayerType:player.strPlayerType};
            list.push(objectPlayer);
        }

        this.FullBroadcast('SM_FullBroadcastPlayerType', list);
    }

    FullBroadcastDefaultAnte()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            if(player.bSpectator == false && player.iLocation != -1)
            {
                let iBettingCoin = this.iDefaultCoin;
                if(player.strPlayerType == 'BB')
                {
                    iBettingCoin = this.iDefaultCoin*2;
                }
                const iCallAmount = this.iDefaultCoin*2 - iBettingCoin;
                let objectPlayer = {
                    strID: player.strID,
                    strNickname: player.strNickname,
                    iCoin: player.iCoin,
                    iCash: player.iCash,
                    iBettingCoin: iBettingCoin,
                    iCallAmount: iCallAmount
                };
                list.push(objectPlayer);
            }
        }

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.GetUser(i).socket.emit('SM_DefaultAnte', list, this.iTotalBettingCoin);
        }
    }

    BroadcastDefaultAnteSB(socket, iCoin, iBettingCoin, iTotalBettingCoin, iCallAmount)
    {
        let objectPlayer = {strID:socket.strID, iCoin:iCoin, iBettingCoin:iBettingCoin, iTotalBettingCoin:iTotalBettingCoin, listPots:this.listPots, iCallAmount:iCallAmount};

        this.Broadcast(socket, 'SM_BroadcastDefaultAnteSB', objectPlayer);
    }

    BroadcastDefaultAnteBB(user, iCoin, iBettingCoin, iTotalBettingCoin)
    {
        let objectPlayer = {strID:user.strID, iCoin:iCoin, iBettingCoin:iBettingCoin, iTotalBettingCoin:iTotalBettingCoin, listPots:this.listPots};

        this.Broadcast(user, 'SM_BroadcastDefaultAnteBB', objectPlayer);
    }

    FullBroadcastBetting(user, iCoin, iCash,iBettingCoin, strBetting, iTotalBettingCoin, iCallAmount, latency)
    {
        let objectPlayer = {strID:user.strID, iCoin:iCoin, iCash:iCash,iBettingCoin:iBettingCoin, strBetting:strBetting, iTotalBettingCoin:iTotalBettingCoin,listPots:this.listPots, iCallAmount:iCallAmount, latency};

        this.FullBroadcast('SM_FullBroadcastBetting', objectPlayer);
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

    FullBroadcastJackpot(iJackpot)
    {
        let objectData = {iJackpot:iJackpot};
        
        this.FullBroadcast('SM_JackpotUpdate', objectData);
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
    
    FullBroadcastShowCard(user, objectData)
    {
        let objectPlayer = {strID:user.strID, iCard1:objectData.iCard1, iCard2:objectData.iCard2}
        this.FullBroadcast('SM_FullBroadcastShowCard', objectPlayer);
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

    FullBroadcastShowdownTurncard()
    {
        //console.log ("_________________FullBroadcastShowdownTurncard");
        let listData = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' )
                continue;
            if ( player.iLocation == -1 || player.bEnable == false )
                continue;


            let objectData = {  strID:player.strID, 
                                iCard1:player.listHandCard[0], 
                                iCard2:player.listHandCard[1],
                            };

            listData.push(objectData);
        }
        
        this.FullBroadcast('SM_ShowDownTurnCard', listData);
    }

    FullBroadcastHandCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.bEnable == true && player.iLocation != -1 && player.strLastBettingAction != 'Fold')
            {
                let listCards = this.listUsers.GetUser(i).listHandCard;
                let objectHand = [];
                if(listCards.length != 0)
                {
                    if(player.bSpectator == false && player.iLocation != -1)
                    {
                        let combinedCards = listCards.concat(this.listOriginalTableCard);

                        objectHand = this.ProcessPokerHand(player);
                        //console.log(`iGame :: FullBroadcastHandCard combinedCards - `);
                        combinedCards = this.ConvertCardList(combinedCards);
                        //console.log(combinedCards);
                        player.simulator = combinedCards;
                    }
                    this.listUsers.GetUser(i).socket.emit('SM_HandCard', listCards, objectHand.handmade, this.listPots);
                }
            }
        }
        this.SimulatorRank();
    }

    FullBroadcastFlopCard()
    {
        //console.log(this.listCardDeck);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            let listCards = this.listTableCard;
            let objectHand = {};          
            //console.log(`FullBroadcastFlopCard!!!!!!!!!!!`);  
            //console.log(player.bSpectator);
            if(player.bSpectator == false && player.iLocation != -1)
            {
                objectHand = this.ProcessPokerHand(player);
            }
            
            player.socket.emit('SM_FlopCard', listCards, objectHand.handmade, this.listPots, this.iRecentTotalBettingCoin, this.iTotalBettingCoin);
        }
    }

    FullBroadcastTurnCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            let listCards = this.listTableCard;
            let objectHand = {};        
            //console.log(`FullBroadcastTurnCard!!!!!!!!!!!`);      
            //console.log(player.bSpectator);
            if(player.bSpectator == false && player.iLocation != -1)
            {
                objectHand = this.ProcessPokerHand(player);
            }
            player.socket.emit('SM_TurnCard', listCards, objectHand.handmade, this.listPots, this.iRecentTotalBettingCoin, this.iTotalBettingCoin);
        }
    }

    FullBroadcastRiverCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            let listCards = this.listTableCard;
            let objectHand = {};      
            //console.log(`FullBroadcastRiverCard!!!!!!!!!!!`);        
            //console.log(player.bSpectator);
            if(player.bSpectator == false && player.iLocation != -1)
            {
                objectHand = this.ProcessPokerHand(player);
            }
            player.socket.emit('SM_RiverCard', listCards, objectHand.handmade, this.listPots, this.iRecentTotalBettingCoin, this.iTotalBettingCoin);
        }
    }

    FullBroadcastResult()
    {
        let listResult = [];
        let strWinnerHand = '';
        let strWinnerDescr = '';
        let strWinner = '';

        const cPlayingUser = this.GetNumPlayingUser();
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' )
                continue;
                
            if ( player.iLocation == -1 || player.bEnable == false )
                continue;

            //let player = this.listUsers.GetSocket(i);

            let objectData = {  strID:player.strID, 
                                strNickname:player.strNickname,
                                iCard1:player.listHandCard[0], 
                                iCard2:player.listHandCard[1], 
                                strHand:player.strHand,
                                iRank:player.iRank,
                                iWinCoin:player.iWinCoin,
                                iCoin:player.iCoin,
                                iCash:player.iCash,
                                strDescr:player.strDescr,
                                iJackpot:this.iJackpotAmount,
                            };

            listResult.push(objectData);

            if ( player.iRank == 1 )
            {
                strWinner = player.strID;
                strWinnerHand = player.strHand;
                strWinnerDescr = player.strDescr;
            }
        }

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.GetUser(i).socket.emit('SM_Result', listResult, this.listTableCard, this.listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser, this.listPots, this.roundUnique, this.iRecentTotalBettingCoin, this.iTotalBettingCoin);
            if(this.listUsers.GetUser(i).strID == strWinner)
            {
                this.listUsers.GetUser(i).socket.emit('SM_ResultUpdateCoin',listResult, cPlayingUser);
            }
        }
        //if(this.iJackpotRound >= this.jackpotInfo.iLevel3Round) this.iJackpotRound = 0;
    }

    FullBroadcastRebuyIn()
    {
        let listObject = [];

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
            let iBuyIn = parseInt(player.strOptionCode[1]) * 100;
            const iEnableRebuyIn = player.strOptionCode[0];
            console.log(`FullBroadcastRebuyIn (iBuyIn : ${iBuyIn}): ${player.strID} Cash : ${player.iCash}, Option : ${player.strOptionCode}, iCoin : ${player.iCoin}, bMenualRebuyin : ${player.bMenualRebuyin}`);

            let bQuit = false;
            let iRebuyinCoin = 0;

            if(player.iCoin <= parseInt(this.iDefaultCoin*2)){
                if ( iEnableRebuyIn == 1)
                {
                    const iRebuyInOdds = iBuyIn;
                    const cRebuyInAmount = parseInt(this.iDefaultCoin)*iRebuyInOdds;

                    //console.log(`RebuyIn : ${iEnableRebuyIn}, Odds ${iRebuyInOdds}, Amount : ${cRebuyInAmount}`);

                    if ( player.iCash >= (cRebuyInAmount-parseInt(player.iCoin)))
                    {
                        player.iCash -= (cRebuyInAmount-parseInt(player.iCoin));
                        iRebuyinCoin = (cRebuyInAmount-parseInt(player.iCoin));
                        player.iCoin = parseInt(cRebuyInAmount);
                    }
                    else if(player.iCash >= parseInt(this.iDefaultCoin*2))
                    {
                        player.iCoin += parseInt(player.iCash);
                        iRebuyinCoin = parseInt(player.iCash);
                        player.iCash = 0;
                    }
                    else
                    {
                        //console.log(`Auto Quit : Not Enough Cash On RebuyIn`);
                        //player.emit('SM_Quit', {code:'NotEnoughCash'});
                        bQuit = true;
                    }
                    player.bMenualRebuyin = false;
                }
                else if(iEnableRebuyIn == 0)//  리바인 사용 안함
                {
                    //console.log(`iGame::Rebuyin iEnableRebuyIn 0 ID = ${obj.strID}`);
                    bQuit = true;
                }
                else
                {
                    //console.log(`IGame :: FullBroadcastRebuyIn() :: Else`);
                }
            }
            else if (player.bMenualRebuyin == true) {
                const iRebuyInOdds = iBuyIn;
                const cRebuyInAmount = parseInt(this.iDefaultCoin) * iRebuyInOdds;

                //console.log(`RebuyIn : ${iEnableRebuyIn}, Odds ${iRebuyInOdds}, Amount : ${cRebuyInAmount}`);

                //수동 리바인 눌렀을떄.
                if (player.iCash >= (cRebuyInAmount - parseInt(player.iCoin))) {
                    if (player.iCoin < cRebuyInAmount) {
                        player.iCash -= (cRebuyInAmount - parseInt(player.iCoin));
                        iRebuyinCoin = (cRebuyInAmount - parseInt(player.iCoin));
                        player.iCoin = parseInt(cRebuyInAmount);
                    }
                }
                else if(player.iCash >= parseInt(this.iDefaultCoin*2))
                {
                    player.iCoin += parseInt(player.iCash);
                    iRebuyinCoin = parseInt(player.iCash);
                    player.iCash = 0;
                }
                else {
                    //console.log(`Auto Quit : Not Enough Cash On RebuyIn`);
                    //bQuit = true;
                }
            }
            let objectData = 
            { 
                strID:player.strID,
                iRebuyinCoin:iRebuyinCoin,
                iCoin:player.iCoin,
                iCash:player.iCash,
                bQuit:bQuit,
                bReserveExit:player.bReserveExit,
                eUserType:player.eUserType
            };
            listObject.push(objectData);
            player.socket.emit('SM_Mode', {eMode:'Rebuyin'});
        }

        let usersToRemove = [];

        // 연결이 끊긴 사용자 or 나가기예약 처리
        for (let i = 0; i < this.listUsers.GetLength(); ++i) {
            const user = this.listUsers.GetUser(i);
            if (user.bConnection == false || user.bReserveExit == true) {
                if (usersToRemove.indexOf(user.strID) == -1) { // 이미 추가된 사용자가 아니라면
                    usersToRemove.push(user.strID);
                }
            }
        }

        // 이제 listObject 배열에서 각 사용자를 처리
        listObject.forEach(obj => {
            const user = this.FindPlayer(obj.strID);
            if (!user) return;

            if (obj.bQuit == true && usersToRemove.indexOf(obj.strID) == -1) { // bQuit가 true이고, 아직 usersToRemove에 없는 경우
                usersToRemove.push(obj.strID);
            }
            user.socket.emit('SM_RebuyIn', listObject);
        });

        // 연결이 끊긴 사용자와 bQuit이 true인 사용자를 모두 처리
        usersToRemove.forEach(userId => {
            const user = this.FindPlayer(userId);
            if (user) {
                this.BroadcastLeaveUser(user);
                this.RemoveUser(user);
            }
        });
    }

    AddUser(user)
    {
        this.listUsers.Add(user);
        this.PrintRoomUsers();
    }

    // SwitchUser(strID, socket)
    // {
    //     const index = this.FindPlayerIndex(strID);
    //     if ( index != -1 )
    //     {

    //         console.log(`##### SwitchUser : ${index}`);
    //         this.listUsers.listSockets.splice(index, 1);
    //         this.listUsers.listSockets.splice(index, 0, socket);

    //         console.log(`${this.listUsers.listSockets.length}`);
    //     }
    // }

    RemoveUser(user)
    {
        this.listUsers.Remove(user);
        this.PrintRoomUsers();

        return this.listUsers.GetLength();
    }

    SetLocation(user, iLocation)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++i )
        {
            if ( this.listUsers.GetUser(i).iLocation == iLocation )
                return false;
        }
        user.iLocation = iLocation;
        user.bEnable = false;

        this.BroadcastPlaceUser(user);
        //this.FullBroadcastPlaceUser();

        return true;
    }
    
    FindPlayerIndex(strID)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( strID == this.listUsers.GetUser(i).strID )
                return i;
        }
        return -1;
    }

    FindUserFromSocketID(socketid)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetSocket(i).id == socketid )
                return this.listUsers.GetUser(i);
        }
        return null;
    }

    FindPlayer(strID)
    {
        //console.log(`IGame::FindPlayer : ${strID}, listLength : ${this.listUsers.GetLength()}`);

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            //console.log(`=> Compare : ${strID} and ${this.listUsers.GetUser(i).strID}`);
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
            //console.log(`iLocation ${iLocation}, socket Location : ${this.listUsers.GetUser(i).iLocation}`);
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
        for ( let i = 0; i < this.cMaxPlayer; ++ i )
        {
            const cLoc = Math.floor((cLocation+i)%this.cMaxPlayer);
            if ( cLoc != cLocation && cLoc != cDealerLocation )
                list.push(cLoc);
        }
        this.SortLocationList(list, cDealerLocation);
        //console.log(`IGame::FindNextPlayer cLocation : ${cLocation}, cDealerLocation : ${cDealerLocation}`);
        //console.log(list);

        // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        //     console.log(`Player Location ${this.listUsers.GetUser(i).strID}, ${this.listUsers.GetUser(i).iLocation}, ${this.listUsers.GetUser(i).strLastBettingAction}`);

        for ( let j in list )
        {
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                const cUser = this.listUsers.GetUser(i);

                if ( cUser.iLocation == list[j] && 
                    cUser.strLastBettingAction != 'Fold' && 
                    cUser.strLastBettingAction != 'Allin' && 
                    cUser.bEnable == true &&
                    cUser.bSpectator == false ) 
                {

                    //console.log(`FindNextUser : ${list[j]}, socket : ${this.listUsers.GetUser(i).strID}`);

                    return cUser;
                }
            }     
        }
        return null;
    }

    BuildPlayerType()
    {
        console.log(`IGame::BuildPlayerType`);
        //const cMaxUsers = this.listUsers.GetLength();
        let cDealerLocation = 0;
        let iNextLocation = 0;

        //  Default Setting about Player Types
        //  User will get the type based on Default Player types
        let cNumPlayerType = 3;
        let cPlayerType = ['Dealer', 'SB', 'BB'];
        //const cPlayingUser = this.GetNumPlacedUser();
        const cPlayingUser = this.GetNumPlayingUser();
        this.iNumPlayingUser = cPlayingUser;
        if ( cPlayingUser <= 1 )
        {
            //console.log(`##### BuildPlayerType : ${cPlayingUser} to Result`);

            this.SetMode(E.EGameMode.Standby);
            return;
        }
        if ( 2 == cPlayingUser )
        {
            cNumPlayerType = 2;
            cPlayerType = ['Dealer', 'BB'];
        }

        //  Location of the User on the Table
        let listLocations = [];

        //  Initialize All Players Type to null
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            this.listUsers.GetUser(i).strPlayerType = '';
        }
        
        //  Build Location List
        if (this.iDealerLocationLast == -1)
        {
            // listUsers의 길이만큼 반복
            for (let i = 0;  i < this.listUsers.GetLength(); i++) {
                let currentLocation = this.listUsers.GetUser(i).iLocation;
                if (currentLocation != -1) {
                    cDealerLocation = currentLocation;
                    break;  // 적절한 위치를 찾았으므로 반복문 종료
                }
            }
        }
        else{
            let player = this.FindNextPlayer(this.iDealerLocationLast, -1);
            cDealerLocation = player.iLocation;
        }
        //console.log(`cDealerLocation~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        //console.log(cDealerLocation);
        iNextLocation = cDealerLocation;
        listLocations.push(iNextLocation);
        this.Shuffle(cDealerLocation);

        for ( let i = 0; i < this.listUsers.GetLength()-1; ++ i )
        {
            let player = this.FindNextPlayer(iNextLocation, cDealerLocation);

            //  If player is null it's occured Critical-Error!!!
            if ( null != player )
            {
                //  Add next players index to array
                listLocations.push(player.iLocation);
                iNextLocation = player.iLocation;
            }
        }
        //console.log("-------------------cDealerLocation : " + cDealerLocation + " iNextLocation : " + iNextLocation);

        //  Setting the Type of Player by PlayerType Constant Values
        for ( let i = 0; i < cNumPlayerType; ++ i )
        {
            console.log(`Find Location ${i}, listLocations ${listLocations[i]}`);
            let player = this.FindPlayerInLocation(listLocations[i]);

            if ( null != player )
            {
                player.strPlayerType = cPlayerType[i];
                player.bNewPlaying = false;
                //console.log(`IGame::BuildPlayerType : Player in location ${i} is ${player.strID}`);
            }
            else 
            {
                //console.log(`IGame::BuildPlayerType : There is no user in the index ${i}`);
            }
        }

        //console.log(`BuildPlayerType : FullBroadcast`);
        this.iDealerLocationLast = cDealerLocation;
        
        this.FullBroadcastPlayerType();
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

    StartBetting(bPreFlopBetting)
    {
        //console.log(`------------------------------------------------------------------------------- StartBetting`);
        if(bPreFlopBetting == true) this.eState = 'PREFLOP';
        //  Test Console
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).strLastBettingAction != 'Fold' && this.listUsers.GetUser(i).strLastBettingAction != 'Allin')
                this.listUsers.GetUser(i).strLastBettingAction = '';
        }
        //
        this.iRecentTotalBettingCoin = this.iTotalBettingCoin;

        this.iBettingLocationLast = this.GetDealerLocation();
        if ( bPreFlopBetting == true )
            this.iBettingLocationLast = this.GetBBLocation();

        if ( true == bPreFlopBetting )
        {
            this.listEnableBettingType.push('Call');
        }

        let player = this.FindNextPlayer(this.iBettingLocationLast, -1);
        if ( null != player )
        {
            for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                let tplay = this.listUsers.GetUser(i);
               
                if (tplay.strID == player.strID) {
                    this.iCurrentBettingID = tplay.strID;
                    
                    const iCallAmount = this.iRecentPlayersBettingCoin - player.iTotalBettingCoin;
                    this.iCallAmount = iCallAmount;

                    if (tplay.bConnection == true) {
                        this.CalculateEnableBettingList(tplay, iCallAmount, this.iTotalBettingCoin, bPreFlopBetting);
                        tplay.socket.bReserveBet = false;
                        tplay.socket.emit('SM_ReserveBet', false, false);
                        tplay.socket.emit('SM_EnableBetting', { iCallAmount: iCallAmount, listEnableBettingType: this.listEnableBettingType, iBettingTime: this.iBettingTime, handcard: tplay.listHandCard, strIDjoker: this.strIDjoker, eState: this.eState, iDefaultCoin: this.iDefaultCoin, tableCards: this.tableCards, iTotalBettingCoin: this.iTotalBettingCoin, iCoin: tplay.iCoin });
                        
                        this.strCurrentBettingPlayerID = tplay.strID;
                    }
                    else {
                        if (iCallAmount == 0) {
                            let objectBetting = { strBetting: 'Check', iAmount: 0 };
                            this.ProcessBetting(tplay, objectBetting);
                        }
                        else {
                            let objectBetting = { strBetting: 'Fold', iAmount: 0 };
                            this.ProcessBetting(tplay, objectBetting);
                        }
                    }
                }
                else
                {
                    tplay.socket.emit('SM_Focus', { strID: player.strID, iBettingTime: this.iBettingTime });
                } 
                tplay.socket.emit('SM_CallAmoutUpdate', 0);
            }

            this.iBettingLocationLast = player.iLocation;
        }
        //console.log(`Last Betting Location : ${this.iBettingLocationLast}`);
    }

    CalculateBettingAmount(user, objectBetting)
    {
        const strBetting = objectBetting.strBetting;

        const cAmount = parseInt(objectBetting.iAmount);

        const iCallAmount = this.iRecentPlayersBettingCoin - user.iTotalBettingCoin;
        //console.log(`IGame :: CalculateBettingAmount iCallamout : ${iCallAmount}`);
        let iAmount = 0;
        let iPot = this.iTotalBettingCoin;
        let iPotAfterCall = this.iTotalBettingCoin + iCallAmount;

        //console.log(`CalculateBettingAmount : strID : ${user.strID} ${strBetting}, user.iCoin : ${user.iCoin}, iPot : ${iPot}, iCall : ${iCallAmount}, PlayerTotalBet : ${user.iTotalBettingCoin}, RecentPlayerBet : ${this.iRecentPlayersBettingCoin}`);

        switch ( strBetting )
        {
            case 'Quater':
                iAmount = iCallAmount + Math.floor(iPotAfterCall / 4);
                break;
            case 'Half':
                iAmount = iCallAmount + Math.floor(iPotAfterCall / 2);
                break;
            case 'Full':
                iAmount = iCallAmount + iPotAfterCall;
                break;
            case 'Allin':
                iAmount = user.socket.iCoin;
                break;
            case 'Call':
                iAmount = iCallAmount;
                break;
            case 'Fold':
                iAmount = 0;
                break;
            case 'Check':
                iAmount = 0;
                break;
            case 'Raise':
                iAmount = cAmount;
                break;
        }

        this.Betting(user, cAmount, strBetting);
    }

    CalculateEnableBettingList(player, iCallAmount, iTotalBettingCoin, bPreFlop)
    {
        this.listEnableBettingType = [];

        this.listEnableBettingType.push('Fold');
       

        if ( iCallAmount == 0 || player.iCoin == 0 )
        {            
            this.listEnableBettingType.push('Check');
        }
        else
            this.listEnableBettingType.push('Call');
        
        if ( iCallAmount < player.iCoin )
        {
            this.listEnableBettingType.push('Allin');
            this.listEnableBettingType.push('Raise');
        }
        console.log(`CalculateEnableBettingList - `);
        console.log(player.iCoin);
        console.log(`iCallAmount : ${iCallAmount}, iTotalBettingCoin: ${iTotalBettingCoin}`);
        console.log(`Quater : ${Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin)) / 4)}, Half : ${Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin)) / 2)}, Full : ${Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin)))}`);
        if( player.iCoin >= Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin)) / 4))
        {
            this.listEnableBettingType.push('Quater');
        }    
        if( player.iCoin >= Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin)) / 2))
        {
            this.listEnableBettingType.push('Half');
        }
        if( player.iCoin >= Math.floor(parseInt(iCallAmount) + (parseInt(iCallAmount) + parseInt(iTotalBettingCoin))))
        {
            this.listEnableBettingType.push('Full');
        }
    }
    FindUserAtBettingList(listAlign, strID)
    {
        for ( let i in listAlign )
        {
            if ( listAlign[i].strID == strID )
            {
                return i;
            }
        }
        return -1;
    }

    ComputeEachBetting()
    {
        let listPlayerAlign = [];
        for ( let i in this.listBet )
        {
            const index = this.FindUserAtBettingList(listPlayerAlign, this.listBet[i].strID);
            if ( -1 == index )
            {
                listPlayerAlign.push({strID:this.listBet[i].strID, iBet:parseInt(this.listBet[i].iAmount)});
            }
            else
            {
                listPlayerAlign[index].iBet += parseInt(this.listBet[i].iAmount);
            }
        }

        if ( listPlayerAlign.length > 0 )
        {
            let iLowest = listPlayerAlign[0].iBet;
            for ( let i = 1; i < listPlayerAlign.length; ++ i )
            {
                if ( iLowest > listPlayerAlign[i].iBet )
                    iLowest = listPlayerAlign[i].iBet;
            }

            for ( let i in listPlayerAlign )
            {
                listPlayerAlign[i].iBet = iLowest;
            }
        }

        return listPlayerAlign;
    }

    CalculateValidAmount(listAlign, strID, iAmount)
    {
        const index = this.FindUserAtBettingList(listAlign, strID);
        if ( index == -1 )
        {
            console.log(`Error`);
            return 0;
        }
        else
        {
            if ( listAlign[index].iBet <= 0 )
                return 0;
            else if ( listAlign[index].iBet >= iAmount )
            {
                listAlign[index].iBet -= iAmount;
                return iAmount;
            }
            else if ( listAlign[index].iBet < iAmount )
            {
                const cAmount = listAlign[index].iBet;
                listAlign[index].iBet = 0;
                return cAmount;
            }
        }
        return 0;
    }

    UpdateCompletedBetting()
    {
        const listData = this.ComputeEachBetting();

        for ( let i in this.listBet )
        {
            const iValidAmount = this.CalculateValidAmount(listData, this.listBet[i].strID, this.listBet[i].iAmount);

            //console.log(`strID : ${this.listBet[i].strID}, iAmount : ${this.listBet[i].iAmount}, iValidAmount : ${iValidAmount}`);

            this.listDBUpdate.push({
                iProcessingID:this.GetProcessingID(),
                iDB:E.EDBType.RecordBets, 
                iSubDB:0, 
                strID:this.listBet[i].strID, 
                iAmount:this.listBet[i].iAmount, 
                iValidAmount:iValidAmount, 
                strBetting:this.listBet[i].strBetting, 
                strGroupID:this.listBet[i].strGroupID, 
                iClass:this.listBet[i].iClass});
        }

        this.listBet = [];
    }

    IsBettingComplete()
    {
        let listCheck = [];
        let iAmount = 0;

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            //console.log(`#IsBettingComplete : ${player.strID} : BetCoin : ${player.iTotalBettingCoin}, MaxBetCoin on Table : ${this.iRecentPlayersBettingCoin}`);

            if ( player.iLocation == -1 )
                continue;

            if ( player.bEnable == false )
                continue;
            
            if ( player.strLastBettingAction == 'Fold' )
                continue;

            //  Not bet yet
            if ( player.strLastBettingAction == '' )
            {
                listCheck.push(`IsBettingComplete index : ${i}, not bet`);
                return false;
            }

            if ( player.iCoin > 0 && player.iTotalBettingCoin < this.iRecentPlayersBettingCoin )
                return false;
        }
        return true;
    }

    IsShowdown()
    {
        let iNumCoinUsers = 0;

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);
            //console.log(` iLocation : ${player.iLocation}, bEnable : ${player.bEnable}, strLastBettingAction : ${player.strLastBettingAction}, iCoin ${player.iCoin}`);

            if ( player.iLocation != -1 && player.bEnable != false && player.strLastBettingAction != 'Fold' && player.iCoin > 0 )
                ++  iNumCoinUsers;
        }

        if ( iNumCoinUsers > 1 )
        {
            return false;
        }

        return true;
    }

    ProcessNextBetting()
    {
        //
        let player = this.FindNextPlayer(this.iBettingLocationLast, -1);
        if ( null != player )
        {
            this.iCallAmount = this.iRecentPlayersBettingCoin - player.iTotalBettingCoin;
            if ( this.iCallAmount <= 0 )
                this.iCallAmount = 0;
            //console.log(`IGame::ProcessBetting CallAmount : ${this.iCallAmount}, RecentPlayers Coin : ${this.iRecentPlayersBettingCoin}, My Coin : ${player.iTotalBettingCoin}`);

            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                let tplay = this.listUsers.GetUser(i);

                if (tplay.strID == player.strID) {
                    this.iCurrentBettingID = tplay.strID;

                    if (tplay.bConnection == true && tplay.bReserveBet == false) {

                        this.CalculateEnableBettingList(tplay, this.iCallAmount, this.iTotalBettingCoin, false);

                        tplay.socket.emit('SM_EnableBetting', { iCallAmount: this.iCallAmount, listEnableBettingType: this.listEnableBettingType, iBettingTime: this.iBettingTime, handcard: tplay.listHandCard, strIDjoker: this.strIDjoker, eState: this.eState, iDefaultCoin: this.iDefaultCoin, tableCards: this.tableCards, iTotalBettingCoin: this.iTotalBettingCoin, iCoin: tplay.iCoin });

                        this.strCurrentBettingPlayerID = tplay.strID;
                    }
                    else {
                        if (this.iCallAmount == 0) {
                            tplay.bReserveBet = false;
                            let objectBetting = { strBetting: 'Check', iAmount: 0 };
                            this.ProcessBetting(tplay, objectBetting);
                            tplay.socket.emit('SM_ReserveBet', false, false);
                        }
                        else {
                            let objectBetting = { strBetting: 'Fold', iAmount: 0 };
                            this.ProcessBetting(tplay, objectBetting);
                            tplay.socket.emit('SM_ReserveBet', false, false);
                        }
                    }
                }
                else
                {
                    tplay.socket.emit('SM_Focus', {strID:player.strID, iBettingTime:this.iBettingTime});
                }
                tplay.socket.emit('SM_CallAmoutUpdate', this.iCallAmount);
            }


            this.iBettingLocationLast = player.iLocation;
        }
        //console.log(`iGame::ProcessNextbetting - Last Betting Location : ${this.iBettingLocationLast}`);
    }

    Betting(user, iAmount, strBetting)
    {
        const iBettingCoin = parseInt(iAmount);
        const iPlayerCoin = parseInt(user.iCoin) - parseInt(iBettingCoin);

        user.iCoin = parseInt(iPlayerCoin);
        user.iTotalBettingCoin += parseInt(iBettingCoin);
        user.iBettingCoin = parseInt(iBettingCoin);
        user.strLastBettingAction = strBetting;

        this.iTotalBettingCoin += iBettingCoin;
        // Calculate iRealBettingCoin for the current player
        this.calculateRealBettingCoin(user);

        // Update iRealBettingCoin for all players
        this.UpdateRealBettingCoins();

        //if ( socket.strLastBettingAction != 'Fold' &&)
        if ( this.iRecentPlayersBettingCoin < user.iTotalBettingCoin )
            this.iRecentPlayersBettingCoin = user.iTotalBettingCoin;
        this.iBettingLocationLast   = user.iLocation;

        ///console.log(`##### Betting : ${user.strID}, Bet : ${iAmount}, TotalBet : ${user.iTotalBettingCoin}, TableTotal : ${this.iTotalBettingCoin}`);

        //  Origin
        //this.listDBUpdate.push({iDB:E.EDBType.RecordBets, iSubDB:0, strID:socket.strID, iAmount:iAmount, strBetting:strBetting, strGroupID:socket.strGroupID, iClass:socket.iClass});
        //  Change
        this.listBet.push({iDB:E.EDBType.RecordBets, iSubDB:0, strID:user.strID, iAmount:iAmount, strBetting:strBetting, strGroupID:user.strGroupID, iClass:user.iClass});


        for ( let i = 0; i < this.listUsers.GetLength(); ++i )
        {
            //console.log(`id : ${this.listUsers.GetUser(i).strID}, total-bet : ${this.listUsers.GetUser(i).iTotalBettingCoin}, action : ${this.listUsers.GetUser(i).strLastBettingAction}`);
        }

        //console.log(`Table : ${this.iTotalBettingCoin}`);

        //this.ProcessPot(socket, iAmount, strBetting);
        this.ProcessPot();
    }

    calculateRealBettingCoin(currentPlayer) {
        let maxMatchableBet = 0;

        for (let i = 0; i < this.listUsers.GetLength(); ++i) {
            let player = this.listUsers.GetUser(i);
            if (player.strID != currentPlayer.strID && player.iLocation != -1 && player.bSpectator == false) {
                maxMatchableBet = Math.max(maxMatchableBet, player.iTotalBettingCoin);
                //console.log(`IGame::calculateRealBettingCoin maxMatchableBet : ${maxMatchableBet}`);
                if(parseInt(this.iDefaultCoin * 2) >= currentPlayer.iTotalBettingCoin)
                {
                    currentPlayer.iRealBettingCoin = currentPlayer.iTotalBettingCoin;
                    player.iRealBettingCoin = player.iTotalBettingCoin;
                }
                else if (player.iTotalBettingCoin < currentPlayer.iTotalBettingCoin && parseInt(this.iDefaultCoin * 2) < currentPlayer.iTotalBettingCoin) {
                    //isOverBetting = true;
                    currentPlayer.iRealBettingCoin = Math.min(currentPlayer.iTotalBettingCoin, maxMatchableBet);
                }
                else
                {
                    currentPlayer.iRealBettingCoin = currentPlayer.iTotalBettingCoin;
                    player.iRealBettingCoin = currentPlayer.iTotalBettingCoin;
                }
            }
        }

        //console.log(`IGame::calculateRealBettingCoin -- strID : ${currentPlayer.strID}, iRealbettingcoin : ${currentPlayer.iRealBettingCoin}`);
    }
    
    UpdateRealBettingCoins() {
        for (let i = 0; i < this.listUsers.GetLength(); ++i) {
            let player = this.listUsers.GetUser(i);
            if (player.strLastBettingAction != 'Fold' && player.iLocation != -1 && player.bSpectator == false) {
                this.calculateRealBettingCoin(player);
            }
        }
    }

    ProcessBetting(user, objectBetting)
    {
        let latency = 0;
        if(objectBetting.timestamp != undefined || objectBetting.timestamp != null)
	    {
	        latency = Date.now() - objectBetting.timestamp;
	    }
        this.CalculateBettingAmount(user, objectBetting);
        this.FullBroadcastBetting(user, user.iCoin, user.iCash, user.iBettingCoin, objectBetting.strBetting, this.iTotalBettingCoin, this.iCallAmount, latency);

        const cEnablePlayer = this.GetNumPlayingUser();
        //console.log(`##### ProcessBetting : NumEnableUser ${cEnablePlayer} to Result`);
        if(user.iBettingCoin > 0 && this.iCallAmount < user.iBettingCoin)
        {
            user.bReserveBet = false;
            user.socket.emit('SM_ReserveBet', false, false);
        }

        if ( cEnablePlayer <= 1 )
        {
            //console.log(`##### ProcessBetting : ${cEnablePlayer} to Result`);
            //socket.emit('SM_ReserveBet',false,false);
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                this.listUsers.GetUser(i).bReserveBet = false;
                this.listUsers.GetUser(i).socket.emit('SM_ReserveBet', false, false);
            }
            this.iDelayTime = 2;
            this.listReservationMode.push(E.EGameMode.Result);
            //this.SetMode(E.EGameMode.Result);
            return;
        }
        else if ( this.IsBettingComplete() )
        {
            //  For Rolling 
            //this.UpdateCompletedBetting();
            //  end of For Rolling

            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                this.listUsers.GetUser(i).bReserveBet = false;
                this.listUsers.GetUser(i).socket.emit('SM_ReserveBet', false, false);
            }

            const cCash = parseInt(user.iCash) + parseInt(user.iCoin);
            this.listDBUpdate.push(
                {
                    iProcessingID:this.GetProcessingID(),
                    iDB:E.EDBType.Users, iSubDB:0, strID:user.strID, iCash:cCash}
                );
            //  Checking Showdown
            this.bShowdown = this.IsShowdown();

            if ( this.bShowdown == true )
            {
                this.FullBroadcastShowdown();
                //console.log(`############################################### Showdown`);

                this.iDelayTime = 5;
                switch ( this.eGameMode )
                {
                    case E.EGameMode.BettingPreFlop:
                        this.listReservationMode.push(E.EGameMode.Flop);
                        break;
                    case E.EGameMode.BettingFlop:
                        this.listReservationMode.push(E.EGameMode.Turn);
                        break;
                    case E.EGameMode.BettingTurn:
                        this.listReservationMode.push(E.EGameMode.River);
                        break;
                    case E.EGameMode.BettingRiver:
                        this.listReservationMode.push(E.EGameMode.Result);
                    break;
                } 
            }
            else if(this.bShowdown == false)
            {
                //console.log(`############################################### NOT Showdown`);
                switch ( this.eGameMode )
                {
                    case E.EGameMode.BettingPreFlop:
                        this.SetMode(E.EGameMode.Flop);
                        break;
                    case E.EGameMode.BettingFlop:
                        this.SetMode(E.EGameMode.Turn);
                        break;
                    case E.EGameMode.BettingTurn:
                        this.SetMode(E.EGameMode.River);
                        break;
                    case E.EGameMode.BettingRiver:
                        this.SetMode(E.EGameMode.Result);
                    break;
                }
            }
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

    SetShowCard(user, objectData)
    {
        this.FullBroadcastShowCard(user,objectData);
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

            // console.log(`IGame::Start strID : ${player.strID}`);
            if ( this.listUsers.GetUser(i).iLocation != -1 )
            {
                //console.log(`IGame::Start strID : ${player.strID} Enabled`);
                this.listUsers.GetUser(i).bEnable = true;
            }                
        }
        return true;
    }

    DefaultAnte() {
        //console.log(`##### DefaultAnte : iBlind ${this.iDefaultCoin}`);
        // first play game sb 1000 betting
        //this.FullBroadcastFocus(socket.strID);
        for (let i = 0; i < this.listUsers.GetLength(); ++i) {
            let player = this.listUsers.GetUser(i);
            if (player.bSpectator == false && player.iLocation != -1) {
                if (player.strPlayerType == 'BB') {
                    this.Betting(player, this.iDefaultCoin * 2, 'BB');
                }
                else {
                    this.Betting(player, this.iDefaultCoin, 'SB');
                }
            }
        }
        this.FullBroadcastDefaultAnte();
    }

    // DefaultAnteSB()
    // {
    //     let socket = null;
    //     //const cPlayingUser = this.GetNumPlacedUser();
    //     const cPlayingUser = this.GetNumPlayingUser();
    //     if ( cPlayingUser == 2 )
    //         socket = this.FindPlayerFromPlayerType("Dealer");
    //     else
    //         socket = this.FindPlayerFromPlayerType("SB");
    //     //let socket = this.FindPlayerFromPlayerType("SB");
    //     if ( null != socket )
    //     {
    //         console.log(`##### DefaultAnteSB : iBlind ${this.iDefaultCoin}`);
    //         // first play game sb 1000 betting
    //         this.FullBroadcastFocus(socket.strID);
    //         this.Betting(socket, this.iDefaultCoin, 'SB');
    //         socket.bNewPlaying = false;

    //         const objectData = {
    //             strID:socket.strID,
    //             strNickname:socket.strNickname, 
    //             iCoin:socket.iCoin, 
    //             iCash:socket.iCash,
    //             iBettingCoin:this.iDefaultCoin, 
    //             iTotalBettingCoin:this.iTotalBettingCoin,
    //             listPots:this.listPots,
    //         };

    //         console.log(`IGame::DefaultAnteSB`);
    //         console.log(objectData);

    //         if ( socket.bConnection == true )
    //             socket.emit('SM_DefaultAnteSB', objectData);
    //         //this.BroadcastDefaultAnteSB(socket, iPlayerCoin, iBettingCoin, this.iTotalBettingCoin);
    //         const iCallAmount = this.iTotalBettingCoin - this.iDefaultCoin;
    //         this.BroadcastDefaultAnteSB(socket, objectData.iCoin, objectData.iBettingCoin, objectData.iTotalBettingCoin, iCallAmount);
    //         return;
    //     }
    // }

    // DefaultAnteBB()
    // {
    //     //const cPlayingUser = this.GetNumPlayingUser();
    //     let socket = this.FindPlayerFromPlayerType("BB");

    //     if ( null != socket )
    //     {
    //         console.log(`##### DefaultAnteBB : iBlind ${this.iDefaultCoin}`);

    //         this.FullBroadcastFocus(socket.strID);
    //         this.Betting(socket, this.iDefaultCoin*2, 'BB');

    //         const objectData = {
    //             strID:socket.strID, 
    //             strNickname:socket.strNickname,
    //             iCoin:socket.iCoin, 
    //             iCash:socket.iCash,
    //             iBettingCoin:this.iDefaultCoin*2, 
    //             iTotalBettingCoin:this.iTotalBettingCoin,
    //             listPots:this.listPots,
    //         };

    //         if ( socket.bConnection == true )
    //             socket.emit('SM_DefaultAnteBB', objectData);

    //         //this.BroadcastDefaultAnteBB(socket, iPlayerCoin, iBettingCoin, this.iTotalBettingCoin);
    //         this.BroadcastDefaultAnteBB(socket, objectData.iCoin, objectData.iBettingCoin, objectData.iTotalBettingCoin);
    //     }
    //     // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
    //     // {
    //     //     let player = this.FindPlayerNewPlaying();

    //     //     if ( null != player && player.bNewPlaying != false && player.bSpectator == false)
    //     //     {
    //     //         player.bNewPlaying = false;
    //     //         this.Betting(player, this.iDefaultCoin*2, 'BB');
    //     //         const objectData = {
    //     //             strID:player.strID, 
    //     //             iCoin:player.iCoin,
    //     //             iCash:player.iCash,
    //     //             iBettingCoin:this.iDefaultCoin*2, 
    //     //             iTotalBettingCoin:this.iTotalBettingCoin,
    //     //             listPots:this.listPots,
    //     //         };
    //     //         socket.emit('SM_DefaultAnteBB', objectData);

    //     //         this.BroadcastDefaultAnteBB(player, objectData.iCoin, objectData.iBettingCoin, objectData.iTotalBettingCoin);
    //     //     }
    //     //     else 
    //     //     {
    //     //         console.log(`IGame::DefaultAnteBB : There is no user in the index ${i}`);
    //     //     }
    //     // }
    //     //first game join user BB betting
    // }

    SetHandCard()
    {
        let iStartLocation = this.iDealerLocationLast;

        let iCount = 0;
        while ( iCount < 100 )
        {
            let player = this.FindNextPlayer(iStartLocation, -1);
            if ( player != null )
            {
                if ( player.listHandCard.length < 2 && player.strLastBettingAction != 'Fold' && player.bEnable == true && player.bSpectator == false )
                {
                    const iCard = this.listCardDeck[this.iCurrentDeckIndex];
                    ++ this.iCurrentDeckIndex;
                    //console.log(iCard);
                    player.listHandCard.push(iCard);

                    iStartLocation = player.iLocation;
        
                    if ( true == this.IsCompleteHandCard() )
                    {
                        iCount = 100;
                        //console.log(`################################################# Success`);
                        break;
                    }                        
                }
            }
            ++ iCount;
        }

        let tableCardIndex = this.iCurrentDeckIndex;
        for ( let i = 0; i < 5; ++ i )
        {
            const iCard = this.listCardDeck[tableCardIndex];
            ++ tableCardIndex;
            //listFlopCard.push(iCard);

            this.listOriginalTableCard.push(iCard);
        }
        this.FullBroadcastHandCard();
    }

    SetFlopCard()
    {
        //let listFlopCard = [];
        for ( let i = 0; i < 3; ++ i )
        {
            const iCard = this.listCardDeck[this.iCurrentDeckIndex];
            ++ this.iCurrentDeckIndex;
            //listFlopCard.push(iCard);

            this.listTableCard.push(iCard);
        }
        this.eState = 'FLOP';
        this.FullBroadcastFlopCard();
    }

    SetTurnCard()
    {
        const iCard = this.listCardDeck[this.iCurrentDeckIndex];
        ++ this.iCurrentDeckIndex;
        //listFlopCard.push(iCard);

        this.listTableCard.push(iCard);
        this.eState = 'TURN';
        this.FullBroadcastTurnCard();
    }

    SetRiverCard()
    {
        const iCard = this.listCardDeck[this.iCurrentDeckIndex];
        ++ this.iCurrentDeckIndex;
        //listFlopCard.push(iCard);

        this.listTableCard.push(iCard);
        this.eState = 'RIVER';
        this.FullBroadcastRiverCard();
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
        //console.log(`############################################################ ProcessResult`);

        const cPlayingUser = this.GetNumPlayingUser();
        let winner = '';
        if(cPlayingUser <= 1)
        {
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                if ( this.listUsers.GetUser(i).strLastBettingAction == 'Fold' ) continue;
                if ( this.listUsers.GetUser(i).bSpectator == true) continue;
                winner = this.listUsers.GetUser(i).strID;
            }
        }
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' )
                continue;
            if ( player.iLocation == -1 )
                continue;
            if ( player.bEnable == false )
                continue;
            if ( player.bSpectator == true)
                continue;

            player.bNewPlaying = false;
            let objectHand = {};
            if (player.listHandCard.length != 0 && cPlayingUser > 1) {
                objectHand = this.ProcessPokerHand(player);
                player.strHand = objectHand.handname;
                player.objectHand = objectHand.pokerhand;
                player.strDescr = objectHand.handdescr;
            }
        }

        this.ProcessWinner(cPlayingUser, winner);

        this.FullBroadcastResult();

        //  
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetUser(i).iLocation == -1 )
                continue;
            if ( this.listUsers.GetUser(i).bEnable == false )
                continue;
            if ( this.listUsers.GetUser(i).bSpectator == true)
                continue;

            const cCash = parseInt(this.listUsers.GetUser(i).iCash) + parseInt(this.listUsers.GetUser(i).iCoin);
            this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.Users, iSubDB:0, strID:this.listUsers.GetUser(i).strID, iCash:cCash});
        }
    }

    ProcessPokerResult(player)
    {
        let listCard = [];
        if(player.listHandCard.length == 0)
        {
            return null;
        }

        for ( let i in this.listOriginalTableCard )
            listCard.push(this.listOriginalTableCard[i]);

        listCard.push(player.listHandCard[0]);
        listCard.push(player.listHandCard[1]);

        //console.log("ProcessPokerResult!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //console.log(listCard);
        
        let hand = this.ConvertCardList(listCard);

        let pokerhand = poker.solve(hand);
        let handname = pokerhand.name;
        if ( handname == 'Straight Flush')
        {
            if ( pokerhand.descr == 'Royal Flush' )
            handname = 'Royal Flush';
        }
        if ( handname == 'Straight')
        {
            if ( pokerhand.descr == 'Straight, A High' )
            handname = 'Mountain';
        }
        
        //let handdescr = this.TanslateDescr(pokerhand.descr)
        return pokerhand;
    }

    ProcessPokerHand(player)
    {
        let listCard = [];
        if(player.listHandCard.length == 0)
        {
            return null;
        }

        for ( let i in this.listTableCard )
            listCard.push(this.listTableCard[i]);

        listCard.push(player.listHandCard[0]);
        listCard.push(player.listHandCard[1]);

        //console.log("ProcessPokerHand!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        //console.log(listCard);
        
        let hand = this.ConvertCardList(listCard);

        let pokerhand = poker.solve(hand);
        let handname = pokerhand.name;
        if ( handname == 'Straight Flush')
        {
            if ( pokerhand.descr == 'Royal Flush' )
            handname = 'Royal Flush';
        }
        if ( handname == 'Straight')
        {
            if ( pokerhand.descr == 'Straight, A High' )
            handname = 'Mountain';
        }
        
        let handdescr = this.TanslateDescr(pokerhand.descr)
        return {pokerhand:pokerhand, handname:handname, handdescr:pokerhand.descr, handmade:handdescr};
    }
    // 핸드카드 족보 한글 번역.
    TanslateDescr(descr) {
        //console.log("TanslateDescr---------------------------------------------------------------------------------");
        //console.log(descr);
        if (descr === 'Royal Flush') {
            return '로얄 플러쉬';
        }
        if (descr === 'Straight, A High') {
            return '마운틴';
        }
    
        if (descr.startsWith('Pair, ')) {
            let cardValue = descr.replace("Pair, ", "").replace(/'s/, '');
            return cardValue + ' 페어';
        }
    
        if (descr.startsWith('Two Pair, ')) {
            let parts = descr.replace('Two Pair, ', '').split(' & ');
             // 각 파트의 's' 제거
            parts[0] = parts[0].replace("'s", "");
            parts[1] = parts[1].replace("'s", "");
            return parts[0] + ' & ' + parts[1] + ' 투페어';
        }
    
        if (descr.startsWith('Full House, ')) {
            let parts = descr.replace('Full House, ', '').split(' over ');
            parts[0] = parts[0].replace("'s", "");
            parts[1] = parts[1].replace("'s", "");
            return parts[0] + ' 오버 ' + parts[1] + ' 풀하우스';
        }
    
        if (descr.startsWith('Three of a Kind, ')) {
            let cardValue = descr.replace('Three of a Kind, ', '').replace(/'s/, '');
            return cardValue + ' 트리플';
        }
    
        if (descr.startsWith('Straight, ')) {
            let cardValue = descr.replace('Straight, ', '').split(' High');
            return cardValue + ' 스트레이트';
        }
    
        if (descr.startsWith('Flush, ')) {
            let cardValue = descr.replace('Flush, ', '').split(' High')[0];
            
            const suitMap = {
                's': '스페이드',
                'd': '다이아',
                'c': '클로버',
                'h': '하트'
            };
        
            let suit = cardValue.charAt(cardValue.length - 1);
            let value = cardValue.substring(0, cardValue.length - 1); // 마지막 문자 제외한 값을 가져옴
            
            return value + suitMap[suit] + ' 플러쉬';
        }
    
        if (descr.startsWith('Straight Flush, ')) {
            let cardValue = descr.replace('Straight Flush, ', '');
            return cardValue + ' 스트레이트 플러쉬';
        }
    
        if (descr.endsWith(' High')) {
            return descr.replace(' High', ' 하이');
        }
        return descr;  // 번역되지 않는 경우 원본 반환
    }    

    ProcessRebuyIn()
    {
        this.FullBroadcastRebuyIn();
    }

    ProcessWinner(cPlayingUser, winner)
    {
        //console.log(`IGame::ProcessWinner cPlayerUser -> ${cPlayingUser}, winner -> ${winner}`);
        if(cPlayingUser <= 1 && winner != '')
        {
            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            {
                let player = this.listUsers.GetUser(i);
                if(player.strID == winner)
                {
                    player.iRank = 1;
                }
            }
        }
        else
        {
            this.CalculateRank();
        }


        this.CalculatePot();

        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);
           // console.log(`ProcessWinner : ${player.strID}, #Rank : ${player.iRank}, $Win : ${player.iWinCoin}, $Coin : ${player.iCoin}`);
        }
    }

    CalculateRank()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' || player.iLocation == -1 || player.bEnable == false || player.bSpectator == true )
                continue;

            list.push(this.listUsers.GetUser(i).objectHand);
        }

        let iRank = 0;
        while (1)
        {
            let winner = poker.winners(list);
            if ( winner.length > 0 )
            {
                ++ iRank;

                for ( let j in winner )
                {
                    this.RemoveWinnerList(list, winner[j]);

                    for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                    {
                        const player = this.listUsers.GetUser(i);
    
                        if ( player.iLocation == -1 || player.bEnable == false || player.strLastBettingAction == 'Fold' || player.bSpectator == true)
                            continue;
    
                        if ( true == this.IsSameCard(player.objectHand.cards, winner[j].cards) )
                            player.iRank = iRank;
    
                        if ( player.iRank == 1 ) {
                            this.ProcessWinCards(player.objectHand.cards, winner[j].name);
                        }                            
                    }
    
                }
            }

            if ( list.length == 0 )
                break;
        }
    }

    SimulatorRank()
    {
        let list = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' || player.iLocation == -1 || player.bEnable == false || player.bSpectator == true )
                continue;

            let hand = poker.solve(player.simulator);
            hand.playerID = player.strID;  // 카드와 플레이어 ID 연결
            list.push(hand);
        }

        // 승자 결정
        let winners = poker.winners(list);

        //console.log(`SimulatorRank()`);
        //console.log(winners);

        // 승자와 플레이어 매칭
        winners.forEach(winnerHand => {
            let winnerPlayerID = winnerHand.playerID;
            //console.log(`승리자 ID: ${winnerPlayerID}`);
            this.strIDjoker = winnerPlayerID;  // 승리한 플레이어의 ID 저장
        });
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

    Shuffle(dealLocation)
    {
        this.listCardDeck = [];
        for (let i = 0; i < 52; ++i)
            this.listCardDeck.push(i);

        this.listCardDeck = this.shuffleArray(this.listCardDeck);

        let players = this.GetPlayingUser();
        let currentLocation = dealLocation;
        let handCards = {};
        let tableCards = null;
        let WinHandCard = null;

        for (let i = 0; i < players.length; i++) {
            //console.log(`${players[i].iLocation} , ${currentLocation}`);
            let currentPlayer = this.FindNextPlayer(currentLocation, -1);
            //console.log(currentPlayer);
            if(currentPlayer != null)
            {
                if (currentPlayer.eUserType == 'JOKER' && Math.random() < 0.15) {
                //if (currentPlayer.eUserType == 'JOKER') { // test 버전 joker 무조건 이기기.
                    //console.log(`JOKER!!!! : ${currentPlayer.strID}`);
                    let winningType = this.chooseWinningType();
                    this.strIDjoker = currentPlayer.strID;
                    let { handCards: winningHand, tableCards: cardsOnTable } = this.chooseWinningCards(currentPlayer.iLocation, winningType);
                    handCards = { ...handCards, ...winningHand }; // merging winningHand into handCards
                    tableCards = cardsOnTable;    
                    WinHandCard = Object.values(winningHand).flat();            

                    for (let j = 0; j < players.length; j++) {
                        //console.log(`${players[j].iLocation} , ${currentPlayer.iLocation}`);
                        if (players[j].iLocation != currentPlayer.iLocation) {
                            //console.log(winningType, tableCards, Object.values(handCards).flat());
                            //console.log(`!!!!!!!!!!!@@@@@@@@@@@@@@@@`);
                            //console.log(`loserid : ${players[j].strID}`);
                            handCards[players[j].iLocation] = this.chooseLosingHandCards(winningType, tableCards, WinHandCard, Object.values(handCards).flat(), players.eUserType);
                        }
                    }
                    break;
                }
                currentLocation = currentPlayer.iLocation;
            }
        }

        if (tableCards && handCards) {
            let sortedHandCards = [];
            let currentLocation2 = dealLocation;
            
            // 첫 번째 라운드에서 모든 플레이어에게 카드 한 장씩 분배
            for (let i = 0; i < players.length; i++) {
                currentLocation2 = this.FindNextPlayer(currentLocation2, -1).iLocation;
                //console.log(handCards[currentLocation][0]);
                sortedHandCards.push(handCards[currentLocation2][0]);
            }
            
            // 위치 초기화
            currentLocation2 = dealLocation;
            
            // 두 번째 라운드에서 모든 플레이어에게 카드 한 장씩 분배
            for (let i = 0; i < players.length; i++) {
                currentLocation2 = this.FindNextPlayer(currentLocation2, -1).iLocation;
                //console.log(handCards[currentLocation][1]);
                sortedHandCards.push(handCards[currentLocation2][1]);
                // if (i < players.length - 1) {
                //     currentLocation = this.FindNextPlayer(currentLocation, dealLocation).iLocation;
                // }
            }
            //console.log("joker win Card Setting@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            //console.log(tableCards);
            //console.log(sortedHandCards);
            this.listCardDeck = sortedHandCards.concat(tableCards);
            this.tableCards = tableCards;
        }
        else
        {
            this.tableCards = this.listCardDeck.slice(players.length * 2, players.length * 2 + 5);
        }

        //console.log("this.listCardDeck!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // 3명 무승부 테스트 덱.
        // this.listCardDeck = [11, 50, 2, 51, 12, 3, 22, 18, 19, 10, 8];
        // 2명 스트레이트 덱.
        //this.listCardDeck = [11, 50, 2, 51, 22, 18, 19, 10, 8];
        //console.log(this.listCardDeck);
    }

    shuffleArray(array)
    {
        for(let i = array.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }

        return array
    }

    chooseWinningType()
    {
        let rand = Math.random() * 100;
        //console.log(`iGame :: chooseWinningType - rand : ${rand}`);
        if (rand < 0.000154) {
            return 'RoyalStraightFlush';
        } else if (rand < 0.00139) {
            return 'StraightFlush';
        } else if (rand < 0.0240) {
            return 'FourOfAKind';
        } else if (rand < 0.1441) {
            return 'FullHouse';
        } else if (rand < 0.1965) {
            return 'Flush';
        } else if (rand < 0.3925) {
            return 'Straight';
        } else if (rand < 2.1128) {
            return 'ThreeOfAKind';
        } else if (rand < 40) {
            return 'TwoPair';
        } else {
            return 'OnePair';
        }
    }
    
    chooseWinningCards(iLocation, handType) {
        let suit, number, startNumber;
        let cards, tableCards, extraCards;
        let handCards = {};
        let exclude;
        //let firstPairNumber, secondPairNumber;
        //console.log(iLocation, handType);

        switch (handType) {
            case 'HighCard':
                do {
                    cards = this.getUniqueRandomNumbers(7, 0, 51);
                    handCards[iLocation] = [cards.pop(), cards.pop()];
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'HighCard') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'OnePair':
                do {
                    exclude = [];
            
                    // A, K, Q, J, 10 중 하나를 선택합니다.
                    let highCardNumber = Math.floor(Math.random() * 5) + 9; // 9는 10, 10은 J, ..., 12는 K, 0는 A
                    highCardNumber = highCardNumber === 13 ? 0 : highCardNumber;
                    let suit = Math.floor(Math.random() * 4);
                    let highCard = suit * 13 + highCardNumber;
                
                    // 동일한 숫자의 다른 슈트 카드를 선택합니다.
                    let pairCard = ((suit + Math.floor(Math.random() * 3) + 1) % 4) * 13 + highCardNumber;
                
                    // PairCard를 제외 리스트에 추가합니다.
                    exclude = [highCard, pairCard];
                
                    // 나머지 카드를 무작위로 선택합니다.
                    extraCards = this.getUniqueRandomNumbers(5, 0, 51, exclude);
                    tableCards = extraCards.concat(pairCard); // PairCard를 TableCards에 포함시킵니다.
                    this.shuffleArray(tableCards); // TableCards를 섞습니다.
                
                    // HandCards에 카드를 추가합니다.
                    handCards[iLocation] = [highCard, tableCards.pop()]; // TableCards에서 하나를 뽑아 HandCards에 추가합니다.
                
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'OnePair') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'TwoPair':
                do {
                    exclude = [];
                
                    // 첫 번째 원페어를 10, J, Q, K, A 중 하나로 설정합니다.
                    let highCardNumber = Math.floor(Math.random() * 5) + 9; // 9는 10, 10은 J, ..., 12는 K, 0는 A
                    highCardNumber = highCardNumber == 13 ? 0 : highCardNumber;
                    let firstSuit = Math.floor(Math.random() * 4);
                    let secondSuit = (firstSuit + Math.floor(Math.random() * 3) + 1) % 4;
                    let firstPairCards = [highCardNumber + firstSuit * 13, highCardNumber + secondSuit * 13];
                
                    // 두 번째 원페어 설정
                    let secondPairNumber;
                    do {
                        secondPairNumber = Math.floor(Math.random() * 13);
                    } while (secondPairNumber == highCardNumber);
                    let thirdSuit = Math.floor(Math.random() * 4);
                    let fourthSuit = (thirdSuit + Math.floor(Math.random() * 3) + 1) % 4;
                    let secondPairCards = [secondPairNumber + thirdSuit * 13, secondPairNumber + fourthSuit * 13];
                
                    // 카드들을 합치고 섞습니다
                    cards = firstPairCards.concat(secondPairCards);
                    this.shuffleArray(cards);
                
                    // HandCards에 카드를 추가합니다
                    handCards[iLocation] = [cards.pop(), cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                
                    // 나머지 3장의 카드를 무작위로 선택합니다
                    extraCards = this.getUniqueRandomNumbers(3, 0, 51, exclude);
                    tableCards = cards.concat(extraCards);
                
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'TwoPair') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'ThreeOfAKind':
                do {
                    exclude = [];
                    number = Math.floor(Math.random() * 13);
                    cards = [number, number + 13, number + 26];
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(4, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);                    
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'ThreeOfAKind') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'Straight':
                do {
                    exclude = [];
                    startNumber = Math.floor(Math.random() * 9);
                    cards = [];
                    for (let i = 0; i < 5; i++) {
                        cards.push(startNumber + i);
                    }
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(2, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'Straight') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'Flush':
                do {
                    exclude = [];
                    suit = Math.floor(Math.random() * 4);
                    cards = [];
                    for (let i = 0; i < 5; i++) {
                        cards.push(suit * 13 + i);
                    }
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(2, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'Flush') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'FullHouse':
                do {
                    exclude = [];
                    number = Math.floor(Math.random() * 13);
                    let anotherNumber;
                    do {
                        anotherNumber = Math.floor(Math.random() * 13);
                    } while (anotherNumber === number);
                    cards = [number, number + 13, number + 26, anotherNumber, anotherNumber + 13];
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(2, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'FullHouse') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'FourOfAKind':
                do {
                    exclude = [];
                    number = Math.floor(Math.random() * 13);
                    cards = [number, number + 13, number + 26, number + 39];
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(3, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'FourOfAKind') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'StraightFlush':
                do {
                    exclude = [];
                    startNumber = Math.floor(Math.random() * 9);
                    suit = Math.floor(Math.random() * 4);
                    cards = [];
                    for (let i = 0; i < 5; i++) {
                        cards.push(suit * 13 + startNumber + i);
                    }
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(2, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'StraightFlush') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            case 'RoyalFlush':
                do {
                    exclude = [];
                    suit = Math.floor(Math.random() * 4);
                    cards = [suit * 13 + 8, suit * 13 + 9, suit * 13 + 10, suit * 13 + 11, suit * 13 + 12];
                    this.shuffleArray(cards);
                    handCards[iLocation] = [cards.pop()];
                    exclude = cards.concat(handCards[iLocation]);
                    extraCards = this.getUniqueRandomNumbers(2, 0, 51, exclude);
                    cards = cards.concat(extraCards);
                    this.shuffleArray(cards);
                    handCards[iLocation].push(cards.pop());
                    //exclude = cards.concat(handCards[iLocation]);
                    tableCards = cards;
                } while (!this.checkForCombination(handCards[iLocation].concat(tableCards), 'RoyalFlush') || handCards[iLocation].length !== 2 || tableCards.length !== 5);
                break;

            default:
                throw new Error('Invalid hand type');
        }
        // Return the hand cards and table cards
        return { handCards, tableCards };
    }
    
    checkForCombination(cards, handType) {
        switch (handType) {
            case 'RoyalFlush':
                return this.isRoyalFlush(cards);
            case 'StraightFlush':
                return this.isStraightFlush(cards);
            case 'FourOfAKind':
                return this.isFourOfAKind(cards);
            case 'FullHouse':
                return this.isFullHouse(cards);
            case 'Flush':
                return this.isFlush(cards);
            case 'Straight':
                return this.isStraight(cards);
            case 'ThreeOfAKind':
                return this.isThreeOfAKind(cards);
            case 'TwoPair':
                return this.isTwoPair(cards);
            case 'OnePair':
                return this.isOnePair(cards);
        }
        return false;
    }

    isHighCard(cards) {
        // If none of the other hand types are found, it is a high card
        return !this.isOnePair(cards) &&
            !this.isTwoPair(cards) &&
            !this.isThreeOfAKind(cards) &&
            !this.isStraight(cards) &&
            !this.isFlush(cards) &&
            !this.isFullHouse(cards) &&
            !this.isFourOfAKind(cards) &&
            !this.isStraightFlush(cards) &&
            !this.isRoyalFlush(cards);
    }

    isOnePair(cards) {
        if (this.isTwoPair(cards)) {
            return false; // 두 쌍의 페어가 있으면 OnePair로 간주하지 않음
        }
        const values = cards.map(card => this.getCardValue(card));
        const valueCounts = new Array(13).fill(0);
        values.forEach(value => valueCounts[value]++);
        return valueCounts.some(count => count == 2);
    }
    
    isTwoPair(cards) {
        const values = cards.map(card => this.getCardValue(card));
        const valueCounts = new Array(13).fill(0);
        values.forEach(value => valueCounts[value]++);
        return valueCounts.filter(count => count == 2).length == 2;
    }
    
    isThreeOfAKind(cards) {
        const values = cards.map(card => this.getCardValue(card));
        const valueCounts = new Array(13).fill(0);
        values.forEach(value => valueCounts[value]++);
        return valueCounts.some(count => count == 3);
    }
    
    isStraight(cards) {
        const values = cards.map(card => this.getCardValue(card)).sort((a, b) => a - b);
        let isStraight = true;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i + 1] - values[i] != 1) {
                isStraight = false;
                break;
            }
        }
        // Check for Ace-low straight
        if (!isStraight && values[0] === 0 && values[4] === 12) {
            isStraight = true;
            for (let i = 1; i < values.length - 1; i++) {
                if (values[i + 1] - values[i] != 1) {
                    isStraight = false;
                    break;
                }
            }
        }
        return isStraight;
    }
    
    isFlush(cards) {
        const suits = cards.map(card => this.getCardSuit(card));
        return suits.every(suit => suit == suits[0]);
    }
    
    isFullHouse(cards) {
        return this.isOnePair(cards) && this.isThreeOfAKind(cards);
    }
    
    isFourOfAKind(cards) {
        const values = cards.map(card => this.getCardValue(card));
        const valueCounts = new Array(13).fill(0);
        values.forEach(value => valueCounts[value]++);
        return valueCounts.some(count => count == 4);
    }
    
    isStraightFlush(cards) {
        return this.isFlush(cards) && this.isStraight(cards);
    }
    
    isRoyalFlush(cards) {
        const values = cards.map(card => this.getCardValue(card)).sort((a, b) => a - b);
        return this.isFlush(cards) && values[0] == 8 && values[4] == 12;
    }

    chooseLosingHandCards(winningType, tableCards, winhandCards, allHandCards, eUserType) {
        //console.log(`chooseLosingHandCards :: windhandcards : ${winhandCards}`);
        let listdeck = Array.from({length: 52}, (_, i) => i);
        let excludeHigherCards = [];
    
        // winhandCards에서 더 높은 카드를 찾습니다.
        let cardNumbers = winhandCards.map(card => card % 13);
        let higherCardNumber;
        if (cardNumbers.includes(0)) {
            // 에이스(0)가 있는 경우, 이를 가장 높은 카드로 간주
            higherCardNumber = 0;
        } else {
            // 에이스가 없는 경우, 가장 높은 숫자를 찾음
            higherCardNumber = Math.max(...cardNumbers);
        }
    
        if (winningType == 'OnePair' || winningType == 'TwoPair')
        {
            // 모든 슈트의 에이스 추가
            for (let suit = 0; suit < 4; suit++) {
                excludeHigherCards.push(0 + suit * 13);
            }

            // higherCardNumber가 에이스(0)보다 큰 경우, 추가적인 카드를 제외 목록에 추가
            if (higherCardNumber > 0) {
                for (let suit = 0; suit < 4; suit++) {
                    for (let number = higherCardNumber; number < 13; number++) {
                        excludeHigherCards.push(number + suit * 13);
                    }
                }
            }
        }
    
        // 모든 제외할 카드들을 하나의 리스트로 합칩니다.
        let totalExcludes = [...allHandCards, ...tableCards, ...excludeHigherCards];
    
        // 제외 리스트를 사용하여 cardPool에서 카드를 제거합니다.
        let cardPool = this.removeCardsFromPool(listdeck, totalExcludes);
    
        // Determine a losing hand type based on the winning type
        let losingHand = this.determineLosingHandType(winningType, tableCards, cardPool, eUserType);
        
        //console.log("chooseLosingHandCards!!!");
        //console.log(losingHand);

        if(losingHand.length < 2)
        {
            const randomIndex1 = Math.floor(Math.random() * listdeck.length);
            let randomCard1 = listdeck[randomIndex1];

            // 두 번째 랜덤 인덱스 선택 (첫 번째와 다른 인덱스)
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * listdeck.length);
            } while (randomIndex1 == randomIndex2);
            let randomCard2 = listdeck[randomIndex2];

            // 선택한 카드를 losingHand에 추가
            losingHand.push(randomCard1, randomCard2);
        }
    
        // Return the losing hand
        return losingHand;
    }

    determineLosingHandType(winningType, tableCards, cardPool, eUserType) {
        let possibleHands = this.getPossibleHands(cardPool, tableCards, winningType);
            
        // sort possibleHands by rank in ascending order
        //console.log(winningType,tableCards,cardPool);
        //console.log(possibleHands);
        let losingHandType = [];
        if(possibleHands == null)
        {
            return losingHandType;
        }
        else
        {
            if(eUserType == 'JOKER')
            {
                let randomIndex = Math.floor(Math.random() * possibleHands.length);
                losingHandType = possibleHands[randomIndex];
            }
            else
            {
                if (Math.random() < 0.3) {
                    possibleHands.sort((handA, handB) => {
                        return this.compareHandRank(this.checkHandRank(handA), this.checkHandRank(handB));
                    });
                    losingHandType = possibleHands[0];
                }
                else
                {
                    let randomIndex = Math.floor(Math.random() * possibleHands.length);
                    losingHandType = possibleHands[randomIndex];
                }
            }
            return losingHandType;
        }  
    }
    
    getPossibleHands(cardPool, tableCards, winningType) {
        let possibleHands = [];
        //let originalWinningType = winningType; // 원래의 winningType을 저장
        if (cardPool.length < 2) {
            // 카드가 충분하지 않으면 null 반환 또는 다른 처리
            return null;
        }

        while (possibleHands.length == 0) {
            for (let i = 0; i < cardPool.length - 1; i++) {
                for (let j = i + 1; j < cardPool.length; j++) {
                    let fullHand = [cardPool[i], cardPool[j], ...tableCards];
                    let handRank = this.checkHandRank(fullHand);
                    
                    if (handRank == winningType) {
                        possibleHands.push([cardPool[i], cardPool[j]]);
                    }
                }
            }
    
            if (possibleHands.length == 0 && winningType != "HighCard") {
                //console.log("possibleHands == 0");
                winningType = this.getLowerRank(winningType);
                //console.log(winningType);
            } 
            if (winningType == "HighCard" && possibleHands.length == 0) {
                // If we are looking for HighCard and no possible hands are found,
                // add two random cards from cardPool to possibleHands.
                const randomIndex1 = Math.floor(Math.random() * cardPool.length);
                let randomIndex2;
                do {
                    randomIndex2 = Math.floor(Math.random() * cardPool.length);
                } while (randomIndex1 == randomIndex2);
    
                possibleHands.push([cardPool[randomIndex1], cardPool[randomIndex2]]);
                break;
            } 
        }
    
        return possibleHands;
    }

    checkHandRank(hand) {
        hand.sort((a, b) => this.getCardValue(b) - this.getCardValue(a));
    
        let sameCards = 1;
        let pairs = [];
        let triples = [];
        let fourOfAKind = [];
        for (let i = 0; i < hand.length - 1; i++) {
            if (this.getCardValue(hand[i]) === this.getCardValue(hand[i + 1])) {
                sameCards++;
            } else {
                if (sameCards === 2) pairs.push(this.getCardValue(hand[i]));
                else if (sameCards === 3) triples.push(this.getCardValue(hand[i]));
                else if (sameCards === 4) fourOfAKind.push(this.getCardValue(hand[i]));
    
                sameCards = 1;
            }
        }
    
        // Add the last card to the appropriate array
        if (sameCards === 2) pairs.push(this.getCardValue(hand[hand.length - 1]));
        else if (sameCards === 3) triples.push(this.getCardValue(hand[hand.length - 1]));
        else if (sameCards === 4) fourOfAKind.push(this.getCardValue(hand[hand.length - 1]));
    
        let straight = this.isStraighthand(hand);
        let flush = this.isFlushhand(hand);
        if (straight && flush) {
            return this.getCardValue(hand[0]) === 12 ? 'RoyalFlush' : 'StraightFlush';
        }
    
        if (fourOfAKind.length === 1) return 'FourOfAKind';
    
        if (triples.length === 1 && pairs.length > 0) return 'FullHouse';
    
        if (flush) return 'Flush';
    
        if (straight) return 'Straight';
    
        if (triples.length === 1) return 'ThreeOfAKind';
    
        if (pairs.length === 2) return 'TwoPair';
    
        if (pairs.length === 1) return 'OnePair';
    
        return 'HighCard';
    }
    
    isStraighthand(hand) {
        for (let i = 0; i < hand.length - 1; i++) {
            if (this.getCardValue(hand[i]) - 1 !== this.getCardValue(hand[i + 1])) {
                return false;
            }
        }
    
        if (this.getCardValue(hand[hand.length - 1]) === 0 && this.getCardValue(hand[0]) === 12) return true;
    
        return true;
    }
    
    isFlushhand(hand) {
        for (let i = 0; i < 4; i++) {
            if (this.getCardSuit(hand[i]) !== this.getCardSuit(hand[i + 1])) {
                return false;
            }
        }
        return true;
    }
    
    compareHandRank(a, b) {
        let pokerHandRank = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'Straight', 'Flush', 'FullHouse', 'FourOfAKind', 'StraightFlush', 'RoyalFlush'];
        return pokerHandRank.indexOf(a) - pokerHandRank.indexOf(b);
    }

    getLowerRank(rank) {
        const ranks = ['HighCard', 'OnePair', 'TwoPair', 'ThreeOfAKind', 'Straight', 'Flush', 'FullHouse', 'FourOfAKind', 'StraightFlush', 'RoyalFlush'];
    
        let index = ranks.indexOf(rank);
        if (index === -1 || index === 0) {
            return ranks[0]; // rank가 리스트에 없거나 이미 가장 낮은 족보일 경우 HighCard 반환
        }
        return ranks[index - 1]; // 한 단계 낮은 족보 반환
    }
    
    getUniqueRandomNumbers(count, min, max, exclude = []) {
        let numbers = [];
    
        while (numbers.length < count) {
            let num = Math.floor(Math.random() * (max - min + 1)) + min;
    
            // 이미 선택된 숫자나 제외해야하는 숫자가 아닌 경우에만 숫자를 추가합니다.
            if (!numbers.includes(num) && !exclude.includes(num)) {
                numbers.push(num);
            }
        }
    
        return numbers;
    }

    removeCardsFromPool(cardPool, cardsToRemove) {
        return cardPool.filter(card => !cardsToRemove.includes(card));
    }

    getCardValue(card) {
        return card % 13;
    }
    
    getCardSuit(card) {
        return Math.floor(card / 13);
    }

    getHighestCardValue(hand) {
        return Math.max(...hand.map(card => this.getCardValue(card)));
    }

    IsCompleteHandCard()
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            let player = this.listUsers.GetUser(i);

            if ( player.strLastBettingAction == 'Fold' || player.iLocation == -1 || player.bEnable == false || player.bSpectator == true )
                continue;

            if ( player.listHandCard.length != 2 )
            {
                //console.log(`IGame::IsCompleteHandCard => HandCard Length : ${player.listHandCard.length}`);
                return false;
            }
        }
        return true;
    }

    StartGame()
    {
        this.Start();
        this.startNewRound();
        this.CheckForJackpot();

        //console.log(`IGame::StartGame`);
        const cPlayingUser = this.GetNumPlayingUser();
        //console.log(`IGame::StartGame => cPlayingUser : ${cPlayingUser}, GameMode ${this.eGameMode}`);
        if ( cPlayingUser >= this.cMinEnablePlayer && this.eGameMode == E.EGameMode.Start )
        {
            this.SetMode(E.EGameMode.BuildPlayerType);
            return true;
        }

        return false;
    }

    CheckForJackpot() {
        // Reset jackpot status
        this.iJackpotAmount = 0;
        // Check if the current round hits any jackpot level
        let iJackpotRound = 0;
        if(this.jackpotInfo != null)
        {
            //console.log(this.jackpotInfo);
            if (this.iJackpot1Round >= this.jackpotInfo.iLevel1Round && this.jackpotRounds.iJackpot1 == 0) {
                this.iJackpotAmount = this.jackpotInfo.iLevel1Amount * this.iDefaultCoin * 2;
                this.iJackpotLevel = 1;
                iJackpotRound = this.iJackpot1Round;
                this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecordJackpotRounds, iSubDB:0, iJackpotLevel:this.iJackpotLevel, iJackpot1:1});
            } else if (this.iJackpot2Round >= this.jackpotInfo.iLevel2Round && this.jackpotRounds.iJackpot2 == 0) {
                this.iJackpotAmount = this.jackpotInfo.iLevel2Amount * this.iDefaultCoin * 2;
                this.iJackpotLevel = 2;
                iJackpotRound = this.iJackpot2Round;
                this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecordJackpotRounds, iSubDB:0, iJackpotLevel:this.iJackpotLevel, iJackpot2:1});
            } else if (this.iJackpot3Round >= this.jackpotInfo.iLevel3Round && this.jackpotRounds.iJackpot3 == 0) {
                this.iJackpotAmount = this.jackpotInfo.iLevel3Amount * this.iDefaultCoin * 2;
                this.iJackpotLevel = 3;
                iJackpotRound = this.iJackpot3Round;
                this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecordJackpotRounds, iSubDB:0, iJackpotLevel:this.iJackpotLevel, iJackpot3:1});
            }
            else
            {
                this.iJackpotLevel = 0;
            }
        }
        //console.log(`iJackpotAmount : ${this.iJackpotAmount}`);
        //console.log(`iJackpotLevel : ${this.iJackpotLevel}`);
        // If a jackpot is hit, notify all users
        if (this.iJackpotAmount > 0) {
            for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                this.listUsers.GetUser(i).socket.emit('SM_JackPot',{iAmount:this.iJackpotAmount, iJackpotRound:iJackpotRound, jackpotInfo:this.jackpotInfo, iJackpotLevel:this.iJackpotLevel});
            }
        }
    }


    PrintRoomUsers()
    {
        //console.log(`################################################## Room ${this.strGameName}, iCoin ${this.iDefaultCoin} : Users`);
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            console.log(`strID : ${this.listUsers.GetUser(i).strID}, eUserType:${this.listUsers.GetUser(i).eUserType}, eStage : ${this.listUsers.GetUser(i).eStage}, eLocation : ${this.listUsers.GetUser(i).iLocation}`);
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

    // Method to extract the round number from roundUnique
    getRoundFromUnique() {
         // Remove the lUnique part from roundUnique to extract the round number
        return parseInt(this.roundUnique.slice(this.lUnique.length));
    }

    //  Management Pots
    ProcessPot()
    {
        this.listPots = [];

        let listClone = this.ClonePlayers();

        for ( let i in listClone )
        {
            let player = listClone[i];

            if ( player.iCoin == 0 && player.strLastBettingAction != 'Fold')
            {
                this.listPots.push({strID:player.strID, iStandard:player.iTotalBettingCoin, iPotAmount:0, iBettingCoin:player.iBettingCoin, iRealBettingCoin:player.iRealBettingCoin, listPlayer:[]});
            }
        }

        this.listPots.sort( (a,b) => {
            return a.iStandard-b.iStandard;
        });

        for ( let i = 0; i < this.listPots.length; ++i )
        {
            const index = this.listPots.length-1-i;
            let prev = index-1;
            if ( prev != -1 )
            this.listPots[index].iStandard -= this.listPots[prev].iStandard;
        }
        
        //console.log(`############################## ProcessPot`);

        for ( let i in this.listPots )
        {
            this.CalculatePotAmount(this.listPots[i], listClone);
        }

        let objectPot = this.CalculateExceptionPotAmount(listClone);
        if ( objectPot != null )
        this.listPots.push(objectPot);

        //console.log(this.listPots);

        //console.log(`############################## TotalBet On Table : ${this.iTotalBettingCoin}`);
    }

    ClonePlayers()
    {
        let listClone = [];
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            const player = this.listUsers.GetUser(i);

            //if ( player.iLocation != -1 )
            if ( player.iLocation != -1 && player.bEnable == true  && player.bSpectator == false)
            {
                //console.log(`ClonePlayers()`);
                //console.log(`${player.strID}, iCoin:${player.iCoin}, iTotalBettingCoin:${player.iTotalBettingCoin}, strLastBettingAction:${player.strLastBettingAction}`);
                let clone = {strID:player.strID, iCoin:player.iCoin, iTotalBettingCoin:player.iTotalBettingCoin, iBettingCoin:player.iBettingCoin, strLastBettingAction:player.strLastBettingAction, iRealBettingCoin:player.iRealBettingCoin};
                listClone.push(clone);
            }
        }
        return listClone;
    }

    CalculatePotAmount(kPot, listClone) {
        const iStandard = kPot.iStandard;
        //console.log(`CalculatePotAmount iStandard : ${iStandard}`);
    
        for (let i in listClone) {
            //console.log(`CalculatePotAmount`);
            //console.log(listClone[i]);
            let iAmount;
    
            if (listClone[i].iTotalBettingCoin < iStandard) {
                iAmount = listClone[i].iTotalBettingCoin;
                listClone[i].iTotalBettingCoin = 0;
            } else {
                iAmount = iStandard;
                //listClone[i].iRealBettingCoin = iStandard;
                listClone[i].iTotalBettingCoin -= iStandard;
            }
            //console.log(listClone[i].strID);
            //console.log(iAmount);
            if (iAmount > 0) {
                kPot.iPotAmount += iAmount;
                if (listClone[i].strLastBettingAction != 'Fold') {
                    kPot.listPlayer.push(listClone[i].strID);
                }
            }
        }
    }

    CalculateExceptionPotAmount(listClone) {
        let object = null;
        let maxBettingCoin = 0;
    
        // 가장 큰 베팅 금액을 찾습니다 (Fold한 플레이어 중에서)
        for (let player of listClone) {
            if (player.strLastBettingAction == 'Fold' && player.iTotalBettingCoin > maxBettingCoin) {
                maxBettingCoin = player.iTotalBettingCoin;
            }
        }
    
        for (let player of listClone) {
            if (player.iTotalBettingCoin > 0) {
                //console.log(`CalculateExceptionPotAmount listclone :`);
                //console.log(player);
                
                if (object == null) {
                    object = {
                        strID: 'high',
                        iStandard: 9999999,
                        iBettingCoin: player.iBettingCoin,
                        iPotAmount: player.iTotalBettingCoin,
                        //iRealBettingCoin: player.iRealBettingCoin,
                        listPlayer: [],
                        iOverBet:0
                    };
                    if (player.strLastBettingAction != 'Fold') {
                        object.listPlayer.push(player.strID);
                    }
                } else {
                    object.iPotAmount += player.iTotalBettingCoin;
                    if (player.strLastBettingAction != 'Fold') {
                        object.listPlayer.push(player.strID);
                    }
                }
                // 오버 베팅 금액 계산
                if (player.strLastBettingAction != 'Fold') {
                    let overBetAmount = player.iTotalBettingCoin - maxBettingCoin;
                    
                    if (overBetAmount > 0 ) {
                        object.iOverBet = overBetAmount;
                    }
                }
                if(object.listPlayer.length != 1)
                {
                    object.iOverBet = 0;
                }
                player.iTotalBettingCoin = 0; // 처리된 베팅 금액은 0으로 초기화
            }
        }
        return object;
    }

    CalculatePot()
    {
        //console.log(`################################################## CalculatePot`);

        let strWinner = '';
        // Jackpot
        let iJackpotInc = 0;
        let iJackpot = this.iJackpotAmount;
        let iFeeAmount = 0;
        
        for (let i in this.listPots) {
            let iPotAmount = this.listPots[i].iPotAmount;
            let listWinner = this.CalculatePotWinner(this.listPots[i]);
            let iPotAmountFee = 0;
            //let iOverBet = 0;
            //console.log(`CalculatePot()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            //console.log(this.listPots[i]);
            //console.log(global.fJackpotFee);
            //console.log(global.fHoldemFee)
            
            // 오버베팅이 아닌 경우에만 딜비를 계산합니다.
            if (this.listPots[i].iStandard < iPotAmount) {
                // 승자에게 분배되는 금액을 계산합니다. 딜비 마이너스.
                if(this.listPots[i].listPlayer.length == 1)
                {
                    iPotAmount -= parseInt(this.listPots[i].iStandard);
                    iPotAmountFee = parseInt(iPotAmount) - parseInt(iPotAmount * global.fHoldemFee * 0.01) - parseInt(iPotAmount * global.fJackpotFee *0.01);
                    iFeeAmount += parseInt(iPotAmount * global.fHoldemFee * 0.01);
                    iJackpotInc += parseInt(iPotAmount * global.fJackpotFee * 0.01);
                    //iOverBet = parseInt(this.listPots[i].iStandard);
                    iPotAmountFee += parseInt(this.listPots[i].iStandard);
                }
                else
                {
                    iPotAmountFee = parseInt(iPotAmount) - parseInt(iPotAmount * global.fHoldemFee * 0.01) - parseInt(iPotAmount * global.fJackpotFee *0.01);
                    iJackpotInc += parseInt(iPotAmount * global.fJackpotFee * 0.01);
                    iFeeAmount += parseInt(iPotAmount * global.fHoldemFee * 0.01);
                }
            }
            else if(this.listPots[i].strID == 'high')
            {
                //console.log(this.listPots.length);
                //console.log();
                if(this.listPots.length == 1 )
                {
                    if(this.listPots[i].iPotAmount <= parseInt(this.iDefaultCoin*(parseInt(this.iNumPlayingUser)+1)) )
                    {
                        iPotAmountFee = parseInt(iPotAmount) - parseInt(iPotAmount * global.fHoldemFee * 0.01) - parseInt(iPotAmount * global.fJackpotFee *0.01);
                        iJackpotInc += parseInt(iPotAmount * global.fJackpotFee * 0.01);
                        iFeeAmount += parseInt(iPotAmount * global.fHoldemFee * 0.01);
                    }
                    else
                    {
                        iPotAmount -= parseInt(this.listPots[i].iOverBet);
                        iPotAmountFee = parseInt(iPotAmount) - parseInt(iPotAmount * global.fHoldemFee * 0.01) - parseInt(iPotAmount * global.fJackpotFee *0.01);
                        iFeeAmount += parseInt(iPotAmount * global.fHoldemFee * 0.01);
                        iJackpotInc += parseInt(iPotAmount * global.fJackpotFee * 0.01);
                        //iOverBet = parseInt(this.listPots[i].iOverBet);
                        iPotAmountFee += parseInt(this.listPots[i].iOverBet);
                    }
                }
                else if(this.listPots[i].iPotAmount == this.listPots[i].iOverBet)
                {
                    iPotAmountFee = parseInt(iPotAmount);
                }
                else
                {
                    iPotAmount -= parseInt(this.listPots[i].iOverBet);
                    iPotAmountFee = parseInt(iPotAmount) - parseInt(iPotAmount * global.fHoldemFee * 0.01) - parseInt(iPotAmount * global.fJackpotFee *0.01);
                    iFeeAmount += parseInt(iPotAmount * global.fHoldemFee * 0.01);
                    iJackpotInc += parseInt(iPotAmount * global.fJackpotFee * 0.01);
                    //iOverBet = parseInt(this.listPots[i].iOverBet);
                    iPotAmountFee += parseInt(this.listPots[i].iOverBet);
                    //console.log(`iPotAmount : ${iPotAmount}, iPotAmountFee ${iPotAmountFee}`);
                }
            }
            else if(this.listPots[i].iStandard == iPotAmount)
            {
                iPotAmountFee = parseInt(iPotAmount);
            }
            else {
                // 오버베팅이라 딜비는 따로 계산 없음.
                iPotAmountFee = parseInt(iPotAmount);
            }
            //console.log(`iPotAmount : ${iPotAmount}, iPotAmountFee ${iPotAmountFee}`);
            if (listWinner.length <= 0)
                continue;

            //console.log(`listWinner length : ${listWinner.length}, PotAmount ${this.listPots[i].iPotAmount}`);
            for (let j in listWinner) {
                let winner = this.FindPlayer(listWinner[j]);
                //console.log(listWinner[j]);
                
                if (winner != null) {
                    let iWinCoinForWinner = Math.floor(iPotAmountFee / listWinner.length);
                    //console.log(`winner coin update : iPotAmountFee : ${iPotAmountFee}, iWinCoinForWinner : ${iWinCoinForWinner}, winner.iWinCoin : ${winner.iWinCoin}, winner.iCoin : ${winner.iCoin}`);
                    if (winner.iRank == 1) {
                        if (strWinner.includes(winner.strID)) {
                            //console.log(`strWinner : ${strWinner}`);

                            let updatedWinner = false;
                            let playerEntries = strWinner.split(",");

                            for (let i = 0; i < playerEntries.length; i++) {
                                let [playerID, coinStr] = playerEntries[i].split(":");

                                if (playerID == winner.strID) {
                                    let previousCoins = Number(coinStr);
                                    let newCoins = previousCoins + parseInt(iWinCoinForWinner);
                                    playerEntries[i] = `${playerID}:${newCoins}`;
                                    updatedWinner = true;
                                    break;
                                }
                            }

                            strWinner = playerEntries.join(",");

                            if (!updatedWinner) {
                                if (strWinner) strWinner += ",";
                                strWinner += `${winner.strID}:${iWinCoinForWinner}`;
                            }
                        }
                        else {
                            if (strWinner) strWinner += ",";
                            strWinner += `${winner.strID}:${iWinCoinForWinner}`;
                        }
                        if (strWinner.startsWith(",")) strWinner = strWinner.slice(1);
                    }

                    winner.iWinCoin += parseInt(iWinCoinForWinner);
                    winner.iCoin += parseInt(iWinCoinForWinner);
                    //winner.iRealBettingCoin = parseInt(winner.iTotalBettingCoin) - parseInt(iOverBetCoinForWinner);
                    //console.log(`winnner strWinner : ${strWinner}`);
                    //console.log(`winnner iWinCoinForWinner : ${iWinCoinForWinner}`);
                    //console.log(`winnner winner.iWinCoin : ${winner.iWinCoin}`);
                    //console.log(`winnner winner.iCoin : ${winner.iCoin}`);
                    //console.log(`winnner iOverBetCoinForWinner : ${iOverBetCoinForWinner}`);
                    //console.log(`winnner winner.iRealBettingCoin : ${winner.iRealBettingCoin}`);
                }
            }
        }
        
        let strDesc = '';
        let strHand = '';
        let strTablecard = '';
        let strStartCoin = '';
        let strResultCoin = '';
        //let iStartCoin = 0;

        if(iJackpot > 0)
        {
            let winners = strWinner.split(",");
            let jackpotPerWinner = iJackpot / winners.length;
            let updatedWinners = {};

            winners.forEach(winnerStr => {
                let [winnerID, currentWinCoin] = winnerStr.split(":");
                updatedWinners[winnerID] = parseInt(currentWinCoin) + parseInt(jackpotPerWinner);
            });

            // 업데이트된 승자 정보로 strWinner 재구성
            strWinner = Object.entries(updatedWinners).map(([id, coin]) => `${id}:${coin}`).join(",");

            // 승자에게 업데이트된 금액 적용
            for (let winnerID in updatedWinners) {
                let winner = this.FindPlayer(winnerID);
                if (winner) {
                    winner.iWinCoin += parseInt(jackpotPerWinner);
                    winner.iCoin += parseInt(jackpotPerWinner);
                }
            }
        }

        if (this.listTableCard.length == 0) {
            strTablecard = 'not';
        }
        else {
            for (let j in this.listTableCard) {
                if (strTablecard != '') {
                    strTablecard += ',';
                }
                strTablecard += `${this.listTableCard[j]}`;
            }
        }

        for ( let j = 0; j < this.listUsers.GetLength(); ++ j )
        {
            let player = this.listUsers.GetUser(j);
            if(player.bSpectator == false)
            {
                if ( strDesc != '' ) strDesc += ',';
                if ( strHand != '' ) strHand += ',';
                if ( strStartCoin != '' ) strStartCoin += ',';
                if ( strResultCoin != '' ) strResultCoin += ',';
                strResultCoin += `${player.strID}:${player.iCoin}`;
                strStartCoin +=`${player.strID}:${player.iStartCoin}:${player.iRealBettingCoin}`;
                strDesc += `${player.strID}:${player.iTotalBettingCoin}:${player.strGroupID}`;

                let handList = [];
                let idList = [];
                for( let k in player.listHandCard ){
                    let card = player.listHandCard[k];
                    let id = player.strID;
                    if(!idList.includes(id)){
                        idList.push(id);
                        handList.push(`${id}:${card}`);
                    } else {
                        handList[idList.indexOf(id)] += `/${card}`;
                    }
                }
                strHand += handList.join(',');
            }
        }
        
        //console.log(`strHand : ${strHand} strStartCoin : ${strStartCoin} strResultCoin : ${strResultCoin}, strTablecard : ${strTablecard}`);
        //console.log(`strWinner : ${strWinner}`);
        //console.log(`#######@@############################################################################################## updatedb caculatepot`);
        
        this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecodrdGames, iSubDB:0, lUnique:this.lUnique, roundUnique:this.roundUnique, strWinner:strWinner, strDesc:strDesc, strStartCoin:strStartCoin, strResultCoin:strResultCoin, strHand:strHand, strTablecard:strTablecard, iJackpot:iJackpot, iFeeAmount:iFeeAmount, iJackpotFeeAmount:iJackpotInc});
        this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecordJackpot, iSubDB:0, iAmount:iJackpotInc});
        if(iJackpot>0)
        {
            this.listDBUpdate.push({iProcessingID:this.GetProcessingID(),iDB:E.EDBType.RecordJackpot, iSubDB:1, iJackpot:iJackpot});
        }
    }

    CalculatePotWinner(kPot)
    {
        let listWinner = [];
        let iTargetRank = this.CalculatePotRanker(kPot);

        //console.log(`Target Rank : ${iTargetRank}`);

        for ( let i in kPot.listPlayer )
        {
            let player = this.FindPlayer(kPot.listPlayer[i]);
            if ( player != null )
            {
                if ( player.iRank == iTargetRank )
                {
                    listWinner.push(player.strID);                    
                }
            }
        }
        return listWinner;
    }

    CalculatePotRanker(kPot)
    {
        let iRank = 999;
        
        for ( let i in kPot.listPlayer )
        {
            let player = this.FindPlayer(kPot.listPlayer[i]);
            if ( player != null )
            {
                //console.log(`player.iRank : ${player.iRank}, parameter iRank : ${iRank}`);
                if ( iRank > player.iRank )
                {
                    iRank = player.iRank;
                }                
            }
        }
        return iRank;
    }

    ProcessWinCards(listCards, strHand)
    {
        const iLength = listCards.length;

        this.listWinCards = [];

        for ( let i = 0; i < iLength; ++ i )
        {
            let iIndex = this.GetCardIndex(listCards[i].value, listCards[i].suit);

            this.listWinCards.push(iIndex);
        }
        //console.log(`##### Process Win Cards`);
        //console.log(listCards);
        //console.log(this.listWinCards);
    }

    GetCardIndex(rank, suit)
    {
        let iNumber = 0;
        switch ( rank )
        {
            case 'A':
                iNumber = 0;
                break;
            case '2':
                iNumber = 1;
                break;
            case '3':
                iNumber = 2;
                break;
            case '4':
                iNumber = 3;
                break;
            case '5':
                iNumber = 4;
                break;
            case '6':
                iNumber = 5;
                break;
            case '7':
                iNumber = 6;
                break;
            case '8':
                iNumber = 7;
                break;
            case '9':
                iNumber = 8;
                break;
            case 'T':
                iNumber = 9;
                break;
            case 'J':
                iNumber = 10;
                break;
            case 'Q':
                iNumber = 11;
                break;
            case 'K':
                iNumber = 12;
                break;
        }

        let iSuit = 0;
        switch ( suit )
        {
        case 's':
            iSuit = 0;
            break;
        case 'h':
            iSuit = 1;
            break;
        case 'd':
            iSuit = 2;
            break;
        case 'c':
            iSuit = 3;
            break;
        }
        return iSuit*13+iNumber;
    }
}
module.exports = IGame;