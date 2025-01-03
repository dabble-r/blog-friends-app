import Blog from '../models/blog.js'
import mongoose from 'mongoose'

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
        res.json(blogs)
        //console.log(res.json(blogs))
    } 
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getOneBlog = async (req, res) => {
    const id = req.params.id
    try {
        const blog = await Blog.findById(id)
        res.json(blog)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createBlog = async (req, res, next) => {
    const body = req.body
    if (!body.username || !body.comment) {
        return res.status(400).json({ 
          error: 'must have user and comment' 
        })
    }
    const blog = new Blog (
        {
          id: "",
          username: body.username,
          date: new Date(),
          comment: body.comment,
          likes: 0
        })
    const error = blog.validateSync()

    if (error) {
        return res.status(400).json({ message: error.message })
    }
    try {
        const savedBlog = await blog.save();
        res.json(savedBlog)
    } 
    catch (error) {
        next(error)
    }
}

const updateBlog = async (req, res, next) => {
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
}

const deleteBlog = async (req, res, next) => {
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
}

export { getBlogs, getOneBlog, createBlog, updateBlog, deleteBlog }


