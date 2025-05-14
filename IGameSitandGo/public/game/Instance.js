import IGameMain from "../game/IGameMain.js";
import IModeGame from "../game/IModeGame.js";

import IScreenConfig from "../js/screenconfig.js";
import IResourceManager from "../js/resourcemanager.js";
import IUISlider from "../js/slider.js";
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
    configScreen = new IScreenConfig(0, 0, 1080, 1920, window.innerWidth, window.innerHeight, 'Mobile');
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
let buttonsGameLocation = [];
let imageBG = [];
let imageTablePanel = [];
let imagesGame = [];
let imagesGameDeck = [];
let emoticonBG = null;
let emoticonButtons = [];
let buttonSlider = null;
let sliderBar = null;
let sliderButton = [];

let Timer = new ITimer();
let Game = null;
let GameMain = null;



let bInit = false;
let bLoaded = false;

$(window).load( ()=> {
    //alert();

    //Init();

    //GameMain.bRenderLoadingScreen   = false;

    bLoaded = true;

    //bInit = true;
  })

let Loop = () => {

    Timer.UpdateEnd();

    console.log();
    if ( bInit == false && ResourceManager.bComplete == false)
    {
        //console.log(`ResourceManager.listLoads.length : ${ResourceManager.listLoads.length}, ResourceManager.listImages.length : ${ResourceManager.listImages.length}`);

        if ( configScreen.listDH.length >= 68 && ResourceManager.listImages.length != 0 && ResourceManager.listLoads.length == ResourceManager.listImages.length )
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
    {x:configScreen.GetPosition(EPositionIndex.BetButtonQuater).x, y:configScreen.GetPosition(EPositionIndex.BetButtonQuater).y},    //  Quater
    {x:configScreen.GetPosition(EPositionIndex.BetButtonHalf).x, y:configScreen.GetPosition(EPositionIndex.BetButtonHalf).y},    //  Half
    {x:configScreen.GetPosition(EPositionIndex.BetButtonFull).x, y:configScreen.GetPosition(EPositionIndex.BetButtonFull).y},    //  Full
    {x:configScreen.GetPosition(EPositionIndex.BetButtonCall).x, y:configScreen.GetPosition(EPositionIndex.BetButtonCall).y},    //  Call
    {x:configScreen.GetPosition(EPositionIndex.BetButtonFold).x, y:configScreen.GetPosition(EPositionIndex.BetButtonFold).y},    //  Fold
    {x:configScreen.GetPosition(EPositionIndex.BetButtonCheck).x, y:configScreen.GetPosition(EPositionIndex.BetButtonCheck).y},    //  Check
    {x:configScreen.GetPosition(EPositionIndex.BetButtonRaise).x, y:configScreen.GetPosition(EPositionIndex.BetButtonRaise).y},    //  Raise
    {x:configScreen.GetPosition(EPositionIndex.plusButton).x, y:configScreen.GetPosition(EPositionIndex.plusButton).y},    //  plus
    {x:configScreen.GetPosition(EPositionIndex.minusButton).x, y:configScreen.GetPosition(EPositionIndex.minusButton).y},    //  minus
    {x:configScreen.GetPosition(EPositionIndex.sliderBar).x, y:configScreen.GetPosition(EPositionIndex.sliderBar).y},    //  slider
    {x:configScreen.GetPosition(EPositionIndex.RaiseButton1).x, y:configScreen.GetPosition(EPositionIndex.RaiseButton1).y},    //  RaiseButton1
    {x:configScreen.GetPosition(EPositionIndex.RaiseButton2).x, y:configScreen.GetPosition(EPositionIndex.RaiseButton2).y},    //  RaiseButton2
    {x:configScreen.GetPosition(EPositionIndex.RaiseButton3).x, y:configScreen.GetPosition(EPositionIndex.RaiseButton3).y},    //  RaiseButton3
    {x:configScreen.GetPosition(EPositionIndex.RaiseButton4).x, y:configScreen.GetPosition(EPositionIndex.RaiseButton4).y},    //  RaiseButton4
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
    new IUIButton(configScreen.GetPosition(EPositionIndex.Emoticon).x, configScreen.GetPosition(EPositionIndex.Emoticon).y, 72.75, 74, OnClickGameEmoticon, imageEmoticonButton, 72.75, 74, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.GameLog).x, configScreen.GetPosition(EPositionIndex.GameLog).y, 100, 74, OnClickGamelog, imageGamelog, 100, 74, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.ShowCard).x, configScreen.GetPosition(EPositionIndex.ShowCard).y, 200, 90, OnClickShowCard, cardOpenButton, 100, 45, "")

];

