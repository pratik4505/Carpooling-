const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const GOOGLE_CLIENT_ID = '962349255344-i3qi6805l6jrakumvroq3f0apqb6bbol.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const CALLBACK_URL = 'http://localhost:3000/auth/google/callback';
const mongoose=require("mongoose");
const User=require("./models/models");
const{connectToMongoDB}=require("./connection");
connectToMongoDB("mongodb+srv://vaibhavkumarmaurya309:9AGEPAMyX2wDWKPO@innodevcarpooling.cqufsh6.mongodb.net/")
.then(console.log("connect to mongodb"));
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
 
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  //res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
  res.sendFile(__dirname+"/login.html");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  res.send(`<h1>Welcome ${req.user.displayName}</h1><a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
  req.logout((err)=>{
    console.log(err);
  });
  res.sendFile(__dirname+"/login.html");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
