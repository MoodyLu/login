const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

module.exports = {

    //protect route for dashboard, profile
    protectRoute: (req, res, next) => {
        const token = req.cookies.token;
        

        if(!token) {
            return res.redirect('/login?pleaselogin');
        }

        

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        }catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.redirect('/login?tokenexpired')
            } else if (error.name === 'JsonWebTokenError') {
                return res.redirect('/login?jwterror')                    
            }
            res.redirect('/login?tokenproblem')
        }
    }
}