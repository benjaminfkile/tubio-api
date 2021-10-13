require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const ytdl = require('ytdl-core');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello, hacker!')
})
//bump
app.get('/downloadmp3', async (req, res) => {
  try {
    var url = req.query.url;
    res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
    ytdl(url, {
      format: 'mp3',
      filter: 'audioonly'
    }).pipe(res);
  } catch (err) {
    next(err);
  }
});

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app