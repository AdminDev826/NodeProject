var express         = require('express');
var async           = require('async');
var nodemailer      = require('nodemailer');
var Config          = require("../config");
var configuration   = require('../config').load();
var Transporter     = nodemailer.createTransport({
    service:    configuration.mailService.service,
    auth:       configuration.mailService.auth
});

MailHelper = () => {

}

/** 
    @param: 
        email:          member email address
        firstName:      member's first name
        lastName:       member's last name
        link:           link to join
        callback :      callback function (err, success)
    @description:
        send invitation mail to someone.
*/
MailHelper.sendInviteMail = (email, firstName, lastName, link, callback) => {
    var mailOptions = { 
        to: email,
        from: 'admin@welink.com',
        subject: 'Welcome to WeLink',
        text: 'Dear ' + firstName + " " + lastName + ',\n\n' +
                'You have received invitation. \n\n' +
                'Get started by clicking following link to experience all the awesome features. \n\n' + 
                link + '\n\n' +
                'Regards, \n\n'+
                'WeLinkTeam.'
    };

    Transporter.sendMail(mailOptions, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    });
}

var EmailTemplate = require("email-templates").EmailTemplate;
var path = require("path");
var templateDir = path.join(Config.DOCUMENT_ROOT, "templates", "support");
var support = new EmailTemplate(templateDir);

MailHelper.sendMessageToSupport = (name, email, phone, subject, message, callback) => {
    support.render({
        name: name,
        subject: subject,
        email: email,
        phone: phone,
        message: message
    }, function(err, result) { 
        var mailOptions = {
            to: "test@welink.com",
            from: email,
            subject: subject,
            html: result.html
        };
        Transporter.sendMail(mailOptions, (err) => {
            if (err) {
                callback(err, false);
            } else {
                callback(err, true);
            }
        });
    });
}

module.exports = MailHelper;