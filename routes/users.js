const express  = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Login Page
router.get('/login', (req, res)=>{
	res.send('Login Succesful');
})

//Register Page
router.get('/register', (req, res)=>{
	res.send('Registeration Succesful');
})

//register handle
router.post('/register', (req, res)=>{
	const {firstName, lastName, email, password} = req.body;

	let errors  =[];

	//checking all fields empty or not
	if(!firstName || !lastName || !email || !password){
		errors.push({msg: "Please Fill All The Fields"})
	}
	//checking the length of the password
	if(password.length< 6){
		errors.push({ msg: "Password must be atleast 6 characters long"});
	}

	if(errors.length >0){
		res.send(errors);
		console.log('Render the form again');
	}
	else{
		// Validation Passed
		User.findOne({ email:email })
			.then(user=>{
				if(user){
					errors.push({ msg: "Email is already registered" })
					res.send("user already exist")
				}
				else{
					const newUser = new User({
						firstName:firstName,
						lastName:lastName,
						email:email,
						password:password
					});
					

					//Password Hashing:
					bcrypt.hash(newUser.password, 10, function(err, hash) {
    					if(err) throw err;
							//Setting password to hashed format
							newUser.password = hash;
							try{
								newUser.save();
							}catch(err){console.log(`cannot save data ${err}`)}

							var doWork = async()=>{
								var response = await newUser.save();
							}
					});
					

					// bcrypt.genSalt(10, (err, salt)=>{
					// 	bcrypt.hash(newUser.password, salt, (err, hash)=>{
							
					// 		//Saving the data in database
					// 		newUser.save()
					// 			.then(user => res.send("Registration Success and data saved in database"))
					// 			.catch(err => console.log(err))
					// 	})
					// })
				}
			})
	}

})

module.exports = router;	