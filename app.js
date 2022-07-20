const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

dotenv.config();
/*
//Set rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter)
*/
//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,
    { 
        useNewUrlParser: true
    },
    (error) =>
    {
        if(error) return console.log(error);
        console.log('Connected to MongoDB');
    });

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));

app.route('/').get((req, res) => {
    res.sendFile(process.cwd() + '/index.html');
});


//Middleware
app.use(express.json());
app.use('/api/user', authRoutes);
app.use('/api/posts', postsRoutes);

app.use(cookieSession(
    {
        name: 'session',
        keys: ["lame"],
        maxAge: 24 * 60 * 60 * 1000
    }
))

app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port  %d in %s mode", this.address().port, app.settings.env');
})