buttonsGameBetting =
[
    new IUIButton(cBettingButtonLocations[0].x, cBettingButtonLocations[0].y, 140, 80, OnClickQuater, imageBetButtons[0], 495.75, 250, "쿼터"),
    new IUIButton(cBettingButtonLocations[1].x, cBettingButtonLocations[1].y, 140, 80, OnClickHalf, imageBetButtons[0], 495.75, 250, "하프"),
    new IUIButton(cBettingButtonLocations[2].x, cBettingButtonLocations[2].y, 140, 80, OnClickFull, imageBetButtons[0], 495.75, 250, "풀"),

    new IUIButton(cBettingButtonLocations[3].x, cBettingButtonLocations[3].y, 180, 100, OnClickCall, imageBetButtons[0], 495.75, 250, "콜",'rgba(98, 210, 117, 0.5)',50),
    new IUIButton(cBettingButtonLocations[4].x, cBettingButtonLocations[4].y, 180, 100, OnClickFold, imageBetButtons[0], 495.75, 250, "폴드",'gray',50),
    new IUIButton(cBettingButtonLocations[5].x, cBettingButtonLocations[5].y, 180, 100, OnClickCheck, imageBetButtons[0], 495.75, 250, "체크",'rgba(186, 156, 124, 0.5)',50),
    new IUIButton(cBettingButtonLocations[6].x, cBettingButtonLocations[6].y, 180, 100, OnclickMobileRaise, imageBetButtons[0], 495.75, 250, "레이스",'rgba(252, 73, 220, 0.5)',50),
];

mobilebuttonsGameBetting =
[
    new IUIButton(cBettingButtonLocations[0].x, cBettingButtonLocations[0].y, 140, 80, OnClickMobileQuater, imageBetButtons[2], 278, 78, "QUARTER"),
    new IUIButton(cBettingButtonLocations[1].x, cBettingButtonLocations[1].y, 140, 80, OnClickMobileHalf, imageBetButtons[2], 278, 78, "HALF"),
    new IUIButton(cBettingButtonLocations[2].x, cBettingButtonLocations[2].y, 140, 80, OnClickMobileFull, imageBetButtons[2], 278, 78, "FULL"),

    new IUIButton(cBettingButtonLocations[3].x, cBettingButtonLocations[3].y, 320, 150, OnClickCall, imageBetButtons[0], 495.75, 250, "콜",'rgba(98, 210, 117, 0.5)',100),
    new IUIButton(cBettingButtonLocations[4].x, cBettingButtonLocations[4].y, 320, 150, OnClickFold, imageBetButtons[0], 495.75, 250, "폴드",'gray',100),
    new IUIButton(cBettingButtonLocations[5].x, cBettingButtonLocations[5].y, 320, 150, OnClickCheck, imageBetButtons[0], 495.75, 250, "체크",'rgba(186, 156, 124, 0.5)',100),
    new IUIButton(cBettingButtonLocations[6].x, cBettingButtonLocations[6].y, 320, 150, OnclickMobileRaise, imageBetButtons[0], 495.75, 250, "레이스",'rgba(252, 73, 220, 0.5)',100),
];

buttonsGameLocation =
[
    //6Player
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player1).x, configScreen.GetPosition(EPositionIndex.Sit6Player1).y, 150, 150, OnClickLocation1, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player2).x, configScreen.GetPosition(EPositionIndex.Sit6Player2).y, 150, 150, OnClickLocation2, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player3).x, configScreen.GetPosition(EPositionIndex.Sit6Player3).y, 150, 150, OnClickLocation3, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player4).x, configScreen.GetPosition(EPositionIndex.Sit6Player4).y, 150, 150, OnClickLocation4, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player5).x, configScreen.GetPosition(EPositionIndex.Sit6Player5).y, 150, 150, OnClickLocation5, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit6Player6).x, configScreen.GetPosition(EPositionIndex.Sit6Player6).y, 150, 150, OnClickLocation6, imageButtons[5], 180, 184, ""),
    // 3Player
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit3Player1).x, configScreen.GetPosition(EPositionIndex.Sit3Player1).y, 150, 150, OnClickLocation1, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit3Player2).x, configScreen.GetPosition(EPositionIndex.Sit3Player2).y, 150, 150, OnClickLocation2, imageButtons[5], 180, 184, ""),
    new IUIButton(configScreen.GetPosition(EPositionIndex.Sit3Player3).x, configScreen.GetPosition(EPositionIndex.Sit3Player3).y, 150, 150, OnClickLocation3, imageButtons[5], 180, 184, ""),
];

imageBG =
[
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BG01).image, 1920, 1080),
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BG02).image, 1920, 1080),
    new IUIImage(0, 0, 1080, 1920, ResourceManager.GetImage(EImageIndex.BG03).image, 1080, 1920),
    new IUIImage(0, 0, 1080, 1920, ResourceManager.GetImage(EImageIndex.BG04).image, 1080, 1920),

    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText01).image, 1920, 1080),
    new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText02).image, 1920, 1080),
    // new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText03).image, 1920, 1080),
    // new IUIImage(0, 0, 1920, 1080, ResourceManager.GetImage(EImageIndex.BGText04).image, 1920, 1080),
];

imageTablePanel =
[
    new IUIImage(configScreen.GetPosition(EPositionIndex.PanelCall).x, configScreen.GetPosition(EPositionIndex.PanelCall).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableTotalPanel01).image, 308, 57),
    new IUIImage(configScreen.GetPosition(EPositionIndex.PanelTotal).x, configScreen.GetPosition(EPositionIndex.PanelTotal).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableCallPanel01).image, 308, 57),
    new IUIImage(configScreen.GetPosition(EPositionIndex.PanelCall).x, configScreen.GetPosition(EPositionIndex.PanelCall).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableTotalPanel02).image, 308, 57),
    new IUIImage(configScreen.GetPosition(EPositionIndex.PanelTotal).x, configScreen.GetPosition(EPositionIndex.PanelTotal).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableCallPanel02).image, 308, 57),

];

