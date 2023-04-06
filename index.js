require('dotenv').config();
const cors = require('cors');
const express = require('express');

const router = express.Router();

const app = express();

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


// Initialisation of the app
app.use(cors(corsOptions));
// add function to the app
app.use('/', router);

app.use(express.json());


// Création des routers

const home = express.Router();
app.use('/', home);


home.get('/', (req, res) => {
    console.log('handling home');
    res.send('<h1>Hello world</h1>');
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });