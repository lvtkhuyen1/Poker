const EnumGameMode = Object.freeze({
    "Standby":0, 
    "Start":1,
    "BuildPlayerType":2,
    "DefaultAnteSB":3, 
    "DefaultAnteBB":4,
    "HandCard":5,
    "BettingPreFlop":6,
    "Flop":7,
    "BettingFlop":8,
    "Turn":9,
    "BettingTurn":10,
    "River":11,
    "BettingRiver":12,
    "Result":13,
    "PrizeResult":14,
    //"Reset":15,
//    "RebuyIn":14,
});
module.exports.EGameMode = EnumGameMode;

const EnumGameTime = Object.freeze({
    "Start":3, 
    "BuildPlayerType":1.5,
    "DefaultAnteSB":0.5,
    "DefaultAnteBB":0.5,
    "HandCard":2,
    "Flop":3,
    "Turn":3,
    "River":3,
    "Result":4,
    "PrizeResult":4,
//    "RebuyIn":3,
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

const EnumRecordBetDBType = Object.freeze({
    "Create":0, 
    "Update":1
});
module.exports.ERecordBetDBType = EnumRecordBetDBType;

const EnumRecordResultDBType = Object.freeze({
    "Create":0, 
    "PrizeCreate":1
});
module.exports.ERecordResultBType = EnumRecordResultDBType;