const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../Models/user-model');

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });
        
        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email
        existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
        }

        // Create new user
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: Math.random().toString(36).substring(2, 15), // Random password
            isOAuth: true
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ facebookId: profile.id });
        
        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email
        if (profile.emails && profile.emails[0]) {
            existingUser = await User.findOne({ email: profile.emails[0].value });
            
            if (existingUser) {
                existingUser.facebookId = profile.id;
                await existingUser.save();
                return done(null, existingUser);
            }
        }

        const newUser = new User({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`,
            password: Math.random().toString(36).substring(2, 15),
            isOAuth: true
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ githubId: profile.id });
        
        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email
        if (profile.emails && profile.emails[0]) {
            existingUser = await User.findOne({ email: profile.emails[0].value });
            
            if (existingUser) {
                existingUser.githubId = profile.id;
                await existingUser.save();
                return done(null, existingUser);
            }
        }

        const newUser = new User({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails ? profile.emails[0].value : `${profile.username}@github.com`,
            password: Math.random().toString(36).substring(2, 15),
            isOAuth: true
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;
