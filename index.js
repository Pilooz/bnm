require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const cors = require('cors');

const port = process.env.PORT || 3000;


const db = require('./db.json');

const EventEmitter = require('events').EventEmitter;
var eventEmitter = new EventEmitter();

const TAG_LENGTH = 12
var tagRFID = ""

var { SerialPort } = require("serialport");

const arduinoPort = new SerialPort({
path: 'COM3',
baudRate: 9600,
dataBits: 8,
stopBits: 1,
parity: 'none',
});

arduinoPort.on("open", function() {
  console.log("-- Connection opened --");
  arduinoPort.on("data", function(data) {
    eventEmitter.emit('serial.data.sent', data)
  });
});

function containsNonLatinCodepoints(s) {
  return regex.test(s);
}

eventEmitter.on('serial.data.sent', function(dataChunk){
  tagRFID += dataChunk
  //console.log("Code => "+tagRFID.charCodeAt(tagRFID.length-1))
  if (tagRFID.charCodeAt(tagRFID.length-1) == 3 || tagRFID.charCodeAt(tagRFID.length-1) == 10 ) { //'♥'
    tagRFID = tagRFID.substring(1,tagRFID.length-1)
    contentURL = ""
    // Search in db.json
    Object.entries(db['rfid']).forEach(entry => {
      const [key, tagDB] = entry;
      if (tagDB.id == tagRFID) {
        contentURL = tagDB.url
      } 
    });
    // Gestion d'erreur
    if (contentURL == "") {
      console.log("Ce tag n'est pas référencé dans db.json... tagRFID = "+tagRFID)
    } else {
      // 
      // Socket to client
      //
      console.log(contentURL)
    }
    tagRFID = ""
  }
});


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
  res.sendFile(__dirname + '/index.html');
});

app.get('/bibliDoc', (req, res) => {
    res.sendFile(__dirname + '/bibliDoc.html')
})

app.get('/bibliFilm', (req, res) => {
    res.sendFile(__dirname + '/bibliFilm.html')
})

app.get('/bibliLivreAudio', (req, res) => {
    res.sendFile(__dirname + '/bibliLivreAudio.html')
})

app.get('/bibliMusique', (req, res) => {
    res.sendFile(__dirname + '/bibliMusique.html')
})

app.get('/bibliPodcast', (req, res) => {
    res.sendFile(__dirname + '/bibliPodcast.html')
})

app.get('/bibliPress', (req, res) => {
    res.sendFile(__dirname + '/bibliPress.html')
})

app.get('/bibliPress/:id', (req, res) => {
    console.log(req.params.id)
})


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