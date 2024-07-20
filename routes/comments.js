const router = require('express').Router()
import { Post, Comment, User } from '../models'
import auth from '../middleware/auth'
import { NotFoundError } from '../utils/errors'

// get all comments for a post
router.get('/:postId', async (request, response, next) => {
    try {
        const post = await Post.findByPk(request.params.postId, {
            include: [
                {
                    model: Comment,
                    include: User,
                },
            ],
        })

        if (!post) {
            throw new NotFoundError('Post not found')
        }

        response.json(post.Comments)
    } catch (error) {
        next(error)
    }
})

// create a new comment
router.post('/:postId', auth, async (request, response, next) => {
    try {
        const { content } = request.body
        const postId = request.params.postId
        const userId = request.user.id

        const post = await Post.findByPk(postId)
        if (!post) {
            throw new NotFoundError('Post not found')
        }

        const comment = await Comment.create({ content, postId, userId })
        const commentWithUser = await Comment.findByPk(comment.id, { include: User })
        response.status(201).json(commentWithUser)
    } catch (error) {
        next(error)
    }
})

export default router