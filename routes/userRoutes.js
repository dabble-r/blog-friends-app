import express from 'express'
import { getUsers, postUser } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/api/users', getUsers)
userRouter.post('/api/users', postUser)

export default userRouter