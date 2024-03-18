const router = require('express').Router()
const { Post, Comment, User, Tag } = require('../models')
const auth = require('../middleware/auth')
const { Op } = require('sequelize')

// self profile
router.get('/', auth, async (request, response) => {
    try {
        const username = request.user.username

        const user = await User.findOne({
            where: { username }, 
            attributes: ['id', 'username'],
            include: [
                {
                    model: Post,
                    include: [Comment, Tag],
                },
                {
                    model: Comment,
                    include: [Post],
                },
            ],
        })

        if ( !user ) {
            return response.status(404).json({ message : 'user not found' })
        }

        const userProfile = {
            id: user.id,
            username: user.username,
            posts: user.Posts.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content,
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

        response.json( userProfile )
    }

    catch ( error ) {
        console.log( error )
        response.status(500).json({ message: 'error' })
    }
})

// others profile
router.get('/:username', async (request, response) => {
    try {
        const username = request.params.username

        const user = await User.findOne({
            where: { username }, 
            attributes: ['id', 'username'],
            include: [
                {
                    model: Post,
                    include: [Comment, Tag],
                },
                {
                    model: Comment,
                    include: [Post],
                },
            ],
        })

        if ( !user ) {
            return response.status(404).json({ message : 'user not found' })
        }

        const userProfile = {
            id: user.id,
            username: user.username,
            posts: user.Posts.map((post) => ({
                id: post.id,
                title: post.title,
                content: post.content,
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

        response.json( userProfile )
    }

    catch ( error ) {
        console.log( error )
        response.status(500).json({ message: 'error' })
    }
})