imagesGame =
[
    new IUIImage(configScreen.GetPosition(EPositionIndex.MyInfo).x, configScreen.GetPosition(EPositionIndex.MyInfo).y, 378, 202, imageMyInfo, 378, 202),// 위치만 일단 logo 위치로 잡아둔거임.
    new IUIImage(configScreen.GetPosition(EPositionIndex.DialogStandby).x, configScreen.GetPosition(EPositionIndex.DialogStandby).y, 600, 200, imageModeStandby, 600, 200)
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

imagesGameDeck =
[
    new IUIImage(configScreen.GetPosition(EPositionIndex.CardDeck).x, configScreen.GetPosition(EPositionIndex.CardDeck).y, 120, 40, ResourceManager.GetImage(EImageIndex.BGTableDeck01).image, 351, 136),
    new IUIImage(configScreen.GetPosition(EPositionIndex.CardDeck).x, configScreen.GetPosition(EPositionIndex.CardDeck).y, 120, 40, ResourceManager.GetImage(EImageIndex.BGTableDeck02).image, 351, 136),//blue card
    new IUIImage(configScreen.GetPosition(EPositionIndex.CardDeck).x, configScreen.GetPosition(EPositionIndex.CardDeck).y, 120, 40, ResourceManager.GetImage(EImageIndex.BGTableDeck04).image, 351, 136),//red card
    new IUIImage(configScreen.GetPosition(EPositionIndex.CardDeck).x, configScreen.GetPosition(EPositionIndex.CardDeck).y, 120, 40, ResourceManager.GetImage(EImageIndex.BGTableDeck03).image, 351, 136),
];
let mobileSizeX = IsMobile() ? 100 : 50;
let mobileSizeY = IsMobile() ? 620 : 400;
let mobilebuttonSizeX = IsMobile() ? 130 : 50;
let mobilebuttonSizeY = IsMobile() ? 160 : 80;
let iFontSize = IsMobile() ? 80 : 30;
let iSizeX = IsMobile() ? 180 : 80;
let iSizeY = IsMobile() ? 140 : 80;
buttonSlider = new IUIButton(50, 80, mobilebuttonSizeX, mobilebuttonSizeY, null,imageButtons[6], 50, 80, "");
sliderBar = new IUISlider(configScreen.GetPosition(EPositionIndex.MobileSliderBar).x, configScreen.GetPosition(EPositionIndex.MobileSliderBar).y, mobileSizeX, mobileSizeY, imageSliderBar, 27, 200, buttonSlider,1);
sliderButton = [
    new IUIButton(cBettingButtonLocations[10].x, cBettingButtonLocations[10].y, iSizeX, iSizeY, OnClickAllin, imageButtons[7], 50, 50, "올인",'red',iFontSize),
    new IUIButton(cBettingButtonLocations[10].x - 200, cBettingButtonLocations[10].y-10, 200, 100, "", RaisebarCredit, 100, 50, "0",'white',iFontSize),
    new IUIButton(cBettingButtonLocations[11].x, cBettingButtonLocations[11].y, iSizeX, iSizeY, OnClickFull, imageButtons[7], 50, 50, "풀",'red',iFontSize),
    new IUIButton(cBettingButtonLocations[11].x - 200, cBettingButtonLocations[11].y-10, 200, 100, "", RaisebarCredit, 100, 50, "0",'white',iFontSize),
    new IUIButton(cBettingButtonLocations[12].x, cBettingButtonLocations[12].y, iSizeX, iSizeY, OnClickHalf, imageButtons[7], 50, 50, "하프",'red',iFontSize),
    new IUIButton(cBettingButtonLocations[12].x - 200, cBettingButtonLocations[12].y-10, 200, 100, "", RaisebarCredit, 100, 50, "0",'white',iFontSize),
    new IUIButton(cBettingButtonLocations[13].x, cBettingButtonLocations[13].y, iSizeX, iSizeY, OnClickQuater, imageButtons[7], 50, 50, "쿼터",'red',iFontSize),
    new IUIButton(cBettingButtonLocations[13].x - 200, cBettingButtonLocations[13].y-10, 200, 100, "", RaisebarCredit, 100, 50, "0",'white',iFontSize),
    new IUIButton(cBettingButtonLocations[7].x, cBettingButtonLocations[7].y, iSizeX, iSizeY, OnClickPlus, imageButtons[9], 50, 50, ""),
    new IUIButton(cBettingButtonLocations[8].x, cBettingButtonLocations[8].y, iSizeX, iSizeY, OnClickMinus, imageButtons[8], 50, 50, ""),
];

Game = new IModeGame(socket, buttonsGame, imageBG, imagesGame, buttonsGameLocation,configScreen, Timer, IsMobile(), strLobbyAddress);
GameMain = new IGameMain(Game, socket, configScreen, Timer);

Game.SetBg(account.strOptionCode[2]);
Game.SetDeck(account.strOptionCode[3], imagesGameDeck);
Game.SetSliderBar(sliderBar,sliderButton);
Game.SetEmoticon(emoticonBG,emoticonButtons);
if(IsMobile()){
    Game.SetBettingButtons(mobilebuttonsGameBetting);
}
else
{
    Game.SetBettingButtons(buttonsGameBetting);
}
// Game.SetBettingButtons(mobilebuttonsGameBetting);
// Game.SetLocationButtons(buttonsGameLocation);

Game.SetTablePanel(imageTablePanel);

GameMain.JoinGame();

await GameMain.OnIO();

GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);
}


let MainLoop = setInterval(Loop, 16);

var canvasPosition = {
    x: canvas.offset().left,
    y: canvas.offset().top
  };

