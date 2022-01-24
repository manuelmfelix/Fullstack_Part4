require('dotenv').config()
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const config = require('./utils/config')
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {:body}'))

app.use('/api/blogs', blogsRouter)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:', error.message)
  })

const errorHandler = (error,req,res,next) => {
  logger.error(error)

  if(error.name === 'CastError'){
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })