var express = require('express');
var router  = express.Router();
var crypto  = require('crypto');
var async   = require('async');
var nodemailer = require('nodemailer');

User = require('../../../models/user'); 

router.get('/', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('dashboard/index', {message: 'Home Page'});
    } else {
        res.render('dashboard/account/forgot_password', {sent: 0});
    }
});

router.post('/', (req, res, next) => {
    var email = req.body.email;

    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },

        (token, done) => {
            User.findOne({email: email}, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return res.render('dashboard/account/forgot_password', {message: 'No account with that email address exists.'});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },

        (token, user, done) => {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'kdees912',
                    pass: '#Eagle1234',
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'admin@welink.com',
                subject: 'WeLink - Reset your password',
                text: 'Hello, \n\n' +
                      'We received a request to reset your password \n\n' +
                      'http://' + req.headers.host + '/dashboard/account/reset/' + token + '\n\n' + 
                      'Regards, \n\n'+
                      'WeLinkTeam.'
            };

            transporter.sendMail(mailOptions, (err) => {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err);
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.render('dashboard/account/forgot_password', {sent: 1});
    });
    // res.render('pages/blank', {message: 'Please check your email'});
});

module.exports = router;