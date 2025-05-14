import IGameMain from "../game/IGameMain.js";
import IModeGame from "../game/IModeGame.js";

import IScreenConfig from "../js/screenconfig.js";
import IResourceManager from "../js/resourcemanager.js";
import IUIButton from "../js/button.js";
import IUIImage from "../js/image.js";
import ITimer from "../game/ITimer.js";

function IsMobile()
{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    //return true;
}
var isFullscreen = false;
function checkFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        isFullscreen = true;
    } else {
        isFullscreen = false;
    }
}
//let configScreen = new IScreenConfig(0, 0, 1920, 1080, window.innerWidth, window.innerHeight);
let configScreen = null;
//let fullscreenResized = false;

if(IsMobile())
{
    configScreen = new IScreenConfig(0, 0, 1920, 1080, window.innerWidth, window.innerHeight, 'Mobile');
}
else
{
    //configScreen = new IScreenConfig(0, 0, 1080, 1920, window.innerWidth, window.innerHeight, 'Mobile');
    configScreen = new IScreenConfig(0, 0, 1920, 1080, window.innerWidth, window.innerHeight, 'Desktop');
}

let ResourceManager = new IResourceManager();

var cScreenWidth = configScreen.m_iCurrentWidth;
var cScreenHeight = configScreen.m_iCurrentHeight;

let canvas = $('<canvas id="maincanvas" width ="' + cScreenWidth + '" height="' + cScreenHeight + '"></canvas>');
let ctx = canvas.get(0).getContext("2d");

// 기본 설정으로 이미지 스무딩을 켜둡니다.
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

$(canvas).appendTo('#stage');

ctx.font = 'bold 24px georgia';
ctx.shadowColor = "black";
ctx.shadowBlur = 10;
ctx.lineWidth = 7;

configScreen.LoadLocation('location.txt', configScreen.ProcessLocation, configScreen.listDH, configScreen.listDV, configScreen.listMH, configScreen.listMV);
ResourceManager.LoadResource('resource.txt', ResourceManager.ProcessResource, ResourceManager.listImages, ResourceManager.listLoads);

let buttonsGame = [];
let cBettingButtonLocations = [];
let cEmoticonButtonLocations = [];
let buttonsGameBetting = [];
let mobilebuttonsGameBetting = [];
let sortButton = [];
let buttonsGameLocation = [];
let imageBG = [];
let madeButton = [];
let imagesGame = [];
let emoticonBG = null;
let emoticonButtons = [];

let Timer = new ITimer();
let Game = null;
let GameMain = null;

let bInit = false;
let bLoaded = false;

$(window).load( ()=> {
    //alert();
    //GameMain.bRenderLoadingScreen   = false;

    bLoaded = true;
  })

let Loop = () => {

    Timer.UpdateEnd();

    console.log();
    if ( bInit == false && ResourceManager.bComplete == false)
    {
        console.log(`configScreen.listDH.length : ${configScreen.listDH.length}, ResourceManager.listLoads.length : ${ResourceManager.listLoads.length}, ResourceManager.listImages.length : ${ResourceManager.listImages.length}`);
        if ( configScreen.listDH.length >= 54 && ResourceManager.listImages.length != 0 && ResourceManager.listLoads.length == ResourceManager.listImages.length )
        {
            Init();

            GameMain.bRenderLoadingScreen   = false;

            bInit = true;

            ResourceManager.bComplete = true;

            console.log(`### LoadComplete!`);
        }
    }

    if ( bInit == true )
    {
        GameMain.Update();
        GameMain.Render(ctx);

        if ( false == bLoaded )
        {
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0,1920, 1080);

            ctx.drawImage(
            imageLogo,
            0,
            0,
            305,
            114,
            100,
            100,
            305,
            114);
        }
    }


    Timer.UpdateStart();
}

