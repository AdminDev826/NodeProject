var express = require('express');
var router  = express.Router();

router.use('/account',        require('./account'));
router.use('/settings',       require('./settings'));

router.get('/', (req, res) => {
    console.log('Language', req.language);
    if (req.cookies.email && req.cookies.password) {
        res.render('dashboard/index');
    } else {
        res.redirect('/dashboard/account/login');
    }
});

module.exports = router;
