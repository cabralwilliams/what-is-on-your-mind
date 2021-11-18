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
        let posts = dbPostData.map(post => post.get({ plain: true }));

        //Give each post a route extender of posts
        posts = posts.map(post => {
            post.routeAddition = "posts";
            return post;
        });

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            routeAddition: "posts"
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

//Will be reached if user clicks on post link from home page
router.get("/posts/:id", (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        //Get the title, content, and timestamp of post
        attributes: ["id","title","content","created_at"],
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

        const loggedIn = req.session.loggedIn ? true : false;

        //Get user id to attach to the comment input or null if not logged in
        const userId = loggedIn ? req.session.user_id : null;

        res.render("viewPost", {
            post,
            loggedIn: loggedIn,
            user_id: userId
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get Route to edit post
router.get("/edit/:id", (req,res) => {
    if(!req.session.loggedIn) {
        //Redirect to login page if user not logged in - you must be logged in to edit post
        res.redirect("/login");
    } else {
        Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ["id","title","content","user_id"]
        })
        .then(dbPostData => {
            if(!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            //User can only edit post if he/she created post
            const canEdit = req.session.user_id == dbPostData.user_id ? true : false;

            post.user_id = req.session.user_id;
            post.postAction = "Edit Post";
            post.postTitle = post.title;
            post.postPlaceholder = post.content;
            post.postContent = post.content;
            post.isEditing = canEdit;
            post.loggedIn = true;

            if(canEdit) {
                res.render("editPost", {
                    post,
                    loggedIn: true
                    /*
                    user_id: req.session.user_id,
                    postAction: "Edit Post",
                    postTitle: post.title,
                    postPlaceholder: post.content,
                    postContent: post.content,
                    isEditing: canEdit
                    */
                });
            } else {
                res.render("viewPost", {
                    post,
                    loggedIn: true
                    //user_id: req.session.user_id
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

//Get Route to create post
router.get("/create", (req,res) => {
    if(!req.session.loggedIn) {
        //Redirect to login page if user not logged in - you must be logged in to create post
        res.redirect("/login");
    } else {
        const post = { postTitle: "On My Mind...", postAction: "Create New Post", postPlaceholder: "What is on your mind?!?", postContent: "", userId: req.session.user_id };
        res.render("create", {
            post,
            loggedIn: true,
            user_id: req.session.user_id,
            isEditing: false
        });
    }
});

//Fake post for photo
router.get("/Caesar", (req,res) => {
    res.render("fakePost");
});

module.exports = router;