"use strict";

/**
 * Actually Sequelize generates this model automatically, but we need a relation to a Product model here.
 * Thus we implement it manually.
 */
module.exports = function(sequelize, DataTypes) {
    var ProductCategories = sequelize.define("ProductCategories", {
        ProductId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        CategoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        }
    }, {
        timestamps: false,
        classMethods: {
            associate: function(models) {
                ProductCategories.hasOne(models.Product, { as: 'Product', foreignKey: 'id', otherKey: 'ProductId' })
            }
        }
    });

    return ProductCategories;
};