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
// const register_handler =async (req, res)=>{

// }
// router.post('/register' , register_handler)
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


























//register handle
// router.post('/register', (req, res) => {
//     const {
//         firstName,
//         lastName,
//         email,
//         password
//     } = req.body;

//     let errors = [];

//     //checking all fields empty or not
//     if (!firstName || !lastName || !email || !password) {
//         errors.push({
//             msg: "Please Fill All The Fields"
//         })
//     }
//     //checking the length of the password
//     if (password.length < 6) {
//         errors.push({
//             msg: "Password must be atleast 6 characters long"
//         });
//     }

//     if (errors.length > 0) {
//         res.send(errors);
//         console.log('Render the form again');
//     } else {
//         // Validation Passed
//         User.findOne({
//                 email: email
//             }
//             
//             .then(user => {
//                 if (user) {
//                     errors.push({
//                         msg: "Email is already registered"
//                     })
//                     res.send("user already exist")
//                 } else {
//                     const newUser = new User({
//                         firstName: firstName,
//                         lastName: lastName,
//                         email: email,
//                         password: password
//                     });
//                     //Password Hashing:
//                     bcrypt.hash(newUser.password, 10, function(err, hash) {
//                         if (err) throw err;
//                         newUser.password = hash;
                        
//                         newUser.save()
//                             // return new Promise((resolve, reject)=>{
//                             //     if(resolve) resolve(`Promise resolved, data saved`)
//                             //     else reject(`There is an error saving the data `)
//                             // })
//                             const doWork = async ()=>{
//                                 try{
//                                     var response = await newUser.save();
//                                     console.log(response);    
//                                 }catch(err){console.log(err)}
//                             }
//                             doWork();
                        
//                     });
//                 }
//             })
//     }

// })

// module.exports = router;