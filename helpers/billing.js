/**
    * Created by kdees912 on 02/14/2017
    * Helper for Plan Model
*/

var async       = require('async');

Billing         = require('../models/billing');

BillingHelper = () => {

}

/**
    @param: 
        billingID: plan id
        callback: callback function (err, billing)
    @description:
        Get plan by id. If planID is null, return all plans.
*/
BillingHelper.getBillingById = (billingID, callback) => {
    Billing.findById(billingID, (err, billing) => {
        callback(err, billing);
    });
}

/**
    @param: 
        billingInfo: billing object
        callback: callback function (err, billingID)
    @description:
        Add new plan 
*/
BillingHelper.setBilling = (billingInfo, callback) => {

    var billing = new Billing({
        first_name:             billingInfo.firstName,
        last_name:              billingInfo.lastName,
        company_name:           billingInfo.companyName,
        country:                billingInfo.country,
        address:                billingInfo.address,
        city:                   billingInfo.city,
        postal_code:            billingInfo.postalCode,
        card_number:            billingInfo.cardNumber,
        card_expiration_month:  billingInfo.cardExpirationMonth,
        card_expiration_year:   billingInfo.cardExpirationYear,
        security_code:          billingInfo.securityCode, 
        billing_type:           billingInfo.billingType
    });

    billing.save((err) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, billing._id);
        }
    })
}

module.exports = BillingHelper;