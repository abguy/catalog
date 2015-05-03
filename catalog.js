'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
global.jQuery = $; // export for bootstrap.js

var Router = require('./stores/router');
var CategoriesStore = require('./stores/categories');
var ProductsStore = require('./stores/products');
var CategoriesView = require('./views/categories');
var ProductsView = require('./views/products');
var PaginationView = require('./views/pagination');

$(function() {
    var categoriesStore = new CategoriesStore();
    var productsStore = new ProductsStore();
    var router = new Router();

    var categoriesView = new CategoriesView({
        collection: categoriesStore.categories,
        categoryTemplate: _.template($('#categoryTemplate').html())
    });
    $('#categoriesContainer').append(categoriesView.render().el);

    var productsView = new ProductsView({
        collection: productsStore.products,
        productTemplate: _.template($('#productTemplate').html())
    });
    $('#productsContainer').append(productsView.render().el);
    var paginationView = new PaginationView({
        collection: productsStore.products,
        pageTemplate: _.template($('#pageTemplate').html())
    });
    $('#productsContainer').append(paginationView.render().el);

    Backbone.history.start({pushState: true});
    router.navigate(Backbone.history.fragment, {trigger: true});
});