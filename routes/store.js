var express = require('express');
var _ = require('underscore');
var router = express.Router();
var models  = require('../models');

var validateInt = function(req, res, next, value) {
    if (value != parseInt(value, 10) || value < 0 || value > 1000) {
        return next(new Error('Invalid request.'));
    }
    next();
};

router.param('offset', validateInt);
router.param('limit', validateInt);
router.param('category', validateInt);

function getQueryParams(req) {
    var filter = req.query.filter;
    return {
        where: ('undefined' == typeof filter)
            ? {}
            : { name: { like: '%' + filter + '%' }} //@info SQL injection is not possible, filter is escaped properly.
            // @fixme There is no proper way to escape "%" symbol in Sequelize now.
            // @fixme Do we really need to search by firt "%" symbol? It affects performance
    };
}

function doFilterProducts(finderObject, finderMethod, queryParams, req, res, next) {
    queryParams = _.extend(queryParams, {
        order: [['id']],
        limit: req.params.limit,
        offset: req.params.offset
    });
    finderMethod.call(finderObject, queryParams).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        next(new Error(err));
    });
}

router.get('/skip/:offset/limit/:limit', function(req, res, next) {
    var queryParams = getQueryParams(req);
    models.Product.count(queryParams).then(function(results) {
        res.setHeader('X-total', results);
        doFilterProducts(models.Product, models.Product.findAll, queryParams, req, res, next);
    }).catch(function(err) {
        next(new Error(err));
    });
});

router.get('/:category/skip/:offset/limit/:limit', function(req, res, next) {
    models.Category.find(req.params.category).then(function(category) {
        if (null === category) {
            return next(new Error('Unknown category "' + req.params.category + '".'));
        }
        var queryParams = getQueryParams(req);
        var countQueryParams = _.clone(queryParams);

        countQueryParams.attributes = [[
            models.Sequelize.fn('COUNT', models.Sequelize.col('ProductCategories.ProductId')),
            'ProductCount'
        ]];
        countQueryParams.where['ProductCategories.CategoryId'] = category.id;
        // @todo implement filter by product name
        models.ProductCategories.findAll(countQueryParams).then(function(results) {
            res.setHeader('X-total', results[0].dataValues.ProductCount);

            doFilterProducts(category, category.getProducts, queryParams, req, res, next);
        }).catch(function(err) {
            next(new Error(err));
        });
    }).catch(function(err) {
        next(new Error(err));
    });
});

module.exports = router;
