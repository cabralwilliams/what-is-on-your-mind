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

router.get("/posts/:id", (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        //Get the title, content, and timestamp of post
        attributes: ["title","content","created_at"],
        include: [
            {
                //Include the username of the creator of the post
                model: User,
                attributes: ["username"],
                as: "user"
            },
            {
                //Include any comments related to the post
                model: Comment,
                attributes: ["comment_text","created_at"],
                as: "comment",
                include: [
                    {
                        //Include the username of the person who made the comment
                        model: User,
                        as: "user",
                        attributes: ["username"]
                    }
                ]
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        // serialize the data
        const post = dbPostData.get({ plain: true });

        const loggedIn = req.session ? true : false;

        res.render("viewPost", {
            post,
            loggedIn: loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;