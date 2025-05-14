import IGameMain from "../game/IGameMain.js";
import IModeGame from "../game/IModeGame.js";

import IScreenConfig from "../js/screenconfig.js";
import IResourceManager from "../js/resourcemanager.js";
import IUISlider from "../js/slider.js";
import IUIButton from "../js/button.js";
import IUIImage from "../js/image.js";
import ITimer from "../game/ITimer.js";

let account = null;

function IsMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  //return true;
}
var isFullscreen = false;
function checkFullscreen() {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    isFullscreen = true;
  } else {
    isFullscreen = false;
  }
}
//let configScreen = new IScreenConfig(0, 0, 1920, 1080, window.innerWidth, window.innerHeight);
let configScreen = null;
//let fullscreenResized = false;

if (IsMobile()) {
  configScreen = new IScreenConfig(
    0,
    0,
    1080,
    1920,
    window.innerWidth,
    window.innerHeight,
    "Mobile"
  );
} else {
  //configScreen = new IScreenConfig(0, 0, 1080, 1920, window.innerWidth, window.innerHeight, 'Mobile');
  configScreen = new IScreenConfig(
    0,
    0,
    1920,
    1080,
    window.innerWidth,
    window.innerHeight,
    "Desktop"
  );
}

let ResourceManager = new IResourceManager();

var cScreenWidth = configScreen.m_iCurrentWidth;
var cScreenHeight = configScreen.m_iCurrentHeight;

let canvas = $(
  '<canvas id="maincanvas" width ="' +
    cScreenWidth +
    '" height="' +
    cScreenHeight +
    '"></canvas>'
);
let ctx = canvas.get(0).getContext("2d");
$(canvas).appendTo("#stage");

ctx.font = "bold 24px georgia";
ctx.shadowColor = "black";
ctx.shadowBlur = 10;
ctx.lineWidth = 7;

configScreen.LoadLocation(
  "location.txt",
  configScreen.ProcessLocation,
  configScreen.listDH,
  configScreen.listDV,
  configScreen.listMH,
  configScreen.listMV
);
ResourceManager.LoadResource(
  "resource.txt",
  ResourceManager.ProcessResource,
  ResourceManager.listImages,
  ResourceManager.listLoads
);

let buttonsGame = [];
let cBettingButtonLocations = [];
// let cEmoticonButtonLocations = [];
let buttonsGameBetting = [];
let mobilebuttonsGameBetting = [];
let buttonReserveBet = [];
let buttonsGameLocation = [];
let imageBG = [];
let imageTablePanel = [];
let imageJackpotPanel = [];
// let imagesGame = [];
let imagesGameDeck = [];
// let emoticonBG = null;
// let emoticonButtons = [];
let buttonSlider = null;
let sliderBar = null;
let sliderLabel1 = null;
let sliderLabel2 = null;

let Timer = new ITimer();
let Game = null;
let GameMain = null;

let bInit = false;
let bLoaded = false;

$(window).load(() => {
  //alert();

  //Init();

  //GameMain.bRenderLoadingScreen   = false;

  bLoaded = true;

  //bInit = true;
});

let Loop = () => {
  Timer.UpdateEnd();

  console.log();
  if (bInit == false && ResourceManager.bComplete == false) {
    //console.log(`configScreen.listDH.length : ${configScreen.listDH.length}, ResourceManager.listLoads.length : ${ResourceManager.listLoads.length}, ResourceManager.listImages.length : ${ResourceManager.listImages.length}`);
    if (
      configScreen.listDH.length >= 114 &&
      ResourceManager.listImages.length != 0 &&
      ResourceManager.listLoads.length == ResourceManager.listImages.length
    ) {
      Init();

      GameMain.bRenderLoadingScreen = false;

      bInit = true;

      ResourceManager.bComplete = true;

      console.log(`### LoadComplete!`);
    }
  }

  if (bInit == true) {
    GameMain.Update();
    GameMain.Render(ctx);

    if (false == bLoaded) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 1920, 1080);

      ctx.drawImage(imageLogo, 0, 0, 305, 114, 100, 100, 305, 114);
    }
  }

  Timer.UpdateStart();
};

