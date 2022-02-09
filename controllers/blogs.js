const blogsRouter = require('express').Router()
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

blogsRouter.post('/', async (req,res,next) => {
  const body = req.body
  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes
  })
  try{
    const savedblog = await blog.save()
    res.status(201).json(savedblog)
  } catch(exception) {
    next(exception)
  }
  // body
  //   .save()
  //   .then(saveblog => {
  //     res.status(201).json(saveblog)
  //   })
  //   .catch(error => next(error))
})

module.exports = blogsRouter