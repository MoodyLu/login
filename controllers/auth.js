const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;


const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, email: user.email},
        JWT_SECRET,
        {expiresIn: '1h'}
    )
}

module.exports = {
    
    //get register
    registerView: (req, res) => {
        res.render('register');
    },

    //get login
    loginView: (req, res) => {
        res.render('login');
    },

    //post register
    registerUser: async (req, res) => {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.render('register', { error: 'please fill all the field'})
        };

        if (await User.findOne({email: email})) {
            return res.render('register', {error: 'user already exist'})
        };

        const newUser = new User ({
            name: name,
            email: email,
            password: password
        });
        try {
            await newUser.save();
            res.redirect('login?registerdone');
        } catch(error) {
            res.render('register', {error: 'error in save user info'})
        }
        

        
        
    },

    //post login
    loginUser: async (req, res) => {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) return res.redirect('/login?cantfinduser');

        const isMatch = await bcrypt.compare(password, user.password);

        if (! isMatch) return res.redirect('/login?wrongpassword');

        const token = generateToken(user);
        
        res.cookie('token', token, {
            httponly: true,
            maxAge: 3600000,
            secure: true
        });
        
        
        res.redirect('/?loginsuccess');
        
    },

    //get log out
    logoutUser: (req, res) => {
        res.clearCookie('token');

        res.redirect('/login?loggedout');
        
    },

    //get change password
    changepassview: (req, res) => {
        res.render('change_password');
    },

    //post change password
    changepass: async (req, res) => {
        const {email, password, new_password} = req.body;

        if (!email || ! password || ! new_password) {
            return res.render('change_password', {error: 'All fields are required'});
        };

        if (password == new_password) {
            return res.render('change_password', {error: 'new password same to old password'})
        }

        try {
            const user = await User.findOne({email});

            if(!user) {
                return res.render('change_password', {error: 'user not find'})
            };

            const isMatch = await bcrypt.compare(password, user.password);

            if(! isMatch) {
                return res.render('change_password', {error: 'please enter correct password'})
            };

            user.password = new_password;

            await user.save();

            res.redirect('/login?password_change');


        } catch (error) {
            res.render('change_password', {error: 'wrong in change'})
        }


    }
}