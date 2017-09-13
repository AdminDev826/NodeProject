var express         = require('express');
var CryptoJS        = require('crypto-js');
var router          = express.Router();
var async           = require('async');
var Response        = require('../../../helpers/response');

router.get('/', (req, res, next) => {
    res.render('dashboard/settings/widgets/index');
});

router.get('/audit', (req, res, next) => {
    res.render('dashboard/settings/widgets/audit');
});

router.post('/getEncryptedData', (req, res, next) => {
    Response.send(res, {success: true, encryptedData: CryptoJS.AES.encrypt(req.cookies.email, "encrypt_secret_key_welink").toString()});
});

module.exports = router;