var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/', function(req, res, next) {
    models.Category.findAll({ order: [['id']] })
        .then(function(results) {
            res.json(results);
        }).catch(function(err) {
            next(new Error(err));
        });
});

module.exports = router;