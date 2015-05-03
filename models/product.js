"use strict";

module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define("Product", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        image: { type: DataTypes.STRING, allowNull: true },
        name: DataTypes.STRING,
        answer: DataTypes.STRING, // Just for fun
        price: DataTypes.INTEGER.UNSIGNED // Price in cents (meanwhile it could be FLOAT even in cents, but it is a test app)
    }, {
        indexes:[
            {
                type: "fulltext",
                fields: ["name"],
                name: "productname"
            }
        ],
        timestamps: false,
        classMethods: {
            associate: function(models) {
                Product.belongsToMany(models.Category, { as: 'Categories', through: models.ProductCategories });
            }
        }
    });

    return Product;
};