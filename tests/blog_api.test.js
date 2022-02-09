const mongose = require('mongoose')
const helper = require('./test_helper')
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
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
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
  expect(response.body).toHaveLength(helper.initialBlogs.length)
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

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(contents).toContain('My Second Blog')
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title:'About async blog',
    author:'Mmsddf',
    url:'www.asyncisamazing.com',
    likes:230
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(r => r.title)

  // const response = await api.get('/api/blogs')
  // const contents = response.body.map(r => r.title)
  // expect(response.body).toHaveLength(initialBlogs.length + 1)

  expect(contents).toContain('About async blog')
})

test('blog without title is not added', async () => {
  const newBlog = {
    author:'Mmsddf',
    url:'www.asyncisamazing.com',
    likes:230
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  // const response = await api.get('/api/blogs')
  // expect(response.body).toHaveLength(initialBlogs.length)
})

// test('a specific blog can be viewed', async () => {
//   const blogsAtStart = await helper.blogsInDb()

//   const blogToView = blogsAtStart[0]

//   const resultBlog = await api
//     .get(`/api/blogs/${blogToView.title}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
//   const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

//   expect(resultBlog.body).toEqual(processedBlogToView)
// })

// test('a blog can be deleted', async () => {
//   const blogsAtStart = await helper.blogsInDb()
//   const blogsToDelete = blogsAtStart[0]

//   await api
//     .delete(`/api/notes/${blogsToDelete.id}`)
//     .expect(204)
//   const blogsAtEnd = await helper.blogsInDb()

//   expect(blogsAtEnd).toHaveLength(
//     helper.initialBlogs.length - 1
//   )

//   const contents = blogsAtEnd.map(r => r.title)

//   expect(contents).not.toContain(blogsAtEnd.title)
// })

afterAll(() => {
  mongose.connection.close()
})