let Init = async () => {
  cBettingButtonLocations = [
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonQuater).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonQuater).y,
    }, //  Quater
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonHalf).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonHalf).y,
    }, //  Half
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonFull).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonFull).y,
    }, //  Full
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonCall).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonCall).y,
    }, //  Call
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonFold).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonFold).y,
    }, //  Fold
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonCheck).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonCheck).y,
    }, //  Check
    {
      x: configScreen.GetPosition(EPositionIndex.BetButtonRaise).x,
      y: configScreen.GetPosition(EPositionIndex.BetButtonRaise).y,
    }, //  Allin
    {
      x: configScreen.GetPosition(EPositionIndex.plusButton).x,
      y: configScreen.GetPosition(EPositionIndex.plusButton).y,
    }, //  plus
    {
      x: configScreen.GetPosition(EPositionIndex.minusButton).x,
      y: configScreen.GetPosition(EPositionIndex.minusButton).y,
    }, //  minus
    {
      x: configScreen.GetPosition(EPositionIndex.sliderBar).x,
      y: configScreen.GetPosition(EPositionIndex.sliderBar).y,
    }, //  slider
    {
      x: configScreen.GetPosition(EPositionIndex.RaiseButton1).x,
      y: configScreen.GetPosition(EPositionIndex.RaiseButton1).y,
    }, //  RaiseButton1
    {
      x: configScreen.GetPosition(EPositionIndex.RaiseButton2).x,
      y: configScreen.GetPosition(EPositionIndex.RaiseButton2).y,
    }, //  RaiseButton2
    {
      x: configScreen.GetPosition(EPositionIndex.RaiseButton3).x,
      y: configScreen.GetPosition(EPositionIndex.RaiseButton3).y,
    }, //  RaiseButton3
    {
      x: configScreen.GetPosition(EPositionIndex.RaiseButton4).x,
      y: configScreen.GetPosition(EPositionIndex.RaiseButton4).y,
    }, //  RaiseButton4
  ];

  // cEmoticonButtonLocations =
  // [
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon00).x, y:configScreen.GetPosition(EPositionIndex.Emoticon00).y},    //  Emoticon00
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon01).x, y:configScreen.GetPosition(EPositionIndex.Emoticon01).y},    //  Emoticon01
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon02).x, y:configScreen.GetPosition(EPositionIndex.Emoticon02).y},    //  Emoticon02
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon03).x, y:configScreen.GetPosition(EPositionIndex.Emoticon03).y},    //  Emoticon03
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon04).x, y:configScreen.GetPosition(EPositionIndex.Emoticon04).y},    //  Emoticon04
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon05).x, y:configScreen.GetPosition(EPositionIndex.Emoticon05).y},    //  Emoticon05
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon06).x, y:configScreen.GetPosition(EPositionIndex.Emoticon06).y},    //  Emoticon06
  //     {x:configScreen.GetPosition(EPositionIndex.Emoticon07).x, y:configScreen.GetPosition(EPositionIndex.Emoticon07).y},    //  Emoticon07
  // ];

  buttonsGame = [
    // new IUIButton(configScreen.GetPosition(EPositionIndex.StartButton).x, configScreen.GetPosition(EPositionIndex.StartButton).y, 230, 90, OnClickGameStart, imageButtons[3], 189, 71, ""),
    // new IUIButton(configScreen.GetPosition(EPositionIndex.Emoticon).x, configScreen.GetPosition(EPositionIndex.Emoticon).y, 72.75, 74, OnClickGameEmoticon, imageEmoticonButton, 72.75, 74, ""),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.GameLog).x,
      configScreen.GetPosition(EPositionIndex.GameLog).y,
      100,
      74,
      OnClickGamelog,
      imageGamelog,
      100,
      74,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.ShowCard).x,
      configScreen.GetPosition(EPositionIndex.ShowCard).y,
      200,
      90,
      OnClickShowCard,
      cardOpenButton,
      100.25,
      45,
      ""
    ),
  ];

  buttonsGameBetting = [
    new IUIButton(
      cBettingButtonLocations[0].x,
      cBettingButtonLocations[0].y,
      280,
      120,
      OnClickQuater,
      imageBetButtons[0],
      512,
      250,
      "쿼터",
      "gray",
      50,
      0,
      25,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[1].x,
      cBettingButtonLocations[1].y,
      280,
      120,
      OnClickHalf,
      imageBetButtons[0],
      512,
      250,
      "하프",
      "gray",
      50,
      0,
      50,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[2].x,
      cBettingButtonLocations[2].y,
      280,
      120,
      OnClickFull,
      imageBetButtons[0],
      512,
      250,
      "풀",
      "gray",
      50,
      0,
      100,
      1
    ),

    new IUIButton(
      cBettingButtonLocations[3].x,
      cBettingButtonLocations[3].y,
      280,
      120,
      OnClickCall,
      imageBetButtons[0],
      512,
      250,
      "콜",
      "rgba(98, 210, 117, 0.5)",
      50,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      280,
      120,
      OnClickFold,
      imageBetButtons[0],
      512,
      250,
      "폴드",
      "gray",
      50,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[5].x,
      cBettingButtonLocations[5].y,
      280,
      120,
      OnClickCheck,
      imageBetButtons[0],
      512,
      250,
      "체크",
      "rgba(186, 156, 124, 0.5)",
      50,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[6].x,
      cBettingButtonLocations[6].y,
      280,
      120,
      OnClickAllin,
      imageBetButtons[0],
      512,
      250,
      "올인",
      "rgba(252, 73, 220, 0.5)",
      50,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[9].x,
      cBettingButtonLocations[9].y,
      75,
      75,
      OnclickMobileRaise,
      imageButtons[8],
      296,
      300,
      ""
    ),
  ];

  mobilebuttonsGameBetting = [
    new IUIButton(
      cBettingButtonLocations[0].x,
      cBettingButtonLocations[0].y,
      320,
      150,
      OnClickQuater,
      imageBetButtons[0],
      512,
      250,
      "쿼터",
      "gray",
      70,
      0,
      25,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[1].x,
      cBettingButtonLocations[1].y,
      320,
      150,
      OnClickHalf,
      imageBetButtons[0],
      512,
      250,
      "하프",
      "gray",
      70,
      0,
      50,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[2].x,
      cBettingButtonLocations[2].y,
      320,
      150,
      OnClickFull,
      imageBetButtons[0],
      512,
      250,
      "풀",
      "gray",
      70,
      0,
      100,
      1
    ),

    new IUIButton(
      cBettingButtonLocations[3].x,
      cBettingButtonLocations[3].y,
      320,
      150,
      OnClickCall,
      imageBetButtons[0],
      512,
      250,
      "콜",
      "rgba(98, 210, 117, 0.5)",
      70,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      320,
      150,
      OnClickFold,
      imageBetButtons[0],
      512,
      250,
      "폴드",
      "gray",
      70,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[5].x,
      cBettingButtonLocations[5].y,
      320,
      150,
      OnClickCheck,
      imageBetButtons[0],
      512,
      250,
      "체크",
      "rgba(186, 156, 124, 0.5)",
      70,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[6].x,
      cBettingButtonLocations[6].y,
      320,
      150,
      OnClickAllin,
      imageBetButtons[0],
      512,
      250,
      "올인",
      "rgba(252, 73, 220, 0.5)",
      70,
      0,
      0,
      1
    ),
    new IUIButton(
      cBettingButtonLocations[9].x,
      cBettingButtonLocations[9].y,
      75,
      75,
      OnclickMobileRaise,
      imageButtons[8],
      296,
      300,
      ""
    ),
  ];

  let mobileButtonSizeX = IsMobile() ? 320 : 180;
  let mobileButtonSizeY = IsMobile() ? 150 : 100;
  buttonReserveBet = [
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      mobileButtonSizeX,
      mobileButtonSizeY,
      OnClickReserveBetTrue,
      imageBetButtons[6],
      512,
      250,
      ""
    ),
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      mobileButtonSizeX,
      mobileButtonSizeY,
      OnClickReserveBetFalse,
      imageBetButtons[7],
      512,
      250,
      ""
    ),
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      mobileButtonSizeX,
      mobileButtonSizeY,
      OnClickReserveBetTrue,
      imageBetButtons[8],
      512,
      250,
      ""
    ),
    new IUIButton(
      cBettingButtonLocations[4].x,
      cBettingButtonLocations[4].y,
      mobileButtonSizeX,
      mobileButtonSizeY,
      OnClickReserveBetFalse,
      imageBetButtons[9],
      512,
      250,
      ""
    ),
  ];

  buttonsGameLocation = [
    //9Ring
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player1).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player1).y,
      150,
      150,
      OnClickLocation1,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player2).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player2).y,
      150,
      150,
      OnClickLocation2,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player3).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player3).y,
      150,
      150,
      OnClickLocation3,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player4).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player4).y,
      150,
      150,
      OnClickLocation4,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player5).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player5).y,
      150,
      150,
      OnClickLocation5,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player6).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player6).y,
      150,
      150,
      OnClickLocation6,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player7).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player7).y,
      150,
      150,
      OnClickLocation7,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player8).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player8).y,
      150,
      150,
      OnClickLocation8,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring9Player9).x,
      configScreen.GetPosition(EPositionIndex.Ring9Player9).y,
      150,
      150,
      OnClickLocation9,
      imageButtons[5],
      180,
      184,
      ""
    ),
    //6Ring
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player1).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player1).y,
      150,
      150,
      OnClickLocation1,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player2).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player2).y,
      150,
      150,
      OnClickLocation2,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player3).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player3).y,
      150,
      150,
      OnClickLocation3,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player4).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player4).y,
      150,
      150,
      OnClickLocation4,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player5).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player5).y,
      150,
      150,
      OnClickLocation5,
      imageButtons[5],
      180,
      184,
      ""
    ),
    new IUIButton(
      configScreen.GetPosition(EPositionIndex.Ring6Player6).x,
      configScreen.GetPosition(EPositionIndex.Ring6Player6).y,
      150,
      150,
      OnClickLocation6,
      imageButtons[5],
      180,
      184,
      ""
    ),
  ];

  imageBG = [
    new IUIImage(
      0,
      0,
      1920,
      1080,
      ResourceManager.GetImage(EImageIndex.BG01).image,
      1920,
      1080
    ),
    new IUIImage(
      0,
      0,
      1920,
      1080,
      ResourceManager.GetImage(EImageIndex.BG02).image,
      1920,
      1080
    ),
    new IUIImage(
      0,
      0,
      1080,
      1920,
      ResourceManager.GetImage(EImageIndex.BG03).image,
      1080,
      1920
    ),
    new IUIImage(
      0,
      0,
      1080,
      1920,
      ResourceManager.GetImage(EImageIndex.BG04).image,
      1080,
      1920
    ),

    // new IUIImage(configScreen.GetPosition(EPositionIndex.BGText).x, configScreen.GetPosition(EPositionIndex.BGText).y, 300, 50, ResourceManager.GetImage(EImageIndex.BGText01).image, 300, 50),
    // new IUIImage(configScreen.GetPosition(EPositionIndex.BGText).x, configScreen.GetPosition(EPositionIndex.BGText).y, 300, 50, ResourceManager.GetImage(EImageIndex.BGText02).image, 300, 50),
    // new IUIImage(configScreen.GetPosition(EPositionIndex.BGText).x, configScreen.GetPosition(EPositionIndex.BGText).y, 300, 50, ResourceManager.GetImage(EImageIndex.BGText03).image, 300, 50),
    new IUIImage(
      0,
      0,
      1920,
      1080,
      ResourceManager.GetImage(EImageIndex.BGText01).image,
      1920,
      1080
    ),
    new IUIImage(
      0,
      0,
      1920,
      1080,
      ResourceManager.GetImage(EImageIndex.BGText02).image,
      1920,
      1080
    ),
    new IUIImage(
      0,
      0,
      1920,
      1080,
      ResourceManager.GetImage(EImageIndex.BGText03).image,
      1920,
      1080
    ),
  ];

  imageTablePanel = [
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.PanelTotal).x,
      configScreen.GetPosition(EPositionIndex.PanelTotal).y,
      200,
      80,
      ResourceManager.GetImage(EImageIndex.BGTableTotalPanel).image,
      130,
      55
    ),
    // new IUIImage(configScreen.GetPosition(EPositionIndex.PanelTotal).x, configScreen.GetPosition(EPositionIndex.PanelTotal).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableCallPanel01).image, 308, 57),
    // new IUIImage(configScreen.GetPosition(EPositionIndex.PanelCall).x, configScreen.GetPosition(EPositionIndex.PanelCall).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableTotalPanel02).image, 308, 57),
    // new IUIImage(configScreen.GetPosition(EPositionIndex.PanelTotal).x, configScreen.GetPosition(EPositionIndex.PanelTotal).y, 308, 57, ResourceManager.GetImage(EImageIndex.BGTableCallPanel02).image, 308, 57),
  ];

  imageJackpotPanel = [
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).x,
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).y,
      308,
      57,
      imageJackpotWin[0],
      308,
      57
    ),
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).x,
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).y,
      308,
      57,
      imageJackpotWin[1],
      308,
      57
    ),
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).x,
      configScreen.GetPosition(EPositionIndex.JackpotWinPanel).y,
      308,
      57,
      imageJackpotWin[2],
      308,
      57
    ),
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.JackpotAmountPanel).x,
      configScreen.GetPosition(EPositionIndex.JackpotAmountPanel).y,
      308,
      57,
      imageJackpotAmount,
      308,
      57
    ),
  ];

  // imagesGame =
  // [
  //     //new IUIImage(configScreen.GetPosition(EPositionIndex.MyInfo).x, configScreen.GetPosition(EPositionIndex.MyInfo).y, 400, 200, imageMyInfo, 400, 200),// 위치만 일단 logo 위치로 잡아둔거임.
  //     new IUIImage(configScreen.GetPosition(EPositionIndex.DialogStandby).x, configScreen.GetPosition(EPositionIndex.DialogStandby).y, 600, 200, imageModeStandby, 600, 200),
  //     new IUIImage(configScreen.GetPosition(EPositionIndex.Jackpot).x, configScreen.GetPosition(EPositionIndex.Jackpot).y, 400, 50, imageJackpot, 400, 39)
  // ];

  //emoticonBG = new IUIImage(configScreen.GetPosition(EPositionIndex.EmoticonBG).x,configScreen.GetPosition(EPositionIndex.EmoticonBG).y, 700, 154, imageEmoticonBG, 252, 154),
  // emoticonButtons =
  // [
  //     new IUIButton(cEmoticonButtonLocations[0].x, cEmoticonButtonLocations[0].y, 80, 80, OnClickEmoticon0, imageEmoticonButtons[0], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[1].x, cEmoticonButtonLocations[1].y, 80, 80, OnClickEmoticon1, imageEmoticonButtons[1], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[2].x, cEmoticonButtonLocations[2].y, 80, 80, OnClickEmoticon2, imageEmoticonButtons[2], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[3].x, cEmoticonButtonLocations[3].y, 80, 80, OnClickEmoticon3, imageEmoticonButtons[3], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[4].x, cEmoticonButtonLocations[4].y, 80, 80, OnClickEmoticon4, imageEmoticonButtons[4], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[5].x, cEmoticonButtonLocations[5].y, 80, 80, OnClickEmoticon5, imageEmoticonButtons[5], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[6].x, cEmoticonButtonLocations[6].y, 80, 80, OnClickEmoticon6, imageEmoticonButtons[6], 156.75, 160, ""),
  //     new IUIButton(cEmoticonButtonLocations[7].x, cEmoticonButtonLocations[7].y, 80, 80, OnClickEmoticon7, imageEmoticonButtons[7], 156.75, 160, ""),
  // ];

  imagesGameDeck = [
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.CardDeck).x,
      configScreen.GetPosition(EPositionIndex.CardDeck).y,
      120,
      40,
      ResourceManager.GetImage(EImageIndex.BGTableDeck01).image,
      351,
      136
    ),
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.CardDeck).x,
      configScreen.GetPosition(EPositionIndex.CardDeck).y,
      120,
      40,
      ResourceManager.GetImage(EImageIndex.BGTableDeck02).image,
      351,
      136
    ), //blue card
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.CardDeck).x,
      configScreen.GetPosition(EPositionIndex.CardDeck).y,
      120,
      40,
      ResourceManager.GetImage(EImageIndex.BGTableDeck04).image,
      351,
      136
    ), //red card
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.CardDeck).x,
      configScreen.GetPosition(EPositionIndex.CardDeck).y,
      120,
      40,
      ResourceManager.GetImage(EImageIndex.BGTableDeck05).image,
      351,
      136
    ), //gold card
    new IUIImage(
      configScreen.GetPosition(EPositionIndex.CardDeck).x,
      configScreen.GetPosition(EPositionIndex.CardDeck).y,
      120,
      40,
      ResourceManager.GetImage(EImageIndex.BGTableDeck03).image,
      351,
      136
    ),
  ];
  let mobilesliderSizeX = IsMobile() ? 100 : 71;
  let mobilesliderSizeY = IsMobile() ? 100 : 75;
  let iFontSize = IsMobile() ? 40 : 30;
  let iSizeX = IsMobile() ? 230 : 170;
  let iSizeY = IsMobile() ? 600 : 420;
  let mobileLabelSizeX = IsMobile() ? 300 : 200;
  let mobileLabelSizeY = IsMobile() ? 100 : 50;
  // let iX = IsMobile() ? 100 : 70;
  // let iY = IsMobile() ? 100 : 100;
  sliderLabel1 = new IUIButton(
    0,
    0,
    mobileLabelSizeX,
    mobileLabelSizeY,
    "",
    RaisebarCredit,
    100,
    50,
    "0",
    "white",
    iFontSize
  );
  sliderLabel2 = new IUIButton(
    configScreen.GetPosition(EPositionIndex.MobileSliderBar).x - 70,
    configScreen.GetPosition(EPositionIndex.MobileSliderBar).y - 100,
    300,
    80,
    "",
    RaisebarCredit,
    100,
    50,
    "0",
    "yellow",
    iFontSize + 10
  );
  buttonSlider = new IUIButton(
    0,
    0,
    mobilesliderSizeX,
    mobilesliderSizeY,
    null,
    imageButtons[6],
    71,
    75,
    "",
    null,
    null,
    null,
    null,
    null,
    sliderLabel1
  );
  sliderBar = new IUISlider(
    configScreen.GetPosition(EPositionIndex.MobileSliderBar).x,
    configScreen.GetPosition(EPositionIndex.MobileSliderBar).y,
    iSizeX,
    iSizeY,
    imageSliderBar,
    170,
    420,
    buttonSlider,
    1
  );

  // Game = new IModeGame(socket, buttonsGame, imageBG, imagesGame, buttonsGameLocation, configScreen, Timer, IsMobile(), strLobbyAddress);
  Game = new IModeGame(
    socket,
    buttonsGame,
    imageBG,
    buttonsGameLocation,
    configScreen,
    Timer,
    IsMobile(),
    strLobbyAddress
  );
  GameMain = new IGameMain(Game, socket, configScreen, Timer);

  Game.SetBg(account.strOptionCode[2]);
  Game.SetDeck(account.strOptionCode[3], imagesGameDeck);
  Game.SetSliderBar(sliderBar, sliderLabel2);
  //Game.SetEmoticon(emoticonBG,emoticonButtons);
  if (IsMobile()) {
    Game.SetBettingButtons(mobilebuttonsGameBetting);
  } else {
    Game.SetBettingButtons(buttonsGameBetting);
  }
  Game.SetBetReserveButtons(buttonReserveBet);

  //Game.SetLocationButtons(buttonsGameLocation);

  Game.SetTablePanel(imageTablePanel, imageJackpotPanel);

  GameMain.JoinGame();

  await GameMain.OnIO();

  GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);
};

