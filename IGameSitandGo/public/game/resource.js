// let reader = new FileReader();
// const urlfile = 'http://192.168.1.10:5555/resource.ini';
// var xhr = new XMLHttpRequest();
// xhr.open("GET", urlfile, true);
// xhr.responseType = "blob";
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         var fileBlob = xhr.response;
//         reader.readAsText(fileBlob);
//         reader.onload = (event) => {

//             const str = event.target.result;
//             const array = str.split('\r\n');
//             for ( let i in array )
//             {
//                 console.log(`${i}, ${array[i]}~)`);
//             }
//         }
//     }
// };
// xhr.send();

function zeroPad(nr, base) {
  var len = String(base).length - String(nr).length + 1;
  return len > 0 ? new Array(len).join("0") + nr : nr;
}

//  Logo
var imageLogo = new Image();
imageLogo.onload = () => {};
imageLogo.src = "images/logo_main.png"; //  305 x 114

// progressbar
var imageProgressBar = [];
for (var i = 0; i < 3; ++i) {
  imageProgressBar.push(new Image());
  imageProgressBar[i].src = `img/control/progressbar${zeroPad(i, 2)}.png`; //  200 X 34
}

// arrow
var imageArrow = new Image();
imageArrow.onload = () => {};
imageArrow.src = "img/game/arrow.png";

// showdown
var imageShowdownBg = new Image();
imageShowdownBg.onload = () => {};
imageShowdownBg.src = "img/showdownbg.png";

var imageShowdown = new Image();
imageShowdown.onload = () => {};
imageShowdown.src = "img/showdown.png";

var imageShowdownBgMobile = new Image();
imageShowdownBgMobile.onload = () => {};
imageShowdownBgMobile.src = "img/showdownbg_mobile.png";

var imageShowdownMobile = new Image();
imageShowdownMobile.onload = () => {};
imageShowdownMobile.src = "img/showdown_mobile.png";

var NumberImages = [];
for (var i = 0; i < 11; ++i) {
  NumberImages.push(new Image());
  NumberImages[i].src = `img/numbers/n01${zeroPad(i, 10)}.png`;
}

var NumberImages3 = [];
for (var i = 0; i < 11; ++i) {
  NumberImages3.push(new Image());
  NumberImages3[i].src = `img/numbers/n03${zeroPad(i, 10)}.png`;
}

var NumberImages4 = [];
for (var i = 0; i < 11; ++i) {
  NumberImages4.push(new Image());
  NumberImages4[i].src = `img/numbers/n04${zeroPad(i, 10)}.png`;
}

var NumberImages5 = [];
for (var i = 0; i < 11; ++i) {
  NumberImages5.push(new Image());
  NumberImages5[i].src = `img/numbers/n05${zeroPad(i, 10)}.png`;
}

var NumberImages0 = [];
for (var i = 0; i < 11; ++i) {
  NumberImages0.push(new Image());
  NumberImages0[i].src = `img/numbers/n00${zeroPad(i, 10)}.png`;
}
// var ButtonImages = [];
// for ( var i = 0; i < 2; ++i)
// {
//     ButtonImages.push(new Image());
//     ButtonImages[i].src = `img/button${i.toString()}.png`;
// }

// var SliderImages = [];
// for ( i = 0; i < 1; ++ i )
// {
//     SliderImages.push(new Image());
//     SliderImages[i].src = `img/slider${i.toString()}.png`;
// }

// //  Lobby
// var imageLobbyBG = new Image();
//     imageLobbyBG.onload = ()=> {
// }
// imageLobbyBG.src = "img/lobby/bg.png";

// //  BG
// var imageGameBG = [];
// for ( var i = 0; i < 4; ++i)
// {
//     imageGameBG.push(new Image());
//     imageGameBG[i].src = `img/game/bg0${i.toString()}.png`;
// }
// // bgtext00~03 9 person, bgtext04~07 6 person
// var imageTextBG = [];
// for ( var i = 0; i < 4; ++i)
// {
//     imageTextBG.push(new Image());
//     imageTextBG[i].src = `img/game/bgtext0${i.toString()}.png`;
// }

//card deck
// var imageGameDeck = [];
// for ( var i = 0; i < 4; ++i)
// {
//     imageGameDeck.push(new Image());
//     imageGameDeck[i].src = `img/game/deck0${i.toString()}.png`;
// }

// var imageLobbyRoomBar = new Image();
// imageLobbyRoomBar.onload = ()=> {
// }
// imageLobbyRoomBar.src = "img/lobby/roombar.png"; //  1533 x 102

var imageBetButtons = [];
for (var i = 0; i < 6; ++i) {
  imageBetButtons.push(new Image());
  imageBetButtons[i].src = `img/control/button_bet${zeroPad(i, 2)}.png`;
}

var imageButtons = [];
for (var i = 0; i < 10; ++i) {
  imageButtons.push(new Image());
  imageButtons[i].src = `img/control/button_${zeroPad(i, 2)}.png`;
}

// var imageSliderButton = new Image();
// imageSliderButton.onload = ()=> {
// }
// imageSliderButton.src = "img/sliderbutton.png"; //  200 x 50

// var imageSlider = new Image();
// imageSlider.onload = ()=> {
// }
// imageSlider.src = "img/slider.png"; //  200 x 6

// var imageSliderMobile = new Image();
// imageSliderMobile.onload = ()=> {
// }
// imageSliderMobile.src = "img/slider_mobile.png"; //  200 x 6

var imageModeStandby = new Image();
imageModeStandby.onload = () => {};
imageModeStandby.src = "img/modestandby.png"; //  200 x 6

var imageModeStandbyDot = new Image();
imageModeStandbyDot.onload = () => {};
imageModeStandbyDot.src = "img/modestandbydot.png";

var cardOpenButton = new Image();
cardOpenButton.onload = () => {};
cardOpenButton.src = "img/cardopen.png"; //  400 x 45

//  Chips
var imageChips = [];
for (var i = 0; i < 13; ++i) {
  imageChips.push(new Image());
  imageChips[i].src = `img/chip/chip${zeroPad(i, 2)}.png`;

  //console.log(`img/chip/chip${zeroPad(i, 2)}.png`);
}

// //  Total
// var imageTableTotalPanel = [];
// for ( var i = 0; i < 2; ++i)
// {
//     imageTableTotalPanel.push(new Image());
//     imageTableTotalPanel[i].src = `img/tabletotalpanel${zeroPad(i, 10)}.png`; //  308 x 57
// }

// //  Call
// var imageTableCallPanel = [];
// for ( var i = 0; i < 2; ++i)
// {
//     imageTableCallPanel.push(new Image());
//     imageTableCallPanel[i].src = `img/tablecallpanel${zeroPad(i, 10)}.png`; //  308 x 57
// }

var imageMyInfo = new Image();
imageMyInfo.onload = () => {};
imageMyInfo.src = "img/myinfo.png"; //  300 x 100

var imageUserPanel = new Image();
imageUserPanel.onload = () => {};
imageUserPanel.src = "img/userpanel.png"; //  357 x 55

//  Other Character
var imageOtherAvatarBase = new Image();
imageOtherAvatarBase.onload = () => {};
imageOtherAvatarBase.src = "img/otheravatarbase.png"; //  160 x 160

var imageOtherAvatarPanel = new Image();
imageOtherAvatarPanel.onload = () => {};
imageOtherAvatarPanel.src = "img/otheravatarpanel.png"; //  172 x 172

var imageOtherAvatarTimeline = new Image();
imageOtherAvatarTimeline.onload = () => {};
imageOtherAvatarTimeline.src = "img/otheravatartimeline.png"; //  186 x 186

var imageOtherBasePanel = new Image();
imageOtherBasePanel.onload = () => {};
imageOtherBasePanel.src = "img/otherbasepanel.png"; //  241 x 102

var imageOtherfold = new Image();
imageOtherfold.onload = () => {};
imageOtherfold.src = "img/otheravatarfold.png"; //  172 x 171

var imageOtherlose = new Image();
imageOtherlose.onload = () => {};
imageOtherlose.src = "img/otheravatarlose.png"; //  172 x 171

