"use strict";

module.exports = function(sequelize, DataTypes) {
    var Merchant = sequelize.define("Merchant", {
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
                Merchant.hasMany(models.Product, { as: 'Products' })
            }
        }
    });

    return Merchant;
};