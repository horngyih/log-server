//jshint esversion:6
const FileLog = require("../src/file-logger").FileLog;

let fileLog = new FileLog("./web.log");

fileLog.log( "test" );
fileLog.log( { test : "test" } );