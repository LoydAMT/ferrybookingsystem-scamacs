const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // Add path module to serve static files

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let adminConnected = false;

// Serve admin.html at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve static files (socket.io will use /socket.io/socket.io.js automatically)
app.use(express.static(__dirname));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('notify admin', (data) => {
    console.log('Notification for Admin:', data.message);
    io.emit('admin notification', { message: data.message });
  });

  socket.on('user message', (msg) => {
    console.log('User message:', msg);
    io.emit('admin message', msg); // Forward message to admin
  });

  socket.on('admin message', (msg) => {
    console.log('Admin message:', msg);
    io.emit('chat message', { sender: 'admin', text: msg });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
