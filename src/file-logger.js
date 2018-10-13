// jshint esversion: 6

const _fs = require("fs");

function FileLog( filename ){
    this.file = filename;
}

function zeropad( str, length, suffix ){
    if( str ){
        let result = ""+str;
        while( str.length < length ){
            result = (suffix)? result +"0" : "0" + result;
        }
        return result;
    }
    return str;
}

function prepareLog( data ){
    let log = '';
    let now = new Date();
    let year = ""+now.getFullYear();
    let month = ""+zeropad(now.getMonth(),2);
    let date = ""+zeropad(now.getDate(),2);
    let hour = ""+zeropad(now.getHours(),2);
    let minute = ""+zeropad(now.getMinutes(),2);
    let second = ""+zeropad(now.getSeconds(),2);
    let millisecond = ""+(now.getMilliseconds()/1000);
    log += `${year}-${month}-${date} ${hour}:${minute}:${second}${millisecond.substring(millisecond.indexOf("."))} `;
    return log += JSON.stringify(data);
}

FileLog.prototype.log = function log( data ){
    let preparedLog = prepareLog( data );
    console.log( "LOG " + preparedLog );
    _fs.writeFileSync( this.file, preparedLog+"\n", { flag : 'a' } );
};

module.exports = {
    FileLog : FileLog
};