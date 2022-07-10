const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

dotenv.config();

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true },
    () => console.log('Connected to MongoDB'));

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

app.use(cors({
    origin: '*',
    method: "GET,POST,PUT,DELETE",
    credentials: true,
}))

app.listen(5000, () => {
  console.log('Server is running on port 5000');
})