const EnumGameMode = Object.freeze({
    "Standby":0, 
    "Start":1,
    "BuildPlayerType":2,
    "DefaultAnte":3, 
    "HandCard":4,
    "BettingPreFlop":5,
    "Flop":6,
    "BettingFlop":7,
    "Turn":8,
    "BettingTurn":9,
    "River":10,
    "BettingRiver":11,
    "Result":12,
    "RebuyIn":13,
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
    "BuildPlayerType":0.5,
    "DefaultAnte":0.5,
    "HandCard":2,
    "Flop":3,
    "Turn":3,
    "River":3,
    "Result":5,
    "RebuyIn":3,
});
module.exports.EGameTime = EnumGameTime;

const EnumDBType = Object.freeze({
    "Users":0, 
    "RecordBets":1,
    "RecodrdGames":2,
    "RecordJackpot":3,
    "RecordJackpotRounds":4,
});
module.exports.EDBType = EnumDBType;

const EnumUserDBType = Object.freeze({
    "UpdateCash":0, 
});
module.exports.EUserDBType = EnumUserDBType;

const EnumRecordBetDBType = Object.freeze({
    "Create":0, 
    "Update":1
});
module.exports.ERecordBetDBType = EnumRecordBetDBType;

const EnumRecordResultDBType = Object.freeze({
    "Create":0, 
});
module.exports.ERecordResultBType = EnumRecordResultDBType;

const EnumJackpotDBTypeDBType = Object.freeze({
    "Increment":0,
    "Decrement":1 
});
module.exports.EJackpotDBType = EnumJackpotDBTypeDBType;

const EnumJackpotRoundDBTypeDBType = Object.freeze({
    "Update":0
});
module.exports.EJackpotRoundDBType = EnumJackpotRoundDBTypeDBType;