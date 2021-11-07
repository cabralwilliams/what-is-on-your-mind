//Import the user model
const User = require("./User");
//Import the post model
const Post = require("./Post");
//Import the comment model
const Comment = require("./Post");

//Associations
User.hasMany(Post, {
    foreignKey: "user_id"
});

Post.belongsTo(User, {
    foreignKey: "user_id"
});

Comment.belongsTo(User, {
    foreignKey: "user_id"
});

Comment.belongsTo(Post, {
    foreignKey: "post_id"
});

Post.hasMany(Comment, {
    foreignKey: "post_id"
});

//Export the models
module.exports = { User, Post, Comment };