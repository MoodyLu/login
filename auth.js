//not use passport session


const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

module.exports = {
    init: () => {
        passport.use(
            new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
                const user = await User.findOne({email});
                if(!user) return done(null, false);
                if(!bcrypt.compareSync(password, user.password)) return done(null, false);
                return done(null, user)
            })
        );

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser(async (_id, done) => {
            const user = await User.findById({_id});
            done(null, user)
        });

        
    },

    protectRoute: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login?next=' + req.url);
    }

};