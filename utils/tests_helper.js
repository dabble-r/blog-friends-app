import Blog from '../models/blog.js'
import User from '../models/user.js'

const initialBlogs = [
  {
      "user": "Jane Doe",
      "comment": "",
      "likes": 0,
      "date": ""
  },
  {
    "user": "Jane Doe",
      "comment": "",
      "likes": 0,
      "date": ""
  },
  {
    "user": "Jane Doe",
      "comment": "",
      "likes": 0,
      "date": ""
  },
  {
    "user": "Jane Doe",
      "comment": "",
      "likes": 0,
      "date": ""
  },
  {
    "user": "Jane Doe",
      "comment": "",
      "likes": 0,
      "date": ""
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogInDbLikes = async (id) => {
  const blog = await Blog.findById(id)
  const blogJSON = blog.toJSON()
  return blogJSON.likes
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}



export default { initialBlogs, nonExistingId, blogsInDb, usersInDb, blogInDbLikes }