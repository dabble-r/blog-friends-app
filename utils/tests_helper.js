import Blog from '../models/blog.js'

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

export { initialBlogs, nonExistingId, blogsInDb }