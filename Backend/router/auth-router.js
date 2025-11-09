const express = require("express");
const router = express.Router();
const passport = require('passport')
const User = require('../Models/user-model')
const jwt = require('jsonwebtoken')
const {
  home,
  register,
  login,
  getUser,
  logout,
  updateProfile,
} = require('../Controllers/auth-controller');

const authMiddleware = require('../Middlewares/authMiddleware');

router.get('/', home);
router.post('/register', register);
router.post('/login', login);
router.get('/user-profile', authMiddleware, getUser);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/logout', logout);
router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/google/callback', passport.authenticate('google',{
  session:false, failureRedirect:'https://frontend-labs-dev.vercel.app'
}),async (req,res)=>{
  const profile = req.user;
  //check user is available or not using google id
  let user = await User.findOne({ $or : [{googleId : profile.id},{email:profile.emails[0].value}]})
  // if user is available then change google id & generate token and send it in Response.
  if(user){
    if(!user.googleId){
      user.googleId = profile.id;
      await user.save();
    }
  }else{
     // User is not available - create a new user & generate token & send it in response
    user = new User(
      {
        name : profile.displayName,
        email: profile.emails[0].value,
        googleId : profile.id
      }
    )
    await user.save()
  }
  const token = jwt.sign({id:user._id,name:user.name},process.env.JWT_SECRET_KEY,{expiresIn:'2h'})
    // Set JWT as cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
    // Redirect to frontend
    // Redirect to frontend - respect FRONTEND_URLS[0] if available
    const redirectTo = (process.env.FRONTEND_URLS && process.env.FRONTEND_URLS.split(',')[0]) || 'https://frontend-labs-dev.vercel.app';
    res.redirect(redirectTo);
})
module.exports = router;
