const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('database', 'username', 'password', {
    host : 'localhost',
    dialect: 'mysql',
})

const User = sequelize.define('User', {
    username : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,    
    },
})

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,    
    },
})

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,    
    },
})

User.hasMany(Post)
Post.belongsTo(User)
Post.hasMany(Comment)
Comment.belongsTo(Post)
Comment.belongsTo(User)

Post.belongsToMany(Tag, { through: 'PostTag' })
Tag.belongsToMany(Post, { through: 'PostTag' })

module.exports = { User, Post, Comment, Tag }