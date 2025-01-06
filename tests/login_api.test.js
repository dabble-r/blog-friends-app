import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../server.js'
import jwt from 'jsonwebtoken'
import { initialBlogs, nonExistingId, blogsInDb } from '../utils/tests_helper.js'

const api = supertest(app)

describe('user auth - token tests', async (req, res) => {
  // test for tokens and user access
  test('valid user - login - post', async () => {
    const user = 
      {
        "username": "nbroussard - 2",
        "password": "pWord!"
      }

    await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('valid user - token - post', async () => {
    const user = 
      {
        "username": "nbroussard - 2",
        "password": "pWord!"
      }

    await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = jwt.sign(user, process.env.SECRET)

    assert(Boolean(token) == true)
  })
})

after(async () => {
  await mongoose.connection.close()
})