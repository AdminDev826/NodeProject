var express     = require('express');
var async       = require('async');
var countries   = require('country-list')();
var moment      = require('moment-timezone');
var stripe      = require('stripe')('sk_test_5zjs1Gtx1gnaV7CqqhwHCOnV');
var router      = express.Router();
var Response    = require('../../../helpers/response'); 

var PlanHelper      = require('../../../helpers/plan');
var AccountHelper   = require('../../../helpers/account');
var BillingHelper   = require('../../../helpers/billing');
var AuditHelper     = require('../../../helpers/audit');
var Event           = require('../../../models/event');

router.get('/', (req, res, next) => {
    var email   = req.cookies.email;
    var userID  = req.cookies.user_id;
    var role    = req.cookies.user_type; 
    var planChanged = req.query.plan_changed;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },
        
        (account, done) => {
            PlanHelper.getPlanById(account.plan_id, (err, plan) => {
                done(err, account, plan);
            });
        },

        (account, plan, done) => {
            BillingHelper.getBillingById(account.billing_id, (err, billing) => {
                done(err, account, plan, billing);
            });
        },

        (account, currentPlan, billing, done) => {
            PlanHelper.getPlanById(null, (err, plans) => {
                if (err) {
                    Response.send(res, {result: 1, message: err});
                } else {
                    var message;

                    if (planChanged == 0) {
                        message = "Sorry, we cannot change your plan. Please check your payment information.";
                    } else if (planChanged == 1) {
                        message = "Plan changed successfully."
                    }

                    res.render('dashboard/settings/index', {
                        active_menu: "plan", 
                        currentPlan: currentPlan, 
                        allPlans: plans, 
                        account: account, 
                        billing: billing, 
                        role: role,
                        planChanged: {
                            success: planChanged,
                            message: message   
                        }
                    });
                }
            });
        }
    ]);
    
});

router.get('/billing', (req, res, next) => {
    var email   = req.cookies.email;

    res.render('dashboard/settings/plan/billing'); 
});

router.post('/billing', (req, res, next) => {
    var email   = req.cookies.email;

    AuditHelper.save({
        email: req.cookies.email, 
        user_id: req.cookies.user_id, 
        event: Event.getEventByType('UpdateBilling').id,
        target: "",
        response: res});

    var billing = {
        firstName:            req.body.firstName,
        lastName:             req.body.lastName,
        companyName:          req.body.companyName,
        country:              req.body.country,
        address:              req.body.address,
        city:                 req.body.city,
        postalCode:           req.body.postalCode,
        cardNumber:           req.body.cardNumber,
        cardExpirationMonth:  req.body.cardExpirationMonth,
        cardExpirationYear:   req.body.cardExpirationYear,
        securityCode:         req.body.securityCode,
        billingType:          req.body.billingType
    };

    async.waterfall([
        (done) => {
            BillingHelper.setBilling(billing, (err, billingID) => {
                if (billingID == null) {
                    Response.send(res, {result: 1, message: err});
                } else {
                    done(err, billingID);
                }
            });
        },

        (billingID, done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                account.billing_id = billingID;
                account.save((err) => {
                    if (err) {
                        Response.send(res, {result: 1, message: err});
                    } else {
                        res.redirect('/dashboard/settings/plan'); 
                    }
                });
            });
        }
    ]);
});

router.get('/changePlan', (req, res, next) => {
    var email   = req.cookies.email;
    var planID  = req.query.planID;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },

        (account, done) => {
            PlanHelper.getPlanById(planID, (err, plan) => {
                done(err, account , plan);
            });
        }, 

        (account, plan, done) => {
            BillingHelper.getBillingById(account.billing_id, (err, billing) => {
                done(err, account, plan, billing);
            })
            
        },

        (account, plan, billing, done) => {
            var amount;
            if (billing.billing_type == 0) {
                amount = plan.cost_monthly; 
            } else if (billing.billing_type == 1) {
                amount = plan.cost_yearly;
            }

            if (amount == 0) {
                AccountHelper.getAccountByEmail(email, (err, account) => {
                    account.plan_id = planID;
                    account.plan_taken_date = new Date();
                    account.plan_start_date = new Date();
                    account.plan_end_date   = null;
                    account.save((err) => {
                        res.redirect('/dashboard/settings/plan?plan_changed=' + 1);
                        return;
                    });
                });
            } else {
                stripe.charges.create({
                    amount:         amount * 100, 
                    currency:       'usd',
                    card: {
                        number:     billing.card_number,
                        exp_month:  billing.card_expiration_month,
                        exp_year:   billing.card_expiration_year,
                        cvc:        billing.security_code
                    },
                    description:    "Charge for " + email
                }, (err, charge) => {
                    if (err) {
                        res.redirect('/dashboard/settings/plan?plan_changed=' + 0);
                        return;
                    } else {
                        AccountHelper.getAccountByEmail(email, (err, account) => {
                            account.plan_id = planID;
                            account.plan_taken_date = new Date();
                            account.plan_start_date = new Date();
                            account.plan_end_date   = moment(new Date()).add('months', 1).toDate();
                            account.save((err) => {
                                AuditHelper.save({
                                    email: req.cookies.email, 
                                    user_id: req.cookies.user_id, 
                                    event: Event.getEventByType('ChangePlan').id,
                                    target: plan.name,
                                    response: res});

                                res.redirect('/dashboard/settings/plan?plan_changed=' + 1);
                                return;
                            });
                        }); 
                    }
                });
            }
        }
    ]);
    

       
});

router.post("/getBillingInfo", (req, res, next) => {
    var email = req.cookies.email;

    async.waterfall([
        (done) => {
            AccountHelper.getAccountByEmail(email, (err, account) => {
                done(err, account);
            });
        },

        (account, done) => {
            BillingHelper.getBillingById(account.billing_id, (err, billing) => {
                if (err) {
                    Response.send(res, {result: 1, message: err});
                } else {
                    if (billing == null) {
                        Response.send(res, {
                            result: 2, 
                        });
                    } else {
                        Response.send(res, {
                            result: 0,
                            firstName:              billing.first_name,
                            lastName:               billing.last_name,
                            companyName:            billing.company_name,
                            country:                billing.country,
                            address:                billing.address,
                            city:                   billing.city,
                            postalCode:             billing.postal_code,
                            cardExpirationMonth:    billing.card_expiration_month,
                            cardExpirationYear:     billing.card_expiration_year
                        });
                    }
                }
            });
        }
        
    ]);
});

router.post("/getCountries", (req, res, next) => {
    Response.send(res, {result: 0, countries: countries.getNames()});
});

module.exports = router;