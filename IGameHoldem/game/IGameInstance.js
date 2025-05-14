let ISocketList = require('./ISocketList');
let E = require('./IEnum');


let axios = require('axios');

let db = require('../db');

class IGameInstance
{
    constructor(io, namespaceIO, kGameManager)
    {
        this.io = io;
        this.namespaceIO = io.of(namespaceIO);
        this.listSocket = new ISocketList();

        //this.listAbnormalSocket = [];

        this.GameManager = kGameManager;
    }

    async RequestAxios(strAddress, objectData)
    {
        console.log(`IGameInstance::RequestAxios ${strAddress}`);
        console.log(objectData);

        try {

            const customAxios = axios.create({});
            const response = await customAxios.post(strAddress, objectData, {headers:{ 'Accept-Encoding': 'application/json'}});
            console.log(response.data);
            if ( response.data.result == 'OK' )
                return {result:'OK', data:response.data};
            else
                return {result:'error', error:response.data.error};    
        }
        catch (error) {

            return {result:'error', error:'axios'};

        }
    }

    FindUser(strID)
    {
        for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
        {
            if ( this.listSocket.GetSocket(i).strID == strID )
                return this.listSocket.GetSocket(i);
        }
        return null;
    }

    // FindUser(id)
    // {
    //     for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
    //     {
    //         if ( this.listSocket.GetUser(i).socket.id == id )
    //             return this.listSocket.GetUser(i);
    //     }
    //     return null;
    // }
    FindUserSocket(user)
    {
        for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
        {
            if ( this.listSocket.GetSocket(i).strID == user.strID )
                return this.listSocket.GetSocket(i);
        }
        return null;
    }
    
    FindUserFromID(strID)
    {
        let user = this.GameManager.FindUserFromID(strID);
        if ( user != null )
            return user;
        return null;
    }

