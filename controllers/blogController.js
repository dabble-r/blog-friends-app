import Blog from '../models/blog.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import express from 'express'
import jwt from 'jsonwebtoken'
import testHelpers from '../utils/tests_helper.js'

const blogRouter = express.Router()

/*
const getTokenFrom = (req) => {
    const authorization = req.get('authorization')
    // console.log('authorization', authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}
*/

blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { "username": 1, "name": 1, "id": 1 })
        // console.log(blogs)
        res.json(blogs)
    } 
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

blogRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    //const token = req.token
    //const decodedToken = jwt.verify(token, process.env.SECRET)
    
        //console.log('token', token)
        //console.log('decoded token', decodedToken)
    try {
        const blog = await Blog.findById(id)
        //const userAccess = decodedToken.id
        /*
        if (blog.user = userAccess) {
            console.log('match!')
        } else {
            console.log('no match!')
        }
        */
        res.json(blog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

blogRouter.post('/', async (req, res, next) => {
    const body = req.body
    // console.log('body', body)
    // console.log('body id', body.userId)
    // console.log('body username', body.username)
    // console.log('token from request', req.headers.authorization)
    //console.log('token from request header', req.token)
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    //console.log('decoded token', decodedToken)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.username || !body.comment) {
        return res.status(400).json({ 
          error: 'must have username and comment' 
        })
    }

    // find user to match username who entered new blog item
    // || body._userId || body.id
    // const userID = body.userId 
    // const user = await User.findById(userID)

    // user still returns null
    // console.log('user found', user)
    // console.log('user id key:value', user.id)

    const blog = new Blog (
        {
          username: body.username,
          date: new Date(),
          comment: body.comment,
          likes: 0,
          user: user.id // add 'user': 'user.id' key:value -- one who entered new blog item
        })

    const error = blog.validateSync()

    // console.log('post schema blog', blog)
    if (error) {
        return res.status(400).json({ message: error.message })
    }
    try {
        const savedBlog = await blog.save()
        // console.log('saved blog', savedBlog)
        // user blogs array 
        // concat new blog item
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        res.json(savedBlog)
    } 
    catch (error) {
        next(error)
    }
})

blogRouter.put('/:id', async (req, res, next) => {
    // console.log('req token', req.headers.Authorization)
    
    try {
        // console.log('token from request header', req.token)
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        
        // catch an invalid token
        if (!decodedToken) {
            console.log('Invalid User Token!')
            //console.log('decoded token', decodedToken)
            return res.status(400).send('Invalid token!')
        }

        const { user, date, comment, likes } = req.body
        const id = req.params.id

        const origLikes = await testHelpers.blogInDbLikes(id)
        //console.log('original likes', origLikes)
        //console.log('new likes', likes)

        const updateBlog = await Blog.findByIdAndUpdate(
            id, 
            { user, date, comment, likes },  
            { new: true,
              runValidators: true,
              context: 'query'
        })
        
        if (likes != origLikes) {
            // console.log('likes update')
            //console.log('user', user)
            //console.log('decoded token id', decodedToken.id)
            if (user == decodedToken.id) {
                alert('You can only like/dislike someone else\'s comment!')
                return res.status(401).json({error: "Likes Change - ID match"})
            }
        }
        
        if (origLikes == likes) {
            if (user != decodedToken.id) {
                alert('You can only update your own comments!')
                return res.status(401).json({ error: "No Likes Change - ID no match user/blog" })
            } 
        }
        
        if (!updateBlog) {
            return res.status(404).json({ error: "Blog not found" })
        }
        await updateBlog.save()
        res.json(updateBlog)
    } 
    catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    
    try {
        const decodedToken = req.decodedToken
        //console.log('decoded token - delete', decodedToken)

        // catch a malformed or invalid ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid Blog ID!')
            //console.log('id', req.params.id)
            return res.status(400).send('Invalid Blog ID!')
        }

        // catch an invalid token
        if (!decodedToken) {
            console.log('Invalid User Token!')
            //console.log('decoded token', decodedToken)
            return res.status(400).send('Invalid token!')
        }

        // Find the blog by ID
        const blog = await Blog.findById(req.params.id)

        if (!blog) {
            console.log("Blog doesn't exist!");
            return res.status(200).send('Blog already deleted or not found!');
        }
        //console.log('blog to delete', blog)
        // decoded token of user making request
        const userAccess = req.decodedToken.id
        // user id of the blog item being accessed
        const blogItemUser = blog.user.toString()
        //console.log('user access id', userAccess)
        //console.log('blog item user id', blogItemUser)

        // check the blog item user id against the user id accessing blog item
        if (blogItemUser == userAccess) {
            console.log('match!')
            // Delete the blog
            await Blog.findByIdAndDelete(req.params.id)
            console.log('Blog deleted!')
            res.status(200).send('Blog deleted!')
        } 
        else {
            console.log('Unauthorized!')
            res.status(401).json({ error: "Unauthorized: User does not have access!" })
        }

        // confirm user delete is same as user post
        // process:
            // take username from blog item
            // take id from blog item
            // find user in DB from username
            // take userID from user item
            // check if blog item/id exists in the blogs array of 
            // associated user/username/userId
    }
    catch (error) {
        console.error('Error deleting the blog: ', error.message)
        next(error)
    }
   next()
})

blogRouter.delete('/', async (req, res, next) => {
    try {
        // Delete all the blogs
        const blogs = await Blog.deleteMany({})
        console.log(`all ${blogs.deletedCount} blogs deleted!`)
        // empty blogs arrays of all users
        const users = await User.updateMany({}, {$set: {blogs: []}})
        
        console.log(users)
        
        res.status(200).send('all blogs deleted from Blogs cluster and User arrays !')
    }
    catch (error) {
        console.error('Error deleting all the blogs: ', error.message)
        next(error)
    }
})


// export { getBlogs, getOneBlog, createBlog, updateBlog, deleteBlog }
export { blogRouter }


