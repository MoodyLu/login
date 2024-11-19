const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

module.exports = {

    //get dashboard
    dashboardView: (req, res) => {
        res.render('dashboard', {name: req.user.name});
    },


    //get show profile
    board_show_profile: async (req, res, next) => {
        //verify token in protectroute

        try {
            const user = await User.findOne({email: req.user.email});

            //delete password field
            req.user = user.toObject();

            res.render('profile', {user: req.user})

        } catch (error) {
            
            res.render('dashboard', {error: 'wrong get info from database'})
        }
    }
}