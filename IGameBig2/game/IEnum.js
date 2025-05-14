const EnumGameMode = Object.freeze({
    "Standby":0, 
    "Start":1,
    "HandCard":2,
    "BuildPlayerType":3,
    "SubmitCard":4,
    "Result":5,
    "PrizeResult":6
    // "Plob":4, 
    // "BettingFlop":5, 
    // "Turn":6, 
    // "BettingTurn":7, "River":8, "RiverBetting":9, "Result":10, "Celebration":11
});
module.exports.EGameMode = EnumGameMode;

// DefaultAnte,
// BettingPreFlop,
// Plob,
// BettingFlop,
// Turn,
// BettingTurn,
// River,
// BettingRever,


const EnumGameTime = Object.freeze({
    "Start":1, 
    "BuildPlayerType":1,
    "HandCard":4,
    "MyTurn":1,
    "Result":4,
    "PrizeResult":4
});
module.exports.EGameTime = EnumGameTime;

const EnumDBType = Object.freeze({
    "Users":0, 
    "RecordBets":1,
    "RecodrdGames":2,
});
module.exports.EDBType = EnumDBType;

const EnumUserDBType = Object.freeze({
    "UpdateCash":0, 
    "UpdateRolling":1
});
module.exports.EUserDBType = EnumUserDBType;

const EnumRecordResultDBType = Object.freeze({
    "Create":0, 
    "PrizeCreate":1
});
module.exports.ERecordResultBType = EnumRecordResultDBType;