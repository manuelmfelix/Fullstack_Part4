require('dotenv').config()
const config = require('./utils/config')
const morgan = require('morgan')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

morgan.token('body', (req) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {:body}'))

logger.info('Connecting to Mongo')
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.info('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use(middleware.errorHandler)


module.exports = app