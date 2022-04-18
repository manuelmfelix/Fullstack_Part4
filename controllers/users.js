const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  // To Validate Uniqueness of username without mongose
  const { username, name, password } = req.body
  const existingUser = await User.findOne({ username })
  if (typeof password === 'undefined' || typeof username === 'undefined') {
    return res.status(400).json({
      error: 'username and password must be given'
    })
  } else if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  } else if (username.length < 3) {
    return res.status(400).json({
      error: 'username must be at least 3 characters long'
    })
  } else if (password.length < 3) {
    return res.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = usersRouter