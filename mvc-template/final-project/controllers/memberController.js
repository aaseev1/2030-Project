const util = require('../models/util.js')
const config = require("../server/config/config")
const Post = require("../models/post")
const client = util.getMongoClient(false)
const express = require('express')
const memberController = express.Router()
const { authorizeAdmin, authorizeMember, authorizeGuest } = require('../middleware/auth')

// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    if (req.user == null){
        res.status(403)
        return res.send('You need to be logged in')
    } else{
        console.log(req.user)
    }
    next()
}

const authenticateRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' })
        }
        next()
    }
}

const authenticateAdmin = (req, res, next) => {
    return authenticateRole('admin')(req, res, next)
}

const authenticateMember = (req, res, next) => {
    return authenticateRole('member')(req, res, next)
}

const authenticateGuest = (req, res, next) => {
    return authenticateRole('guest')(req, res, next)
}
// Define routes with role-based authorization
memberController.get('/adminPage', authenticateUser, authenticateAdmin, (req, res) => {
    res.send('Welcome Admin, you can manage the system here.');
})
memberController.get('/memberPage', authenticateUser, authenticateMember, (req, res) => {
    res.send('Welcome Member, you can access posts here.');
})
memberController.get('/publicPage', authenticateGuest, (req, res) => {
    res.send('Welcome Guest, this is public content.');
})
memberController.get('/admin-dashboard', authorizeAdmin, (req, res) => {
    res.send('Welcome, Admin!')
})

memberController.get('/member-dashboard', authorizeMember, (req, res) => {
    res.send('Welcome, Member!')
})

memberController.get('/guest-info', authorizeGuest, (req, res) => {
    res.send('Guest Access Page')
})
memberController.get('/member', authenticateUser, authorizeMember, util.logRequest, async (req, res) => {
    console.info('Inside member.html')
    let collection = client.db().collection('Posts')
    let post = Post('Security','AAA is a key concept in security','Pentester')
    util.insertOne(collection, post)
    res.sendFile('member.html',{ root: config.ROOT})
})
// HTTP GET
memberController.get('/posts', util.logRequest, async (req, res) => {
    let collection = client.db().collection('Posts')
    let posts = await util.findAll(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts)
})

// -- Going to edit the rest later (Allison)

memberController.get('/post/:ID', async (request, response, next) => {
    // extract the querystring from url
    let id = request.params.ID
    console.info(`Post Id ${id}`)
    let collection = client.db().collection('Posts')
    let post = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log('Post', post)
    response.status(200).json({post: post})
})
memberController.get('/postMessage', util.logRequest, async (req, res, next) => {
    res.sendFile('postMessage.html',{ root: config.ROOT})
       
})
memberController.post('/getBookTitles', async(req, res, next) => {
    let titles = await util.fetchBookResults(req.body.query)
    res.status(200).json(titles)
})
memberController.get('/getBookCover/:imageId', async(req, res, next) => {
    const imageId = req.params.imageId
    const coverUrl = await util.fetchBookCoverURL(imageId)
    res.status(200).json({coverUrl: coverUrl})
})
// HTTP POST
memberController.post('/addPost', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Posts')
    let bookId = req.body.bookID
    let title = req.body.bookTitles
    let author = req.body.author
    let message = req.body.message
    let user = req.body.postedBy
    let post = Post(bookId,title,author,message,user)
    util.insertOne(collection, post)
    // res.json(
    //     {
    //         message: `You post was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/posts.json', JSON.stringify(posts))
    res.redirect('/posts.html')
})
// HTTP DELETE
memberController.delete('/delete/:ID', util.logRequest, async(req, res, next) => {
    let collection = client.db().collection('Posts')
    let id = req.params.ID
    await util.deleteOne(collection, id)
    res.status(200).json({response: `Post with id ${id} was deleted successfully!`})
})
// HTTP PUT
memberController.put('/update/:ID', util.logRequest, async(req, res, next) => {
    let collection = client.db().collection('Posts')
    let id = req.params.ID 
    let topic = req.body.Topic
    let message = req.body.Message
    let updatedPost = {Topic: topic, Message: message}
    await util.updateOne(collection, id, updatedPost)
    res.status(200).json({updatedPost})
})

module.exports = memberController