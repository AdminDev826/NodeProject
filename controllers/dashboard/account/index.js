var express = require('express');
var router  = express.Router();

router.use('/login',            require('./login'));
router.use('/signup',           require('./create'));
router.use('/forgot_password',  require('./forgot_password'));
router.use('/reset',            require('./reset'));

router.get('/logout', (req, res) => {
    res.clearCookie('email');
    res.clearCookie('password');
    res.clearCookie('user_type');

    res.redirect('/');
});


module.exports = router;