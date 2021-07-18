//check if the user is admin our not to perform operations
module.exports = function (req, res, next) { 
  
  if (!req.user.isAdmin) return res.status(403).send('Access denied.'); //status 403 means forbidden which means don't try again

  next(); // if the user is admin pass control to the next midddleware function "the right handler"
}