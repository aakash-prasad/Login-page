const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

 router.post('/login', async(req, res)=>{
    try{
        const userdbData = await User.findOne({email: req.body.email }).exec();
     if(userdbData.email === req.body.email) {
        const match = await bcrypt.compare(req.body.password, userdbData.password)
    if(match){
        jwt.sign({ User }, 'shhh', { expiresIn: '30s' }, (err, token)=>{ 
        if(err) console.log(err);
        return res.json({token});
        })
        return res.sendStatus(200);  
        } 
        return res.sendStatus(403);
    }
     res.sendStatus(400);
 }catch(err){console.log(`The error in try catch block ${err}`)}
});


const checkToken = (req, res, next)=>{
    const header = req.headers['authorization'];
    if(typeof header !== undefined){
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    }
    res.sendStatus(403);
}


router.post('/dashboard',checkToken,(req, res)=>{
    jwt.verify(req.token, 'shhh', (err, authData)=>{
        if(err) res.sendStatus(403);
        console.log('You are inside a protected route');
        res.json({message: 'successfully accesed your protected route'});
        authData
    })
})


router.post('/register', async (req, res)=>{
    const{ firstName, lastName, email, password } = req.body;
    let errors =[];
    if(password.length < 6) errors.push('Password should be atleast 6 character long')
    if(!firstName || !lastName || !email || !password) errors.push( `No fields can be empty `)    

    if(errors.length>0) return res.status(500).json({status: 500, errors: JSON.stringify(errors)})          
    
    try{
        const check = await User.findOne({email:req.body.email})
        if(check) return res.status(400).json({status: 400, error: 'E-mail ID is taken already. Try another once'});
        //Creating the new user
        const newUser = new User({firstName: firstName, 
            lastName:lastName, 
            email:email, 
            password:password});
        console.log("New User created")
        //Password Hashing:
        const hash  = await bcrypt.hash(newUser.password, 10)
        newUser.password = hash;    
        const save = await newUser.save();
        return res.status(201).json({status: 201, message:'User successfully created', token: '123'});
    }catch(err){console.log(err)}   
})
module.exports = router;


























