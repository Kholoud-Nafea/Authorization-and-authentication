const jwt = require('jsonwebtoken');
const config = require('config');

//function used to protect operations that modify data and make them avairable only to authenticated users
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); //we use token because it is the res from authentication
  //if there is no token
  if (!token) return res.status(401).send('Access denied. No token provided.'); //status 401 means unauthorized

  try { //if the token is valid
    const decoded = jwt.verify(token, config.get('jwtPrivateKey')); //decoded the token using the private key which store in environment variable so we use the config to read that
    req.user = decoded; 
    next();
  }
  catch (ex) { //if the token is not valid
    res.status(400).send('Invalid token.'); //status 400 means bad request because what the client sends to us doesn't have the right data
  }
}