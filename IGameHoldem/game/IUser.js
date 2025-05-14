class IUser
{
    constructor(socket)
    {
        this.socket = socket;

        this.bSpectator = false;
        this.strID = "";
        this.strNickname = "";
        this.lUnique = -1;
        this.iCash = 0;
        this.iCoin = 0;
        this.iLocation = -1;
        this.eUserType = '';
        this.iTotalBettingCoin = 0;
        this.iBettingCoin = 0;
        this.iStartCoin = 0;
        this.iStartCash = 0;
        this.strPlayerType = '';
        this.strLastBettingAction = '';
        this.listHandCard = [];
        this.strHand = '';
        this.iWinCoin = 0;
        this.iRank = 9;
        this.iRealBettingCoin = 0;
        this.strDescr = '';
        this.bMenualRebuyin = false;
        this.bRejoin = false;
        this.bEnable = false;
        this.bConnection = true;
        this.objectHand = null;
        this.bReserveBet = false;
        this.bReserveExit = false;

        this.eStage = 'STANDBY';
        this.iAvatar = 0;
        this.strOptionCode = 0;
        this.strGroupID = 0;
        this.iClass = 0;
    }
}
module.exports = IUser;