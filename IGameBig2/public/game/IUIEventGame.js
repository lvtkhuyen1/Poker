function IsMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let OnClickLeave = (game) => {

    // game.socket.emit('CM_LeaveGame');

    soundClick.play();
}

let OnClickGameReady = (game) => {
    console.log("OnClickGameReady");
    console.log(game.bEnableChat);
    if (game.bEnableChat == false) {
        if (game.kMainUser.bReady == true) {
            game.listButtons[1].strCaption = "Ready";
            game.kMainUser.bReady = false;
        }
        else {
            game.listButtons[1].strCaption = "Not Ready";
            game.kMainUser.bReady = true;
        }
        game.socket.emit('CM_ReadyGame');
        soundClick.play();
    }
}

let OnClickGameStart = (game) => {
    if (game.bEnableChat == false) {
        if (game.listPlayers.length == 4) {
            let bStart = true;
            socket.emit('CM_StartGame', { bStart: bStart });
        }
        else {
            $('#popup_message').show();
            // let tag = game.i18nTexts.Alert2;
            let tag = `최대 인원은 아닙니다. 그래도 시작하시겠습니까?`;
            $('#message').empty();
            $('#message').append(tag);
            socket.emit('SM_DisableStartGame');
        }

        game.listButtons[0].bEnable = false;

        soundClick.play();
    }
}

let OnClickGameEmoticon = (game) => {

    if (game.bEnableChat == false) {

        if(game.bEmoticon == true)
        {
            game.bEmoticon = false;
        }
        else
        {
            game.bEmoticon = true;
        }
        soundClick.play();
    }
}

let OnClickGameChat = (game) => {

    if (game.bEnableChat == false) {
        $('#chatting').show();
        $('#game_log').hide();
        game.bEnableChat = true;

        soundClick.play();
    }
}

let OnClickGamelog = (game) => {

    if (game.bEnableChat == false) {
        $('#chatting').hide();
        $('#game_log').show();
        game.bEnableChat = true;

        soundClick.play();
    }
}

let OnClickLocation1 = (game) => {

    if (game.bEnableChat == false) {
        game.socket.emit('CM_SelectLocation', 0);

        soundClick.play();
        soundBGM.loop = true;
        soundBGM.play(); // BGM 재생
    }
}

let OnClickLocation2 = (game) => {

    if (game.bEnableChat == false) {
        game.socket.emit('CM_SelectLocation', 1);

        soundClick.play();
        soundBGM.loop = true;
        soundBGM.play(); // BGM 재생
    }
}

let OnClickLocation3 = (game) => {
    if (game.bEnableChat == false) {
        game.socket.emit('CM_SelectLocation', 2);

        soundClick.play();
        soundBGM.loop = true;
        soundBGM.play(); // BGM 재생
    }
}

let OnClickLocation4 = (game) => {
    if (game.bEnableChat == false) {
        game.socket.emit('CM_SelectLocation', 3);

        soundClick.play();
        soundBGM.loop = true;
        soundBGM.play(); // BGM 재생
    }
}

let OnClickEmoticon0 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 0);
    game.bEmoticon = false;
}

let OnClickEmoticon1 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 1);
    game.bEmoticon = false;
}

let OnClickEmoticon2 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 2);
    game.bEmoticon = false;
}

let OnClickEmoticon3 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 3);
    game.bEmoticon = false;
}

let OnClickEmoticon4 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 4);
    game.bEmoticon = false;
}

let OnClickEmoticon5 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 5);
    game.bEmoticon = false;
}

let OnClickEmoticon6 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 6);
    game.bEmoticon = false;
}

let OnClickEmoticon7 = (game) => {
    game.socket.emit('CM_SelectEmoticon', 7);
    game.bEmoticon = false;
}

let OnClickSingle = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('single');
            soundClick.play();
        }
    }
}
let OnClickPair = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('pair');
            soundClick.play();
        }
    }
}
let OnClickTriple = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('triple');
            soundClick.play();
        }
    }
}
let OnClickStraight = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('straight');
            soundClick.play();
        }
    }
}
let OnClickFlush = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('flush');
            soundClick.play();
        }
    }
}
let OnClickFullhouse = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('fullHouse');
            soundClick.play();
        }
    }
}
let OnClickFourcard = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('fourOfAKind');
            soundClick.play();
        }
    }
}
let OnClickStraightFlush = (game) => {
    if (game.bEnableChat == false) {
        if (game.kMainUser.bTrunStart == true) {
            game.GetMadeButton('straightFlush');
            soundClick.play();
        }
    }
}

