//Import express router instance
const router = require("express").Router();
//Import database instance
const sequelize = require("../../config/connection");
//Import models
const { User, Post, Comment } = require("../../models");

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
                model: Post,
                attributes: ["title"],
                through: Comment,
                as: "commented_post"
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
router.put("/posts/:id", (req,res) => {

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