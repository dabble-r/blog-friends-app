import User from '../models/user.js'
import bcrypt from 'bcrypt'
import express from 'express'

const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  try {
      const users = await User.find({}).populate('blogs', {'comment': 1, 'likes': 1})
      const findUser = users.map(el => el.username == "nbroussard - 1")
      // console.log('ids', IDs)
      //console.log('user found', findUser)
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

userRouter.delete('/', async (req, res, next) => {
  try {
    // users in DB
    const users = await User.deleteMany({})
    // log to console total number of users deleted
    //console.log('users', users)
    console.log(`all ${users.deletedCount} blogs deleted!`)

    res.status(200).send('All users deleted from Users cluster!')
  }
  catch (error) {
    console.error('Error deleting all the blogs: ', error.message)
    next(error)
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