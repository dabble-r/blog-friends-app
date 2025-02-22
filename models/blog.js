import mongoose from 'mongoose'

// to implement with furhter updates
// user authentication

const blogSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  comment: { 
    type: String, 
    required: true },
  likes: { 
    type: Number, 
    default: 0 },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
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

