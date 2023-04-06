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

//------------------------------------------------------------------------------
// Arduino stuff
//------------------------------------------------------------------------------
//const arduinoPort = new SerialPort('COM3', { autoOpen: true, baudRate: 9600 });
const { SerialPort } = require('serialport');
const Readline = require('@serialport/parser-readline');
const arduinoPort = new SerialPort({
path: 'COM3',
baudRate: 9600,
dataBits: 8,
stopBits: 1,
parity: 'none',
});

const parserConf = new Readline({ delimiter: '\n' })
const parser = arduinoPort.pipe(parserConf);// Read the port data

arduinoPort.on("open", () => {
  console.log('serial port open');
});
parser.on('data', data =>{
  console.log('got word from arduino:', data);
});

//------------------------------------------------------------------------------

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

io.on('connection', (socket) => {
//   console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log('listening on *:3000');
});