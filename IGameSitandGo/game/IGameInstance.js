let ISocketList = require('./ISocketList');

let axios = require('axios');

class IGameInstance
{
    constructor(io, namespaceIO, kGameManager)
    {
        this.io = io;
        this.namespaceIO = io.of(namespaceIO);
        this.listUsers = new ISocketList();

        this.listAbnormalSocket = [];

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

    FindUser(strID)
    {
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
        {
            if ( this.listUsers.GetSocket(i).strID == strID )
                return this.listUsers.GetSocket(i);
        }
        return null;
    }

    OnIO(io)
    {
        this.namespaceIO.on('connection', (socket) => {

            console.log(`#---------------------------------- Socket Connection : ${socket.id}`);
            
            socket.eStage = 'STANDBY';
            socket.bConnection = true;
            //console.log(socket);
            this.AddUser(socket);
            if ( socket.strID == undefined )
            {
                console.log(`Emit SM_RequestLogin`);
                socket.emit('SM_RequestLogin');
            }

            socket.on('disconnect', async () => {
                let lUnique = socket.lUnique;
                console.log(`#---------------------------------- Socket Disconnection : ${socket.id}, ${socket.strID}, ${socket.eStage}, ${socket.lUnique}`);
            
                socket.bConnection = false;
                this.listAbnormalSocket.push(socket);
                
                if (this.GameManager.LeaveSetting(socket)) {
                    // 역순으로 순회
                    for(let i = this.listAbnormalSocket.length - 1; i >= 0; i--) {
                        if (lUnique == this.listAbnormalSocket[i].lUnique) {
                            this.RemoveUser(this.listAbnormalSocket[i]);
                            this.listAbnormalSocket.splice(i, 1); // 제거
                        }
                    }
                    // this.RemoveUser(socket);
            
                    await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                } else {
                    if(socket.bSpectator == true || socket.bEnable == false)
                    {
                        for(let i in this.listAbnormalSocket)
                        {
                            if(this.listAbnormalSocket[i].strID == socket.strID)
                            {
                                this.listAbnormalSocket.splice(i,1);
                            }
                        }
                        if ( this.GameManager.Leave(socket) )
                        {
                            this.RemoveUser(socket);
                            await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                        }
                        else
                        {
                            let objectPlayer = {strID:socket.strID, iLocation:socket.iLocation};

                            for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                            {
                                this.listUsers.GetSocket(i).emit('SM_BroadcastLeaveUser', objectPlayer);
                            }
                            this.RemoveUser(socket);
                            //await this.RequestAxios(`${global.strLobbyAddress}/leaveroom`, {lUnique:lUnique});                    
                        }
                    }
                }
            });

            // this.GameManager.OnIO(io);

            socket.on('CM_Login', (strID, strNickname, strPassword, iAvatar, eUserType) => {

                console.log(`CM_Login`);

                socket.strID = strID;
                socket.strNickname = strNickname;
                socket.strPassword = strPassword;
                socket.eStage = 'LOBBY';
                socket.iLocation = -1;
                //socket.iCoin = 100000;
                socket.iAvatar = iAvatar;
                socket.eUserType = eUserType;
                // socket.iCoin = this.iCoinList[this.iCurrentCoin];
                // this.iCurrentCoin ++;
                // this.iCurrentCoin = Math.floor(this.iCurrentCoin%5);
                //socket.iCash = 200000;

                console.log(`${socket.strID}, ${socket.eStage}, ##### CM_Login Avatar : ${iAvatar}, eUserType : ${eUserType}`);

                this.PrintLobbyUsers();

                socket.emit('SM_Login', {result:'OK', strID:strID, iAvatar:iAvatar, eUserType:eUserType});
           });

        socket.on('CM_JoinGame', (strID, strNickname, lUnique, iCoin, iAvatar, strOptionCode, strGroupID, iClass, eUserType) => {

            console.log(`CM_JoinGame`);
            console.log(`strID : ${strID}, strNickname : ${strNickname},iCoin : ${iCoin}, lUnique : ${lUnique}, Avatar : ${iAvatar}, strGroupID : ${strGroupID}, eUserType : ${eUserType}`);

            socket.strID = strID;
            socket.strNickname = strNickname;
            //socket.strPassword = strPassword;
            socket.eStage = 'LOBBY';
            socket.iLocation = -1;
            // socket.iCoin = iCoin;
            socket.iAvatar = iAvatar;
            socket.eUserType = eUserType;
            socket.strOptionCode = strOptionCode;
            socket.strGroupID = strGroupID;
            socket.iClass = iClass;
            socket.iCash = parseInt(iCoin);
            let iBuyIn = parseInt(strOptionCode[1]) * 100;

            let instanceRoom = this.GameManager.Join(lUnique, socket);
            if ( instanceRoom != null )
            {
                let iCash = parseInt(iCoin)-parseInt(instanceRoom.iDefaultCoin);
                console.log(`======================================= ${iBuyIn} : ${instanceRoom.iDefaultCoin}`);
                if ( iCash < 0 )
                {
                    socket.emit('SM_Error', {error:'NotEnoughCoin'});
                }
                else
                {
                    console.log(`##### bRejoin : ${socket.bRejoin}`);
                    if ( socket.bRejoin == false )
                    {
                        socket.emit('SM_EnterGame', {result:'OK', strID:strID, strNickname:strNickname, iCash:iCoin, strGameName:instanceRoom.strGameName, iBlind:instanceRoom.iBlind, eUserType:eUserType});
                    }
                }
            }
            else 
                socket.emit('SM_Error', {error:'NotExistRoom',lUnique:lUnique});

            this.PrintLobbyUsers();
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

            socket.on('CM_CreateRoom', async (data) => {
                console.log("CM_CreateRoom");
                console.log(data);
                let instanceRoom = this.GameManager.CreateGame(data.strRoomName, data.eGameType, data.strPassword, data.iDefaultCoin, data.iBettingTime, data.iMaxPlayer);
                
                socket.emit('SM_CreateRoom', instanceRoom);
                let listPlayer = [];
                for ( let i = 0; i < instanceRoom.listUsers.GetLength(); ++ i )
                {
                    const player = instanceRoom.listUsers.GetSocket(i);
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
                console.log(`CM_LeaveGame`);
                console.log(strID);
                let player = this.FindUser(strID);
                if(player != null){
                    let lUnique = player.lUnique;
                    for(let i in this.listAbnormalSocket)
                    {
                        if(this.listAbnormalSocket[i].strID == strID)
                        {
                            this.listAbnormalSocket.splice(i,1);
                        }
                    }
                    if ( this.GameManager.Leave(player) )
                    {
                        this.RemoveUser(player);
                        await this.RequestAxios(`${global.strLobbyAddress}/removeroom`, {lUnique:lUnique});
                    }
                    else
                    {
                        this.RemoveUser(player);
                        await this.RequestAxios(`${global.strLobbyAddress}/leaveroom`, {lUnique:lUnique});                    
                    }
                }
            });

            socket.on('CM_QuickJoin', (data) => {

                console.log(`CM_QuickJoin`);

                console.log(data);

                console.log(`User Coin : ${socket.iCoin}, DefaultCoin : ${data.iDefaultCoin}`);

                const cBuyin = parseInt(data.iDefaultCoin) * 100;

                if ( socket.iCoin >= cBuyin )
                {
                    //this.GameManager.QuickJoin(data.iDefaultCoin, socket);
                    let result = this.GameManager.QuickJoin(data.strRoomName, data.strPassword, data.iDefaultCoin, data.iBettingTime, data.iNumPlayers, socket);
                    if ( result != null )
                    {
                        //this.RemoveUser(socket);
                        //socket.emit('SM_EnterGame', {result:'OK', lUnique:result.lUnique});
                        socket.emit('SM_OpenGame', {result:'OK', lUnique:result.lUnique});
                    }
                    else
                    {
                        socket.emit('SM_Error', {error:'NotJoinableRoom'});
                    }
                }
                else
                {
                    socket.emit('SM_Error', {error:'NotEnoughBuyin'});
                }
            });
            
            socket.on('CM_RoomUpdate', (objectData) => {

                console.log(`CM_RoomUpdate`);
                console.log(objectData);

                io.emit('SM_RoomUpdate', objectData);
                //socket.emit('SM_RoomUpdate', objectData);
                console.log("SM_RoomUpdate!!!!!!");
            });

            socket.on('CM_SelectLocation', (iLocation) => {

                console.log(`CM_SelectLocation ${iLocation}`);
                let instanceRoom = this.GameManager.GetRoomInfo(socket.lUnique);
                if ( instanceRoom != null )
                {
                    socket.iCash = parseInt(socket.iCash)-parseInt(instanceRoom.iDefaultCoin);
                    socket.iCoin = 200;
                }

                let ret = this.GameManager.SetLocation(socket, iLocation);

                console.log(`${socket.iLocation}, ${socket.strID}, ${socket.strNickname}, ${socket.eStage}, ${socket.lUnique}, ##### Avatar : ${socket.iAvatar}`);

                if ( instanceRoom != null )
                {
                    socket.emit('SM_SelectLocation', {eResult:ret,strNickname:socket.strNickname, iCoin:socket.iCoin, iCash:socket.iCash, iLocation:iLocation, iAvatar:socket.iAvatar, eUserType:socket.eUserType, iDefaultCoin:instanceRoom.iDefaultCoin});
                }
                else 
                    socket.emit('SM_Error', {error:'NotExistRoom',lUnique:socket.lUnique});
            });

            socket.on('CM_StartGame', () => {
                console.log(`CM_StartGame : lUnique(${socket.lUnique})`);

                let ret = this.GameManager.StartGame(socket.lUnique);
                let index = this.GameManager.FindGameIndex(socket.lUnique);
                let list = [];

                if ( -1 != index )
                {
                    list = this.GameManager.listGames[index].GetEnableUserList();
                }

                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                {
                    this.listUsers.GetSocket(i).emit('SM_StartGame', {eResult:ret, listUser:list});
                }
            });

            socket.on('CM_StartSitGo', async () => {
                console.log(`CM_StartSitGo : lUnique(${socket.lUnique})`);

                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:socket.strNickname,iAmount:socket.iCash});
            });

            socket.on('CM_ShowCard', (objectData) => {
                console.log(`CM_ShowCard : objectData(${objectData})`);

                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                {
                    this.listUsers.GetSocket(i).emit('SM_ShowCard', objectData);
                }
            });

            socket.on('CM_CloseCheck', (objectData) => {
                console.log(`CM_CloseCheck`);
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                {
                    if(this.listUsers.GetSocket(i).strID == objectData.strID && (this.listUsers.GetSocket(i).iLocation == -1 || (this.listUsers.GetSocket(i).iLocation != -1 && this.listUsers.GetSocket(i).bSitGoPlay == false)))
                        this.listUsers.GetSocket(i).emit('SM_CloseCheck',objectData);
                }
            });

            socket.on('CM_Exit', (objectData) => {
                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                {
                    this.listUsers.GetSocket(i).emit('SM_Exit',objectData);
                }
            });

            socket.on('CM_ChatSend', (tag) => {

                console.log(`CM_ChatSend :`);
                console.log(tag);
                
                //socket.bClick = true;
                for (let i = 0; i < this.listUsers.GetLength(); ++i) {
                    //socket.emit('SM_ChatSend', {tag:tag, strID:this.listUsers.GetSocket(i).strID});
                    this.listUsers.GetSocket(i).emit('SM_ChatSend', {tag:tag});
                }
            });

            socket.on('CM_ChatClose', () => {
                socket.emit('SM_ChatClose');
            });

            socket.on('CM_ChatOpen', () => {
                socket.emit('SM_ChatOpen');
            });

            socket.on('CM_ManualRebuyin', () => {

                console.log(`CM_ManualRebuyin :`);
                socket.bMenualRebuyin = true;
            });

            socket.on('CM_ChangeOptionCode', async (objectData) => {

                console.log(`CM_ChangeOptionCode : `);
                console.log(objectData);

                const player = this.FindUser(objectData.strID);
                if(player != null)
                {
                    player.strOptionCode = objectData.strOptionCode;
                    await this.RequestAxios(`${global.strLobbyAddress}/UpdateOption`, {strID:objectData.strID, strOptionCode:objectData.strOptionCode});
                }
            });

            socket.on('CM_DefaultAnteSB', async (objectData) => {

                console.log(`CM_DefaultAnteSB : ${objectData.strNickname}`);
                //socket.iCoin -= iCoin;
                // const cCash = parseInt(objectData.iCash) + parseInt(objectData.iCoin);
                // await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:cCash});
            });

            socket.on('CM_DefaultAnteBB', async (objectData) => {

                console.log(`CM_DefaultAnteBB : ${objectData.strNickname}`);
                //socket.iCoin -= iCoin;
                // const cCash = parseInt(objectData.iCash) + parseInt(objectData.iCoin);
                // await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:cCash});
            });

            socket.on('CM_Betting', async (objectBetting) => {

                console.log(`CM_Betting : ${objectBetting.strBetting}, Amount : ${objectBetting.iAmount}, nickname : ${socket.strNickname}`);

                this.GameManager.ProcessBetting(socket, objectBetting);

                // const cCash = parseInt(socket.iCash) + parseInt(socket.iCoin);
                // await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:socket.strNickname,iAmount:cCash});
            });
            
            socket.on('CM_NextBlindUp', (bNextBlindUp) => {

                console.log(`CM_NextBlindUp bNextBlindUp : ${bNextBlindUp}`);

                let instanceRoom = this.GameManager.GetRoomInfo(socket.lUnique);
                if ( instanceRoom != null )
                {
                    instanceRoom.bNextBlindUp = bNextBlindUp;
                }
            });
            
            socket.on('CM_BlindUp', (iBlind) => {

                console.log(`CM_BlindUp iBlind : ${iBlind}`);

                let instanceRoom = this.GameManager.GetRoomInfo(socket.lUnique);
                if ( instanceRoom != null )
                {
                    instanceRoom.iBlind = iBlind;
                }
            });

            socket.on('CM_Result', async (objectData) => {

                console.log(`CM_Result : ${objectData.strNickname}, Amount : ${objectData.iAmount}`);
                socket.iCash = objectData.iAmount;

                await this.RequestAxios(`${global.strLobbyAddress}/UpdateCoin`, {strNickname:objectData.strNickname,iAmount:objectData.iAmount});
            });

            socket.on('CM_UpdateICash', (objectBetting) => {
                console.log(`CM_UpdateICash`);
                console.log(objectBetting);

                socket.emit('SM_UpdateICash', objectBetting);
            });
            
            socket.on('CM_SelectEmoticon', (iEmoticon) => {

                console.log(`CM_SelectEmoticon ${iEmoticon}`);

                for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
                {
                    this.listUsers.GetSocket(i).emit('SM_SelectEmoticon', {strID:socket.strID,iEmoticon:iEmoticon});
                }
            });
        });
    }

    Update()
    {
        //this.GameManager.Update();
    }

    AddUser(socket)
    {
        console.log(`AddUser : ${socket.strID}`);

        this.listUsers.Add(socket);
        this.PrintLobbyUsers();
    }

    RemoveUser(socket)
    {
        if(socket != null){
            this.listUsers.Remove(socket);
            this.PrintLobbyUsers();
        }
    }

    PrintLobbyUsers()
    {
        console.log(`################################################## #Users`);
        
        for ( let i = 0; i < this.listUsers.GetLength(); ++ i )
            console.log(`strID : ${this.listUsers.GetSocket(i).strID}, eStage : ${this.listUsers.GetSocket(i).eStage}`);
    }
}
module.exports = IGameInstance;