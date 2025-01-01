import express from 'express'
import { getBlogs, getOneBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js'

const router = express.Router()

router.get('/', getBlogs)
router.get('/:id', getOneBlog)
router.post('/', createBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)

export default router
