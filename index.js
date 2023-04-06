require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const cors = require('cors');

const port = process.env.PORT || 3000;


const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log('listening on *:3000');
});