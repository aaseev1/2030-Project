const util = require('../models/util.js')
const config = require("../server/config/config")
const User = require("../models/user")
const CurrentUser = require("../server/current-user")
const client = util.getMongoClient(false)
const express = require('express')
const hashing = require('bcrypt')
const homeController = express.Router()

homeController.get('/', util.logRequest, (req,res) => {
    res.sendFile('index.html')
})
homeController.get('/index.html', util.logRequest, (req,res) => {
    res.sendFile('index.html')
})
homeController.get('/index.html',util.logRequest, (req,res) => {
    res.sendFile('index.html')
})
homeController.get('/about',util.logRequest, (req,res) => {
    res.sendFile('about.html')
})
homeController.post('/signin', async (request, response, next) => {
    let collection = client.db().collection('Users')
    let email = request.body.email
    let password = request.body.password
    
    let user = await util.findOneByEmail(collection, email)
    const isMatch = await hashing.compare(password, user.password)

    console.log(user)
    if(isMatch){
        CurrentUser.login(user.username, user.role)
        console.log(`Current user: ${CurrentUser.getUsername()}`)
        response.status(200).json({})
    }else{
        //return error 
        //incorrect credentials code 
        response.status(403).json({})
    }
})
// HTTP POST
homeController.post('/register', util.logRequest, async (req, res, next) => {
    console.log('register')
    let collection = client.db().collection('Users')
    let email = req.body.email
    let password = req.body.password
    let confirm = req.body.confirm
    

    if (password !== confirm) {
        console.log('\t|Password does not match')

    } else{
        const encodedPassword = await hashing.hash(password, 10)
        let user = User(email,encodedPassword)
        console.info(user)
        util.insertOne(collection, user)
    }
    res.redirect('/member.html')
})

module.exports = homeController