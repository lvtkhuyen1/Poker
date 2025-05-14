let IGame = require('./IGame');
let E = require('./IEnum');

let db = require('../db');

class IGameManager
{
    constructor(io)
    {
        this.io = io;

        this.listGames = [];
    }

    // CreateGame(strGameName, iDefaultCoin)
    // {
    //     console.log(`IGameManager::CreateGame : ${strGameName}, iDefaultCoin : ${iDefaultCoin}`);
    //     let instanceGame = new IGame(strGameName, iDefaultCoin);
    //     this.listGames.push(instanceGame);

    //     this.PrintRoomList();

    //     return instanceGame;
    // }
    CreateGame(strGameName, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers)
    {
        console.log(`IGameManager::CreateGame : ${strGameName}, iDefaultCoin : ${iDefaultCoin}`);
        //let instanceGame = new IGame(strGameName, iDefaultCoin);
        let instanceGame = new IGame(strGameName, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers);
        this.listGames.push(instanceGame);

        this.PrintRoomList();

        return instanceGame;
    }

    DeleteGame(lUnique)
    {
        console.log(`IGameManager::DeleteGame : lUnique : ${lUnique}`);
        const cIndex = this.FindGameIndex(lUnique);
        if ( -1 != cIndex )
        {

            this.listGames.splice(cIndex, 1);
        }
        this.PrintRoomList();
    }

    FindUserFromID(strID)
    {
        for ( let i in this.listGames )
        {
            let game = this.listGames[i];
            let user = game.FindPlayer(strID);
            if ( user != null )
            {
                return user;
            }
        }
        return null;

    }

    FindUserFromSocketID(socketid)
    {
        for ( let i in this.listGames )
        {
            let game = this.listGames[i];
            let user = game.FindUserFromSocketID(socketid);
            if ( user != null )
            {
                return user;
            }
        }
        return null;

    }

    FindUncompletedGame(strID)
    {
        for ( let i in this.listGames )
        {
            console.log(`FindGame : ${i}, ${this.listGames[i].strGameName}`);

            let game = this.listGames[i];
            if ( game.FindPlayer(strID) != null )
            {
                return game.lUnique;
            }
        }
        return -1;
    }

    FindGameIndex(lUnique)
    {
        console.log(`FindGameIndex : ${lUnique}, GameLength : ${this.listGames.length}`);

        for ( let i in this.listGames )
        {
            console.log(`FindGame : ${i}, ${this.listGames[i].strGameName}`);

            if ( this.listGames[i].lUnique == lUnique )
            {
                return i;
            }
        }
        return -1;
    }

    FindGame(iDefaultCoin)
    {
        for ( let i in this.listGames )
        {
            //if ( this.listGames[i].iDefaultCoin == iDefaultCoin && this.listGames[i].GetNumUsers() < 9 )
            if ( this.listGames[i].iDefaultCoin == iDefaultCoin && this.listGames[i].GetNumUsers() < this.listGames[i].cMaxPlayer )
            {
                return this.listGames[i];
            }
        }
        return null;
    }

