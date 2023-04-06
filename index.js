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