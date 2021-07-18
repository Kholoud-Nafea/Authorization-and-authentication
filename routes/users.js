const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcrypt'); //used to hash the password
const _ = require('lodash'); // gives alot of utility functions that work with object
const {User, validate} = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//getting current user
router.get('/me', auth, async (req, res) => { //using me instead of id because id is private we mustn't show it
    const user = await User.findById(req.user._id).select('-password');//password will not be shown
    res.send(user);
});

//create user
router.post('/' , async (req, res)=>{
    //if this is an error
    const {error} =validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //to make sure that user is not already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.'); //status 400 means bad request

    //pick() is a method return a new object with only those props instead of using req.body.name, req.body.email, ..
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10); //generate a salt (the highter the num that pass to the salt the longer it takes to generate a salt and also the salt will be more complix and hard to break )
    user.password = await bcrypt.hash(user.password, salt); //hash the password

    await user.save();

    req.session.clientId = user._id;
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id','name', 'email'])); // return the token that means the user has already registered
});
 
// get user who has cookies
router.get('/', async (req, res) => {
    const user = await User.find().sort('name');
    res.send(req.session);
  });
 
  //deleting users (only admin can delete user)
router.delete('/:id', [auth,admin], async (req,res)=>{
    const user =await User.findByIdAndRemove(req.params.id);

   if(!user) return res.status(404).send("user with id not found"); //404 not found

   res.send(user);
});

module.exports = router;