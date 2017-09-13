var express = require('express');
var router  = express.Router();
var async   = require('async');
var nodemailer = require('nodemailer');

User = require('../../../models/user');
Account = require('../../../models/account');
Plan = require('../../../models/plan');

router.get('/', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('dashboard/index', {message: 'Home Page'}); 
    } else {
        res.render('dashboard/account/signup'); 
    }
});

router.post('/', (req, res, next) => { 
    var name     = req.body.name;
    var password = req.body.password;
    var email    = req.body.email;
    var timezone = req.body.timezone;

    var user =  new User({
        "fullname" : name,
        "password" : password,
        "email"    : email,
        "timezone" : timezone,
        "user_type": 0,
        "status"   : 0,
    });

    async.waterfall([
        (next) => {
            user.save((err) => {
                if (err) {
                    res.render('dashboard/index', req.app.locals.appdata);
                } else {
                    next(null, user);
                }
            });
        },

        (user, next) => {
            Plan.findOne({plan_type: 0}, (err, plan) => {
                next(err, user, plan);
            }); 
        },

        (user, plan, next) => {
            var account = new Account();
            account.owner_id    = user.id;
            account.create_at   = user.create_at;
            account.expire_date = user.expire_date;
            account.plan_id     = plan.id;
            account.plan_taken_date = new Date();
            account.plan_start_date = new Date();
            account.plan_end_date = null;
            account.users.push(user.id);
            
            account.save((err) => {
                next(err, user, account);
            });

        },

        (user, account, next) => {
            var group = new Group();
            group.account_id = account.id;
            group.users.push(user.id);
            group.name = "No Groups";
            group.save((err) => {
                if (err) {
                    console.log("Create.js error occured while saving account.");
                } else {
                    next(null, user, account);
                }
            });
        },

        (user, account, next) => {
            user.account_id = account.id;
            user.save((err) => {
                if (err) {
                    console.log("Create.js error occured while saving user.");
                    console.log(err);    
                } else {
                    console.log("Create.js account saved successfully.");
                    res.cookie('email', email);
                    res.cookie('password', password);
                    res.cookie('user_type', 0);
                    res.cookie('user_id', user.id);
                    
                    res.redirect('/dashboard');
                    sendWelcomeMessage(name, email, req);
                    next(null);
                }
            });
        }

        ], (err) => {
            if (err) {
                console.log("Create.js error occured");
            }
        }

     );

});

router.post('/checkValidEmail', (req, res, next) => {
    var email = req.body.email;
    
    User.findOne({email: email}, function(err, user) {
		if (user != null) {
			res.send("invalid");
		} else {
			res.send("valid");
		}
        
        res.end();
    });  
});

sendWelcomeMessage = (name, email, req) => {
    var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'kdees912',
            pass: '#Eagle1234',
        }
    });

    var mailOptions = { 
        to: email,
        from: 'admin@welink.com',
        subject: 'Welcome to WeLink',
        text: 'Dear ' + name + ',\n\n' +
                'Thank you for registering your account on WeLink. \n\n' +
                'Get started by creating a monitor for your location to experience all the awesome features. \n\n' + 
                'Regards, \n\n'+
                'WeLinkTeam.'
    };

    transporter.sendMail(mailOptions, (err) => {
        req.flash('info', 'An e-mail has been sent to ' + email + ' with further instructions.');
    });
}

module.exports = router;