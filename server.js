import express, { json } from 'express'
import cors from 'cors'
import { blogRouter } from './controllers/blogController.js'
import { userRouter } from './controllers/userController.js'
import { set, connect } from 'mongoose'
import { MONGODB_URI } from './utils/config.js'
//import errorHandler from './utils/middleware.js'

set('strictQuery', false)

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
//app.use(errorHandler())

// Connect to MongoDB
connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  app.use(cors())
  //app.use(express.static('dist'))

  app.use('/api/blogs', blogRouter)
  app.use('/api/users', userRouter)

export default app