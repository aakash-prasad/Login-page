const express = require('express');
const router = express.Router();
const User = require('../models/User');
const post = require('../models/post');
const jwt = require('jsonwebtoken');


const checkToken = (req, res, next)=>{
    const header = req.headers['authorization'];
    if(typeof header!== undefined){
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    }
    res.sendStatus(403);
}


router.post('/newposts', checkToken, (req, res)=>{
    
        jwt.verify(req.token, 'shhh', async (err, authData)=>{
        if(err) return res.sendStatus(403);
        res.json({message: `successfully logged in`})
        console.log(`Connected to the protected route`);
        //Create Post        
        const {text} = req.body;
        const newPost = new post({
            text: text
        });
        try{
        	const saving = await newPost.save();
        	console.log('This is saving: '+saving);
        	res.json({message:"A new Post created"})	
        }catch(err){console.log('error in saving' +err)}     
    })
 })


router.put('/deleteposts', async (req, res)=>{
	const userObject = await User.findOne({email: req.body.email});
    posts.findByIdAndRemove(userObject.id, req.body,text, (err, posts)=>{
        if(err) return res.json({message: "error while deleting your post"});
        res.json(posts);
    })
 })


 router.delete('/updateposts', async(req, res)=>{
 	const userObject = await User.findOne({email: req.body.email});
    posts.findIdAndUpdate(userObject.id, (err,posts)=>{
        if(err) res.json({message: "There was an error while updating your post"});
        res.json(posts  )
    })
 })

 module.exports = router;