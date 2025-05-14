let ISocketList = require('./ISocketList');
let E = require('./IEnum');


let axios = require('axios');

let db = require('../db');

class IGameInstance {
    constructor(io, namespaceIO, kGameManager) {
        this.io = io;
        this.namespaceIO = io.of(namespaceIO);
        this.listSocket = new ISocketList();

        this.GameManager = kGameManager;
    }

    async RequestAxios(strAddress, objectData) {
        console.log(`IGameInstance::RequestAxios ${strAddress}`);
        console.log(objectData);

        try {

            const customAxios = axios.create({});
            const response = await customAxios.post(strAddress, objectData, { headers: { 'Accept-Encoding': 'application/json' } });
            console.log(response.data);
            if (response.data.result == 'OK')
                return { result: 'OK', data: response.data };
            else
                return { result: 'error', error: response.data.error };
        }
        catch (error) {

            return { result: 'error', error: 'axios' };

        }
    }

    // async RequestAxios(strAddress, objectData)
    // {
    //     console.log(`IGameInstance::RequestAxios ${strAddress}`);
    //     console.log(objectData);

    //     try {

    //         const response = await axios.post(strAddress, objectData);
    //         console.log(response.data);
    //         if ( response.data.result == 'OK' )
    //             return {result:'OK', data:response.data};
    //         else
    //             return {result:'error', error:response.data.error};    
    //     }
    //     catch (error) {

    //         return {result:'error', error:'axios'};

    //     }
    // }

    FindUser(strID) {
        for (let i = 0; i < this.listSocket.GetLength(); ++i) {
            if (this.listSocket.GetSocket(i).strID == strID)
                return this.listSocket.GetSocket(i);
        }
        return null;
    }
    
    FindUserSocket(user)
    {
        for ( let i = 0; i < this.listSocket.GetLength(); ++ i )
        {
            if ( this.listSocket.GetSocket(i).strID == user.strID )
                return this.listSocket.GetSocket(i);
        }
        return null;
    }

    FindUserFromID(strID) {
        let user = this.GameManager.FindUserFromID(strID);
        if (user != null)
            return user;
        return null;
    }

    OnIO(io) {
        this.namespaceIO.on('connection', (socket) => {

            console.log(`#---------------------------------- Socket Connection : ${socket.id}`);
            socket.emit('SM_RequestLogin');
            console.log(`#---------------------------------- Socket Connection : ${socket.strID}`);

            socket.on('disconnect', async () => {

                console.log(`#---------------------------------- Socket Disconnection : ${socket.id}`);
                console.log(`#---------------------------------- Socket Disconnection : ${socket.strID}`);

                let bLeave = false;
                let kUser = this.FindUserFromID(socket.strID);

                if (kUser != null) {
                    console.log(`lUnique : ${kUser.lUnique}`);
                    let index = this.GameManager.FindGameIndex(kUser.lUnique);

                    if (index != -1) {
                        let instanceGame = this.GameManager.listGames[index];
                        console.log(`-------------------------------- RemoveRoom 0 : ${instanceGame.listUsers.GetLength()}`);
                        this.GameManager.LeaveSetting(kUser)
                        if (instanceGame.listUsers.GetLength() <= 1) {
                            bLeave = true;
                        }
                        else if (kUser.bSpectator == true) {
                            bLeave = true;
                        }
                        else {
                            kUser.bConnection = false;
                        }
                    }

                    if (bLeave == true) {
                        console.log(`-------------------------------- RemoveRoom1`);
                        const lUnique = kUser.lUnique;
                        const kUserID = kUser.strID;

                        if (true == this.GameManager.Leave(kUser)) {
                            console.log(`-------------------------------- RemoveRoom2`);
                            socket.emit('SM_Remove', kUserID);
                            await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, { lUnique: lUnique });
                        }
                    }
                }
                this.RemoveUser(socket);
            });

            // this.GameManager.OnIO(io);

            socket.on('CM_Login', (strID, strNickname, strPassword, iAvatar, eUserType) => {

                console.log(`CM_Login`);

                socket.strID = strID;
                socket.strPassword = strPassword;
                socket.strNickname = strNickname;
                socket.eStage = 'LOBBY';
                socket.iLocation = -1;
                socket.iAvatar = iAvatar;
                socket.eUserType = eUserType;
                socket.emit('SM_Login', { result: 'OK', strID: strID, iAvatar: iAvatar, eUserType: eUserType });
            });

            socket.on('CM_JoinGame', (strID, strNickname, lUnique, iCoin, iAvatar, strOptionCode, strGroupID, iClass, eUserType) => {

                socket.strID = strID;
                socket.lUnique = lUnique;

                let objectUserData = {
                    strID: strID, strNickname: strNickname, iCoin: iCoin, iCash: 0, iAvatar: iAvatar, strOptionCode: strOptionCode,
                    strGroupID: strGroupID, iClass: iClass, eUserType: eUserType, socket: socket
                };

                const retlUnique = this.GameManager.FindUncompletedGame(strID);
                if (-1 != retlUnique) {
                    console.log(`####AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA Rejoin2`);

                    this.GameManager.Rejoin(retlUnique, strID, socket);
                }
                else {
                    console.log(`CM_JoinGame`);
                    console.log(`strID : ${strID}, strNickname : ${strNickname},iCoin : ${iCoin}, lUnique : ${lUnique}, Avatar : ${iAvatar}, strGroupID : ${strGroupID}, eUserType : ${eUserType}`);

                    let instanceRoom = this.GameManager.Join(lUnique, objectUserData);
                    console.log(instanceRoom);
                    let iCash = parseInt(iCoin) - parseInt(instanceRoom.iDefaultCoin);
                    if (instanceRoom != null) {
                        if (iCash < 0) {
                            socket.emit('SM_Error', { error: 'NotEnoughCoin', strLobbyAddress: global.strLobbyAddress });
                        }
                        else {
                            socket.emit('SM_EnterGame', {
                                result: 'OK',
                                strID: strID,
                                strNickname: strNickname,
                                iCoin: objectUserData.iCoin,
                                iCash: objectUserData.iCash,
                                strGameName: instanceRoom.strGameName,
                                iBlind: instanceRoom.iDefaultCoin,
                                eUserType: eUserType
                            });
                        }
                    }
                    else
                        socket.emit('SM_Error', { error: 'NotExistRoom', lUnique: lUnique, strLobbyAddress: global.strLobbyAddress });
                }
                this.AddSocket(socket);
            });

            socket.on('CM_EnterLobby', () => {

                // let listRooms = [];

                // for ( let i in this.GameManager.listGames )
                // {
                //     let iNumPlayers = this.GameManager.listGames[i].listUsers.GetLength();

                //     listRooms.push(
                //         {iNo:i+1, strName:this.GameManager.listGames[i].strGameName, iNumPlayers:iNumPlayers}
                //     );
                // }

                let listRooms = this.GameManager.GetRoomList();

                socket.emit('SM_RoomList', listRooms);
            });

            socket.on('CM_RoomList', () => {

                let listRooms = this.GameManager.GetRoomList();

                socket.emit('SM_RoomList', listRooms);
            });

            // socket.on('CM_EnterGame', () => {

            //     console.log(`CM_EnterGame strID : ${socket.strID}`);

            //     socket.emit('SM_EnterGame', {result:'OK'});
            // });

            // socket.on('CM_LeaveGame', async () => {

            //     console.log(`CM_LeaveGame strID : ${socket.strID}, lUnique : ${socket.lUnique}`);

            //     let lUnique = socket.lUnique;

            //     if ( true == this.GameManager.Leave(socket) )
            //     {
            //         //this.AddUser(socket);
            //         await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
            //     }
            //     await this.RequestAxios(`${global.strLobbyAddress}/quitroom`, {strID:socket.strID});

            //     socket.emit('SM_LeaveGame', {result:'OK'});
            // });

            // socket.on('CM_QuickJoin', (data) => {

            //     console.log(`CM_QuickJoin`);

            //     console.log(`User Coin : ${socket.iCoin}, DefaultCoin : ${data.iDefaultCoin}`);

            //     const cBuyin = parseInt(data.iDefaultCoin) * 100;

            //     if ( socket.iCoin >= cBuyin )
            //     {
            //         this.GameManager.QuickJoin(data.iDefaultCoin, socket);

            //         this.RemoveUser(socket);

            //         socket.emit('SM_EnterGame', {result:'OK'});
            //     }
            //     else
            //     {
            //         socket.emit('SM_Error', {error:'NotEnoughBuyin'});
            //     }
            // });
            socket.on('CM_QuickJoin', (data) => {

                console.log(`CM_QuickJoin`);

                console.log(data);

                console.log(`User Coin : ${socket.iCoin}, DefaultCoin : ${data.iDefaultCoin}`);

                const cBuyin = parseInt(data.iDefaultCoin) * 100;

                if (socket.iCoin >= cBuyin) {
                    //this.GameManager.QuickJoin(data.iDefaultCoin, socket);
                    let result = this.GameManager.QuickJoin(data.strRoomName, data.strPassword, data.iDefaultCoin, data.iBettingTime, data.iNumPlayers, socket);
                    if (result != null) {
                        //this.RemoveUser(socket);
                        //socket.emit('SM_EnterGame', {result:'OK', lUnique:result.lUnique});
                        socket.emit('SM_OpenGame', { result: 'OK', lUnique: result.lUnique });
                    }
                    else {
                        socket.emit('SM_Error', { error: 'NotJoinableRoom' });
                    }
                }
                else {
                    socket.emit('SM_Error', { error: 'NotEnoughBuyin' });
                }
            });

            // socket.on('CM_CreateRoom', (data) => {

            //     console.log(`CM_CreateRoom`);
            //     console.log(data);

            // });

            //  Game

            socket.on('CM_SelectLocation', (iLocation) => {
                console.log(`CM_SelectLocation ${iLocation}`);
                let instanceRoom = this.GameManager.GetRoomInfo(socket.lUnique);
                if ( instanceRoom != null )
                {
                    socket.iCoin = parseInt(socket.iCoin)-parseInt(instanceRoom.iDefaultCoin);
                    //socket.iCoin = 200;
                }
                
                let kUser = this.FindUserFromID(socket.strID);
                let ret = this.GameManager.SetLocation(kUser, iLocation);
                console.log(socket.iCoin);
                
                console.log(`${kUser.iLocation}, ${kUser.strID}, ${kUser.strNickname}, ${kUser.eStage}, ${kUser.lUnique}, ##### Avatar : ${kUser.iAvatar}, ${kUser.iCoin}`);
                if ( instanceRoom != null )
                {
                    socket.emit('SM_SelectLocation', {eResult:ret,strNickname:kUser.strNickname, iScore:kUser.iScore, iCoin:kUser.iCoin, iCash:kUser.iCash, iLocation:iLocation, iAvatar:kUser.iAvatar, eUserType:kUser.eUserType, iDefaultCoin:instanceRoom.iDefaultCoin});
                }
                else 
                    socket.emit('SM_Error', {error:'NotExistRoom',lUnique:kUser.lUnique, strLobbyAddress:global.strLobbyAddress});
            });

            socket.on('CM_ReadyGame', () => {
                let kUser = this.FindUserFromID(socket.strID);
                if (kUser.bReady == false) {
                    kUser.bReady = true;
                } else {
                    kUser.bReady = false;
                }
                // console.log(`CM_ReadyGame : lUnique(${socket.lUnique})`);

                this.GameManager.ReadyGame(kUser.lUnique);
                // let index = this.GameManager.FindGameIndex(socket.lUnique);
                // let list = [];

                // if ( -1 != index )
                // {
                //     list = this.GameManager.listGames[index].GetEnableUserList();
                // }

                // for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                // {
                //     this.listUsers.GetSocket(i).emit('SM_ReadyGame', {eResult:ret, listUser:list});
                // }
            });

            socket.on('CM_StartGame', (object) => {

                //socket.bClick = true;
                let kUser = this.FindUserFromID(socket.strID);
                console.log(`CM_StartGame : lUnique(${kUser.lUnique})`);
                if (object.bStart == true) {
                    kUser.bBig2Play = true;
                    socket.emit('SM_DisableStartGame');
                }
                else {
                    socket.emit('SM_EnableStartGame');
                }
            });

            socket.on('CM_StartBig2', async () => {
                console.log(`CM_StartBig2 : lUnique(${socket.lUnique})`);

                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:socket.strNickname,iAmount:socket.iCash});
            });
            
            socket.on('CM_Language', (i18nTexts) => {
                socket.emit('SM_Language',i18nTexts);
            });

            socket.on('CM_ChatSend', (tag) => {

                console.log(`CM_ChatSend :`);
                console.log(tag);

                //socket.bClick = true;
                for (let i = 0; i < this.listSocket.GetLength(); ++i) {
                    //socket.emit('SM_ChatSend', {tag:tag, strID:this.listUsers.GetSocket(i).strID});
                    this.listSocket.GetSocket(i).emit('SM_ChatSend', { tag: tag });
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

            socket.on('CM_ChatClose', () => {
                socket.emit('SM_ChatClose');
            });

            socket.on('CM_ChatOpen', () => {
                socket.emit('SM_ChatOpen');
            });

            socket.on('CM_ManualRebuyin', () => {

                let kUser = this.FindUserFromID(socket.strID);
                if (null != kUser) {
                    kUser.bMenualRebuyin = true;
                }
            });

            socket.on('CM_DefaultAnteSB', (iCoin) => {

                console.log(`CM_DefaultAnteSB : ${iCoin}`);
                //socket.iCoin -= iCoin;
            });

            socket.on('CM_DefaultAnteBB', (iCoin) => {

                console.log(`CM_DefaultAnteBB : ${iCoin}`);
                //socket.iCoin -= iCoin;
            });

            socket.on('CM_Submit', (objectBetting) => {

                console.log(`CM_Submit : ${objectBetting.strBetting}`);
                console.log(objectBetting.list);
                let kUser = this.FindUserFromID(socket.strID);
                this.GameManager.ProcessSubmit(kUser, objectBetting);
            });

            socket.on('CM_SelectEmoticon', (iEmoticon) => {

                console.log(`CM_SelectEmoticon ${iEmoticon}`);

                let kUser = this.FindUserFromID(socket.strID);

                if ( null != kUser )
                {
                    this.GameManager.SetEmoticon(kUser, iEmoticon);
                }
            });

            socket.on('CM_Result', async (objectData) => {

                console.log(`CM_Result : ${objectData.strNickname}, Amount : ${objectData.iAmount}`);
                socket.iCash = objectData.iAmount;

                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:objectData.iAmount});
            });
        });
    }

    Update() {
        //this.GameManager.Update();
    }

    AddSocket(socket) {
        console.log(`AddSocket : ${socket.id}`);

        this.listSocket.Add(socket);
        // this.PrintLobbyUsers();
    }

    async RemoveUser(socket) {
        console.log(`RemoveUser!!!!!!!!!!!!!!`);
        if (socket != null) {
            console.log(`IGameInstance::RemoveUser - ${socket.strID}`);
            if (socket.strID != undefined) {
                await db.Users.update({ eLocation: 'LOBBY' }, { where: { strID: socket.strID } });
            }
            this.listSocket.Remove(socket);
        }
        else {
            console.log(`IGameInstance::RemoveUser - socket null~~!!`);
        }
        this.listSocket.PrintList(`IGameInstance:${socket.strID}`);
    }

    PrintLobbyUsers() {
        console.log(`################################################## #Users`);

        for (let i = 0; i < this.listSocket.GetLength(); ++i) {
            const player = this.FindUserFromID(this.listSocket.GetSocket(i).strID);
            if (player != null && player.eStage != 'GAME') {
                console.log(`strID : ${this.listSocket.GetSocket(i).strID}, eStage : ${player.eStage}, socket id : ${this.listSocket.GetSocket(i).id}`);
                this.RemoveUser(this.listSocket.GetSocket(i));
            }
        }
    }
}
module.exports = IGameInstance;