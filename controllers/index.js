var express         = require('express');
var router          = express.Router();
var async           = require('async');

var Response        = require('../helpers/response');
var MessageHelper   = require("../helpers/message.js");
var MailHelper      = require("../helpers/mail.js");

router.use('/dashboard',    require('./dashboard'));
router.use('/apps',         require('./apps'));

router.get('/', (req, res) => {
    console.log('Language', req.language);
    if (req.cookies.email && req.cookies.password) {
        res.render('index', {logged_in: true});
    } else {
        res.render('index', {logged_in: false});
    }
});

router.get('/solutions/account-impersonations', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-account-impersonations', {logged_in: true});
    } else {
        res.render('home/solutions-account-impersonations', {logged_in: false});
    }
});

router.get('/solutions/brand-protection', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-brand-protection', {logged_in: true});
    } else {
        res.render('home/solutions-brand-protection', {logged_in: false});
    }
});
router.get('/solutions/crisis-management', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-crisis-management', {logged_in: true});
    } else {
        res.render('home/solutions-crisis-management', {logged_in: false});
    }
});
router.get('/solutions/customer-engagement', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-customer-engagement', {logged_in: true});
    } else {
        res.render('home/solutions-customer-engagement', {logged_in: false});
    }
});
router.get('/solutions/cyber-security-support', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-cyber-security-support', {logged_in: true});
    } else {
        res.render('home/solutions-cyber-security-support', {logged_in: false});
    }
});
router.get('/solutions/event-security', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-event-security', {logged_in: true});
    } else {
        res.render('home/solutions-event-security', {logged_in: false});
    }
});
router.get('/solutions/executive-protection', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-executive-protection', {logged_in: true});
    } else {
        res.render('home/solutions-executive-protection', {logged_in: false});
    }
});
router.get('/solutions/public-safety', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-public-safety', {logged_in: true});
    } else {
        res.render('home/solutions-public-safety', {logged_in: false});
    }
});
router.get('/solutions/scam-protection', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-scam-protection', {logged_in: true});
    } else {
        res.render('home/solutions-scam-protection', {logged_in: false});
    }
});
router.get('/solutions/security-operations-center', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/solutions-security-operations-center', {logged_in: true});
    } else {
        res.render('home/solutions-security-operations-center', {logged_in: false});
    }
});

router.get('/industry/corporate-security', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-corporate-security', {logged_in: true});
    } else {
        res.render('home/industry-corporate-security', {logged_in: false});
    }
});

router.get('/industry/emergency-response', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-emergency-response', {logged_in: true});
    } else {
        res.render('home/industry-emergency-response', {logged_in: false});
    }
});

router.get('/industry/financial-services', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-financial-services', {logged_in: true});
    } else {
        res.render('home/industry-financial-services', {logged_in: false});
    }
});

router.get('/industry/healthcare', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-healthcare', {logged_in: true});
    } else {
        res.render('home/industry-healthcare', {logged_in: false});
    }
});

router.get('/industry/political-campaigns', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-political-campaigns', {logged_in: true});
    } else {
        res.render('home/industry-political-campaigns', {logged_in: false});
    }
});

router.get('/industry/oil-energy-utilities-providers', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/industry-oil-energy-utilities-providers', {logged_in: true});
    } else {
        res.render('home/industry-oil-energy-utilities-providers', {logged_in: false});
    }
});

router.get('/products/cloud', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/products-cloud', {logged_in: true});
    } else {
        res.render('home/products-cloud', {logged_in: false});
    }
});

router.get('/products/on-premises', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/products-on-premises', {logged_in: true});
    } else {
        res.render('home/products-on-premises', {logged_in: false});
    }
});

router.get('/features/location-based-monitoring', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-location-based-monitoring', {logged_in: true});
    } else {
        res.render('home/features-location-based-monitoring', {logged_in: false});
    }
});

router.get('/features/trueid', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-trueid', {logged_in: true});
    } else {
        res.render('home/features-trueid', {logged_in: false});
    }
});

router.get('/features/keyword-based-monitoring', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-keyword-based-monitoring', {logged_in: true});
    } else {
        res.render('home/features-keyword-based-monitoring', {logged_in: false});
    }
});

router.get('/features/sentiment-analysis', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-sentiment-analysis', {logged_in: true});
    } else {
        res.render('home/features-sentiment-analysis', {logged_in: false});
    }
});

router.get('/features/streamer', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-streamer', {logged_in: true});
    } else {
        res.render('home/features-streamer', {logged_in: false});
    }
});

router.get('/features/trueid', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/features-trueid', {logged_in: true});
    } else {
        res.render('home/features-trueid', {logged_in: false});
    }
});

router.get('/partners/mssp', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/partners-mssp', {logged_in: true});
    } else {
        res.render('home/partners-mssp', {logged_in: false});
    }
});
router.get('/partners/oem', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/partners-oem', {logged_in: true});
    } else {
        res.render('home/partners-oem', {logged_in: false});
    }
});
router.get('/partners/resellers', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/partners-resellers', {logged_in: true});
    } else {
        res.render('home/partners-resellers', {logged_in: false});
    }
});
router.get('/partners/technology', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/partners-technology', {logged_in: true});
    } else {
        res.render('home/partners-technology', {logged_in: false});
    }
});

router.get('/pricing/cloud', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/pricing-cloud', {logged_in: true});
    } else {
        res.render('home/pricing-cloud', {logged_in: false});
    }
});

router.get('/pricing/on-premises', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('home/pricing-on-premises', {logged_in: true});
    } else {
        res.render('home/pricing-on-premises', {logged_in: false});
    }
});

router.get('/about', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('pages/about', {logged_in: true});
    } else {
        res.render('pages/about', {logged_in: false});
    }
});

router.get('/contact', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('pages/contact', {logged_in: true});
    } else {
        res.render('pages/contact', {logged_in: false});
    }
});

router.get('/faq', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('pages/faq', {logged_in: true});
    } else {
        res.render('pages/faq', {logged_in: false});
    }
});

//POST
router.post("/support", (req, res, next) => {
    var name        = req.body.name;
    var email       = req.body.email;
    var phone       = req.body.phone;
    var message     = req.body.message;
    var subject     = req.body.subject;

    async.waterfall([
        (done) => {
            MailHelper.sendMessageToSupport(name, email, phone, subject, message, function(err, success){
                done(err, success);
            });
        },
        (success, done) => {
            MessageHelper.save({
                type: 0,
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message
            }, function(err, success){
                Response.send(res, {success: success});
            });
        }
    ]);
});

module.exports = router;
