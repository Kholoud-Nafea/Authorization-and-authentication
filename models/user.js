const config = require('config'); //used to config .get method
const jwt = require('jsonwebtoken'); // is a long string that identifies user
const Joi = require('joi'); // for validate the schema
const mongoose = require('mongoose'); 

//definig user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

//  return the token to send it back to the server for future API calls
userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

//connect to mongoDB
const User = mongoose.model('User', userSchema);

//validate user schema
function validateUser(user){
    
  const schema = Joi.object({
      name : Joi.string().min(2).max(200).required(),
      email : Joi.string().min(2).max(200).email().required(),
      password : Joi.string().min(5).max(250).required()
  });
  return schema.validate(user);
}

exports.User = User; 
exports.validate = validateUser;