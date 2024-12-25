import Blog from '../models/blog.js'
import mongoose from 'mongoose'

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
        res.json(blogs)
    } 
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createBlog = async (req, res, next) => {
    const body = req.body
    if (!body.user || !body.comment) {
        return res.status(400).json({ 
          error: 'must have user and comment' 
        })
    }
    const blog = new Blog (
        {
          id: "",
          user: body.user,
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
        res.json(savedBlog);
    } 
    catch (error) {
        next(error)
    }
}

const updateBlog = async (req, res, next) => {
    const { user, date, comment, likes } = req.body
    const id = req.params.id
    
    Blog.findByIdAndUpdate(
        id, 
        { user, date, comment, likes },  
        { new: true,
          runValidators: true,
          context: 'query'
        })
        .then(updatedBlog => {
          res.json(updatedBlog)
        })
        .catch(error => next(error))
}

const deleteBlog = async (req, res, next) => {
    try {
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

export { getBlogs, createBlog, updateBlog, deleteBlog }


