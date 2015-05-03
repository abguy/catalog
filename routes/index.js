var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Products Catalog' });
});
router.get('/category/:category', function(req, res, next) {
    res.render('index', { title: 'Products Catalog' });
});

module.exports = router;
