const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

// get all posts
router.get('/', async (request, response) => {
    try {
        const [ posts ] = await db.execute('SELECT * from posts')
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
        const [ posts ] = await db.execute('SELECT * from posts WHERE id = ?', [request.params.postid])
        if ( posts.length === 0 ) {
            return response.status(404).json({ message : 'post not found' })
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
        const { title, content } = request.body
        const username = request.user.username

        // wait a sec, i think i got a better way to deal with this
    }

    catch (error) {
        // really bad error handling system for now
        console.log(error)
        response.status(500).json({ message: 'error' })
    }
})

module.exports = router