var express = require('express');
var compression = require('compression')
var app = express();
app.use(compression());
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);
var fs=require('fs');
var router=require('./server/router.js');
app.use(express.static('dist',{maxAge:36000000}));
app.use(express.static('upload',{maxAge:36000000}));
app.use(express.static('./',{maxAge:36000000}));

server.listen(8088);
router(app);
// app.use('/upload/file', express.static('upload/file'));
app.get('/', function (req, res) {
		fs.readFile('dist/manager.html',function(err,data){
			if(err){
				res.end('404');
			}
			else{
				res.end(data.toString());
			}
	})
})
app.get('/custom', function (req, res) {
		fs.readFile('dist/custom.html',function(err,data){
			if(err){
				res.end('404');
			}
			else{
				res.end(data.toString());
			}
	})
})
global.sockets={};
io.sockets.on('connection', function (socket) {
  var shopId=socket.handshake.query.shopId
  socket.shopId=shopId
  console.log("new connection")
  global.sockets[shopId]=socket
  socket.on('disconnect', function (data) {
    delete global.sockets[socket.shopId]
  });
  socket.on('SHeartBeat', function (data) {
	console.log("recieve HeartBeat",data)
  	socket.emit("CHeartBeat",{})
  });
});