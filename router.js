const express = require('express');
const router = express.Router();
const connection = require('./db/connection');
const flash = require('connect-flash');
var session;

router.get('/', (req, res) => {
    const logfail = req.flash('fail');
    res.render('index', {logfail});
});

router.post('/', (req, res) => {
    session = req.session;
    session.user = req.body.email;
    session.password = req.body.password;
    let sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    let data = [session.user, session.password];
    connection.query(sql, data, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                res.render('dashboard', {
                    data: result
                });
                return;
            } else {
                req.flash('fail', 'invalid username or password');
                res.redirect('/');
                return;
            }
        }
        res.end();
    })
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/register', (req, res) => {
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;
    let sql =  `SELECT * FROM users WHERE email = ?`;
            let data = [email];
     connection.query(sql, data, (err, result) => {
        if (err) {
            throw err;
        } else {
        if (result.length > 0) {
            req.flash('userExists', 'User Already Exists');
            return res.redirect('/register');
        } else {
            let sql = `INSERT INTO users VALUES ('', ?, ?, ?, ?) `;
            let data = [firstName, lastName, email, password];
            connection.query(sql, data, (err, result) => {
                req.flash('userRegistered', 'User registered successfully');
                return res.redirect('/register');
            })
        }
    }})
});

router.get('/register', (req, res) => {
    const msg = req.flash('userExists');
    const user = req.flash('userRegistered');
    res.render('register', { msg, user });
});

router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;