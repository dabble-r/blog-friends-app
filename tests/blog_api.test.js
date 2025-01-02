import { test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../server.js'
import { initialBlogs, nonExistingId, blogsInDb } from '../utils/tests_helper.js'

const api = supertest(app)

/*
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
*/

// simple test, expects blogs to return as json format
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// checks 'id' prop of each blog is literally id
test('id is really id', async () => {
  const response = await api.get('/api/blogs')

  const blogIDs = response.body.map(el => el.id).filter(el => el != 'id')

  assert.strictEqual(response.body.length, blogIDs.length)
})


// checks blogs count from locally initialized array
test('total blogs count', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

// checks all blogs content from mongoDB storage
test('blogs content check', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(el => el.comment)
  assert(contents.includes('I like Jason because he travels to places.'))
})

// checks one blogs content of first array item for mongoDB storage
test('blogs content -- first item -- check', async () => {
  const response = await api.get('/api/blogs')
  const firstElContents = response.body.map(el => el.comment)

  assert(firstElContents.includes('I like Jason because he travels to places.'))
})

// check POST request - valid blog created - initialBlogs increase by one
test('a valid blog POST', async () => {
  const newBlog = 
    {
      "user": "John Doe",
      "comment": "some comment here",
      "likes": 1,
      "date": "today"
    }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await blogsInDb()

  const contents = response.map(el => el.comment)

  assert.strictEqual(response.length, initialBlogs.length + 1)
  assert(contents.includes('some comment here'))
})

test('blog malformed - invalid not added', async () => {
  const newBlog = {
    "comment": "",
    "likes": "",
    "date": ""
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsResult = await blogsInDb()

  assert.strictEqual(blogsResult.length, initialBlogs.length)  
})

test.only('likes value - default to zero', async () => {
  const newBlog = {
    "user": "Name",
    "comment": "comment",
    "likes": "",
    "date": "today"
  }

  await api 
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)

  const response = await blogsInDb()
  //const test = response[response.length - 1]['likes']
  const lastBlogLikes = response[response.length - 1]['likes']

  assert.strictEqual(lastBlogLikes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
