const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin');


router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "please add all the field" })
    }

    User.findOne({
        email: email
    }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "user already exists" })

        }
        bcrypt.hash(password, 12)
            .then(hashpassowrd => {
                const user = new User({
                    name,
                    email,
                    password: hashpassowrd
                })

                user.save()
                    .then(user => {
                        res.json({ message: "Signup successfull, Please login!" })
                    })

                    .catch(err => {
                        console.log(err)
                    })

            })

    }
    )

        .catch(err => {
            console.log(err)
        })
})


router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please provide your emailid and password" })

    }
    User.findOne({email:email})
        .then(savedUser=>{
            if (!savedUser) {
                return res.status(422).json({ error: "invalid Email or password try again" , })
                
            }


            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id}, JWT_SECRET )
                        const {_id, name, email} = savedUser
                        res.json({token, user : {_id, name , email}})
                    }
                    else {
                        return res.status(422).json({ error: "invalid Email or password" })

                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
    

      
})


module.exports = router;