var imageRaiseText = new Image();
imageRaiseText.onload = () => {};
imageRaiseText.src = "img/raisebarcredit.png";

// //  Logo
// var imageLogo = new Image();
// imageLogo.onload = ()=> {
// }
// imageLogo.src = "images/logo_main.png"; //  305 x 114

//  Player Type
var imagePlayerType = [];
for (var i = 0; i < 3; ++i) {
  imagePlayerType.push(new Image());
  imagePlayerType[i].src = `img/playertype${zeroPad(i, 10)}.png`; //  74 x 78
}

//  Card Panel
var imageBettings = [];
for (var i = 0; i < 8; ++i) {
  imageBettings.push(new Image());
  imageBettings[i].src = `img/betting${zeroPad(i, 10)}.png`; //  188 x 50
}

//winner
var imageWinner = new Image();
imageWinner.onload = () => {};
imageWinner.src = "img/winner.png"; //  305 x 114

//winner wing
var imageWinnerWing = new Image();
imageWinnerWing.onload = () => {};
imageWinnerWing.src = "img/winnerwing.png";

//win ceremony
var imageWinCeremony = new Image();
imageWinCeremony.onload = () => {};
imageWinCeremony.src = "img/winceremony.png";

//win result made card
var imageWinMadePanel = new Image();
imageWinMadePanel.onload = () => {};
imageWinMadePanel.src = "img/winmadepanel.png";

//AbstentionWin
var imageAbstentionWin = new Image();
imageAbstentionWin.onload = () => {};
imageAbstentionWin.src = "img/AbstentionWin.png";

//  Card Images
var imageCards = [];
for (var i = 0; i < 55; ++i) {
  imageCards.push(new Image());
  imageCards[i].src = `img/cards/card${zeroPad(i, 10)}.png`; //  163 x 227
}

var imageCardFrames = [];
for (var i = 0; i < 2; ++i) {
  imageCardFrames.push(new Image());
  imageCardFrames[i].src = `img/cards/cardframe${zeroPad(i, 10)}.png`; //  163 x 227
}

var imageHighNum = [];
for (var i = 0; i < 13; ++i) {
  imageHighNum.push(new Image());
  imageHighNum[i].src = `img/madetype/high${zeroPad(i, 10)}.png`; //  452 x 74
}

var imageComma = new Image();
imageComma.onload = () => {};
imageComma.src = "img/madetype/comma.png";

var imagePokerHand = [];
for (var i = 0; i < 11; ++i) {
  imagePokerHand.push(new Image());
  imagePokerHand[i].src = `img/madetype/hand${zeroPad(i, 10)}.png`; //  452 x 74
}
var imagePokerHigh = [];
for (var i = 0; i < 13; ++i) {
  imagePokerHigh.push(new Image());
  imagePokerHigh[i].src = `img/madetype/high${zeroPad(i, 10)}.png`; //  452 x 74
}

var imageExitReserve = new Image();
imageExitReserve.onload = () => {};
imageExitReserve.src = "img/exitreserve.png";

var imageCardOpen = new Image();
imageCardOpen.onload = () => {};
imageCardOpen.src = "img/cards/cardopen.png";

var imageCardOpen1 = new Image();
imageCardOpen1.onload = () => {};
imageCardOpen1.src = "img/cards/cardopen1.png";

var imageCardOpen2 = new Image();
imageCardOpen2.onload = () => {};
imageCardOpen2.src = "img/cards/cardopen2.png";

var imageCardOpen3 = new Image();
imageCardOpen3.onload = () => {};
imageCardOpen3.src = "img/cards/cardopen3.png";

var imageGameLose = new Image();
imageGameLose.onload = () => {};
imageGameLose.src = "img/gamelose.png";

var imageGameLoseMobile = new Image();
imageGameLoseMobile.onload = () => {};
imageGameLoseMobile.src = "img/gamelose_mobile.png";

var imageGameWin = new Image();
imageGameWin.onload = () => {};
imageGameWin.src = "img/gamewin.png";

var imageGameWinMobile = new Image();
imageGameWinMobile.onload = () => {};
imageGameWinMobile.src = "img/gamewin_mobile.png";

