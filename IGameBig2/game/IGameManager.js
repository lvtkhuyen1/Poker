let IGame = require('./IGame');
let E = require('./IEnum');

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
        console.log(`IGameManager::CreateGame : ${strGameName}, iDefaultCoin : ${iDefaultCoin}, iMaxPlayers : ${iMaxPlayers}`);
        //let instanceGame = new IGame(strGameName, iDefaultCoin);
        let instanceGame = new IGame(strGameName, eGameType, strPassword, iDefaultCoin, iBettingTime, iMaxPlayers);
        this.listGames.push(instanceGame);

        this.PrintRoomList();

        return instanceGame;
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
        console.log(user.lUnique);
        console.log(cIndex);
        if ( -1 != cIndex )
        {
            return this.listGames[cIndex].SetLocation(user, iLocation);
        }
        return false;
    }

    ReadyGame(lUnique)
    {
        const cIndex = this.FindGameIndex(lUnique);
        if ( -1 != cIndex )
        {
            return this.listGames[cIndex].ReadyGame();
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

    Rejoin(lUnique, strID, user)
    {
        const cIndex = this.FindGameIndex(lUnique);        
        if ( cIndex != -1 )
        {
            let instanceGame = this.listGames[cIndex];
            instanceGame.Rejoin(strID, user);
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
        console.log(`IGameManager::Leave : ${user.lUnique},  ${user.eStage}, userID : ${user.id}, strID : ${user.strID}`);
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
            else if ( 1 == iNumUsers )
            {
                this.listGames[cIndex].SetMode(E.EGameMode.Standby);
            }
            //return true;
        }
        return false;
    }

    ProcessSubmit(user, objectBetting)
    {
        console.log(`IGameManager::ProcessSubmit : ${user.strID}, ${objectBetting.strBetting}`);
        console.log(objectBetting.list);

        const cIndex = this.FindGameIndex(user.lUnique);
        if ( -1 != cIndex )
        {
            this.listGames[cIndex].ProcessSubmit(user, objectBetting);
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
            let iNumPlayers = this.listGames[i].listUsers.GetLength();
            let iMaxPlayers = this.listGames[i].cMaxPlayer;
            //let iBuyIn = this.listGames[i].iBuyIn;
    
            listRooms.push(
                {
                    iNo:i+1, 
                    strName:this.listGames[i].strGameName, 
                    eGameType:this.listGames[i].eGameType,
                    iNumPlayers:iNumPlayers, 
                    iMaxPlayers:iMaxPlayers,
                    //iBuyIn:iBuyIn,
                    iDefaultCoin:this.listGames[i].iDefaultCoin
                }
            );
        }
        return listRooms;    
    }

    Update()
    {
        for ( let i in this.listGames )
            this.listGames[i].Update();
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
}
module.exports = IGameManager;