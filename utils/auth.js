//Checks to see if user is logged in and redired them if not
const authorize = (req, res, next) => {
    if(!req.session.user_id) {
        res.redirect("/login");
    } else {
        next();
    }
};

module.exports = authorize;