class IUser
{
    constructor(socket)
    {
        this.socket = socket;

        this.bSpectator = false;
        this.strID = "";
        this.strNickname = "";
        this.lUnique = -1;
        this.iBlind = 0;
        this.iCash = 0;
        this.iCoin = 0;
        this.iLocation = -1;
        this.eUserType = '';
        this.iTotalBettingCoin = 0;
        this.iBettingCoin = 0;
        this.iStartCoin = 0;
        this.strPlayerType = '';
        this.strLastBettingAction = '';
        this.listHandCard = [];
        this.listTipCard = [];
        // this.strHand = '';
        this.iWinCoin = 0;
        this.iRank = 4;
        this.iScore = 0;
        // this.iRealBettingCoin = 0;
        this.strDescr = '';
        this.bRejoin = false;
        this.bEnable = false;
        this.bConnection = true;
        this.bReady = false;
        // this.bStart = false; 
        this.bShowReady = false;
        this.bShowStart = false;
        this.bBig2Play = false;
        // this.objectHand = null;
        // this.bReserveBet = false;
        // this.bReserveExit = false;
        this.bFold = false;

        this.eStage = 'STANDBY';
        this.iAvatar = 0;
        this.strOptionCode = 0;
        this.strGroupID = 0;
        this.iClass = 0;
    }
}
module.exports = IUser;