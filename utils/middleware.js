import jwt from 'jsonwebtoken'
import User from '../models/user.js'

/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/

const extractToken = (req, res, next) => {
  const authorization = req.get('authorization');
  // console.log('authorization header:', authorization);
  
  if (authorization && authorization.startsWith('Bearer ')) {
    // console.log('extract reaches if statement/block')
    req.token = authorization.replace('Bearer ', '')
    //console.log('req token', req.token)
    req.decodedToken = jwt.verify(req.token, process.env.SECRET)
    console.log(' token decoded - request', req.decodedToken)
  } else {
    req.token = null; // Explicitly set to null if no valid token found
  }

  next(); // Call the next middleware or route handler
}

export { extractToken }