let Init = async () => {

cBettingButtonLocations = 
[
    {x:configScreen.GetPosition(EPositionIndex.ButtonPass).x, y:configScreen.GetPosition(EPositionIndex.ButtonPass).y},    //  Pass
    {x:configScreen.GetPosition(EPositionIndex.ButtonSubmit).x, y:configScreen.GetPosition(EPositionIndex.ButtonSubmit).y},    //  Play
];

cEmoticonButtonLocations = 
[
    {x:configScreen.GetPosition(EPositionIndex.Emoticon00).x, y:configScreen.GetPosition(EPositionIndex.Emoticon00).y},    //  Emoticon00
    {x:configScreen.GetPosition(EPositionIndex.Emoticon01).x, y:configScreen.GetPosition(EPositionIndex.Emoticon01).y},    //  Emoticon01
    {x:configScreen.GetPosition(EPositionIndex.Emoticon02).x, y:configScreen.GetPosition(EPositionIndex.Emoticon02).y},    //  Emoticon02
    {x:configScreen.GetPosition(EPositionIndex.Emoticon03).x, y:configScreen.GetPosition(EPositionIndex.Emoticon03).y},    //  Emoticon03
    {x:configScreen.GetPosition(EPositionIndex.Emoticon04).x, y:configScreen.GetPosition(EPositionIndex.Emoticon04).y},    //  Emoticon04
    {x:configScreen.GetPosition(EPositionIndex.Emoticon05).x, y:configScreen.GetPosition(EPositionIndex.Emoticon05).y},    //  Emoticon05
    {x:configScreen.GetPosition(EPositionIndex.Emoticon06).x, y:configScreen.GetPosition(EPositionIndex.Emoticon06).y},    //  Emoticon06
    {x:configScreen.GetPosition(EPositionIndex.Emoticon07).x, y:configScreen.GetPosition(EPositionIndex.Emoticon07).y},    //  Emoticon07
];

buttonsGame =
[
    new IUIButton(configScreen.GetPosition(EPositionIndex.StartButton).x, configScreen.GetPosition(EPositionIndex.StartButton).y, 230, 90, OnClickGameStart, imageButtons[3], 189, 71, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.StartButton).x, configScreen.GetPosition(EPositionIndex.StartButton).y, 230, 90, OnClickGameReady, imageButtons[4], 173, 56, "Ready"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Emoticon).x, configScreen.GetPosition(EPositionIndex.Emoticon).y, 72.75, 74, OnClickGameEmoticon, imageEmoticonButton, 72.75, 74, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.GameLog).x, configScreen.GetPosition(EPositionIndex.GameLog).y, 100, 74, OnClickGamelog, imageGamelog, 100, 74, ""),

];

buttonsGameBetting =
[
    new IUIButton(cBettingButtonLocations[0].x, cBettingButtonLocations[0].y, 180, 110, OnClickPass, imageBetButtons[3], 278, 76, "PASS"),
    new IUIButton(cBettingButtonLocations[1].x, cBettingButtonLocations[1].y, 180, 110, OnClickSubmit, imageBetButtons[4], 278, 76, "PLAY"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Tips).x, configScreen.GetPosition(EPositionIndex.Tips).y, 180, 110, OnClickTips, imageBetButtons[2], 278, 76, "tips"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Reset).x, configScreen.GetPosition(EPositionIndex.Reset).y, 180, 110, OnClickReset, imageButtons[2], 278, 76, "Reset")
];

mobilebuttonsGameBetting =
[
    new IUIButton(cBettingButtonLocations[0].x, cBettingButtonLocations[0].y, 180, 110, OnClickPass, imageBetButtons[3], 278, 76, "PASS"),
    new IUIButton(cBettingButtonLocations[1].x, cBettingButtonLocations[1].y, 180, 110, OnClickSubmit, imageBetButtons[4], 278, 76, "PLAY"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Tips).x, configScreen.GetPosition(EPositionIndex.Tips).y, 180, 110, OnClickTips, imageBetButtons[2], 278, 76, "tips"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Reset).x, configScreen.GetPosition(EPositionIndex.Reset).y, 180, 110, OnClickReset, imageButtons[2], 278, 76, "Reset")
];

buttonsGameLocation =
[
    new IUIButton(configScreen.GetPosition(EPositionIndex.P1Table).x, configScreen.GetPosition(EPositionIndex.P1Table).y, 150, 150, OnClickLocation1, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.P2Table).x, configScreen.GetPosition(EPositionIndex.P2Table).y, 150, 150, OnClickLocation2, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.P3Table).x, configScreen.GetPosition(EPositionIndex.P3Table).y, 150, 150, OnClickLocation3, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.P4Table).x, configScreen.GetPosition(EPositionIndex.P4Table).y, 150, 150, OnClickLocation4, imageButtons[5], 180, 184, ""),
];

