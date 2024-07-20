## blog application backend

this is the backend for a simple blog application built with node.js, express.js, and mysql. 
it provides apis for user authentication, creating and managing blog posts, comments, and user profiles.

### features
- authentication
    - json web token (jwt) based authentication

    - user registration

    - user login

- posts
    - get all posts

    - get a specific post

    - create a new post

    - search for posts by title and tags

- comments
    - get all comments for a specific post

    - create a new comment on a post

- profiles
    - get the authenticated user's profile

    - get another user's profile

    - view posts and comments made by a user

### technologies Used

- node.js

- express.js

- mysql (with sequelize orm)

- json web tokens (jwt) for authentication

### getting started

> prerequisites
> - node.js (v14 or later)
> - mysql server

*installation*

1. clone the repository:

```
git clone https://github.com/aquaticcalf/backend-miniproject-mysql
```
2. install dependencies:
```
cd backend-miniproject-mysql
npm install
```
3. set up the mysql database

4. start the server:
```
npm start
```
5. The backend server should now be running on [`http://localhost:3000`](http://localhost:3000)

### api documentation

the api documentation will be available once the server is running. you can access it at http://localhost:3000/api-docs -> not yet implemented

### license
this project is licensed under the [mit license](license.md).

### related projects

blog application frontend - the frontend for this blog application, built with react.

blog application mongodb version - a version of this backend using mongodb instead of mysql.