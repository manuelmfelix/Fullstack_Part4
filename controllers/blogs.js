const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   console.log('Authorization: ',authorization)
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .find({}).populate('user', { username: 1, name: 1 })

  res.json(blogs)
})

blogsRouter.get('/:id', async (req,res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', async (req,res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = req.user
  const blog = new Blog({ ...req.body, user: user.id })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)

  //-------------------------

  // const body = req.body
  // const token = getTokenFrom(req)
  // console.log('Token: ',token)
  // console.log(body)
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // if(!decodedToken.id) {
  //   return res.status(401).json({ error: 'token missing or invalid ' })
  // }
  // const user = await User.findById(decodedToken.id)
  // // const user = await User.findById(body.userId)
  // console.log('User: ',user)
  // console.log('User ID: ',user._id)
  // const blog = new Blog({
  //   title:body.title,
  //   author:body.author,
  //   url:body.url,
  //   likes:body.likes || 0,
  //   user: user._id
  // })
  // const savedblog = await blog.save()
  // user.blogs = user.blogs.concat(savedblog._id)
  // await user.save()
  // res.status(201).json(savedblog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const blogToDelete = await Blog.findById(req.params.id)
  if (!blogToDelete ) {
    return res.status(204).end()
  }

  if ( blogToDelete.user && blogToDelete.user.toString() !== req.user.id ) {
    return res.status(401).json({
      error: 'only the creator can delete a blog'
    })
  }

  //------------------

  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    likes:body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog)

})

module.exports = blogsRouter