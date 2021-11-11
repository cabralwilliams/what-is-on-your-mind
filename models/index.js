//Import the user model
const User = require("./User");
//Import the post model
const Post = require("./Post");
//Import the comment model
const Comment = require("./Comment");

//Associations
//A single user can create many posts
User.hasMany(Post, {
    foreignKey: "user_id"
});

//A post belongs to the user who created it
Post.belongsTo(User, {
    foreignKey: "user_id"
});

//A comment belongs to the user who created it
Comment.belongsTo(User, {
    foreignKey: "user_id"
});

//A comment belongs to the post to which it is attached
Comment.belongsTo(Post, {
    foreignKey: "post_id"
});

//A user owns the comments that he or she created
User.hasMany(Comment, {
    foreignKey: "user_id"
});

//A post can have many comments attached to it
Post.hasMany(Comment, {
    foreignKey: "post_id"
});

//Many users can comment on the same post
/*
Post.belongsToMany(User, {
    through: Comment,
    as: "commented_post",
    foreignKey: "post_id"
});
*/

//The same user can comment on many posts
/*
User.belongsToMany(Post, {
    through: Comment,
    as: "commented_post",
    foreignKey: "user_id"
});
*/

//Export the models
module.exports = { User, Post, Comment };