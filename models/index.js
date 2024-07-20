import { Sequelize, DataTypes } from 'sequelize'
import { genSalt, hash, compare } from 'bcrypt'

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
})

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await genSalt(10)
                user.password = await hash(user.password, salt)
            }
        },
    },
})

User.prototype.validatePassword = async function (password) {
    return await compare(password, this.password)
}

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
})

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
})

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

const Topic = sequelize.define('Topic', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
})

User.hasMany(Post)
Post.belongsTo(User)
Post.hasMany(Comment)
Comment.belongsTo(Post)
Comment.belongsTo(User)

Post.belongsToMany(Tag, { through: 'PostTag' })
Tag.belongsToMany(Post, { through: 'PostTag' })

Post.belongsTo(Topic)
Topic.hasMany(Post)

export default { User, Post, Comment, Tag, Topic }