    OnIO(io)
    {
        this.namespaceIO.on('connection', (socket) => {

            console.log(`#---------------------------------- Socket Connection : ${socket.id}`);
            socket.emit('SM_RequestLogin');
            console.log(`#---------------------------------- Socket Connection : ${socket.strID}`);

            // let cUser = this.FindUserFromID(socket.strID);
            // if ( cUser == null )
            // {
            //     this.AddSocket(socket);
            // }

            // socket.on('reconnect', function (attemptNumber) {
            //     console.log(`reconnect succese! (try num : ${attemptNumber})`);
                
            //     // 여기에 재접속 성공 후 실행할 작업을 추가할 수 있습니다.
            //     let kUser = this.FindUserFromID(socket.strID);
            //     if(kUser != null)
            //     {
            //         if ( -1 != this.GameManager.FindUncompletedGame(kUser.strID) )
            //         {
            //             console.log(`####reconnect Rejoin`);
            //             this.GameManager.Rejoin(strID, socket);
            //         }
            //         else
            //         {
            //             this.GameManager.Leave(kUser);
            //             this.RemoveUser(socket);
            //         }
            //     }
            // });

            // socket.on('reconnect_failed', () => {
            //     console.log('reconnect fail!!!');
            //     let kUser = this.FindUserFromID(socket.strID);
            //     if(kUser != null)
            //     {
            //         this.GameManager.Leave(kUser);
            //         this.RemoveUser(socket);
            //     }
            // });

            socket.on('disconnect', async () => {

                console.log(`#---------------------------------- Socket Disconnection : ${socket.id}`);
                console.log(`#---------------------------------- Socket Disconnection : ${socket.strID}`);

                let bLeave = false;
                let kUser = this.FindUserFromID(socket.strID);

                if ( kUser != null )
                {
                    console.log(`lUnique : ${kUser.lUnique}`);
                    let index = this.GameManager.FindGameIndex(kUser.lUnique);

                    if ( index != -1 )
                    {
                        let instanceGame = this.GameManager.listGames[index];
                        console.log(`-------------------------------- RemoveRoom 0 : ${instanceGame.listUsers.GetLength()}`);
                        this.GameManager.LeaveSetting(kUser)
                        if ( instanceGame.listUsers.GetLength() <= 1 )
                        {
                            bLeave = true;
                        }
                        else if(kUser.bSpectator == true)
                        {
                            bLeave = true;
                        }
                        else
                        {
                            kUser.bConnection = false;
                        }
                    }

                    if ( bLeave == true )
                    {
                        console.log(`-------------------------------- RemoveRoom1`);
                        const lUnique = kUser.lUnique;
                        const kUserID = kUser.strID;
                        
                        if ( true == this.GameManager.Leave(kUser) )
                        {
                            console.log(`-------------------------------- RemoveRoom2`);
                            socket.emit('SM_Remove', kUserID);
                            await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                        }
                    }
                }
                this.RemoveUser(socket);
            });

            // this.GameManager.OnIO(io);

            socket.on('CM_Login', (strID, strNickname, strPassword, iAvatar, eUserType) => {

                console.log(`###################################################################### CM_Login`);
                console.log(strID);
        
                socket.strID = strID;
                socket.strPassword = strPassword;
                socket.strNickname = strNickname;
                socket.eStage = 'LOBBY';
                socket.iLocation = -1;
                socket.iAvatar = iAvatar;
                socket.eUserType = eUserType;
                socket.emit('SM_Login', {result:'OK', strID:strID, iAvatar:iAvatar, eUserType:eUserType});
           });
    //        socket.on('CM_Login', (strID, strNickname, strPassword, iAvatar, eUserType) => {

    //         console.log(`###################################################################### CM_Login`);
    //         console.log(strID);

    //         let kUser = this.FindUserFromID(strID);
    //         const retlUnique = this.GameManager.FindUncompletedGame(strID);
    //         if ( kUser != null )
    //         {
    //             kUser.strID = strID;
    //             kUser.strNickname = strNickname;
    //             kUser.strPassword = strPassword;
    //             kUser.eStage = 'LOBBY';
    //             kUser.iLocation = -1;
    //             kUser.iAvatar = iAvatar;
    //             kUser.eUserType = eUserType;
    //         }
           
    //         if ( -1 != this.GameManager.FindUncompletedGame(strID) )
    //         {
    //             console.log(`####AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA Rejoin`);
    //             this.GameManager.Rejoin(retlUnique, strID, socket);
    //         }
    //         else
    //         {
    //             // let kUser = this.FindUser(socket.id);

    //             // kUser.strID = strID;
    //             // kUser.strNickname = strNickname;
    //             // kUser.strPassword = strPassword;
    //             // kUser.eStage = 'LOBBY';
    //             // kUser.iLocation = -1;
    //             // kUser.iAvatar = iAvatar;
    //             // kUser.eUserType = eUserType;

    //             //console.log(`${socket.strID}, ${socket.eStage}, ##### CM_Login Avatar : ${iAvatar}, eUserType : ${eUserType}`);

    //             //this.PrintLobbyUsers();

    //             //socket.emit('SM_Login', {result:'OK', strID:strID, iCoin:kUser.iCoin, iAvatar:iAvatar, eUserType:eUserType});
    //             socket.emit('SM_Login', {result:'OK', strID:strID, iAvatar:iAvatar, eUserType:eUserType});
    //         }
    //    });

        socket.on('CM_JoinGame', (strID, strNickname, lUnique, iCoin, iAvatar, strOptionCode, strGroupID, iClass, eUserType) => {

            socket.strID = strID;

            let objectUserData = {strID:strID, strNickname:strNickname, iCoin:iCoin, iCash:0, iAvatar:iAvatar, strOptionCode:strOptionCode,
                                    strGroupID:strGroupID, iClass:iClass, eUserType:eUserType, socket:socket, iBuyIn:0};

            const retlUnique = this.GameManager.FindUncompletedGame(strID);
            if ( -1 != retlUnique )
            {
                console.log(`####AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA Rejoin2`);

                this.GameManager.Rejoin(retlUnique, strID, socket);
            }
            else
            {
                console.log(`CM_JoinGame`);
                console.log(`strID : ${strID}, strNickname : ${strNickname},iCoin : ${iCoin}, lUnique : ${lUnique}, Avatar : ${iAvatar}, strGroupID : ${strGroupID}, eUserType : ${eUserType}`);
    
                let iBuyIn = parseInt(strOptionCode[1]) * 100;
                objectUserData.iBuyIn = iBuyIn;
    
                let instanceRoom = this.GameManager.Join(lUnique, objectUserData);
                let iCash = parseInt(iCoin)-(parseInt(iBuyIn)*parseInt(instanceRoom.iDefaultCoin));
                if ( instanceRoom != null )
                {
                    
                    console.log(`======================================= ${iBuyIn} : ${instanceRoom.iDefaultCoin}`);
                    if(instanceRoom.iDefaultCoin == 500)
                    {
                        if(iCoin >= 10000)
                        {
                            socket.emit('SM_EnterGame', {result:'OK', 
                            strID:strID, 
                            strNickname:strNickname, 
                            iCoin:objectUserData.iCoin, 
                            iCash:objectUserData.iCash, 
                            strGameName:instanceRoom.strGameName, 
                            iBlind:instanceRoom.iDefaultCoin,
                            iLocation:instanceRoom.GetPlacedUser(),
                            eUserType:eUserType});
                        }
                        else
                        {
                            socket.emit('SM_Error', {error:'NotEnoughCoin', strLobbyAddress:global.strLobbyAddress});
                        }
                    }
                    else
                    {
                        if ( iCash < 0 )
                        {
                            socket.emit('SM_Error', {error:'NotEnoughCoin', strLobbyAddress:global.strLobbyAddress});
                        }
                        else
                        {
                            socket.emit('SM_EnterGame', {result:'OK', 
                                                        strID:strID, 
                                                        strNickname:strNickname, 
                                                        iCoin:objectUserData.iCoin, 
                                                        iCash:objectUserData.iCash, 
                                                        strGameName:instanceRoom.strGameName, 
                                                        iBlind:instanceRoom.iDefaultCoin,
                                                        iLocation:instanceRoom.GetPlacedUser(), 
                                                        eUserType:eUserType});
                        }
                    }
                }
                    //socket.emit('SM_EnterGame', {result:'OK'});
                else 
                    socket.emit('SM_Error', {error:'NotExistRoom',lUnique:lUnique, strLobbyAddress:global.strLobbyAddress});
    
                // this.PrintLobbyUsers();
            }            
            this.AddSocket(socket);
       });


            // socket.on('CM_EnterLobby', () => {

            //     // let listRooms = [];

            //     // for ( let i in this.GameManager.listGames )
            //     // {
            //     //     let iNumPlayers = this.GameManager.listGames[i].listUsers.GetLength();

            //     //     listRooms.push(
            //     //         {iNo:i+1, strName:this.GameManager.listGames[i].strGameName, iNumPlayers:iNumPlayers}
            //     //     );
            //     // }

            //     let listRooms = this.GameManager.GetRoomList();

            //     socket.emit('SM_RoomList', listRooms);
            // });

            socket.on('CM_CreateRoom', async (data) => {
                console.log("CM_CreateRoom");
                console.log(data);
                let instanceRoom = this.GameManager.CreateGame(data.strRoomName, data.eGameType, data.strPassword, data.iDefaultCoin, data.iBettingTime, data.iMaxPlayer);
                
                socket.emit('SM_CreateRoom', instanceRoom);
                let listPlayer = [];
                for ( let i = 0; i < instanceRoom.listUsers.GetLength(); ++ i )
                {
                    const player = instanceRoom.listUsers.GetUser(i);
                    //console.log(player);
                    const iCoin = player.iCoin+player.iCash;
                    listPlayer.push({strID:player.strID, strNickname:player.strNickname, iCoin:iCoin, iLocation:player.iLocation, iAvatar:player.iAvatar});
                }

                let objectData ={
                    lUnique:instanceRoom.lUnique,
                    strGameName:instanceRoom.strGameName,
                    eGameType:instanceRoom.eGameType,
                    strPassword:instanceRoom.strPassword,
                    iDefaultCoin:instanceRoom.iDefaultCoin,
                    iBettingTime:instanceRoom.iBettingTime,
                    iMaxPlayer:instanceRoom.cMaxPlayer,
                    iNumPlayer:1,
                    listPlayer:listPlayer
                };
                await this.RequestAxios(`${global.strLobbyAddress}/createroom`, {objectData:objectData});
            });

            socket.on('CM_RoomList', () => {

                let listRooms = this.GameManager.GetRoomList();

                socket.emit('SM_RoomList', listRooms);
            });

            socket.on('CM_RoomInfo', (lUnique) => {

                let roominfo = this.GameManager.GetRoomInfo(lUnique);

                socket.emit('SM_RoomInfo', roominfo);
            });
            // socket.on('CM_EnterGame', () => {

            //     console.log(`CM_EnterGame strID : ${socket.strID}`);

            //     socket.emit('SM_EnterGame', {result:'OK'});
            // });

            socket.on('CM_LeaveGame', async (strID) => {
                console.log('CM_LeaveGame : strID :');
                console.log(strID);
                let bLeave = false;
                let kUser = this.FindUserFromID(strID);

                if ( kUser != null )
                {
                    console.log(`lUnique : ${kUser.lUnique}`);
                    let index = this.GameManager.FindGameIndex(kUser.lUnique);

                    if ( index != -1 )
                    {
                        let instanceGame = this.GameManager.listGames[index];
                        this.GameManager.LeaveSetting(kUser)
                        if ( instanceGame.listUsers.GetLength() <= 1 )
                            bLeave = true;
                        else
                        {
                            let user = this.GameManager.listGames[index].FindPlayer(kUser.strID);
                            user.bConnection = false;
                        }
                    }

                    if ( bLeave == true )
                    {
                        console.log(`-------------------------------- RemoveRoom1`);
                        const lUnique = kUser.lUnique;
                        const kUserID = kUser.strID;
                        
                        if ( true == this.GameManager.Leave(kUser) )
                        {
                            console.log(`-------------------------------- RemoveRoom2`);
                            socket.emit('SM_Remove', kUserID);
                            await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                        }
                    }
                    this.RemoveUser(socket);
                }
            });

            socket.on('CM_LeaveGameReserve', async (strID) => {
                console.log('CM_LeaveGameReserve');
                console.log(strID);
                //let bLeave = false;
                let player = this.FindUserFromID(strID);
                //console.log(player.strID);
                if(player != null)
                {
                    console.log(player.bSpectator);
                    //player.bConnection = false;
                    player.bReserveExit = true;
                    const lUnique = player.lUnique;
                    let index = this.GameManager.FindGameIndex(lUnique);
                    if(index != -1)
                    {
                        let instanceGame = this.GameManager.listGames[index];
                        console.log(`${instanceGame.listUsers.GetLength()}`);
                        if(instanceGame.listUsers.GetLength() <= 1)
                        {
                            if ( true == this.GameManager.Leave(player) )
                            {
                                console.log(`-------------------------------- RemoveRoom2`);
                                player.socket.emit('SM_RemoveRoom',strID);
                                this.RemoveUser(player.socket);
                                await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                            }
                        }
                    }
                }
            });
            
            socket.on('CM_RoomUpdate', (objectData) => {

                //console.log(`CM_RoomUpdate`);
                //console.log(objectData);

                socket.emit('SM_RoomUpdate', objectData);
                //console.log("SM_RoomUpdate!!!!!!");
            });

            socket.on('CM_SelectLocation', (iLocation) => {

                console.log(`CM_SelectLocation ${iLocation}, socket.strID : ${socket.strID}`);

                //let kUser = this.FindUser(socket.id);
                let kUser = this.FindUserFromID(socket.strID);

                //console.log(kUser);
                let ret = this.GameManager.SetLocation(kUser, iLocation);

                console.log(`${kUser.iLocation}, ${kUser.strID}, ${kUser.strNickname}, ${kUser.eStage}, ${kUser.lUnique}, ##### Avatar : ${kUser.iAvatar}`);

                socket.emit('SM_SelectLocation', {
                    eResult:ret,
                    strNickname:kUser.strNickname, 
                    iCoin:kUser.iCoin, 
                    iCash:kUser.iCash, 
                    iLocation:iLocation, 
                    iAvatar:kUser.iAvatar, 
                    eUserType:kUser.eUserType
                });
            });

            // socket.on('CM_StartGame', () => {

            //     let kUser = this.FindUserFromID(socket.strID);

            //     if ( kUser != null )
            //     {
            //         console.log(`CM_StartGame : lUnique(${kUser.lUnique})`);

            //         let ret = this.GameManager.StartGame(kUser.lUnique);
            //         let index = this.GameManager.FindGameIndex(kUser.lUnique);
            //         let list = [];
    
            //         if ( -1 != index )
            //         {
            //             list = this.GameManager.listGames[index].GetEnableUserList();
            //         }
    
            //         for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
            //         {
            //             this.listSocket.GetSocket(i).emit('SM_StartGame', {eResult:ret, listUser:list});
            //         }
            //     }
            // });

            socket.on('CM_ShowCard', (objectData) => {
                console.log(`CM_ShowCard : objectData(${objectData})`);

                let kUser = this.FindUserFromID(objectData.strID);

                if ( null != kUser )
                {
                    this.GameManager.SetShowCard(kUser, objectData);
                }
            });

            socket.on('CM_Exit', (objectData) => {
                let kUser = this.FindUserFromID(objectData.strID);
                if(kUser != null)
                {
                    kUser.bReserveExit = objectData.bReserveExit;
                    this.GameManager.SetExit(kUser, objectData.bReserveExit);
                }
            });

            socket.on('CM_ChatSend', (tag) => {

                console.log(`CM_ChatSend :`);
                console.log(tag);
                
                //socket.bClick = true;
                // for (let i = 0; i < this.listSocket.GetLength(); ++i) {
                //     //socket.emit('SM_ChatSend', {tag:tag, strID:this.listSocket.GetSocket(i).strID});
                //     this.listSocket.GetSocket(i).emit('SM_ChatSend', {tag:tag});
                // }
            });

            socket.on('CM_MenuOpen', () => {
                socket.emit('SM_MenuOpen');
            });

            socket.on('CM_MenuClose', () => {
                socket.emit('SM_MenuClose');
            });

            socket.on('CM_ChatClose', () => {
                socket.emit('SM_ChatClose');
            });

            socket.on('CM_ChatOpen', () => {
                socket.emit('SM_ChatOpen');
            });

            socket.on('CM_ManualRebuyin', () => {

                console.log(`CM_ManualRebuyin :`);

                let kUser = this.FindUserFromID(socket.strID);
                if ( null != kUser )
                {
                    kUser.bMenualRebuyin = true;
                }
            });

            socket.on('CM_ChangeOptionCode', async (objectData) => {

                console.log(`CM_ChangeOptionCode : `);
                console.log(objectData);

                //const player = this.FindUser(objectData.strID);
                let kUser = this.FindUserFromID(socket.strID);
                if(kUser != null)
                {
                    kUser.strOptionCode = objectData.strOptionCode;
                    //await this.RequestAxios(`${global.strLobbyAddress}/UpdateOption`, {strID:objectData.strID, strOptionCode:objectData.strOptionCode});
                }
            });

            socket.on('CM_DefaultAnteSB', async (objectData) => {

                console.log(`CM_DefaultAnteSB : ${objectData.strNickname}`);
                //socket.iCoin -= iCoin;
                const cCash = parseInt(objectData.iCash) + parseInt(objectData.iCoin);
                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:cCash});
            });

            socket.on('CM_DefaultAnteBB', async (objectData) => {

                console.log(`CM_DefaultAnteBB : ${objectData.strNickname}`);
                //socket.iCoin -= iCoin;
                const cCash = parseInt(objectData.iCash) + parseInt(objectData.iCoin);
                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:cCash});
            });

            socket.on('CM_Betting', async (objectBetting) => {

                console.log(`CM_Betting`);
                //console.log(objectBetting);
				let kUser = this.FindUserFromID(socket.strID);
				if ( kUser != null )
                {
	                this.GameManager.ProcessBetting(kUser, objectBetting);
	                
	                const cCash = parseInt(kUser.iCash) + parseInt(kUser.iCoin);
	                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:kUser.strNickname,iAmount:cCash});
	            }
            });

            socket.on('CM_ReserveBet', async (bReserveBet) => {

                console.log(`CM_ReserveBet : ${bReserveBet}, ${socket.strID}`);

                socket.bReserveBet = bReserveBet;
            });

            socket.on('CM_Result', async (objectData) => {

                console.log(`CM_Result : ${objectData.strNickname}, Amount : ${objectData.iAmount}`);

                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:objectData.iAmount});
            });

            socket.on('CM_UpdateICash', (objectBetting) => {
                console.log(`CM_UpdateICash`);
                console.log(objectBetting);

                socket.emit('SM_UpdateICash', objectBetting);
            });
            
            socket.on('CM_SelectEmoticon', (iEmoticon) => {

                console.log(`CM_SelectEmoticon ${iEmoticon}`);

                let kUser = this.FindUserFromID(socket.strID);

                if ( null != kUser )
                {
                    this.GameManager.SetEmoticon(kUser, iEmoticon);
                }
            });
        });
    }

    Update()
    {
        //this.GameManager.Update();
    }

    AddSocket(socket)
    {
        console.log(`AddSocket : ${socket.id}`);

        this.listSocket.Add(socket);
        // this.PrintLobbyUsers();
    }

    async RemoveUser(socket)
    {
        console.log(`RemoveUser!!!!!!!!!!!!!!`);
        if(socket != null){
            console.log(`IGameInstance::RemoveUser - ${socket.strID}`);
            if(socket.strID != undefined)
            {
                await db.Users.update({eLocation:'LOBBY'}, {where:{strID:socket.strID}});
            }
            this.listSocket.Remove(socket);
        }
        else
        {
            console.log(`IGameInstance::RemoveUser - socket null~~!!`);
        }
        this.listSocket.PrintList(`IGameInstance:${socket.strID}`);
    }

    PrintLobbyUsers()
    {
        console.log(`################################################## #Users`);
        
        for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
        {
            const player = this.FindUserFromID(this.listSocket.GetSocket(i).strID);
            if(player != null && player.eStage != 'GAME')
            {
                console.log(`strID : ${this.listSocket.GetSocket(i).strID}, eStage : ${player.eStage}, socket id : ${this.listSocket.GetSocket(i).id}`);
                this.RemoveUser(this.listSocket.GetSocket(i));
            }
        }
    }
}
module.exports = IGameInstance;