// var imagePokerHand = [];
// for ( var i = 0; i < 9; ++i)
// {
//     imagePokerHand.push(new Image());
//     imagePokerHand[i].src = `img/hand${zeroPad(i, 10)}.png`;  //  452 x 74
// }

var imageAvatar = [];
for (var i = 0; i < 41; ++i) {
  imageAvatar.push(new Image());
  imageAvatar[i].src = `img/avatars/avatar${zeroPad(i, 10)}.png`; //  452 x 74
}

var imageBlindUp = new Image();
imageBlindUp.onload = () => {};
imageBlindUp.src = "img/blindup.png";

var imagePrizeBlue = new Image();
imagePrizeBlue.onload = () => {};
imagePrizeBlue.src = "img/prize_blue.gif";

var imagePrizeRed = new Image();
imagePrizeRed.onload = () => {};
imagePrizeRed.src = "img/prize_red.gif";

var imageGamelog = new Image();
imageGamelog.onload = () => {};
imageGamelog.src = "img/gamelog.png";

var imageEmoticonButton = new Image();
imageEmoticonButton.onload = () => {};
imageEmoticonButton.src = "img/emoticon/emoticon.png";

var imageEmoticonBG = new Image();
imageEmoticonBG.onload = () => {};
imageEmoticonBG.src = "img/emoticon/emoticonbg.png";

var imageEmoticon = [];
for (var i = 0; i < 8; ++i) {
  imageEmoticon.push(new Image());
  imageEmoticon[i].src = `img/emoticon/emoticon${zeroPad(i, 10)}.png`;
}

var imageEmoticonButtons = [];
for (var i = 0; i < 8; ++i) {
  imageEmoticonButtons.push(new Image());
  imageEmoticonButtons[i].src = `img/emoticon/emoticonButton${zeroPad(
    i,
    10
  )}.png`;
}

var landscapeImg = new Image();
landscapeImg.onload = () => {};
landscapeImg.src = "img/game/landscape.png";

var verticalImg = new Image();
verticalImg.onload = () => {};
verticalImg.src = "img/game/vertical.png";

var AndroidlandscapeImg = new Image();
AndroidlandscapeImg.onload = () => {};
AndroidlandscapeImg.src = "img/game/android_landscape.png";

var AndroidverticalImg = new Image();
AndroidverticalImg.onload = () => {};
AndroidverticalImg.src = "img/game/adroid_vertical.png";

var imageSliderBg = new Image();
imageSliderBg.onload = () => {};
imageSliderBg.src = "img/control/sliderbg.png";

var imageSliderBar = new Image();
imageSliderBar.onload = () => {};
imageSliderBar.src = "img/control/slider.png";

var RaisebarCredit = new Image();
RaisebarCredit.onload = () => {};
RaisebarCredit.src = "img/control/raisebarcredit.png";

var RaiseActive = new Image();
RaiseActive.onload = () => {};
RaiseActive.src = "img/control/raiseactive.png";

let soundPlaceCard = new Audio("sounds/placecard.mp3");

let soundBettingType = [];
for (var i = 0; i < 8; ++i) {
  soundBettingType.push(new Audio(`sounds/betting0${i}.mp3`));
}

let soundGameStart = new Audio("sounds/gamestart.mp3");
let soundGameEnd = new Audio("sounds/gameend.mp3");
let soundGameWin = new Audio("sounds/gamewin.mp3");
let soundPlaceUser = new Audio("sounds/placeuser.mp3");
let soundLeaveUser = new Audio("sounds/leaveuser.mp3");

let soundClick = new Audio("sounds/click.mp3");
let soundEnableBetting = new Audio("sounds/enablebetting.mp3");
let soundEnableStartGame = new Audio("sounds/enablestartgame.mp3");

let soundChipThrow = new Audio("sounds/chipthrow.mp3");
let soundShowDown = new Audio("sounds/showdown.mp3");
let soundHertBeat = new Audio("sounds/hertbeat.mp3");

let soundcardflop = new Audio("sounds/cardflop.mp3");
let soundcardturn = new Audio("sounds/cardturn.mp3");
let soundcardriver = new Audio("sounds/cardriver.mp3");
