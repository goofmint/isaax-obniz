var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      const json = JSON.parse(message.utf8Data);
      for (const obj of json) {
        console.log("Received: '", obj);
      }
    }
  });
  
  function sendNumber() {
    if (connection.connected) {
      var number = Math.round(Math.random() * 0xFFFFFF);
      connection.sendUTF(number.toString());
      setTimeout(sendNumber, 1000);
    }
  }
  sendNumber();
});
 
client.connect('wss://2ws.obniz.io/obniz/0239-5853/ws/1', 'echo-protocol');
