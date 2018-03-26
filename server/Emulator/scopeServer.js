const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8085 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('something');
    });

    ws.send('something');

    setInterval(() => {
        console.log("sending");
        ws.send('xx');
    }, 500);
    
});

