//Import express router instance
const router = require("express").Router();
//Import database instance
const sequelize = require("../../config/connection");
//Import models
const { User, Post, Comment } = require("../../models");

const authorize = require("../../utils/auth");

//See all users
router.get("/users", (req,res) => {
    User.findAll({
        attributes: { exclude: ["password"] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//See individual user based on id - get back username, created posts, and commented posts
router.get("/users/:id", (req,res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ["password"] },
        include: [
            {
                model: Post,
                attributes: ["id","title","content","created_at","updated_at"]
            },
            {
                model: Comment,
                attributes: ["id","post_id","comment_text"]
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Create new user - fetch needs to be directed to /api/user
router.post("/users", (req,res) => {
    //Expect req.body = { username, password }
    //Check to see if username already exists
    User.findOne({
        where: {
            username: req.body.username
        },
        attributes: ["username"]
    })
    .then(dbUserData => {
        if(!dbUserData) {
            //Create user if username is unique
            User.create({
                username: req.body.username,
                password: req.body.password
            })
            .then(dbUserData => {
                req.session.save(() => {
                    req.session.user_id = dbUserData.id;
                    req.session.username = dbUserData.username;
                    req.session.loggedIn = true;
                
                    res.json(dbUserData);
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
        } else if(req.body.username === dbUserData.username) {
            console.log("==============================");
            console.log("Duplicate Username!!!!");
            console.log("==============================");
            res.status(403).json({ "message": `The username ${req.body.username} already exists in the system.  Usernames must be unique.`})
            return;
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Log user in
router.post("/users/login", (req,res) => {
    console.log("Recieved Request");
    console.log(JSON.stringify(req.body));
    User.findOne(
        {
            where: {
                username: req.body.username
            }
        }
    )
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user found with that username.' });
            return;
        }
        console.log("User Found!!!!!!!!");
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        //Successful login
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
    
            res.json({ user: dbUserData, message: 'You are now logged in.' });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//See all posts
router.get("/posts", (req,res) => {
    Post.findAll({
        attributes: [
            "id",
            "title",
            "content",
            "created_at"
        ],
        order: [["created_at", "DESC"]],
        include: [
            {
                //For each post, include the username of the user who created the post
                model: User,
                attributes: ["username"]
            },
            {
                //For each post, include the comments attached to the post
                model: Comment,
                attributes: ["id","comment_text","created_at"],
                include: [
                    {
                        //For each comment, include the username of the user who made the comment
                        model: User,
                        attributes: ["username"]
                    }
                ]
            }
        ]
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//See individual post
router.get("/posts/:id", (req,res) => {

});

//Create new post - fetch needs to be directed to /api/post
router.post("/posts", (req,res) => {
    //Expect { user_id, title, content }
    Post.create({
        user_id: req.body.user_id,
        title: req.body.title,
        content: req.body.content
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Edit existing post - fetch needs to be directed to /api/post/:id
router.put("/posts/:id", authorize, (req,res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(updatedPost => {
        if(!updatedPost) {
            res.json({ message: "No such post with that id exists."});
            return;
        }
        res.json(updatedPost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Delete existing post
router.delete("/posts/:id", authorize, (req,res) => {
    Comment.destroy({
        where: {
            post_id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            return;
        }
        Post.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if(!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//See all comments
router.get("/comments", (req,res) => {

});

//Post a comment to a specific post
router.post("/comments", (req,res) => {
    //Temporarily use req.body.user_id -> later to use req.session.user_id
    Comment.create({
        post_id: req.body.post_id,
        comment_text: req.body.comment_text,
        user_id: req.body.user_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Delete a specific comment
router.delete("/comments/:id", authorize, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbResponse => res.json(dbResponse))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Logout and destroy session
router.post("/users/logout", (req,res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;