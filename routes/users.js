const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


 let user = mongoose.model('users', User);
// //Login Page
// router.post('/login', async(req, res)=>{
//     user.find({email: req.body.email}, (error, data)=>{
//         if(error) console.log(`There is an error in find() ${error}`);
//         console.log(data);
//     })
    // const emailCheck = await User.findOne({/*Get email from the db */emailCheck: req.body.email });
    // if(emailCheck) {
    // const passwordCheck = await bcrypt.compare(req.body.password,'pass' Get the password from the db ) 
    // if(passwordCheck) res.status(200).send(`Login Success`);
    //     res.status(401).send(`Wrong password`);
    // }
    // res.status(400).send(`Email id not registered`);
    
//     const user = {
//         firstName:firstName,
//         lastName: lastName,
//         email: email,
//         password: password
//     }
//     jwt.sign({ user }, 'shhh', (err, token)=>{
//         res.json({token});
//         console.log(`The web token is ${token}`)
//     })
// });

// const verifyToken = (req, res, next)=>{
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== undefined){
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//         req.token = bearerToken;
//         next();
//     }
//     res.sendstatus(403);

// }
// router.post('/dashoard',verifyToken,(req, res)=>{
//     jwt.verify(req.token, 'shhh', (err, authData)=>{
//         if(err) res.sendstatus(403);
//         res.json('This is user dashoard which is password protected');
//     })
// })
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


























