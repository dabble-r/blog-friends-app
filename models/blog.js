import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comment: { type: String, required: true },
  likes: { type: Number, default: 0 },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog

