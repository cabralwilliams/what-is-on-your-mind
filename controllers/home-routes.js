//Import express router instance
const router = require("express").Router();
//Import database instance
const sequelize = require("../config/connection");
//Import models
const { User, Post, Comment } = require("../models");

router.get("/", (req,res) => {
    
    Post.findAll({
        attributes: ["id","title", "created_at"]
    })
    .then(dbPostData => {
        // pass a single post object into the homepage template
        //console.log(dbPostData[0]);
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
    
});

router.get("/login", (req,res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    
    res.render('login');
});

module.exports = router;