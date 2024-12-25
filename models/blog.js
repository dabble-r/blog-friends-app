import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comment: { type: String, required: true },
  likes: { type: Number, default: 0 },
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog

