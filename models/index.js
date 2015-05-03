'use strict';

var fs = require('fs');
var path = require('path');
var Q = require('q');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'production';
var config = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.addQuestions = function(questions) {
    return sequelize.transaction().then(function (t) {
        var promises = [];
        questions.forEach(function (sample) {
            var price = sample.value || '$0';
            price = parseInt(price.slice(1));
            var imageNumber = (Math.ceil(Math.random() * 20) % 16) + 1;
            var productPromise = db.Product.create({
                name: sample.question.slice(1, -1), // Remove first and end quotes
                answer: sample.answer,
                price: (isNaN(price)) ? Math.ceil(Math.random() * 20000) : price * 100,
                image: 'http://placekitten.com/120/90?image=' + imageNumber
            }, {transaction: t}).then(function(product) {
                var internalPromises = [];
                var categories = ['Round ' + sample.round];
                if (0 == product.id % 100) {
                    // Add some additional categories into DB
                    categories.push(sample.category.charAt(0) + sample.category.slice(1).toLowerCase());
                }
                categories.forEach(function (categoryName) {
                    var categoryPromise = db.Category
                        .findOrCreate({ where: { name: categoryName }}, { transaction: t })
                        .spread(function (category, created) {
                            return product.addCategories(category, {transaction: t});
                        });
                    internalPromises.push(categoryPromise);
                });
                var merchantPromise = db.Merchant
                    .findOrCreate({where: {name: sample.round}}, {transaction: t})
                    .spread(function (merchant, created) {
                        return merchant.addProduct(product, {transaction: t});
                    });
                internalPromises.push(merchantPromise);
                return Q.all(internalPromises);
            });
            promises.push(productPromise);
        });
        return Q.all(promises).then(function(result) {
            return t.commit()
        }).catch(function (err) {
            t.rollback();
            throw err;
        });
    });
};

module.exports = db;
