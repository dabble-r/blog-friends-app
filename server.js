import express, { json } from 'express'
import cors from 'cors'
import blogRouter from './routes/blogRoutes.js'
import userRouter from './routes/userRoutes.js'
import { set, connect } from 'mongoose'
import { MONGODB_URI} from './utils/config.js'

set('strictQuery', false)

const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

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