const express = require('express')
const {postModel} = require('../models/postModel')

const postRouter = express.Router()

postRouter.get('/',async(req,res) => {
    const posts = await postModel.find()
    res.send(posts)
})

postRouter.post('/create',async(req,res) => {
    const payload = req.body
    const post = new postModel(payload)
    await post.save()
    res.send({'msg':'You have posted to your timeline'})
})
// {
//   "title":"Day-1 at Masai",
//   "body":"These are things that I experienced on my first day",
//   "device":"Laptop",
//   "no_if_comments":3
// }


postRouter.patch('/update/:id',async(req,res) => {
    const payload = req.body
    const postID = req.params.id
    // const posts = await postModel.findOne({"_id":id})
    try{
        await postModel.findByIdAndUpdate({"_id":postID},payload)
        res.send({'msg':`The post with id ${postID} has been updated`})
    }
    catch(err){
        res.send({'msg':'Something went wrong','error':err.message})
    }

})

postRouter.delete('/delete/:id',async(req,res) => {
    const postID = req.params.id
    await postModel.findByIdAndDelete({_id:postID})
    res.send({'msg':`Post with the ${postID} has been deleted`})
})

module.exports = {
    postRouter
}