    SetLocation(user, iLocation)
    {
        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            return this.listGames[cIndex].SetLocation(user, iLocation);
        }
        return false;
    }

    StartGame(lUnique)
    {
        const cIndex = this.FindGameIndex(lUnique);
        if ( -1 != cIndex )
        {
            return this.listGames[cIndex].StartGame();
        }
        return false;
    }

    QuickJoin(iDefaultCoin)
    {
        let instanceGame = this.FindGame(iDefaultCoin);
        if ( instanceGame != null )
        {
            return instanceGame;
        }
        // else if ( instanceGame == null && strGameRoom != '' )
        // {
        //     //console.log(`IGameManager::QuickJoin Create SocketID : ${socket.id}, strID : ${socket.strID}`);

        //     instanceGame = this.CreateGame(strGameRoom, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers);
        //     //instanceGame.Join(socket);
        //     return instanceGame;
        // }
        return null;
    }

    Join(lUnique, objectUserData)
    {
        //console.log(objectUserData);
        //console.log(objectUserData.socket);
        const cIndex = this.FindGameIndex(lUnique);
        if ( cIndex != -1 )
        {
            let instanceGame = this.listGames[cIndex];
            console.log(`IGameManager::Join strID : ${objectUserData.strID}`);
            instanceGame.Join(objectUserData);
            return instanceGame;
        }
        return null;
    }

    Rejoin(lUnique, strID, socket)
    {
        const cIndex = this.FindGameIndex(lUnique);        
        if ( cIndex != -1 )
        {
            let instanceGame = this.listGames[cIndex];
            instanceGame.Rejoin(strID, socket);
        }
    }

    CheckJoin(lUnique)
    {
        const cIndex = this.FindGameIndex(lUnique);
        if ( cIndex != -1 )
        {
            let instanceGame = this.listGames[cIndex];

            if ( instanceGame.listUsers.GetLength() >= parseInt(instanceGame.cMaxPlayer) )
            {
                console.log(`IGameManager::CheckJoin : MaxUser(${instanceGame.cMaxPlayer}) CurrentUser(${instanceGame.listUsers.GetLength()})`);
                return null;
            }
            return instanceGame;
        }
        return null;        
    }

    GetRoomInfo(lUnique)
    {
        const cIndex = this.FindGameIndex(lUnique);
        if ( cIndex != -1 )
        {
            let instanceGame = this.listGames[cIndex];

            return instanceGame;
        }
        return null;
    }

    GetAllRoomInfo()
    {
        return this.listGames;
    }

    LeaveSetting(user)
    {
        console.log(`IGameManager::LeaveSetting : ${user.lUnique},  ${user.eStage}, strID : ${user.strID}`);
        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].LeaveSetting(user);
        }
    }

    Leave(user)
    {
        console.log(`IGameManager::Leave : ${user.lUnique},  ${user.eStage}, SocketID : ${user.socket.id}, strID : ${user.strID}`);
        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            let iNumUsers = this.listGames[cIndex].Leave(user);
            console.log(`IGameManager::Leave : iNumUsers ${iNumUsers}`);
            if ( 0 == iNumUsers )
            {
                this.DeleteGame(this.listGames[cIndex].lUnique);
                // this.listGames.splice(cIndex, 0);
                // this.PrintRoomList();
                return true;
            }
        }
        return false;
    }

    RemoveRoom(lUnique)
    {
        this.DeleteGame(lUnique);        
    }

    ProcessBetting(user, objectBetting)
    {
        console.log(`IGameManager::ProcessBetting : ${user.strID}, ${objectBetting.strBetting}, Amount : ${objectBetting.iAmount}`);

        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].ProcessBetting(user, objectBetting);
        }
    }

    SetEmoticon(user, iEmoticon)
    {
        console.log(`IGameManager::SetEmoticon : ${user.strID}, iEmoticon : ${iEmoticon}`);

        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].SetEmoticon(user, iEmoticon);
        }
    }
    
    SetShowCard(user, objectDate)
    {
        console.log(`IGameManager::SetShowCard : ${user.strID}`);
        console.log(objectDate)

        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].SetShowCard(user, objectDate);
        }
    }
    
    SetExit(user, bReserveExit)
    {
        console.log(`IGameManager::SetExit : ${user.strID}, bReserveExit: ${bReserveExit}`);

        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].SetExit(user, bReserveExit);
        }
    }

    GetRoomList()
    {
        let listRooms = [];

        for ( let i in this.listGames )
        {
            //console.log(this.listGames[i]);
            let iNumPlayers = this.listGames[i].listUsers.GetLength();
            let iMaxPlayers = this.listGames[i].cMaxPlayer;

            let listPlayer = [];
            for ( let j = 0; j < this.listGames[i].listUsers.GetLength(); ++ j )
            {
                const player = this.FindUserFromID(this.listGames[i].listUsers.GetSocket(j).strID);
                //console.log(player);
                const iCoin = player.iCoin+player.iCash;
                listPlayer.push({strID:player.strID, iCoin:iCoin, iLocation:player.iLocation, iAvatar:player.iAvatar});
            }
            listRooms.push(
                {
                    iNo:i+1, 
                    strName:this.listGames[i].strGameName, 
                    eGameType:this.listGames[i].eGameType,
                    iNumPlayers:iNumPlayers, 
                    iMaxPlayers:iMaxPlayers,
                    lUnique:this.listGames[i].lUnique,
                    iDefaultCoin:this.listGames[i].iDefaultCoin,
                    listPlayer:listPlayer
                }
            );
        }
        return listRooms;    
    }

    Update()
    {
        for ( let i in this.listGames )
        {
            this.listGames[i].Update();
        }
    }

    async UpdateDB()
    {
        for ( let i in this.listGames )
            this.listGames[i].UpdateDB();        
    }

    PrintRoomList()
    {
        console.log(`################################################## Room List`);
        for ( let i in this.listGames )
        {
            console.log(`Room : ${this.listGames[i].strGameName}, ${this.listGames[i].iDefaultCoin}`);
        }
    }

    // async UpdateJackpot()
    // {
    //     const jackpot = await db.Jackpots.findOne({where:{strGame:'HOLDEM'}});

    //     for ( let i in this.listGames )
    //     {
    //         const jackpotRounds = await db.JackpotRounds.findOne({where:{strGame:'HOLDEM',iBlind:parseInt(this.listGames[i].iDefaultCoin)}});
    //         if(this.listGames[i] != null)
    //         {
    //             this.listGames[i].FullBroadcastJackpot(jackpot.iJackpot);
    //             this.listGames[i].jackpotInfo = jackpot;
    //             this.listGames[i].jackpotRounds = jackpotRounds;
    //         }
    //     }
    // }
}
module.exports = IGameManager;