const WebSocketClient = require('websocket').client;
const execSync = require('child_process').execSync;

const client = new WebSocketClient();
 
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
        if (obj['switch'] && obj['switch']['state'] === 'push') {
          const result = execSync('cat /sys/class/thermal/thermal_zone0/temp').toString('utf-8');
          const temp = parseInt(result.match(/([0-9]+)/, "$1")[1]);
          connection.sendUTF(JSON.stringify([
            {display:{clear:true}},
            {display:{text: `Temperature is ${Math.round(temp / 100) / 10} degrees.`}}
          ]));
        }
        console.log("Received: '", obj);
      }
    }
  });
});
 
client.connect('wss://2ws.obniz.io/obniz/0239-5853/ws/1', 'echo-protocol');
