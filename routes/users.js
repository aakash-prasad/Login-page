const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwt_decode = require("jwt-decode");

 router.post('/login', async(req, res)=>{
    try{
        const userdbData = await User.findOne({email: req.body.email }).exec();
     if(userdbData.email === req.body.email) {
        const match = await bcrypt.compare(req.body.password, userdbData.password)
     if(match){
        jwt.sign({ userdbData }, 'shhh', { expiresIn: '5h' }, (err, token)=>{ 
        if(err) console.log(err);
        res.json({token});
        })
        } 
    }
 }catch(err){console.log(`The error in try catch block ${err}`)}
});


router.post('/register', async (req, res)=>{
    const{ firstName, lastName, email, password } = req.body;
    let errors =[];
    if(password.length < 6) errors.push('Password should be atleast 6 character long')
    if(!firstName || !lastName || !email || !password) errors.push( `No fields can be empty `)    

    if(errors.length>0) return res.status(500).json({status: 500, errors: JSON.stringify(errors)})          
    
    try{
        const check = await User.findOne({email:req.body.email})
        if(check) res.status(400).json({status: 400, error: 'E-mail ID is taken already. Try another once'});
        //Creating the new user
        const newUser = new User({firstName: firstName, 
            lastName:lastName, 
            email:email, 
            password:password});
        //Password Hashing:
        const hash  = await bcrypt.hash(newUser.password, 10)
        newUser.password = hash;    
        const save = await newUser.save();
        res.status(201).json({status: 201, message:'User successfully created', token: '123'});
    }catch(err){console.log(err)}   
})
module.exports = router;


























