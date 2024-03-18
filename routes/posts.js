const router = require('express').Router()
const { Post, Comment, User, Tag } = require('../models')
const auth = require('../middleware/auth')
const { Op } = require('sequelize')

// get all posts
router.get('/', async (request, response) => {
    try {
        const posts = await Post.findAll({
            include: [User, Tag],
        })
        response.json( posts )
    }

    catch (error) {
        // really bad error handling system for now
        console.log(error)
        response.status(500).json({ message: 'error' })
    }

})

// get a perticular post
router.get('/:postid', async (request, response) => {
    try {

        const posts =  await Post.findByPk(request.params.postId, {
            include: [User, { model: Comment, include: User }, Tag],
        })

        if (!posts) {
            return res.status(404).json({ message: 'post not found' })
        }

        response.json(posts[0])
    }

    catch (error) {
        // really bad error handling system for now
        console.log(error)
        response.status(500).json({ message: 'error' })
    }
})

// create a new post
router.post('/new', auth, async (request, response) =>{
    try {
        const { title, content, tags } = request.body
        const userId = req.user.id

        const post = await Post.create({ title, content, userId })
        
        const TagInstance = await Promise.all(
            tags.map(async (tagName) => {
                const [tag, created] = await Tag.findOrCreate({ where: { name: tagName } })
                return tag
            })
        )

        await post.addTags(TagInstance)

        const postWithTags = await Post.findByPk(post.id, {include: Tag})
        response.status(201).json( postWithTags )
    }

    catch (error) {
        // really bad error handling system for now
        console.log(error)
        response.status(500).json({ message: 'error' })
    }
})

// search for a post
router.get('/search', async (request, response) => {
    try {
        const { title, tags } = request.query
        const where = {}

        if ( title ) {
            where.title = { [Op.like]: `%${title}$%` }
        }

        if ( tags ) {
            where.tags = { [Op.contains]: tags.split(',') }
        }

        const posts = await Post.findAll({
            where, 
            include: [User, Tag],
        })

        response.json(posts)
    }

    catch ( error ) {
        console.log( error )
        response.status(500).json({ message: 'error' })
    }
})

module.exports = router