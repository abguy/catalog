var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var catalogDispatcher = require('../dispatcher');

// We don't use original model here in order to minimize size of JS for browser
var CategoryModel = Backbone.Model.extend({});

var CategoriesCollecton = Backbone.Collection.extend({
    currentCategoryId: null,
    setCurrent: function(categoryId) {
        this.currentCategoryId = categoryId;
        this.trigger('change:current');
    },
    model: CategoryModel,
    url: "/categories"
});

var CategoriesStore = function() {
    this.initialize.apply(this, arguments);
};

_.extend(CategoriesStore.prototype, Backbone.Events, {
    initialize: function() {
        this.dispatchToken = catalogDispatcher.register(function(payload) {
            if ('change:category' == payload.eventName) {
                this.categories.setCurrent(payload.categoryId);
            }
            return true;
        }.bind(this));

        this.categories = new CategoriesCollecton();
        this.categories.fetch().then(function() {
            this.trigger('read');
        }.bind(this.categories));
    }
});

module.exports = CategoriesStore;
