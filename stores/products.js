var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var catalogDispatcher = require('../dispatcher');

// We don't use original model here in order to minimize size of JS for browser
var ProductModel = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: null,
        image: null,
        answer: null,
        price: 0
    }
});

var ProductsCollecton = Backbone.Collection.extend({
    pageSize: 12,
    state: {
        page: 1,
        totalRecords: 0,
        categoryId: null
    },
    model: ProductModel,
    url: "/store",

    changeCategory: function (categoryId) {
        this.state.categoryId = categoryId;
        this.trigger('change:category');

        this.fetchFirstPage();
    },

    changePage: function (page) {
        if (page == this.state.page) {
            return;
        }
        if (page < 1) {
            return;
        }
        if ((page - 1) * this.pageSize > this.totalRecords) {
            return;
        }
        this.state.page = page;
        this.trigger('change:page');

        this.fetch();
    },

    /**
     * Parse server response data.
     * @see http://backbonejs.org/#Collection-parse
     *
     * @param {Object} response The deserialized response data from the server.
     * @param {Object} options The options for the ajax request.
     * @return {Array.<Object>} An array of model objects.
     */
    parse: function (response, options) {
        var xTotal = parseInt(options.xhr.getResponseHeader('X-total'));
        if (!isNaN(xTotal)) {
            this.state.totalRecords = xTotal;
        }

        return response;
    },

    /**
     * Resets collection by other model.
     * @see http://backbonejs.org/#Collection-reset
     *
     * @param {Array.<Object>} models An array of model objects.
     * @param {Object} options The options for the ajax request.
     * @return {Array.<Object>} An array of model objects.
     */
    reset: function(models, options) {
        var result = Backbone.Collection.prototype.reset.call(this, models, options);
        this.trigger('read');

        return result;
    },

    /**
     * Fetch a page from the server.
     * @see http://backbonejs.org/#Collection-fetch
     *
     * @param {Object} [options] Accepts all
     * @return {XMLHttpRequest}
     */
    fetch: function (options) {
        options = options || {};

        // '/skip/:offset/limit/:limit' or '/:category/skip/:offset/limit/:limit'
        var urlParts = [this.url];
        if (null !== this.state.categoryId) {
            urlParts.push(this.state.categoryId);
        }
        urlParts.push('skip');
        urlParts.push((this.state.page - 1) * this.pageSize);

        urlParts.push('limit');
        urlParts.push(this.pageSize);

        options.url = urlParts.join('/');
        options.reset = true;

        return Backbone.Collection.prototype.fetch.call(this, options);
    },

    /**
     * Fetch first page
     * @see http://backbonejs.org/#Collection-fetch
     *
     * @param {Object} [options] Accepts all
     * @return {XMLHttpRequest}
     */
    fetchFirstPage: function (options) {
        options = options || {};

        this.state.page = 1;
        this.state.totalRecords = 0;

        return this.fetch(options);
    }
});

var ProductsStore = function() {
    this.initialize.apply(this, arguments);
};

_.extend(ProductsStore.prototype, Backbone.Events, {
    initialize: function() {
        this.products = new ProductsCollecton();

        this.dispatchCategoriesToken = catalogDispatcher.register(function(payload) {
            if ('change:category' == payload.eventName) {
                this.products.changeCategory(payload.categoryId);
            }
            return true;
        }.bind(this));

        this.dispatchPaginationToken = catalogDispatcher.register(function(payload) {
            if ('change:page' == payload.eventName) {
                this.products.changePage(payload.categoryId);
            }
            return true;
        }.bind(this));
    }
});

module.exports = ProductsStore;
