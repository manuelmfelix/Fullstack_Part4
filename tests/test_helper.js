const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title:'My First Blog',
    author:'Manuel Félix',
    url:'www.myblog.com',
    likes:23
  },
  {
    title:'My Second Blog',
    author:'Manuel Fonseca Félix',
    url:'www.myblog2.com',
    likes:11
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}