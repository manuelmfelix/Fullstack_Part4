const logger = require('../utils/logger')

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

module.exports = {
  errorHandler
}