let MainLoop = setInterval(Loop, 16);

var canvasPosition = {
  x: canvas.offset().left,
  y: canvas.offset().top,
};

if (IsMobile()) {
  document.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length === 1) {
        var touch = {
          x: e.touches[0].clientX - canvasPosition.x,
          y: e.touches[0].clientY - canvasPosition.y + window.pageYOffset,
        };
        if (bInit == true) GameMain.OnTouchStart(touch);
      }
    },
    false
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches.length === 1) {
        var touch = {
          x: e.touches[0].clientX - canvasPosition.x,
          y: e.touches[0].clientY - canvasPosition.y + window.pageYOffset,
        };
        if (bInit == true) GameMain.OnTouchMove(touch);
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    function (e) {
      if (e.changedTouches.length === 1) {
        var touch = {
          x: e.changedTouches[0].clientX - canvasPosition.x,
          y:
            e.changedTouches[0].clientY - canvasPosition.y + window.pageYOffset,
        };
        if (bInit == true) GameMain.OnTouchEnd(touch);
      }
    },
    false
  );
} else {
  //canvas.on('mousemove', function(e) {
  $(document).on("mousemove", "#stage", (e) => {
    var mouse = {
      x: e.clientX - canvasPosition.x,
      y: e.clientY - canvasPosition.y + window.pageYOffset,
    };

    if (bInit == true) GameMain.OnMouseMove(mouse);
  });
}
$(document).on("click", "#stage", (e) => {
  var mouse = {
    x: e.clientX - canvasPosition.x,
    y: e.clientY - canvasPosition.y + window.pageYOffset,
  };
  if (bInit == true) GameMain.OnClick(mouse);
});

