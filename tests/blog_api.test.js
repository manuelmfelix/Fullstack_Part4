const mongose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
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
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('first blog content', async () => {
  const response = await api.get('/api/blogs')
  // console.log(response.body[0].title)
  expect(response.body[0].title).toBe('My First Blog')
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  // console.log(response.body)
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(contents).toContain('My Second Blog')
})

afterAll(() => {
  mongose.connection.close()
})