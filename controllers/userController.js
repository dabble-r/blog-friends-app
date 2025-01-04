import User from '../models/user.js'
import bcrypt from 'bcrypt'
import express from 'express'

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  try {
      const users = await User.find({}).populate('blogs', {'comment': 1, 'likes': 1})
      const IDs = users.map(el => el.id)
      console.log('ids', IDs)
      console.log('users', users)
      res.json(users)
      //console.log(res.json(blogs))
  } 
  catch (error) {
      res.status(500).json({ message: error.message })
  }
})

userRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findById(id)
        res.json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


userRouter.post('/', async (request, response) => {
  const { username, name, password, blogs } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    blogs
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

/*

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

*/

/*

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

*/

export { userRouter }

//export { getUsers, postUser }