imageBG =
[
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BG01).image, 1920, 1080),
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BG02).image, 1920, 1080),
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText01).image, 1920, 1080),
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText02).image, 1920, 1080)
];

imagesGame =
[
    new IUIImage(configScreen.GetPosition(EPositionIndex.MyInfo).x, configScreen.GetPosition(EPositionIndex.MyInfo).y, 400, 200, imageMyInfo, 400, 200),// 위치만 일단 logo 위치로 잡아둔거임.
    // new IUIImage(configScreen.GetPosition(EPositionIndex.DialogStandby).x, configScreen.GetPosition(EPositionIndex.DialogStandby).y, 600, 200, imageModeStandby, 600, 200),
];

sortButton =
[
    new IUIButton(configScreen.GetPosition(EPositionIndex.SortButton).x, configScreen.GetPosition(EPositionIndex.SortButton).y, 300, 113, OnClickSortNum, imageButtons[7], 368, 143, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.SortButton).x, configScreen.GetPosition(EPositionIndex.SortButton).y, 300, 113, OnClickSortSuit, imageButtons[8], 368, 143, "")
];

madeButton =
[
    new IUIButton(configScreen.GetPosition(EPositionIndex.Single).x, configScreen.GetPosition(EPositionIndex.Single).y, 120, 70, OnClickSingle, imageBetButtons[5], 278, 76, "single"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Pair).x, configScreen.GetPosition(EPositionIndex.Pair).y, 120, 70, OnClickPair, imageBetButtons[5], 278, 76, "pair"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Triple).x, configScreen.GetPosition(EPositionIndex.Triple).y, 120, 70, OnClickTriple, imageBetButtons[5], 278, 76, "triple"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Straight).x, configScreen.GetPosition(EPositionIndex.Straight).y, 140, 70, OnClickStraight, imageBetButtons[5], 278, 76, "straight"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Flush).x, configScreen.GetPosition(EPositionIndex.Flush).y, 120, 70, OnClickFlush, imageBetButtons[5], 278, 76, "flush"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.FullHouse).x, configScreen.GetPosition(EPositionIndex.FullHouse).y, 140, 70, OnClickFullhouse, imageBetButtons[5], 278, 76, "fullhouse"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.FourOfKind).x, configScreen.GetPosition(EPositionIndex.FourOfKind).y, 140, 70, OnClickFourcard, imageBetButtons[5], 278, 76, "fourcard"),
    new IUIButton(configScreen.GetPosition(EPositionIndex.StraightFlush).x, configScreen.GetPosition(EPositionIndex.StraightFlush).y, 160, 70, OnClickStraightFlush, imageBetButtons[5], 278, 76, "straightflush")
];

emoticonBG = new IUIImage(configScreen.GetPosition(EPositionIndex.EmoticonBG).x,configScreen.GetPosition(EPositionIndex.EmoticonBG).y, 700, 154, imageEmoticonBG, 252, 154),
emoticonButtons =
[
    new IUIButton(cEmoticonButtonLocations[0].x, cEmoticonButtonLocations[0].y, 80, 80, OnClickEmoticon0, imageEmoticonButtons[0], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[1].x, cEmoticonButtonLocations[1].y, 80, 80, OnClickEmoticon1, imageEmoticonButtons[1], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[2].x, cEmoticonButtonLocations[2].y, 80, 80, OnClickEmoticon2, imageEmoticonButtons[2], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[3].x, cEmoticonButtonLocations[3].y, 80, 80, OnClickEmoticon3, imageEmoticonButtons[3], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[4].x, cEmoticonButtonLocations[4].y, 80, 80, OnClickEmoticon4, imageEmoticonButtons[4], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[5].x, cEmoticonButtonLocations[5].y, 80, 80, OnClickEmoticon5, imageEmoticonButtons[5], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[6].x, cEmoticonButtonLocations[6].y, 80, 80, OnClickEmoticon6, imageEmoticonButtons[6], 156.75, 160, ""),
    new IUIButton(cEmoticonButtonLocations[7].x, cEmoticonButtonLocations[7].y, 80, 80, OnClickEmoticon7, imageEmoticonButtons[7], 156.75, 160, ""),
];

