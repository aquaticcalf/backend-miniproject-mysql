const router = require('express').Router()
import { Post, Comment, User, Tag, Topic } from '../models'
import auth from '../middleware/auth'
import { Op } from 'sequelize'
import { NotFoundError } from '../utils/errors'

// get all posts
router.get('/', async (request, response, next) => {
    try {
        const posts = await Post.findAll({
            include: [User, Tag, Topic],
        })
        response.json(posts)
    } catch (error) {
        next(error)
    }
})

// get a particular post
router.get('/:postId', async (request, response, next) => {
    try {
        const post = await Post.findByPk(request.params.postId, {
            include: [User, { model: Comment, include: User }, Tag, Topic],
        })

        if (!post) {
            throw new NotFoundError('Post not found')
        }

        response.json(post)
    } catch (error) {
        next(error)
    }
})

// create a new post
router.post('/new', auth, async (request, response, next) => {
    try {
        const { title, content, tags, topicId } = request.body
        const userId = request.user.id

        const post = await Post.create({ title, content, userId, topicId })

        const tagInstances = await Promise.all(
            tags.map(async (tagName) => {
                const [tag, created] = await Tag.findOrCreate({ where: { name: tagName } })
                return tag
            })
        )

        await post.addTags(tagInstances)

        const postWithTagsAndTopic = await Post.findByPk(post.id, { include: [Tag, Topic] })
        response.status(201).json(postWithTagsAndTopic)
    } catch (error) {
        next(error)
    }
})

// search for a post
router.get('/search', async (request, response, next) => {
    try {
        const { title, tags, topicId } = request.query
        let where = {}

        if (title) {
            where.title = { [Op.like]: `%${title}%` }
        }

        if (tags) {
            where.tags = { [Op.contains]: tags.split(',') }
        }

        if (topicId) {
            where.topicId = topicId
        }

        const posts = await Post.findAll({
            where,
            include: [User, Tag, Topic],
        })

        response.json(posts)
    } catch (error) {
        next(error)
    }
})

export default router