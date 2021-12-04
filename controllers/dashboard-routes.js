//Import express router instance
const router = require("express").Router();
//Import database instance
const sequelize = require("../config/connection");
//Import models
const { User, Post, Comment } = require("../models");
//Import authorization
const authorize = require("../utils/auth");

router.get("/", authorize, (req,res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ["id","title", "created_at"]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: `No post data was found.`});
            return;
        }
        console.log(dbPostData);
        //Assign variable hasPosts based on whether user has made any posts
        const hasPosts = dbPostData.length === 0 ? false : true;
        let posts = dbPostData.map(post => post.get({ plain: true }));
        posts = posts.map(post => {
            post.user = {};
            post.user.username = req.session.username;
            return post;
        });
        posts.hasPosts = hasPosts;

        //Add the edit routeAddition to each post
        posts = posts.map(post => {
            post.routeAddition = "dashboard/edit";
            return post;
        });

        res.render("dashboard", { posts, loggedIn: true, hasPosts: hasPosts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Will be reached when user clicks on one of her/his own posts from dashboard
router.get("/edit/:id", authorize, (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["id","title","content","created_at","user_id"],
        include: [
            {
                //Include the username of the person who created the post
                model: User,
                attributes: ["username"]
            },
            {
                //Include the comments to the post
                model: Comment,
                attributes: ["comment_text","created_at"],
                include: [
                    {
                        //Include the username of the person who made the comment
                        model: User,
                        attributes: ["username"]
                    }
                ]
            }
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: `No post with the id ${req.params.id} exists.`});
            return;
        } else {
            //Check to see if the person trying to edit the post created it
            const canEdit = req.session.user_id == dbPostData.user_id ? true : false;

            // serialize the data
            const post = dbPostData.get({ plain: true });

            if(canEdit) {
                post.postAction = "Edit Post";
                post.postTitle = post.title;
                post.postValue = post.title;
                post.postPlaceholder = post.content;
                post.postContent = post.content;
                post.isEditing = true;
                post.userId = req.session.user_id;
                post.postId = post.id;
                res.render("editPost", {
                    post,
                    loggedIn: true
                });
            } else {
                //Send user to view post view of the post if the user is not authorized to edit
                res.render("viewPost", {
                    post,
                    loggedIn: true
                });
            }
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Will be reached when user clicks on create post option from dashboard
router.get("/create", authorize, (req,res) => {
    const isEditing = false;
    const post = { postTitle: "On My Mind...", postAction: "Create New Post", postPlaceholder: "What is on your mind?!?", postContent: "", userId: req.session.user_id, isEditing: false, postValue: "On My Mind..." };
    res.render("create", {
        post,
        loggedIn: true,
        user_id: req.session.user_id,
        isEditing: isEditing
    });
});

module.exports = router;