var express = require('express');
var router  = express.Router();
var async   = require('async');
var path 	= require('path');
var moment      = require('moment-timezone');
var stripe      = require('stripe')('sk_test_5zjs1Gtx1gnaV7CqqhwHCOnV');

User = require('../../../models/user.js');
var PlanHelper      = require('../../../helpers/plan');
var AccountHelper   = require('../../../helpers/account'); 
var BillingHelper   = require('../../../helpers/billing');

router.get('/', (req, res, next) => {
    if (req.cookies.email && req.cookies.password) {
        res.render('dashboard/index', {message: 'Home Page'});
    } else {
        res.render('dashboard/account/login');
    }
});

router.post('/', (req, res, next) => {
    var email    = req.body.email;
    var password = req.body.password;

    User.findOne({email: email}, function(err, user) {
		if (err != null) {
			res.render('dashboard/account/login', {message: 'Error while logging in: ' + err});
			return;
		}
		
		if (user == null) {
			res.render('dashboard/account/login', {message: 'Email is incorrect.'});
			return;
		}

		user.comparePassword(password, function(err, isMatch) {
			if (err != null) {
				res.render('dashboard/account/login', {message: 'Error when comparing password: ' + err});
				return;
			}
		
			if (isMatch) {
				if (user.status == 2) { // deactivated
					res.render('dashboard/account/login', {message: 'Your account was deactivated'});
				} else {
					res.cookie('email', email);
					res.cookie('password', password);
					res.cookie('user_type', user.user_type);
					res.cookie('user_id', user.id);

					if (user.user_type == 2) {
						res.render('dashboard/index', {message: 'Login successful.'});
						return;
					} else {
						async.waterfall([
							(done) => {
								AccountHelper.getAccountByEmail(email, (err, account) => {
									done(err, account);
								});
							},

							(account, done) => {
								if (account.plan_end_date < new Date() || account.plan_end_date == null) {
									done(null, account);
								} else {
									res.render('dashboard/index', {message: 'Login successful.'});
									return;
								}
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

							(account, plan, billing, done) => {
								var amount;
								if (billing == null) {
									res.render('dashboard/index', {message: 'Login successful.'});
									return;
								}

								if (billing.billing_type == 0) {
									amount = plan.cost_monthly; 
								} else if (billing.billing_type == 1) {
									amount = plan.cost_yearly;
								}

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
										PlanHelper.getPlanByType(0, (err, plan) => {
											account.plan_id = plan.id;
											account.plan_taken_date = new Date();
											account.plan_start_date = new Date();
											account.plan_end_date = null;
											account.save((err) => {
												res.redirect('/dashboard/settings/plan?plan_changed=' + 0);
											});
										})
									} else {
										account.plan_id = plan.id;
										account.plan_taken_date = new Date();
										account.plan_start_date = new Date();
										account.plan_end_date   = moment(new Date()).add('months', 1).toDate();
										account.save((err) => {
											res.render('dashboard/index', {message: 'Login successful.'});
											return;
										});
									}
								});
								
							}
						]);
					}
					
				}
			} else {
				res.render('dashboard/account/login', {message: 'Login Error. Password is incorrect.'});
				return;
			}
		});				
	});
});

module.exports = router;