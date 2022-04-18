const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error,req,res,next) => {
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    return res.status(400).json({ error: error.message })
  }else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })  }
  logger.error(error)
  next(error)
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    if (decodedToken) {
      request.user = await User.findById(decodedToken.id)
    }
  }

  next()
}

module.exports = {
  errorHandler, userExtractor
}