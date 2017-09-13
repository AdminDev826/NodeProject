var express = require('express');
var router  = express.Router();

router.use('/locations',    require('./locations'));
router.use('/keywords',     require('./keywords'));

module.exports = router;