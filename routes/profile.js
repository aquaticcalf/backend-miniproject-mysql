const router = require('express').Router()
import { Post, Comment, User, Tag, Topic } from '../models'
import auth from '../middleware/auth'
import { NotFoundError } from '../utils/errors'

// self profile
router.get('/', auth, async (request, response, next) => {
    try {
        const username = request.user.username

        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username', 'bio', 'profilePicture'],
            include: [
                {
                    model: Post,
                    include: [Comment, Tag, Topic],
                },
                {
                    model: Comment,
                    include: [Post],
                },
            ],
        })

        if (!user) {
            throw new NotFoundError('user not found')
        }

        const userProfile = {
            id: user.id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            posts: user.Posts.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content,
                topic: post.Topic ? { id: post.Topic.id, name: post.Topic.name } : null,
                tags: post.Tags.map((tag) => ({
                    id: tag.id,
                    tag: tag.name,
                })),
                comments: post.Comments.map((comment) => ({
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                })),
            })),
            comments: user.Comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                postId: comment.PostId,
            })),
        }

        response.json(userProfile)
    } catch (error) {
        next(error)
    }
})

// others profile
router.get('/:username', async (request, response, next) => {
    try {
        const username = request.params.username

        const user = await User.findOne({
            where: { username },
            attributes: ['id', 'username', 'bio', 'profilePicture'],
            include: [
                {
                    model: Post,
                    include: [Comment, Tag, Topic],
                },
                {
                    model: Comment,
                    include: [Post],
                },
            ],
        })

        if (!user) {
            throw new NotFoundError('user not found')
        }

        const userProfile = {
            id: user.id,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
            posts: user.Posts.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content,
                topic: post.Topic ? { id: post.Topic.id, name: post.Topic.name } : null,
                tags: post.Tags.map((tag) => ({
                    id: tag.id,
                    tag: tag.name,
                })),
                comments: post.Comments.map((comment) => ({
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                })),
            })),
            comments: user.Comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                postId: comment.PostId,
            })),
        }

        response.json(userProfile)
    } catch (error) {
        next(error)
    }
})

export default router