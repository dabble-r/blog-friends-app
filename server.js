import express, { json } from 'express'
import cors from 'cors'
import { blogRouter } from './controllers/blogController.js'
import { userRouter } from './controllers/userController.js'
import { loginRouter } from './controllers/loginController.js'
import { set, connect } from 'mongoose'
import { MONGODB_URI } from './utils/config.js'
import { extractToken } from './utils/middleware.js'

set('strictQuery', false)

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
//app.use(extractToken)
//app.use(requestLogger())


// Connect to MongoDB
connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  //app.use(express.static('dist'))

  app.use('/api/blogs', extractToken, blogRouter)
  app.use('/api/users', userRouter)
  app.use('/api/login', loginRouter)

export default app