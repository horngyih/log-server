//jshint esversion:6

const _express = require("express");
const _expresshbs = require("express-handlebars");
const _bodyParser = require( "body-parser" );
const _cors = require("cors");
const FileLog = require("./file-logger").FileLog;

const port = process.env.PORT || 9995;
const logfile = process.env.LOG_LOCATION || "./web.log";

const fileLogger = new FileLog(logfile);

const app = _express();

app.use(_cors());
app.use(_bodyParser.raw({type:"application/json"}));

app.engine( 'hbs', _expresshbs({defaultLayout:'main',extname:'.hbs',layoutsDir:'src/views/layouts/'}));
app.set('views', 'src/views/');
app.set('view engine', 'hbs' );

app.all( "/shutdown", doShutdown );
app.all( "/ping", (req, res)=>res.send("PONG"));
app.put( "/log", webLog );
app.post("/log", webLog );

app.get("/list", (req,res)=>{
    fileLogger.readLogFile()
    .then( lines=>{
        console.log( lines );
        res.render("loglist", { title : "Logs from file", logs: lines } );
    });
});

let server = app.listen(port);

process.on( "SIGINT", shutdown );

function webLog( req, res ){
    if( req.body ){
        fileLogger.log( req.body.toString() );
    }
    res.send("OK");
    res.end();
}

function doShutdown( req, res){
    if( server ){
        fileLogger.log( `Close call originated from ${req.ip}` );
        res.send("OK");
        shutdown();
    }
}

function shutdown(){
    console.log( "Shutting down..." );
    server.close();
    exit();
}

function exit(delay){
    delay = delay || 5000;
    setTimeout(()=>process.exit(0), delay );
}