var express     = require('express');
var router      = express.Router();
var async       = require('async');
var nodemailer  = require('nodemailer');

AccountHelper   = require('../../../helpers/account');
AuditHelper     = require('../../../helpers/audit');
Event           = require('../../../models/event');
User            = require('../../../models/user');

router.get('/:token', (req, res, next) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
        console.log(req.params.token);
        console.log("Error", err);
        console.log("User", user);

        if (!user) {
            res.render('dashboard/account/forgot_password', {message: 'Password reset token is invalid or has expired.'});
            return;
        }

        res.render('dashboard/account/reset');
    });
});

router.post('/:token', (req, res, next) => {
    async.waterfall([
        (done) => {
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
                if (!user) {
                    return res.render('dashboard/account/forgot_password', {message: 'Password reset token is invalid or has expired.'});
                }

                user.password               = req.body.password;
                user.resetPasswordToken     = undefined;
                user.resetPasswordExpires   = undefined;
                user.status = 0;

                user.save((err) => {
                    if (err) {
                        return res.render('dashboard/account/forgot_password', {message: 'Error while reset password' + err});
                    }

                    AccountHelper.getAccountById(user.account_id, (err, account) => {
                        if (account.users.length > 1) {
                            AuditHelper.save({
                                email: user.email,
                                user_id: user.id,
                                event: Event.getEventByType('Join').id,
                                target: "",
                                response: res});
                        }
                    });

                    res.render('dashboard/account/login');
                    done(err, user);
                });
            });
        },

        (user, done) => {
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
                subject: 'Your password has been changed',
                text: 'Dear, ' + user.fullname + '\n\n' +
                      'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n\n' +
                      'Regards, \n\n'+
                      'WeLink Team.'
            };

            transporter.sendMail(mailOptions, (err) => {
                console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            });
        }
    ], (err) => {
        res.redirect('/');
    });
    // res.render('dashboard/index', req.app.locals.appdata);
});

module.exports = router;
