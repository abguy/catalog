"use strict";

module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define("Category", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING, unique: true }
    }, {
        timestamps: false,
        classMethods: {
            associate: function(models) {
                Category.belongsToMany(models.Product, { as: 'Products', through: models.ProductCategories });
            }
        }
    });

    return Category;
};