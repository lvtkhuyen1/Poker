var leadingZeros = (n, digits) => {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
            zero += '0';
    }
    return zero + n;
}

exports.getTimeStamp = (offset)=> {
    var now = new Date();

    var d = new Date(now.setDate(now.getDate()-offset));
    var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2);

    return s;
}

exports.getMonthlyStart = ()=> {
    var now = new Date();

    var s =
        leadingZeros(now.getFullYear(), 4) + '-' +
        leadingZeros(now.getMonth() + 1, 2) + '-' +
        leadingZeros(1, 2);

    return s;
}

exports.getMonthlyEnd = ()=> {
    var now = new Date();

    var s =
        leadingZeros(now.getFullYear(), 4) + '-' +
        leadingZeros(now.getMonth() + 1, 2) + '-' +
        leadingZeros(31, 2);

    return s;
}

exports.getTodayStart = ()=> {
    const today_start = new Date().setHours(0,0,0,0);

    return today_start;
}

exports.getTodayEnd = ()=> {
    const today_end = new Date().setHours(23,59,59,0);
    
    return today_end;
}



exports.getCurrentDate = () =>{
    var current = new Date();

    return current.getDate();
}