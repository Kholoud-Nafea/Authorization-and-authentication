const Joi = require('joi'); //validate the schema
const bcrypt = require('bcrypt'); //to hash the password
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//to make sure the user enter a vaild email and password
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  //send a token which means that user has already registered
  const token = user.generateAuthToken();
  res.send(token);
});

//to validate the email and password that the user enter
function validate(req){
  const schema = Joi.object({
      email : Joi.string().min(2).max(200).email().required(),
      password : Joi.string().min(5).max(250).required(),
  });
  return schema.validate(req);
}

module.exports = router; 