//  Betting
let OnClickPass = (game) => {

    let player = game.FindUser(game.socket.strID);
    if (null != game.kMainUser) {
        game.kMainUser.listSelectCard = [];

        for (let i in game.kMainUser.listHandCard) {
            game.kMainUser.listHandCard[i].select = false;
        }
    }

    if (null != player) {
        let list = [];

        let objectBetting = { strBetting: 'Pass', list: list };
        game.socket.emit('CM_Submit', objectBetting);
        game.bEnableBetting = false;
        game.kMainUser.bTrunStart = false;
        game.kMainUser.bFirstTurn = false;
        soundClick.play();
    }
    
}

let OnClickSubmit = (game) => {

    let player = game.FindUser(game.socket.strID);

    let list = [];


    if (null != game.kMainUser) {
        if (game.kMainUser.bCanPlay == true && game.bSubmit == true) {
            game.kMainUser.bCanPlay = false;
            game.bSubmit = false;
            game.iPasscount = 0;
            game.kMainUser.listSelectCard = [];
            //game.listTableCard = [];
            for (let i = 0; i < game.kMainUser.listHandCard.length; i++) {
                if (true == game.kMainUser.listHandCard[i].select) {
                    //game.kMainUser.listHandCard[i].select = false;
                    list.push(game.kMainUser.listHandCard[i]);
                    //game.listTableCard.push(game.kMainUser.listHandCard[i].index);
                    game.kMainUser.listHandCard.splice(i, 1);
                    i--; // 요소를 제거했으므로, 인덱스를 하나 감소시켜야 함
                }
            }
            if (null != player) {
                let objectBetting = { strBetting: 'Submit', list: list };
                game.socket.emit('CM_Submit', objectBetting);
                game.bEnableBetting = false;
                game.kMainUser.bTrunStart = false;
                game.kMainUser.bFirstTurn = false;
            }
            soundClick.play();
        }
    }


}

let OnClickSortNum = (game) => {
    if (game.bEnableChat == false) {
        //console.log("OnClickSortNumOnClickSortNumOnClickSortNum");
        if (null != game.kMainUser) {
            game.kMainUser.listSelectCard = [];
            for (let i in game.kMainUser.listHandCard) {
                game.kMainUser.listHandCard[i].select = false;
            }
            game.kMainUser.listHandCard.sort((a, b) => {
                // 예외 처리: 2카드는 가장 나중에 정렬
                if (a.num === 1) return 1;
                if (b.num === 1) return -1;
                if (a.num === 0) return 1;
                if (b.num === 0) return -1;
                // 숫자가 같은 경우 문양별로 정렬
                if (a.num === b.num) {
                    const suitPriority = { 0: 3, 1: 2, 2: 1, 3: 0 }; // 다이아, 클로버, 하트, 스페이드 순으로 우선순위 부여
                    return suitPriority[a.suit] - suitPriority[b.suit];
                }
                // 그 외에는 숫자대로 정렬
                return a.num - b.num;
            });
            console.log(game.kMainUser.listHandCard);
        }
        game.bSortNum = true;
        soundClick.play();
    }
}

let OnClickSortSuit = (game) => {
    if (game.bEnableChat == false) {
        //console.log("OnClickSortSuitOnClickSortSuitOnClickSortSuit");
        if (null != game.kMainUser) {
            game.kMainUser.listSelectCard = [];
            for (let i in game.kMainUser.listHandCard) {
                game.kMainUser.listHandCard[i].select = false;
            }
            game.kMainUser.listHandCard.sort((a, b) => {
                const suitPriority = { 0: 3, 1: 2, 2: 1, 3: 0 }; // 다이아, 클로버, 하트, 스페이드 순으로 우선순위 부여
                if (a.suit == b.suit) { // 문양이 같은 경우 숫자로 정렬된 상태이므로 그대로 반환

                    if (a.num === 1) return 1;
                    if (b.num === 1) return -1;
                    if (a.num === 0) return 1;
                    if (b.num === 0) return -1;

                    return a.num - b.num; // 같은 문양에서는 숫자로 오름차순 정렬
                }
                return suitPriority[a.suit] - suitPriority[b.suit]; // 우선순위에 따라 정렬
            });
            console.log(game.kMainUser.listHandCard);
        }
        game.bSortNum = false;

        soundClick.play();
    }
}

let OnClickTips = (game) => {
    if (null != game.kMainUser) {
        game.kMainUser.listSelectCard = [];
        for (let i in game.kMainUser.listHandCard) {
            game.kMainUser.listHandCard[i].select = false;
        }
        game.GetTipsCard();
    }

    soundClick.play();
}

let OnClickReset = (game) => {

    if (null != game.kMainUser) {
        game.kMainUser.listSelectCard = [];
        for (let i in game.kMainUser.listHandCard) {
            game.kMainUser.listHandCard[i].select = false;
        }
    }

    soundClick.play();
}