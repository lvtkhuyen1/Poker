function zeroPad(nr,base){
    var  len = (String(base).length - String(nr).length)+1;
    return len > 0? new Array(len).join('0')+nr : nr;
}

//  Logo
var imageLogo = new Image();
imageLogo.onload = ()=> {
}
imageLogo.src = "images/logo_main.png"; //  305 x 114

// progressbar
// var imageProgressBar = [];
// for ( var i = 0; i < 3; ++i)
// {
//     imageProgressBar.push(new Image());
//     imageProgressBar[i].src = `img/progressbar${zeroPad(i, 2)}.png`;  //  200 X 34
// }

var NumberImages = [];
for ( var i = 0; i < 11; ++i)
{
    NumberImages.push(new Image());
    NumberImages[i].src = `img/numbers/n01${zeroPad(i, 10)}.png`;
}

var NumberImages3 = [];
for ( var i = 0; i < 11; ++i)
{
    NumberImages3.push(new Image());
    NumberImages3[i].src = `img/numbers/n03${zeroPad(i, 10)}.png`;
}

var NumberImages4 = [];
for ( var i = 0; i < 11; ++i)
{
    NumberImages4.push(new Image());
    NumberImages4[i].src = `img/numbers/n04${zeroPad(i, 10)}.png`;
}

var NumberImages5 = [];
for ( var i = 0; i < 11; ++i)
{
    NumberImages5.push(new Image());
    NumberImages5[i].src = `img/numbers/n05${zeroPad(i, 10)}.png`;
}

var NumberImages0 = [];
for ( var i = 0; i < 11; ++i)
{
    NumberImages0.push(new Image());
    NumberImages0[i].src = `img/numbers/n00${zeroPad(i, 10)}.png`;
}

var imageBetButtons = [];
for ( var i = 0; i < 6; ++i)
{
    imageBetButtons.push(new Image());
    imageBetButtons[i].src = `img/game/button_bet${zeroPad(i, 2)}.png`;
}

var imageButtons = [];
for ( var i = 0; i < 9; ++i)
{
    imageButtons.push(new Image());
    imageButtons[i].src = `img/game/button_${zeroPad(i, 2)}.png`;
}

// var imageModeStandby = new Image();
// imageModeStandby.onload = ()=> {
// }
// imageModeStandby.src = "img/modestandby.png"; //  200 x 6

// var imageModeStandbyDot = new Image();
// imageModeStandbyDot.onload = ()=> {
// }
// imageModeStandbyDot.src = "img/modestandbydot.png";

//  Chips
var imageChips = [];
for ( var i = 0; i < 13; ++i)
{
    imageChips.push(new Image());
    imageChips[i].src = `img/chip/chip${zeroPad(i, 2)}.png`;

    //console.log(`img/chip/chip${zeroPad(i, 2)}.png`);
}

var imageMyInfo = new Image();
imageMyInfo.onload = ()=> {
}
imageMyInfo.src = "img/myinfo.png"; //  300 x 100

// //  My Character
// var imageUserAvatarBase = new Image();
// imageUserAvatarBase.onload = ()=> {
// }
// imageUserAvatarBase.src = "img/useravatarbase.png"; //  245 x 245

// var imageUserAvatarPanel = new Image();
// imageUserAvatarPanel.onload = ()=> {
// }
// imageUserAvatarPanel.src = "img/useravatarpanel.png"; //  269 x 269

// var imageUserAvatarTimeline = new Image();
// imageUserAvatarTimeline.onload = ()=> {
// }
// imageUserAvatarTimeline.src = "img/useravatartimeline.png"; //  303 x 303

// var imageUserBasePanel = new Image();
// imageUserBasePanel.onload = ()=> {
// }
// imageUserBasePanel.src = "img/userbasepanel.png"; //  235 x 100

var imageUserPanel = new Image();
imageUserPanel.onload = ()=> {
}
imageUserPanel.src = "img/userpanel.png"; //  357 x 55

//  Other Character
var imageOtherAvatarBase = new Image();
imageOtherAvatarBase.onload = ()=> {
}
imageOtherAvatarBase.src = "img/otheravatarbase.png"; //  160 x 160

var imageOtherAvatarPanel = new Image();
imageOtherAvatarPanel.onload = ()=> {
}
imageOtherAvatarPanel.src = "img/otheravatarpanel.png"; //  172 x 172

var imageOtherAvatarTimeline = new Image();
imageOtherAvatarTimeline.onload = ()=> {
}
imageOtherAvatarTimeline.src = "img/otheravatartimeline.png"; //  186 x 186

var imageOtherAvatarProgress = new Image();
imageOtherAvatarProgress.onload = ()=> {
}
imageOtherAvatarProgress.src = "img/otheravatarprogress.png"; //  248 x 109

var imageOtherBasePanel = new Image();
imageOtherBasePanel.onload = ()=> {
}
imageOtherBasePanel.src = "img/otherbasepanel.png"; //  241 x 102

var imageOtherfold = new Image();
imageOtherfold.onload = ()=> {
}
imageOtherfold.src = "img/otheravatarfold.png"; //  172 x 171

// //  Logo
// var imageLogo = new Image();
// imageLogo.onload = ()=> {
// }
// imageLogo.src = "images/logo_main.png"; //  305 x 114


//  Player Type
var imagePlayerType = new Image();
imagePlayerType.onload = ()=> {
}
imagePlayerType.src = "img/playertype00.png";

//  Player Ready
var imagePlayerReady = new Image();
imagePlayerReady.onload = ()=> {
}
imagePlayerReady.src = "img/playerready.png";

//  Player Start
var imagePlayerStart = new Image();
imagePlayerStart.onload = ()=> {
}
imagePlayerStart.src = "img/playerstart.png";

//  Card Panel
var imageBettings = [];
for ( var i = 0; i < 4; ++i)
{
    imageBettings.push(new Image());
    imageBettings[i].src = `img/betting${zeroPad(i, 10)}.png`;  //  188 x 50
}

//winner
var imageWinner = new Image();
imageWinner.onload = ()=> {
}
imageWinner.src = "img/winner.png"; //  305 x 114

//winner wing
var imageWinnerWing = new Image();
imageWinnerWing.onload = ()=> {
}
imageWinnerWing.src = "img/winnerwing.png";

//win ceremony
var imageWinCeremony = new Image();
imageWinCeremony.onload = ()=> {
}
imageWinCeremony.src = "img/winceremony.png"; 

//ranking
var imageRank = [];
for ( var i = 0; i < 4; ++i)
{
    imageRank.push(new Image());
    imageRank[i].src = `img/rank${zeroPad(i, 2)}.png`;  //  200 X 34
}

//  Card Images
var imageCards = [];
for ( var i = 0; i < 54; ++i)
{
    imageCards.push(new Image());
    imageCards[i].src = `img/cards/card${zeroPad(i, 10)}.png`;  
}

var imageCardFrames = [];
for ( var i = 0; i < 2; ++i)
{
    imageCardFrames.push(new Image());
    imageCardFrames[i].src = `img/cards/cardframe${zeroPad(i, 10)}.png`;  //  163 x 227
}

// var imagePokerHand = [];
// for ( var i = 0; i < 9; ++i)
// {
//     imagePokerHand.push(new Image());
//     imagePokerHand[i].src = `img/hand${zeroPad(i, 10)}.png`;  //  452 x 74
// }

var imageAvatar = [];
for ( var i = 0; i < 14; ++i)
{
    imageAvatar.push(new Image());
    imageAvatar[i].src = `img/avatars/avatar${zeroPad(i, 10)}.png`;  //  452 x 74
}

var imageExitReserve = new Image();
imageExitReserve.onload = ()=> {
}
imageExitReserve.src = "img/exitreserve.png"; 

var imagePrizeBlue = new Image();
imagePrizeBlue.onload = ()=> {
}
imagePrizeBlue.src = "img/prize_blue.gif";

var imagePrizeRed = new Image();
imagePrizeRed.onload = ()=> {
}
imagePrizeRed.src = "img/prize_red.gif";

var imageChat = new Image();
imageChat.onload = ()=> {
}
imageChat.src = "img/chat.png";

var imageGamelog = new Image();
imageGamelog.onload = ()=> {
}
imageGamelog.src = "img/gamelog.png";

var imageGameLose = new Image();
imageGameLose.onload = ()=> {
}
imageGameLose.src = "img/gamelose.png";

var imageGameWin = new Image();
imageGameWin.onload = ()=> {
}
imageGameWin.src = "img/gamewin.png";

var imageEmoticonButton = new Image();
imageEmoticonButton.onload = ()=> {
}
imageEmoticonButton.src = "img/emoticon/emoticon.png";

var imageEmoticonBG = new Image();
imageEmoticonBG.onload = ()=> {
}
imageEmoticonBG.src = "img/emoticon/emoticonbg.png";

var imageEmoticon = [];
for ( var i = 0; i < 8; ++i)
{
    imageEmoticon.push(new Image());
    imageEmoticon[i].src = `img/emoticon/emoticon${zeroPad(i, 10)}.png`; 
}

var imageEmoticonButtons = [];
for ( var i = 0; i < 8; ++i)
{
    imageEmoticonButtons.push(new Image());
    imageEmoticonButtons[i].src = `img/emoticon/emoticonButton${zeroPad(i, 10)}.png`; 
}

var landscapeImg = new Image();
landscapeImg.onload = ()=> {
}
landscapeImg.src = "img/game/landscape.png";

var verticalImg = new Image();
verticalImg.onload = ()=> {
}
verticalImg.src = "img/game/vertical.png";

var AndroidlandscapeImg = new Image();
AndroidlandscapeImg.onload = ()=> {
}
AndroidlandscapeImg.src = "img/game/android_landscape.png";

var AndroidverticalImg = new Image();
AndroidverticalImg.onload = ()=> {
}
AndroidverticalImg.src = "img/game/adroid_vertical.png";

let soundPlaceCard = new Audio('sounds/placecard.mp3');

let soundGameStart = new Audio('sounds/gamestart.mp3');
let soundGameEnd = new Audio('sounds/gameend.mp3');
let soundGameWin = new Audio('sounds/gamewin.mp3');
let soundPlaceUser = new Audio('sounds/placeuser.mp3');
let soundLeaveUser = new Audio('sounds/leaveuser.mp3');

let soundClick = new Audio('sounds/click.mp3');
let soundEnableBetting = new Audio('sounds/enablebetting.mp3');
let soundEnableStartGame = new Audio('sounds/enablestartgame.mp3');

let soundChipThrow = new Audio('sounds/chipthrow.mp3');

let soundPass = new Audio('sounds/pass.mp3');
let soundBGM = new Audio('sounds/bgm.mp3');