Game = new IModeGame(socket, buttonsGame, imageBG, imagesGame, configScreen, Timer, strLobbyAddress, i18nTexts);
GameMain = new IGameMain(Game, socket, configScreen, Timer);

Game.SetBg(account.strOptionCode[2]);
//Game.SetDeck(account.strOptionCode[3], imagesGameDeck);
Game.SetDeck(account.strOptionCode[3]);
if(IsMobile()){
    Game.SetBettingButtons(mobilebuttonsGameBetting, true);
    //Game.SetSliderBar(moblieSliderBar);
}
else 
{
    Game.SetBettingButtons(buttonsGameBetting, false);
    //Game.SetSliderBar(sliderBar);
}
Game.SetLocationButtons(buttonsGameLocation);

//Game.SetLocationArrow(imageGameLocationArrow);
//Game.SetTablePanel(imageTablePanel);
Game.SetSortButton(sortButton);
Game.SetMadeButton(madeButton);
Game.SetEmoticon(emoticonBG,emoticonButtons);

GameMain.JoinGame();

await GameMain.OnIO();

GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);
}


let MainLoop = setInterval(Loop, 16);

var canvasPosition = {
    x: canvas.offset().left,
    y: canvas.offset().top
  };

if(IsMobile()){
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            var touch = {
                x: e.touches[0].clientX - canvasPosition.x,
                y: e.touches[0].clientY - canvasPosition.y + window.pageYOffset
            };
            if ( bInit == true )
                GameMain.OnTouchStart(touch);
        }
    }, false);
    
    document.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1) {
            var touch = {
                x: e.touches[0].clientX - canvasPosition.x,
                y: e.touches[0].clientY - canvasPosition.y + window.pageYOffset
            };
            if ( bInit == true )
                GameMain.OnTouchMove(touch);
        }
    }, { passive: false });

    document.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 1) {
            var touch = {
                x: e.changedTouches[0].clientX - canvasPosition.x,
                y: e.changedTouches[0].clientY - canvasPosition.y + window.pageYOffset
            };
            if ( bInit == true )
                GameMain.OnTouchEnd(touch);
        }
    }, false);
}
else
{
    //canvas.on('mousemove', function(e) {
    $(document).on('mousemove', '#stage', (e) => {

        var mouse = {
            x: e.clientX - canvasPosition.x,
            y: e.clientY - canvasPosition.y + window.pageYOffset
          };

        if ( bInit == true )
        GameMain.OnMouseMove(mouse);
    });

}
$(document).on('click', '#stage', (e) => {
    var mouse = {
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y + window.pageYOffset
    };
    if ( bInit == true )
    GameMain.OnClick(mouse);
});

//canvas.on('mousedown', function(e) {
$(document).on('mousedown', '#stage', (e) => {

    var mouse = {
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y + window.pageYOffset
      };
      if ( bInit == true )
    GameMain.OnMouseDown(mouse);
});

//canvas.on('mouseup', function(e) {
$(document).on('mouseup', '#stage', (e) => {
    var mouse = {
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y + window.pageYOffset
      };
    // var mouse = {
    //     x: e.pageX - canvasPosition.x,
    //     y: e.pageY - canvasPosition.y
    // }
    if ( bInit == true )
    GameMain.OnMouseUp(mouse);
});
// $(document).on('mouseleave', '#stage', (e) => {
//     // 여기에 웹 페이지를 벗어났을 때 실행할 로직을 구현
//     if (bInit == true) {
//         // 카드 상태를 초기화하는 등의 로직을 여기에 추가
//         GameMain.OnMouseLeave();
//     }
// });