//canvas.on('mousedown', function(e) {
$(document).on("mousedown", "#stage", (e) => {
  var mouse = {
    x: e.clientX - canvasPosition.x,
    y: e.clientY - canvasPosition.y + window.pageYOffset,
  };
  if (bInit == true) GameMain.OnMouseDown(mouse);
});

//canvas.on('mouseup', function(e) {
$(document).on("mouseup", "#stage", (e) => {
  var mouse = {
    x: e.clientX - canvasPosition.x,
    y: e.clientY - canvasPosition.y + window.pageYOffset,
  };
  // var mouse = {
  //     x: e.pageX - canvasPosition.x,
  //     y: e.pageY - canvasPosition.y
  // }
  if (bInit == true) GameMain.OnMouseUp(mouse);
});
$(document).on("mouseleave", "#stage", (e) => {
  // 여기에 웹 페이지를 벗어났을 때 실행할 로직을 구현
  if (bInit == true) {
    // 카드 상태를 초기화하는 등의 로직을 여기에 추가
    GameMain.OnMouseLeave();
  }
});

function OnSize(e) {
  console.log(123123123, { account });

  if (account === null) {
    console.log(document.getElementById("accountData"));
    account = JSON.parse(document.getElementById("accountData").value);
  }
  cScreenWidth = window.innerWidth;
  cScreenHeight = window.innerHeight;

  //UpdateLocation();
  configScreen.OnSize(cScreenWidth, cScreenHeight);

  //console.log(configScreen);

  //console.log(`OnSize width : ${cScreenWidth}, height : ${cScreenHeight}`);

  if (GameMain != null)
    GameMain.OnSize(configScreen.m_fWidthRate, configScreen.m_fHeightRate);

  canvas = $(
    '<canvas width ="' +
      cScreenWidth +
      '" height="' +
      cScreenHeight +
      '"></canvas>'
  );
  ctx = canvas.get(0).getContext("2d");
  $("#stage").empty();

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

  $("#stage").append(tag);
  $("#stage").append(tag2);
  $("#stage").append(tag3);
  $("#stage").append(tag4);
  // $('#stage').append(tag5);
  // $('#stage').append(tag6);

  $("#popup_setting").hide();
  $("#popup_message").hide();
  $("#popup_yesorno").hide();
  // $('#mainMenu').hide();
  // $('#Stage_Text').hide();
  // $('#Rebuy_Text').hide();

  let iRebuyIn = account.strOptionCode[0];
  let iRebuyInLevel = account.strOptionCode[1];
  let iBgLevel = account.strOptionCode[2];
  let iCardDeck = account.strOptionCode[3];
  // 음악 볼륨 및 효과음 볼륨 설정 값 로드
  let musicVolume = parseInt(account.strOptionCode.substring(4, 6));
  let soundVolume = parseInt(account.strOptionCode.substring(6, 8));

  // "99"를 100%로 변환
  musicVolume = musicVolume == 99 ? 100 : musicVolume;
  soundVolume = soundVolume == 99 ? 100 : soundVolume;

  if (iRebuyIn == 0) {
    $("#rebuyinAuto").removeClass("on").addClass("off").find("div").text("OFF");
  } else {
    $("#rebuyinAuto").removeClass("off").addClass("on").find("div").text("ON");
  }

  if (iBgLevel == 0) {
    $("#selectBg0").prop("checked", true);
    $("#selectBg1").prop("checked", false);
  } else {
    $("#selectBg0").prop("checked", false);
    $("#selectBg1").prop("checked", true);
  }

  $("#selectRebuyIn").text(parseInt(iRebuyInLevel) * 100 + "%");

  // 음악 및 효과음 볼륨 설정 업데이트
  $(".melody .percent").text(musicVolume + "%");
  $(".sound .percent").text(soundVolume + "%");

  // 음악 및 효과음 볼륨에 따른 표시기(indicator) 위치 업데이트
  // 이 부분은 프로젝트의 구체적인 UI 요소에 따라 다를 수 있으므로, 필요에 따라 수정
  $(".melody .indicator").css("left", musicVolume + "%");
  $(".sound .indicator").css("left", soundVolume + "%");

  $(canvas).appendTo("#stage");

  canvasPosition = {
    x: canvas.offset().left,
    y: canvas.offset().top,
  };
}

OnSize();

let previousWidth = window.innerWidth;
let previousHeight = window.innerHeight;

const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
if (isIOS) {
  window.addEventListener("resize", OnSize, false);
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
} else {
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    if (
      window.innerWidth !== previousWidth ||
      window.innerHeight !== previousHeight
    ) {
      // Window size actually changed

      // Check if the device has been rotated
      if (
        (previousWidth > previousHeight &&
          window.innerHeight > window.innerWidth) ||
        (previousWidth < previousHeight &&
          window.innerHeight < window.innerWidth)
      ) {
        // The device has been rotated
        console.log("장치가 회전되었습니다.");
        OnSize();
      } else {
        // The device has not been rotated, check for keyboard
        if (window.innerHeight < previousHeight * 0.4) {
          console.log("키보드가 나타났습니다.");
          // 키보드가 나타났을 때 수행하려는 동작을 여기에 작성
        } else {
          console.log("키보드가 사라졌습니다.");
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
