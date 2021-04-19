const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Login Page
router.get('/login', (req, res) => {
    res.send('Login Succesful');
})

//Register Page
router.get('/register', (req, res) => {
    res.send('Registeration Succesful');
})
router.post('/register', async (req, res)=>{
    const{ firstName, lastName, email, password } = req.body;
    let errors =[];
    if(password.length < 6){
        errors.push('Password should be atleast 6 character long')
        return res.send(`Cannot sign in ${errors}`);
    }
    if(!firstName || !lastName || !email || !password){
        errors.push( `No fields can be empty `);
        return res.send(`Cannot sign in ${errors}`);
    }
    
    
    else{        
            try{
                const check = await User.findOne({email:req.body.email})
                    if(check){
                        res.send(`email id already exist`);
                    }
                else{
                    //Creating the new user
                    const newUser = new User({firstName: firstName, 
                        lastName:lastName, 
                        email:email, 
                        password:password});
                    //Password Hashing:
                        try{
                            const hash  = await bcrypt.hash(newUser.password, 10)
                            newUser.password = hash;    
                            const save = await newUser.save();
                         }catch(err){console.log(`Error in hashing ${err}`)}
                        res.send(`new user created`);
                 }
            }catch(err){console.log(err)}        
    }
})
module.exports = router;


