let OnSize = () =>
{
    cScreenWidth = window.innerWidth;
    cScreenHeight = window.innerHeight;

    configScreen.OnSize(cScreenWidth, cScreenHeight);

    //console.log(configScreen);

    //console.log(`OnSize width : ${cScreenWidth}, height : ${cScreenHeight}`);

    if ( GameMain != null )
    GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);


    canvas = $('<canvas width ="' + cScreenWidth + '" height="' + cScreenHeight + '"></canvas>');
    ctx = canvas.get(0).getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    $('#stage').empty();
    let tag = `
    <!-- 메뉴 팝업 -->
    <div class="main_menu" id="popup_menu">
        <div class="menu_nav">
            <a href="javascript:OnClickSetting();">
                <div id="settingsMenu">설정</div>
            </a>
            <a href="#" class="openFullscreen">
                <div>전체화면</div>
            </a>
            <a href="#">
                <div>방이동</div>
            </a>
            <a href="javascript:OnClickClose();">
                <div id="exit">나가기</div>
            </a>
            <a href="javascript:OnClickMenuClose();">
                <div>메뉴닫기</div>
            </a>
        </div>
    </div>
    `;

    let tag2 = `
    <div class="header-wrap" style="position: absolute; z-index: 11; top:20px; right:20px;">
        <div class="ingame_menu" onclick="OnClickMenu()">
                <div></div>
                <div></div>
                <div></div>
        </div>
    </div> 
    `;
    let tag3 = `<div id="popup_message" class="message-wrap" style="position: absolute; border-radius: 20px; z-index: 12; top:50%; left:50%; transform:translate(-50%, -50%); text-align: center;">
        <div class="setting-form">
            <div class="title">메세지</div>
            <div class="form">
                <p id="message"></p>
            </div>
            <button style="opacity:1.0 border-radius: 20px;" onclick="OnClickMessageYes();">확인</button>
        </div>
    </div>
    <div id="popup_yesorno" class="message-wrap" style="position: absolute; border-radius: 20px; z-index: 12; top:50%; left:50%; transform:translate(-50%, -50%); text-align: center;">
        <div class="setting-form">
            <div id="popup_title" class="title">나가기</div>
            <div class="form">
                <p id="message_yesorno"></p>
            </div>
            <button style="opacity:1.0 border-radius: 16px;" id="yesButton" data-action="exit" onclick="OnClickYes(this);">예</button>
            <button style="opacity:1.0 border-radius: 16px;" id="noButton" data-action="exit" onclick="OnClickNo(this);">아니오</button>
        </div>
    </div>
    `;

    let tag4 = `
    <div class="popup" id="popup_setting">
        <div class="popup_fixed">
            <!-- setting -->
            <div class="setting_head">
                <p>설정</p>
            </div>

            <div class="setting_body">
                
                <div class="sound gauge">
                    <div>
                        <span>효과음</span>
                    </div>
                    <div class="percent-container">
                        <span class="percent">0%</span>
                    </div>
                    <div class="container_top">
                        <div class="image-container imageContainer">
                            <div class="indicator"></div> <!-- 추가된 표시기 -->
                        </div><!-- 이미지 -->
                    </div>
                </div>

                <div class="melody gauge">
                    <div>
                        <span>음  악</span>
                    </div>
                    <div class="percent-container">
                        <span class="percent">0%</span>
                    </div>
                    <div class="container_top">
                        <div class="image-container imageContainer">
                            <div class="indicator"></div> <!-- 추가된 표시기 -->
                        </div><!-- 이미지 -->
                    </div>
                </div>
                <div class="table_color">
                    <div>
                        <span>테이블색
                            
                        </span>
                    </div>
                    <div>
                        <input type="radio" id="selectBg0" name="onoff">블루
                        <label for="selectBg0"></label>
                        
                        <input type="radio" id="selectBg1" name="onoff">레드
                        <label for="selectBg1"></label>
                    </div>
                </div>
                <div class="rebyin">
                    <div>
                        <span>자동 리바인</span>
                    </div>
                    <div class="toggle-button off" id="rebuyinAuto">
                        <div>OFF</div>
                    </div>
                </div>
                <div class="byin gauge">
                    <div>
                        <span>바이인</span>
                    </div>
                    <div class="percent-container">
                        <span class="percent" id="selectRebuyIn">0%</span>
                    </div>
                    <div class="container_top">
                        <div class="image-container imageContainer">
                            <div class="indicator"></div> <!-- 추가된 표시기 -->
                        </div><!-- 이미지 -->
                    </div>
                </div>
            </div>
            <div class="setting_button">
                <div><a href="javascript:OnClickModifySetting();">확인</a></div>
                <div><a href="javascript:OnClickModifyClose();">취소</a></div>
            </div>
        </div>
    </div>
    `;
    // let tag5 = `
    //     <div id="Stage_Text" class="stage_text" style="">
    //         <strong style="margin:10px;">#${account.lUnique}</strong>
    //         <span>${account.iDefaultCoin}/${account.iDefaultCoin * 2}</span>
    //     </div>
    // `;

    $('#stage').append(tag);
    $('#stage').append(tag2);
    $('#stage').append(tag3);
    $('#stage').append(tag4);
    // $('#stage').append(tag4);
    // $('#stage').append(tag5);

    $('#popup_setting').hide();
    $('#popup_message').hide();
    $('#popup_yesorno').hide();
    //$('#chatting').hide();
    //$('#game_log').hide();
    //$('.header-wrap').hide();

    let iRebuyIn = account.strOptionCode[0];
    let iRebuyInLevel = account.strOptionCode[1];

    if ( iRebuyIn == 0 )
    {
        $('#radioRebuyInOff').prop('checked', true);
        $('#radioRebuyInOn').prop('checked', false);
    }
    else
    {
        $('#radioRebuyInOff').prop('checked', false);
        $('#radioRebuyInOn').prop('checked', true);                
    }
    $('#selectRebuyIn').val(parseInt(iRebuyInLevel)*100);

    
    $(canvas).appendTo('#stage');

    canvasPosition = {
        x: canvas.offset().left,
        y: canvas.offset().top
      };
}

