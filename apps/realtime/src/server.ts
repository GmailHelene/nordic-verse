import { WebSocketServer } from 'ws';

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const wss = new WebSocketServer({ port });

wss.on('connection', (socket) => {
  console.log('Realtime client connected');

  socket.send(JSON.stringify({ type: 'welcome', message: 'Nordic Verse realtime server is ready.' }));

  socket.on('message', (raw) => {
    try {
      const payload = JSON.parse(raw.toString());
      console.log('Realtime message:', payload);
      socket.send(JSON.stringify({ type: 'pong', okay: true }));
    } catch (error) {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
    }
  });

  socket.on('close', () => {
    console.log('Realtime client disconnected');
  });
});

console.log(`Realtime server listening on ws://localhost:${port}`);
