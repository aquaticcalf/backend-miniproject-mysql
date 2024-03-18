const router = require('express').Router()
const { Post, Comment, User } = require('./models')
const auth = require('../middleware/auth')

// get all comments for a post
router.get('/post/:postId', async (request, response) => {
    try {
        const post = await Post.findByPk(request.params.postId, {
            include : [
                {
                    model : Comment, 
                    include : User, 
                },
            ],
        })
        if (!post) {
            return response.status(404).json({ message : 'post not found' })
        }
        response.json(post.Comments)
    }
    catch ( error ) {
        console.log(error)
        response.status(500).json({ message : 'error' })
    }
})

// create a new comment
router.post('/post/:postId', auth, async (request, response) => {
    try {
        const { content } = request.body
        const postId = request.params.postId
        const userId = request.user.id

        const comment = await Comment.create({content, postId, userId})
        const commentWithUser = await Comment.findByPk(comment.id, { include: User })
        response.status(201).json( commentWithUser )
    }
    catch ( error ) {
        console.log( error )
        response.status(500).json({ message: 'error' })
    }
})


module.exports = router