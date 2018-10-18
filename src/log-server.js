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

app.all( "/shutdown", shutdown );
app.all( "/ping", (req, res)=>res.send("PONG"));
app.put( "/log", webLog );
app.post("/log", webLog );

app.get("/list", (req,res)=>{
    res.render('loglist');
});

let server = app.listen(port);

function webLog( req, res ){
    if( req.body ){
        fileLogger.log( req.body.toString() );
    }
    res.send("OK");
}

function shutdown( req, res){
    if( server ){
        fileLogger.log( `Close call originated from ${req.ip}` );
        res.send("OK");
        server.close();
    }
}