//canvas.on('click', function(e) {
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
$(document).on('mouseleave', '#stage', (e) => {
    // 여기에 웹 페이지를 벗어났을 때 실행할 로직을 구현
    if (bInit == true) {
        // 카드 상태를 초기화하는 등의 로직을 여기에 추가
        GameMain.OnMouseLeave();
    }
});

let OnSize = () =>
{
    cScreenWidth = window.innerWidth;
    cScreenHeight = window.innerHeight;

    //UpdateLocation();
    configScreen.OnSize(cScreenWidth, cScreenHeight);

    //console.log(configScreen);

    //console.log(`OnSize width : ${cScreenWidth}, height : ${cScreenHeight}`);

    if ( GameMain != null )
    GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);


    canvas = $('<canvas width ="' + cScreenWidth + '" height="' + cScreenHeight + '"></canvas>');
    ctx = canvas.get(0).getContext("2d");
    $('#stage').empty();
    let tag2 = '';
    let tag = `
    <div id="popup_setting" class="setting-wrap" style="position: absolute; border-radius: 20px; z-index: 12; top:50%; left:50%; transform:translate(-50%, -50%); text-align: center; ">
    <div class="close"><a href="javascript:OnClickSettingClose();"><img src="images/close.svg"></a></div>
    <div class="setting-form">
        <div class="title">설정</div>
        <div class="form">
            <ul>
                <li>리바인</li>
                <li>
                    <span><input type="radio" id="radioRebuyInOn" name="radioRebuyin"><font>on</font></span>
                    <span><input type="radio" id="radioRebuyInOff" name="radioRebuyin"><font>off</font></span>
                </li>
            </ul>
            <ul>
                <li>리바인 설정</li>
                <li>
                    <select id="selectRebuyIn">
                        <option value="100">100%</option>
                        <option value="200">200%</option>
                        <option value="300">300%</option>
                    </select>
                </li>
            </ul>
        </div>
    </div>`;
    if(IsMobile())
    {
        tag2 = `
        <div class="header-wrap" style="position: absolute; z-index: 11; top:0%; right:0%;">
        <div class="head-top">
                <span class="user-nav">
                    <ul>
                        <li><a href="javascript:OnClickClose();"><img src="images/close.svg"></a></li>
                        <li id="exit">나가기</li>
                    </ul>

                    <ul>
                        <li><a href="javascript:OnClickSetting();"><img src="images/setting_icon.svg"></a></li>
                        <li>설정</li>
                    </ul>
                </span>
            </div>
        </div>
        `;
    }
    else
    {
        tag2 = `
        <div class="header-wrap" style="position: absolute; z-index: 11; top:0%; right:0%;">
        <div class="head-top">
                <span class="user-nav">
                    <ul class="openFullscreen">
                        <li><img src="images/full_size.svg"></li>
                        <li>전체화면</li>
                    </ul>
                    <ul>
                        <li><a href="javascript:OnClickSetting();"><img src="images/setting_icon.svg"></a></li>
                        <li>설정</li>
                    </ul>
                    <ul>
                        <li><a href="javascript:OnClickClose();"><img src="images/close.svg"></a></li>
                        <li id="exit">나가기</li>
                    </ul>
                </span>
            </div>
        </div>
        `;
    }
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
    </div>`;

    $('#stage').append(tag);
    $('#stage').append(tag2);
    $('#stage').append(tag3);

    $('#popup_setting').hide();
    $('#popup_message').hide();
    $('#popup_yesorno').hide();

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
            }
        }
        else {
            if($('#game_log').is(':hidden')) {
                // chatting 요소와 game_log 요소가 모두 숨겨져 있는 경우에 실행할 코드를 여기에 작성합니다.
                window.addEventListener('resize', OnSize, false);
            } else {
                // chatting 요소와 game_log 요소 중 하나라도 보이는 경우에 실행할 코드를 여기에 작성합니다.
                window.scrollTo(0, 0);
            }
        }
    });

    previousWidth = window.innerWidth;
    previousHeight = window.innerHeight;
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