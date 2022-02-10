const blogsRouter = require('express').Router()
// const { request } = require('express')
// const { response } = require('../app')
const Blog = require('../models/blog')

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
  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes || 0
  })
  // try{
  const savedblog = await blog.save()
  res.status(201).json(savedblog)
  // } catch(exception) {
  //   next(exception)
  // }
  // body
  //   .save()
  //   .then(saveblog => {
  //     res.status(201).json(saveblog)
  //   })
  //   .catch(error => next(error))
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