OnSize();

let previousWidth = window.innerWidth;
let previousHeight = window.innerHeight;

const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
if(isIOS) {
    window.addEventListener('resize', OnSize, false);
    //window.addEventListener('resize', () => {
        // let vh = window.innerHeight * 0.01;
        // document.documentElement.style.setProperty('--vh', `${vh}px`);
        // if (window.innerWidth !== previousWidth || window.innerHeight !== previousHeight) {
        //     // Window size actually changed

        //     // Check if the device has been rotated
        //     if ((previousWidth > previousHeight && window.innerHeight > window.innerWidth) ||
        //         (previousWidth < previousHeight && window.innerHeight < window.innerWidth)) {
        //         // The device has been rotated
        //         console.log('장치가 회전되었습니다.');
        //         OnSize();
        //     }
        // }
        // else {
        //     if($('#game_log').is(':hidden')) {
        //         // chatting 요소와 game_log 요소가 모두 숨겨져 있는 경우에 실행할 코드를 여기에 작성합니다.
        //         window.addEventListener('resize', OnSize, false);
        //     } else {
        //         // chatting 요소와 game_log 요소 중 하나라도 보이는 경우에 실행할 코드를 여기에 작성합니다.
        //         window.scrollTo(0, 0);
        //     }
        // }
    //});

    //previousWidth = window.innerWidth;
    //previousHeight = window.innerHeight;
}
else {
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        if (window.innerWidth !== previousWidth || window.innerHeight !== previousHeight) {
            // Window size actually changed

            // Check if the device has been rotated
            if ((previousWidth > previousHeight && window.innerHeight > window.innerWidth) ||
                (previousWidth < previousHeight && window.innerHeight < window.innerWidth)) {
                // The device has been rotated
                console.log('장치가 회전되었습니다.');
                OnSize();
            } else {
                // The device has not been rotated, check for keyboard
                if (window.innerHeight < previousHeight * 0.4) {
                    console.log('키보드가 나타났습니다.');
                    // 키보드가 나타났을 때 수행하려는 동작을 여기에 작성
                } else {
                    console.log('키보드가 사라졌습니다.');
                    OnSize();
                    // 키보드가 사라졌을 때 수행하려는 동작을 여기에 작성
                }
            }
        }

        previousWidth = window.innerWidth;
        previousHeight = window.innerHeight;
    });
}

//window.addEventListener('resize', OnSize, false);