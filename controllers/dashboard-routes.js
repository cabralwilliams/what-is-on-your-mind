//Import express router instance
const router = require("express").Router();
//Import database instance
const sequelize = require("../config/connection");
//Import models
const { User, Post, Comment } = require("../models");
//Import authorization
const authorize = require("../utils/auth");

router.get("/", authorize, (req,res) => {

});

router.get("/edit/:id", authorize, (req,res) => {

});

module.exports = router;