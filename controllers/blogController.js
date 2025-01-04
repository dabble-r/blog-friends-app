import Blog from '../models/blog.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import express from 'express'

const blogRouter = express.Router()

blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { "username": 1, "name": 1, "id": 1 })
        console.log(blogs)
        res.json(blogs)
    } 
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

blogRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const blog = await Blog.findById(id)
        res.json(blog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

blogRouter.post('/', async (req, res, next) => {

    const body = req.body
    console.log('body', body)
    console.log('body id', body.user)
    console.log('body username', body.username)

    if (!body.username || !body.comment) {
        return res.status(400).json({ 
          error: 'must have username and comment' 
        })
    }
    // find user to match username who entered new blog item
    const user = await User.findById(body.user)

    // user still returns null
    console.log('user found', user)
    console.log('user id key:value', user.id)

    const blog = new Blog (
        {
          username: body.username,
          date: new Date(),
          comment: body.comment,
          likes: 0,
          user: user.id // add 'user': 'user.id' key:value -- one who entered new blog item
        })

    const error = blog.validateSync()

    console.log('post schema blog', blog)
    if (error) {
        return res.status(400).json({ message: error.message })
    }
    try {
        const savedBlog = await blog.save()
        console.log('saved blog', savedBlog)
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
    try {
        const { user, date, comment, likes } = req.body
        const id = req.params.id
        
        const updateBlog = await Blog.findByIdAndUpdate(
            id, 
            { user, date, comment, likes },  
            { new: true,
              runValidators: true,
              context: 'query'
            })
        if (!updateBlog) {
            return res.status(404).json({ error: "Blog not found" })
        }
        res.json(updateBlog)
    } 
    catch (error) {
        next(error)
    }
})

blogRouter.delete('/:id', async (req, res, next) => {
    try {
        // catch a malformed or invlaid ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid Blog ID!');
            return res.status(400).send('Invalid Blog ID!');
        }
        // Find the blog by ID
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            console.log("Blog doesn't exist!");
            return res.status(200).send('Blog already deleted or not found!');
        }
        // Delete the blog
        await Blog.findByIdAndDelete(req.params.id)
        console.log('Blog deleted!')
        res.status(200).send('Blog deleted!')
    }
    catch (error) {
        console.error('Error deleting the blog: ', error.message)
        next(error)
    }
})

// export { getBlogs, getOneBlog, createBlog, updateBlog, deleteBlog }
export { blogRouter }


