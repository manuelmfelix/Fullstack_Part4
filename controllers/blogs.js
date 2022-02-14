const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  // Blog
  //   .find({})
  //   .then(blogs => {
  res.json(blogs)
  // })
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
  const body = req.body

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes || 0,
    user: user._id
  })
  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog._id)
  await user.save()
  res.status(201).json(savedblog)
})

blogsRouter.delete('/:id', async (req, res) => {
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