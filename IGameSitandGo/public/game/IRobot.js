class IRobot{

    constructor(account, timer)
    {
        this.socket = io('/game');
        this.account = account;
        this.iLocation = -1;
        this.bConnected = false;
        this.fElapsedTime = 0;
        this.timer = timer;
        this.bEnableBetting = false;
        this.iCallAmount = 0;
        this.strBetting = '';

        this.eState = '';
        this.listRooms = [];

        this.sGameName = '';
        this.iBlind = 0;
        this.lUnique = 0;
        
        this.listAbnormalID = [];
    }

    // 카드 랭크 및 슈트를 나타내는 배열
    cardRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    cardSuits = ['s', 'h', 'c', 'd'];  // s: Spades, h: Hearts, c: Clubs, d: Diamonds

     // 각 위치에 대한 홀 카드 레인지를 저장하는 객체
    holeCardRanges = {
        'CO': [
            // AA부터 22까지
            'AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22',
    
            // AKs부터 A2s까지, AKo부터 A10o까지
            'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
            'AKo', 'AQo', 'AJo', 'A10o',
    
            // KQs부터 K8s까지, KQo부터 K8o까지
            'KQs', 'KJs', 'K10s', 'K9s', 'K8s',
            'KQo', 'KJo', 'K10o', 'K9o', 'K8o',
    
            // QJs부터 Q8s까지, QJo부터 Q8o까지
            'QJs', 'Q10s', 'Q9s', 'Q8s',
            'QJo', 'Q10o', 'Q9o', 'Q8o',
    
            // J10s부터 J8s까지, J10o부터 J8o까지
            'J10s', 'J9s', 'J8s',
            'J10o', 'J9o', 'J8o',
    
            // 109s부터 108s까지
            '109s', '108s',
        ],
        'BTN': [
            // AA부터 22까지
            'AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77', '66', '55', '44', '33', '22',

            // AKs부터 A2s까지, AKo부터 A2o까지
            'AKs', 'AQs', 'AJs', 'A10s', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
            'AKo', 'AQo', 'AJo', 'A10o', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',

            // KQs부터 K3s까지, KQo부터 K9o까지
            'KQs', 'KJs', 'K10s', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s',
            'KQo', 'KJo', 'K10o', 'K9o',

            // QJs부터 Q5s까지, QJo부터 Q9o까지
            'QJs', 'Q10s', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
            'QJo', 'Q10o', 'Q9o',

            // J10s부터 J6s까지, J10o부터 J9o까지
            'J10s', 'J9s', 'J8s', 'J7s', 'J6s',
            'J10o', 'J9o',

            // 109s부터 106s까지, 109o
            '109s', '108s', '107s', '106s',
            '109o',
        ],
        'PREFLOP': [
            // AA부터 77까지
            'AA', 'KK', 'QQ', 'JJ', '1010', '99', '88', '77',

            // AKs부터 AJs까지, AKo부터 AJo까지
            'AKs', 'AQs', 'AJs',
            'AKo', 'AQo', 'AJo',
        ],
    };

    // 이 함수는 주어진 홀 카드가 주어진 위치에 대한 홀덤 레인지에 있는지 확인합니다.
    isHoleCardInRange(holeCards, position) {
        // holeCards는 'AsKs'와 같은 문자열 형식으로 전달되어야 합니다.
        // position은 'CO', 'BTN' 등이 될 수 있습니다.
        console.log(`iRobot :: isHoleCardInRange`);
        console.log(holeCards);
        return this.holeCardRanges[position].includes(holeCards);
    }

    // 숫자 카드를 문자 카드로 변환하고 동일한 슈트인지 여부를 확인하는 함수
    convertCardsToHoleCardString(cardNumber1, cardNumber2) {
        let suitIndex1 = Math.floor(cardNumber1 / 13);
        let rankIndex1 = cardNumber1 % 13;   // 0을 'A'로 처리하도록 수정

        let suitIndex2 = Math.floor(cardNumber2 / 13);
        let rankIndex2 = cardNumber2 % 13;   // 0을 'A'로 처리하도록 수정

        let holeCardString = '';
        
        // 동일한 랭크일 경우
        if (rankIndex1 === rankIndex2) {
            holeCardString += this.cardRanks[rankIndex1] + this.cardRanks[rankIndex2];
        }
        // 다른 랭크일 경우
        else {
            // 항상 랭크가 높은 카드를 먼저 표시합니다. a,k,q,j....3,2
            if ((rankIndex1 == 0 && rankIndex2 != 0) || (rankIndex2 == 0 && rankIndex1 != 0)) {
                holeCardString += (rankIndex1 == 0 ? this.cardRanks[rankIndex1] : this.cardRanks[rankIndex2]) +
                                  (rankIndex1 != 0 ? this.cardRanks[rankIndex1] : this.cardRanks[rankIndex2]);
            } else if (rankIndex1 > rankIndex2) {
                holeCardString += this.cardRanks[rankIndex1] + this.cardRanks[rankIndex2];
            } else {
                holeCardString += this.cardRanks[rankIndex2] + this.cardRanks[rankIndex1];
            }

            // 동일한 슈트인지 여부를 확인하여 's' 또는 'o'를 추가합니다.
            if (suitIndex1 === suitIndex2) {
                holeCardString += 's';
            } else {
                holeCardString += 'o';
            }
        }
        
        return holeCardString;
    }

    async selectRandomRoom() {
        // 먼저 방 목록을 업데이트합니다.
        await this.RequestRoomList();
        
        // 룸 리스트에서 랜덤하게 방을 선택하고 lUnique 값을 갱신합니다.
        let availableRooms = this.listRooms.filter(room => room.iNumPlayers < room.iMaxPlayers);
        if (availableRooms.length > 0) {
            let randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
            this.lUnique = randomRoom.lUnique;
            this.sGameName = randomRoom.strGameName;
            this.iBlind = randomRoom.iDefaultCoin;
        }
        // Ensure updated room list before returning
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }

    async Update() {
        // Wait for random interval before selecting room
        //console.log(this.timer.GetElapsedTime());
        if (this.bConnected == false ){
            this.fElapsedTime-=this.timer.GetElapsedTime();
            if(this.fElapsedTime > 3) {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
                // Select room
                await this.selectRandomRoom();
                let availableRooms = this.listRooms.filter(room => room.iNumPlayers < room.iMaxPlayers && room.iMaxPlayers - room.iNumPlayers > 2);
                if (availableRooms.length > 0) {
                    // Choose a random room
                    let randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
                    this.lUnique = randomRoom.lUnique;
                    this.sGameName = randomRoom.strGameName;
                    this.iBlind = randomRoom.iDefaultCoin;

                    let selectedRoom = this.listRooms.find(room => room.lUnique == this.lUnique);
                    if (selectedRoom && this.account.iCash && this.account.iCash > 0 && this.account.iCash > parseInt(selectedRoom.iDefaultCoin*100)) {
                        let existingLocations = selectedRoom.listPlayer.map(player => player.iLocation);
                        let availableLocations = [];

                        for (let i = 0; i < parseInt(selectedRoom.iMaxPlayers); i++) {
                            if (!existingLocations.includes(i)) {
                                availableLocations.push(i);
                            }
                        }

                        if (availableLocations.length > 0) {
                            let randomIndex = Math.floor(Math.random() * availableLocations.length);
                            this.iLocation = availableLocations[randomIndex];
                            console.log(this.iLocation);

                            this.socket.emit('CM_JoinGame', this.account.strID, this.account.strNickname, this.lUnique, this.account.iCash, this.account.iAvatar, this.account.strOptionCode, this.account.strGroupID, this.account.iClass, this.account.eUserType);
                            this.bConnected = true;
                            this.fElapsedTime = 0;
                        }
                    }
                }
                else
                {
                    this.RequestMakeGame();

                     // Use the same logic to join the game as above
                     let selectedRoom = this.listRooms.find(room => room.lUnique == this.lUnique);
                     if (selectedRoom && this.account.iCash && this.account.iCash > 0  && this.account.iCash > parseInt(selectedRoom.iDefaultCoin*100)) {
                         let existingLocations = selectedRoom.listPlayer.map(player => player.iLocation);
                         let availableLocations = [];
 
                         for (let i = 0; i < parseInt(selectedRoom.iMaxPlayers); i++) {
                             if (!existingLocations.includes(i)) {
                                 availableLocations.push(i);
                             }
                         }
 
                         if (availableLocations.length > 0) {
                             let randomIndex = Math.floor(Math.random() * availableLocations.length);
                             this.iLocation = availableLocations[randomIndex];
 
                             this.socket.emit('CM_JoinGame', this.account.strID, this.account.strNickname, this.lUnique, this.account.iCash, this.account.iAvatar, this.account.strOptionCode, this.account.strGroupID, this.account.iClass, this.account.eUserType);
                             this.bConnected = true;
                             this.fElapsedTime = 0;
                         }
                     }
                }
            }
        }
        if ( this.bEnableBetting == true ){
            this.fElapsedTime -= this.timer.GetElapsedTime();
            if( this.fElapsedTime > 2 )
            {
                //console.log(this.iElapsedTime);
                let objectBetting = {strBetting:this.strBetting, iAmount:this.iCallAmount};
                this.socket.emit('CM_Betting', objectBetting);
                this.bEnableBetting = false;
                this.fElapsedTime = 0;
            } 
        }
    }

    async RequestMakeGame()
    {
        let strDefaultRoomName = ['포커 홀덤~!', '스피드 진행!!!', '매너게임 부탁!'];
        let index = Math.floor(Math.random()*3);
        let strRoomName = strDefaultRoomName[index];
        let data = {
            //eGameType:0,
            eGameType:'SITGO',
            iDefaultCoin:500, 
            strRoomName:strRoomName, 
            strPassword:'', 
            //iBuyIn:iBuyIn,
            iBettingTime:10,
            iMaxPlayer:9,
        };
        this.socket.emit('CM_CreateRoom',data);
    }
    
    RequestRoomList()
    {
        this.socket.emit('CM_RoomList');
    }

    RequestRoomInfo(lUnique)
    {
        this.socket.emit('CM_RoomInfo',lUnique);
    }

    // Checks for pairs, 3-of-a-kind, 4-card flushes, and open-ended straights
    hasViableVision(holeCards, tableCards, eState) {

        //console.log(`##############################################################################################`);
        //console.log(tableCards);
        let allCards = holeCards.concat(tableCards);

        //console.log(allCards);

        // Convert card numbers to rank and suit
        allCards = allCards.map(cardNumber => {
            let rank = cardNumber % 13;
            if (rank === 0) rank = 13;  // make A the highest
            return {
                rank: rank, // 1 to 13 represents 2, 3, ..., Q, K, A
                suit: Math.floor(cardNumber / 13), // 0 to 3 represents four suits
            };
        });
    
        // 가장 높은 카드의 랭크를 찾습니다. (여기서는 에이스)
        let highestCardRank = Math.max(...allCards.map(card => card.rank));
    
        // 모든 카드의 랭크와 슈트를 계산
        let ranks = {};
        let suits = {};
        for (let card of allCards) {
            ranks[card.rank] = (ranks[card.rank] || 0) + 1;
            suits[card.suit] = (suits[card.suit] || 0) + 1;
        }

        // Check for pair, three of a kind
        if(eState == 'FLOP')
        {
            // Check for high card pair, three of a kind, or four of a kind
            if (ranks[highestCardRank] >= 2) {
                return true;
            }

            // Check for high two pair
            let pairs = Object.values(ranks).filter(rankCount => rankCount == 2).length;
            if (pairs >= 2 && ranks[highestCardRank] == 2) {
                return true;
            }

            // Check for 4-card flush
            for (let suit in suits) {
                if (suits[suit] >= 4) {
                    return true;  // we have a 4-card flush
                }
            }

            // Check for open-ended straight
            let sortedRanks = Object.keys(ranks).map(Number).sort((a, b) => a - b);
            for (let i = 0; i < sortedRanks.length - 3; i++) {
                if (sortedRanks[i+3] - sortedRanks[i] == 3) {
                    return true;  // we have an open-ended straight
                }
            }
        }
        else if(eState == 'TURN')
        {
            // 고수준 투페어를 찾기 위해 모든 페어의 수를 계산
            let pairs = Object.values(ranks).filter(rankCount => rankCount == 2).length;
            // 가장 높은 카드로 이루어진 투페어가 있는지 확인
            if (pairs >= 2 && ranks[highestCardRank] == 2) {
                return true;
            }

            for (let rank in ranks) {
                if (ranks[rank] >= 3) {
                    return true;  // we have three of a kind or four of a kind
                }
            }

            // Check for 4-card flush
            for (let suit in suits) {
                if (suits[suit] >= 4) {
                    return true;  // we have a 4-card flush
                }
            }
        }
        else if(eState == 'RIVER')
        {
            // 고수준 투페어를 찾기 위해 모든 페어의 수를 계산
            let pairs = Object.values(ranks).filter(rankCount => rankCount == 2).length;
            // 가장 높은 카드로 이루어진 투페어가 있는지 확인
            if (pairs >= 2 && ranks[highestCardRank] == 2) {
                return true;
            }

            for (let rank in ranks) {
                if (ranks[rank] >= 3) {
                    return true;  // we have three of a kind or four of a kind
                }
            }

            // Check for 5-card flush
            for (let suit in suits) {
                if (suits[suit] >= 5) {
                    return true;  // we have a 4-card flush
                }
            }
        }

        return false;
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

    OnIO()
    {
        this.socket.on('SM_CreateRoom',async (instanceRoom) => {
            console.log("SM_CreateRoom");
            console.log(instanceRoom);

            this.lUnique = instanceRoom.lUnique;
        });

        this.socket.on('SM_RequestLogin', (data) => {

            //let account = {strID:'bbb', strPassword:'1111', iAvatar:5};

            console.log(`SM_RequestLogin`);
            this.socket.emit('CM_Login', this.account.strID, this.account.strNickname, this.account.strPassword, this.account.iAvatar, this.account.eUserType);
        });

        this.socket.on('SM_Login', (data) => {

        console.log(`SM_Login`);
            console.log(data);
            this.socket.strID = data.strID;
            this.socket.iCoin = data.iCoin;
            this.socket.iAvatar = data.iAvatar;
            this.socket.eUserType = data.eUserType;
        });

        this.socket.on('SM_EnterGame', (data) => {

            console.log('SM_EnterGame');
            console.log(data);

            this.socket.strID = data.strID;
            this.socket.iCoin = data.iCoin;
            this.socket.iCash = data.iCash;

            // this.Game.UpdateGameInfo(data.strGameName, data.iBlind);
            // this.Game.UpdatePoint(parseInt(data.iCoin));
            console.log(this.iLocation);
            this.socket.emit('CM_RoomUpdate', {strID:data.strID, strGameName:data.strGameName, iDefaultCoin:data.iBlind, eGameType:'SITGO'});

            this.socket.emit('CM_SelectLocation', this.iLocation);
        });

        this.socket.on('SM_LeaveGame', (data) => {

            console.log('SM_LeaveGame');
            console.log(data);

            if ( data.result == 'OK' )
            {
                // this.Game.Initialize();
            }
        });

        this.socket.on('SM_JoinUser', (user) => {

        });

        this.socket.on('SM_JoinGame', (listPlayers, iMaxPlayer) => {

            console.log(`SM_JoinGame`);
            console.log(listPlayers);

            // this.Game.SetMaxPlayer(iMaxPlayer);
            // this.Game.ProcessLocation(listPlayers);
        });

        //  Game
        this.socket.on('SM_SelectLocation', (objectData) => {

            console.log(`SM_SelectLocation ${objectData.eResult}, ${objectData.iLocation}`);
            console.log(objectData);
            this.RequestRoomList();
            // if ( true == objectData.eResult )
            // {
            //     this.Game.ProcessLocationComplete(socket.strID, objectData.iCoin, objectData.iLocation, objectData.iAvatar);
            //     this.Game.UpdatePoint(parseInt(objectData.iPoint));
            // }
        });

        this.socket.on('SM_BroadcastJoinUser', (objectPlayer) => {

            console.log(`SM_BroadcastJoinUser`);
            console.log(objectPlayer);
        });

        this.socket.on('SM_BroadcastLeaveUser', (objectPlayer) => {

            console.log(`SM_BroadcastLeaveUser`);
            console.log(objectPlayer);

            this.listAbnormalID.push(objectPlayer.strID);
            // this.Game.RemoveUser(objectPlayer);
        });

        this.socket.on('SM_BroadcastPlaceUser', (objectPlayer) => {

            console.log(`SM_BroadcastPlaceUser`);
            console.log(objectPlayer);

            //this.Game.ProcessLocationSingle(objectPlayer);
        });

        this.socket.on('SM_EnableStartGame', () => {

            console.log(`SM_EnableStartGame`);

            //this.Game.listButtons[0].bEnable = true;
        });

        this.socket.on('SM_StartGame', (objectData) => {

            console.log(`SM_StartGame : eResult : ${objectData.eResult}`);
            console.log(objectData.listUser);
            // this.Game.EnableUserList(objectData.listUser);
            // this.Game.StartGame();
        })

        this.socket.on('SM_FullBroadcastPlayerType', (listData) => {

            console.log(`SM_FullBroadcastPlayerType`);
            console.log(listData);

            // this.Game.SetPlayerType(listData);
        });

        this.socket.on('SM_DefaultAnteSB', (objectData) => {

            console.log(`SM_DefaultAnteSB`);
            console.log(objectData);

            this.socket.emit('CM_DefaultAnteSB', objectData.iCoin);
            //this.socket.emit('CM_UpdateICash',data);

            // this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            // this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
        });

        this.socket.on('SM_BroadcastDefaultAnteSB', (objectData) => {

            console.log(`SM_BroadcastDefaultAnteSB`);
            console.log(objectData);

            // this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            // this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
        });

        this.socket.on('SM_DefaultAnteBB', (objectData) => {

            console.log(`SM_DefaultAnteBB`);
            console.log(objectData);

            this.socket.emit('CM_DefaultAnteBB', objectData.iCoin);

            // this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            // this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
        });

        this.socket.on('SM_BroadcastDefaultAnteBB', (objectData) => {

            console.log(`SM_BroadcastDefaultAnteBB`);
            console.log(objectData);

            // this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, '');
            // this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
        });

        this.socket.on('SM_EnableBetting', (objectData) => {

            try {
                console.log(`SM_EnableBetting : Call ${objectData.iCallAmount}`);
                console.log(objectData.listEnableBettingType);
                console.log(objectData);
    
                console.log(objectData.handcard);
    
                // objectData.handcard에서 카드를 문자열로 변환
                let holeCards = this.convertCardsToHoleCardString(objectData.handcard[0], objectData.handcard[1]);
    
                //console.log(holeCards);
    
                // 기본 베팅 유형 설정
                let bettingType = objectData.listEnableBettingType.includes('Check') ? 'Check' : 'Call';
                let iCallAmount = objectData.iCallAmount;
    
                // 홀 카드가 컷오프 레인지에 있는지 확인인데 bettingtype 유형에 check가 있으면 check를 무조건 해주기.
                // objectData.eState 가 PREFLOP,FLOP,TURN, RIVER 홀덤 턴 유형 받아오기.
                // objectData.iDefaultCoin 으로 레이즈 금액 랜덤 설정.
                // isHoleCardInRange에 핸드레인지 'CO','BTN' 이렇게 있음.
                if( objectData.iCoin > 0 )
                {
                    if( this.account.strID == objectData.strIDjoker )
                    {
                        if (objectData.iCallAmount == 0) {
                            bettingType = 'Raise';
                            iCallAmount = parseInt(objectData.iCallAmount + (Math.floor(Math.random() * 21 + 20) * objectData.iDefaultCoin));
                        } else if (objectData.iCallAmount > 0) {
                               bettingType = Math.random() < 0.5 ? 'Raise' : 'Call'; // 랜덤하게 Raise나 Call 선택
                            if(bettingType == 'Raise')
                            {
                                iCallAmount = parseInt(objectData.iCallAmount + ((Math.floor(Math.random() * 3) + 1) * objectData.iCallAmount));
                            }
                            else
                            {
                                iCallAmount = objectData.iCallAmount;
                            }
                        }
                        if(bettingType == 'Raise' || bettingType == 'Call')
                        {
                            if(iCallAmount >= objectData.iCoin)
                            {
                                bettingType = 'Allin';
                                iCallAmount = objectData.iCoin;
                            }
                        }
                    }
                    else
                    {
                        if(objectData.iCallAmount > 0)
                        {
                            if(objectData.eState == 'PREFLOP')
                            {
                                if (this.isHoleCardInRange(holeCards, 'CO')) {
                                    // holeCards가 컷오프 레인지에 있음
                                    if(this.isHoleCardInRange(holeCards, 'PREFLOP'))
                                    {
                                        bettingType = 'Raise';
                                        iCallAmount = parseInt(iCallAmount + (Math.floor(Math.random() * 21 + 20) * parseInt(objectData.iDefaultCoin)));
                                    }
                                    else
                                    {
                                        if (objectData.iCallAmount == 0) {
                                            bettingType = 'Check';
                                            iCallAmount = 0;
                                        } else if (objectData.iCallAmount > 0 && objectData.iCallAmount < parseInt(objectData.iDefaultCoin*30)) {
                                            if(objectData.iCoin < parseInt(objectData.iDefaultCoin*15))
                                            {
                                                console.log("ALLIN!!!!!!!!!!!!!!!!");
                                                console.log(parseInt(objectData.iDefaultCoin*20));
                                                bettingType = 'Allin';
                                                iCallAmount = objectData.iCoin;
                                            }
                                            else
                                            {
                                                bettingType = 'Call';
                                            }
                                        }
                                        else
                                        {
                                            bettingType = 'Fold';
                                            iCallAmount = 0;
                                        }
                                    }
                                } 
                                else {
                                    // holeCards가 컷오프 레인지에 없음
                                    if (objectData.iCallAmount == 0) {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
            
                                    } else if (objectData.iCallAmount > 0) {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                            
                                }
                            }
                            else if(objectData.eState == 'FLOP' )
                            {
                                console.log(`##### FLOP`);
                                // console.log(holeCards);
                                // console.log(`##### FLOP2`);
                                // console.log(objectData.tableCards);
                                // console.log(`##### FLOP3`);
                                // console.log(objectData.eState);
                                // console.log(`##### FLOP4`);
                                // console.log(objectData);
                                if(this.hasViableVision(objectData.handcard, objectData.tableCards.slice(0,3), objectData.eState)){
                                    if(iCallAmount < objectData.iTotalBettingCoin * 0.3)
                                    {
                                        bettingType = 'Call';
                                        //iCallAmount = iCallAmount;
                                    }
                                    else if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                } 
                                else {
                                    if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                }
                            }
                            else if(objectData.eState == 'TURN')
                            {
                                console.log(`##### TURN`);
                                if(this.hasViableVision(objectData.handcard, objectData.tableCards.slice(0,4), objectData.eState)){
                                    if(iCallAmount < objectData.iTotalBettingCoin * 0.3)
                                    {
                                        bettingType = 'Call';
                                    }
                                    else if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                } 
                                else {
                                    if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                }
                            }
                            else if(objectData.eState == 'RIVER')
                            {
                                console.log(`##### RIVER`);
                                if(this.hasViableVision(objectData.handcard, objectData.tableCards, objectData.eState)){
                                    if(iCallAmount > 0)
                                    {
                                        bettingType = 'Call';
                                        //iCallAmount = iCallAmount;
                                    }
                                    else if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                } 
                                else {
                                    if(iCallAmount == 0)
                                    {
                                        bettingType = 'Check';
                                        iCallAmount = 0;
                                    }
                                    else
                                    {
                                        bettingType = 'Fold';
                                        iCallAmount = 0;
                                    }
                                }
                            }
                            else
                            {
                                bettingType = 'Fold';
                                iCallAmount = 0;
                            }
                        }
                    }
                    if(bettingType == 'Raise' || bettingType == 'Call')
                    {
                        if(iCallAmount >= objectData.iCoin)
                        {
                            bettingType = 'Allin';
                            iCallAmount = objectData.iCoin;
                        }
                    }
                }
                else
                {
                    bettingType = 'Allin'
                    iCallAmount = 0;
                }
                this.bEnableBetting = true;
                this.iCallAmount = iCallAmount;
                this.strBetting = bettingType;
                this.fElapsedTime = 0;
            } catch (error) {
                console.log("BOT BETTING ERROR:"+error);
            }
        });

        this.socket.on('SM_Focus', (objectPlayer) => {

            console.log(`SM_Focus : ${objectPlayer.strID}`);
            // this.Game.Focus(objectPlayer.strID, objectPlayer.iBettingTime);
        });

        this.socket.on('SM_Mode', (objectData) => {

            console.log(`SM_Mode : ${objectData.eMode}`);

            switch ( objectData.eMode )
            {
                case 'Standby':
                    if(this.listAbnormalID.length > 0)
                    {
                        for(let i in this.listAbnormalID)
                            this.socket.emit('CM_LeaveGame',this.listAbnormalID[i]);
                    }
                    this.listAbnormalID = [];
                    break;
                case 'RebuyIn':
                    if(this.listAbnormalID.length > 0)
                    {
                        for(let i in this.listAbnormalID)
                            this.socket.emit('CM_LeaveGame',this.listAbnormalID[i]);
                    }
                    this.listAbnormalID = [];
                    break;
            }
        });

        this.socket.on('SM_FullBroadcastBetting', (objectData) => {

            console.log(`SM_FullBroadcastBetting`);
            console.log(objectData);
            if(objectData.strID == this.account.strID)
            {
                let iCash = parseInt(objectData.iCash) + parseInt(objectData.iCoin);
                this.account.iCash = iCash;
            }
            //this.socket.emit('CM_UpdateICash',data);
            // this.Game.SetPlayerBetting(objectData.strID, objectData.iCoin, objectData.iBettingCoin, objectData.strBetting);
            // this.Game.UpdateTotalBettingCoin(objectData.iTotalBettingCoin);
        });

        this.socket.on('SM_HandCard', (listCard, strHand, listPots) => {

            console.log(`SM_HandCard`);
            console.log(listCard);
            console.log(strHand);
            console.log(listPots);

            // this.Game.SetHandCard(listCard, strHand);
            // this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_FlopCard', (listCard, strHand, listPots) => {

            console.log(`SM_FlopCard`);
            console.log(listCard);
            console.log(strHand);

            // this.Game.SetFlopCard(listCard, strHand);
            // this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_TurnCard', (listCard, strHand, listPots) => {

            console.log(`SM_TurnCard`);
            console.log(listCard);
            console.log(strHand);

            // this.Game.SetTurnCard(listCard, strHand);
            // this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_RiverCard', (listCard, strHand, listPots) => {

        console.log(`SM_RiverCard`);
            console.log(listCard);
            console.log(strHand);

            // this.Game.SetRiverCard(listCard, strHand);
            // this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_Result', (listResult, listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser, listPots) => {

            console.log(`SM_Result`);
            console.log(listResult);
            console.log(listWinCards);
            console.log(strWinnerHand);

            if(listResult.strID == this.account.strID)
            {
                let iCash = parseInt(listResult.iCash)+parseInt(listResult.iCoin);
                this.account.iCash = iCash;
            }
            // this.Game.ProcessResult(listResult, listWinCards, strWinnerHand, strWinnerDescr, cPlayingUser);
            // this.Game.UpdatePot(listPots);
        });

        this.socket.on('SM_RebuyIn', (listObject) => {

            console.log(`SM_RebuyIn`);
            console.log(listObject);

            // this.Game.ProcessRebuyIn(listObject);
        });

        this.socket.on('SM_ShowDown',(listData) => {

            console.log(`SM_ShowDown`);
            //this.Game.ProcessShowDown();
        });

        this.socket.on('SM_ShowDownTurnCard',(listData) => {

            console.log(`SM_ShowDownTurnCard`);
            console.log(listData);

            // this.Game.ProcessShowDownTurnCard(listData);
        });

        this.socket.on('SM_RoomList', (listRooms) => {

            console.log(`SM_RoomList`);
            console.log(listRooms);

            this.listRooms = listRooms;
        })

        this.socket.on('SM_RoomInfo', (listInfo) => {

            console.log(`SM_RoomInfo`);
            console.log(listInfo);
        })


        this.socket.on('SM_Error', (objectError) => {

            console.log(`SM_Error`);
            console.log(objectError);
        });
    }
}

window.IRobot = IRobot;