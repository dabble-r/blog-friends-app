import User from '../models/user.js'
import bcrypt from 'bcrypt'

const getUsers = async (req, res) => {
  try {
      const users = await User.find({})
      res.json(users)
      //console.log(res.json(blogs))
  } 
  catch (error) {
      res.status(500).json({ message: error.message })
  }
}

const postUser = async (req, res) => {
  try {
    const { username, name, password, blogs } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
      blogs
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
}

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

// export { usersRouter }

export { getUsers, postUser }