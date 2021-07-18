const config = require('config'); //config the environment
const mongoose = require('mongoose'); //connect to mongoDB
const users = require('./routes/users');
const auth = require('./routes/auth');
const session = require('express-session'); //for session
const express = require('express');
const app = express();

//config session middleware
app.use(session({
  // store: new RedisStore({client: redisClient}),
  secret: 'mySecret',
  saveUninitialized: false, //this means if you make a request to the server and you don't store anything in the session, this wont go to DB because the session will be empty any way
  resave: false, // if you make a call and you don't update the session, then we will not force override the session we already have because it is already change
  cookies: { //control how the cookies setting
      secure: false, //means only send cookies back if the incoming request is https request if it is true
      httpOnly: true, //if it is true, it prevents client side JS from reading the cookies
      maxAge: 1000 * 60* 30 //session max age in miilisec
  }
}));

//to make sure the environment variable has already set
if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

//connect the project to mongoDB
mongoose.connect('mongodb://localhost/task')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

  //appling middleware functions
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

//the port that run the project 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));