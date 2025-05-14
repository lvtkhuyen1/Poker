//import IRobot from "../game/IRobot.js";
//import ITimer from "../game/ITimer.js";

let robots = [];

// 단일 로봇 데이터 처리
function createSingleRobot(robotData) {
    if (robotData.iCash && robotData.iCash > 0) {
        let timer = new ITimer();
        let robot = new IRobot(robotData, timer);  // 인덱스 값은 적절히 조정할 필요가 있습니다.
        robots.push(robot);
        robot.OnIO();
    }
}

// 여러 로봇 데이터 처리
function createMultipleRobots(robotData) {
    for (let i = 0; i < robotData.length; i++) {
        createSingleRobot(robotData[i]);
    }
}

// Async version of selectRandomRoom
IRobot.prototype.selectRandomRoom = async function() {
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
};

IRobot.prototype.update = async function () {
    // Wait for random interval before selecting room
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
            console.log(`Bot ElapsedTime :  ${this.fElapsedTime}`);
            this.fElapsedTime = 0;
        } 
    }
};

async function doRandomInterval() {
    while (true) {
        for (let robot of robots) {
            robot.timer.UpdateStart();
            await robot.update();
            robot.timer.UpdateEnd();
            // if(!robot.bConnected)
            // robot.RequestRoomList();
        }
        // iCash가 0 이하 또는 null인 로봇을 제거
        robots = robots.filter(robot => robot.account.iCash && robot.account.iCash > 0);

        // 여기에 간단한 딜레이를 추가
        await new Promise(resolve => setTimeout(resolve, 16));
    }
}
window.onload = function() {
    // 이벤트 리스너 설정
    document.addEventListener('receivedRobotData', function (event) {
        // 이벤트에서 데이터를 받아 처리
        var robotData = event.detail;
        // robotData 사용하여 IRobot 객체 생성
        console.log(robotData);
        // 데이터 타입(단일 로봇 vs. 여러 로봇)에 따라 처리
        if (Array.isArray(robotData)) {
            createMultipleRobots(robotData);
        } else {
            createSingleRobot(robotData);
        }
    });
    // 최초 실행
    doRandomInterval();
};