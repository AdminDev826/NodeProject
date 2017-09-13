var express     = require('express');
var router      = express.Router();
var crypto      = require('crypto');
var async       = require('async');
var nodemailer  = require('nodemailer');
var Response    = require('../../../helpers/response');

AuditHelper     = require('../../../helpers/audit');
SocketHelper    = require('../../../helpers/socket');
Event           = require('../../../models/event'); 

User = require('../../../models/user'); 

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/index', {active_menu: "account"});
});

//0: success, 1: db_error, 2, password_not_matched
router.post('/changePassword', (req, res, next) => {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var email       = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangePassword').id,
        target: "",
        response: res});

    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        if (user == null) {
            Response.send(res, {result: 1});
        }

        user.comparePassword(oldPassword, (err, isMatch) => {
            if (err != null) {
                Response.send(res, {result: 1});
            }

            if (isMatch) {
                user.password = newPassword;

                user.save((err) => {
                    if (err != null) {
                        Response.send(res, {result: 1});
                    } else {
                        res.cookie('password', newPassword);
                        sendPasswordChangedMail(user);
                        Response.send(res, {result: 0});
                    }
                });
                
            } else {
                Response.send(res, {result: 2});
            }
        });
    });
});

router.post('/changeName', (req, res, next) => {
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var email = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeName').id,
        target: firstName + " " + lastName,
        response: res});

    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.fullname = firstName + " " + lastName;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.post('/changeTag', (req, res, next) => {
    var tag = req.body.tag;
    var email = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeTag').id,
        target: tag,
        response: res});

    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.tag = tag;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.post('/changeEmail', (req, res, next) => {
    var newEmail = req.body.email;
    var currentEmail = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeEmail').id,
        target: newEmail,
        response: res});

    User.findOne({email: currentEmail}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.email = newEmail;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.post('/changeLanguage', (req, res, next) => {
    var email = req.cookies.email;
    var language = req.body.language;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeLanguage').id,
        target: language.toUpperCase(),
        response: res});
    
    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.language = language;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.post('/changeDateFormat', (req, res, next) => {
    var email = req.cookies.email;
    var date_format = req.body.date_format;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeDateFormat').id,
        target: date_format,
        response: res});
    
    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.date_format = date_format;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.post('/changeTimezone', (req, res, next) => {
    var email = req.cookies.email;
    var timezone = req.body.timezone;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('ChangeTimezone').id,
        target: timezone,
        response: res});

    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1}); 
        }

        user.timezone = timezone;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                Response.send(res, {result: 0});
            }
        });
    });
});

router.get('/deactivate', (req, res, next) => {
    var email = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('DeactivateAccount').id,
        target: "",
        response: res});
    
    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        user.status = 2;
        user.save((err) => {
            if (err != null) {
                Response.send(res, {result: 1});
            } else {
                res.cookie('email', '');
                res.cookie('password', '');
                res.redirect('/dashboard/account/login');
            }
        });
    });
});

router.post('/getUserInfo', (req, res, next) => {
    var email = req.cookies.email;

    User.findOne({email: email}, (err, user) => {
        if (err != null) {
            Response.send(res, {result: 1});
        }

        Response.send(res, {result: 0, user: user});
    });
});

sendPasswordChangedMail = (user) => {
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
                'WeLinkTeam.'
    };

    transporter.sendMail(mailOptions, (err) => {
        console.log(err);
        console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    });
}

module.exports = router;