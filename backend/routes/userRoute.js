const express = require('express')
const { userModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { postModel } = require('../models/postModel')

const userRouter = express.Router()

userRouter.get('/posts', async(req, res) => {
    const userID = req.user._id
    try{
        const posts = await postModel.find({"_id":userID})
        res.send(posts)
    }
    catch(err){
        res.send({'msg':'Something went wrong','error':err.message})
    }
})


// {
//     "name":"kumar",
//     "email":"kumar@email.com",
//     "gender":"Male",
//     "password":"kumar@55",
//     "age":25,
//     "city":"Banglore"
//   }
userRouter.post('/register', async (req, res) => {
    const { name, email, gender, password, age, city } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send({ 'msg': 'Something went wrong', 'error': err.message })
            } else {
                const existingUser = await userModel.findOne({ email })
                if (existingUser) {
                    res.send({ 'msg': 'User already exist, please login' })
                } else {
                    const user = new userModel({ name, email, gender, password: hash, age, city })
                    await user.save()
                    res.send({ 'msg': 'new user has been registered successfully' })
                }
            }
        })
    }
    catch (err) {
        res.send({ 'msg': 'Something went wrong', 'error': err.message })
    }
})

//karan token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2YzNDZiNzRlZWYwMDRhYmJkMzlkNzUiLCJpYXQiOjE2NzY4ODgyNTB9.8W24IPFV57RXoxg_kOwMrB_LtcvQkntKy9rgsp-epkY

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, hash) => {
                if (hash) {
                    let token = jwt.sign({ userID: user[0]._id }, 'secret')
                    res.send({ 'msg': 'Logged in', 'token': token })
                } else {
                    res.send({ 'msg': 'Wrong credentials' })
                }
            })
        } else {
            res.send({ 'msg': 'Wrong credentials' })
        }
    }
    catch (err) {
        res.send({ 'msg': 'Something went wrong', 'error': err.message })
    }
})


module.exports = {
    userRouter
}