const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  // To Validate Uniqueness of username without mongose
  // const { username, name, password } = request.body
  // const existingUser = await User.findOne({ username })
  // if (existingUser) {
  //   return response.status(400).json({
  //     error: 'username must be unique'
  //   })
  // }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = usersRouter