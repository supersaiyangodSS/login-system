const express = require('express');
const app = express();
const router = require('./router');
const connection = require('./db/connection');
const hbs = require('hbs');
const path = require('path');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
hbs.registerPartials('partials', path.join(__dirname + 'partials'));
app.set('View', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cookieParser('flames'));
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: 'flames',
    resave: false,
    cookie: {maxAge: oneDay},
    saveUninitialized: false
}));
app.use(flash());
const port = process.env.port || 4000;
app.use(router);

app.listen(port, () => console.log(`server is up and running on ${port}`));