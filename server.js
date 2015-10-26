var filesToWatch = './app/components';


var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({ port: 5544 }),
  ts = require('typescript'),
  sockets = [];

wss.on('connection', function connection(ws) {
  sockets.push(ws);
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close', function close() {
    sockets.splice(sockets.indexOf(ws), 1);
  });
});

console.log('Listening on port 5544');

var watch = require('watch');
var fs = require('fs');
var ts = require('typescript');

function compile(sourceCode) {
  var result = ts.transpile(sourceCode, { module: ts.ModuleKind.CommonJS });
  return eval(JSON.stringify(result));
}

watch.createMonitor(filesToWatch, function (monitor) {
  monitor.on('changed', function (f) {
    fs.readFile(f, function (e, content) {
      var toSend = {
        type: 'update',
        file: f,
        content: '(function(){' + compile(content.toString()) + '}())'
      };
      sockets.forEach(function (socket) {
        socket.send(JSON.stringify(toSend));
      });
    });
  });
});

