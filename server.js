var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var User = require('./app/routes/user.server.routes');

var apiRouter = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');


var osipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var osport = process.env.OPENSHIFT_NODEJS_PORT;


app.set('port', osport || 3000);
app.set('ipaddress', osipaddress);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type,  Authorization');
    next();
});

app.use(morgan('dev'));


//User(app, apiRouter);

 io.on('connection', function(client) {
         console.log('Client connected...');

     client.on('join', function(data) {
        console.log(data);
     });

     client.on('messages', function(data) {
     client.emit('broad', data);
         client.broadcast.emit('broad',data);
     });
 });


app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

server.listen(app.get('port'), app.get('ipaddress'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
