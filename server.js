const PORT = process.env.PORT || 3030;
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

//Set maxAge of cookie - for development, set to 5 minutes - when live, set to an hour?
const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 300000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();

app.use(session(sess));

//Connect to database and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});