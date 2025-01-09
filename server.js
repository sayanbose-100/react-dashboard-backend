import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { stockData, aqiData } from './utils/constants.js';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST"]
  }
});

// Simulation real-time updates every 5 seconds
setInterval(() => {
  // Update stock values randomly
  stockData.values = stockData.values.map(value => 
    Math.max(0, value + (Math.random() - 0.5) * 20)
  );
  
  // Update AQI values randomly
  aqiData.values = aqiData.values.map(value => 
    Math.max(0, value + (Math.random() - 0.5) * 30)
  );

  // Emit updates to all connected clients
  io.emit('stockUpdate', stockData);
  io.emit('aqiUpdate', aqiData);
}, 5000);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial data to newly connected clients
  socket.emit('stockUpdate', stockData);
  socket.emit('aqiUpdate', aqiData);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
