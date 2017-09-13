var express = require('express');
var router  = express.Router();

router.use('/account',          require('./account'));
router.use('/team',             require('./team')); 
router.use('/plan',             require('./plan'));
router.use('/audit',            require('./audit'));
router.use('/dictionaries',     require('./dictionaries'));
router.use('/apps',             require('./apps'));
router.use('/plugins',          require('./plugins'));
router.use('/widgets',          require('./widgets'));

module.exports = router;