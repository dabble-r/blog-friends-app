import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../server.js'
import jwt from 'jsonwebtoken'
import { usersInDb } from '../utils/tests_helper.js'

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

  test('user exists', async () => {
    const user = 
      {
        "username": "nbroussard - 3",
        "password": "pWord!"
      }
    
    const users = (await usersInDb()).map(el => el.username)
    
    const findUser = users.includes(user.username)

    assert(Boolean(findUser) == true)
  })

  test('user password correct', async () => {
    const user = 
      {
        "username": "nbroussard - 3",
        "password": "pWord!"
      }
    // array of all users in DB
    const users = await usersInDb()
    // confirm the specific user exists in DB
    const findUser = users.filter(el => el.username == user.username)
    // confirm that one user is found/findUser array length == 1
    assert.strictEqual(findUser.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})