var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var catalogDispatcher = require('../dispatcher');

var Router = Backbone.Router.extend({
    initialize: function (options) {
        this.dispatchToken = catalogDispatcher.register(function(payload) {
            if ('change:category' == payload.eventName) {
                this.setCategory(payload.categoryId);
            }
            return true;
        }.bind(this));
    },
    routes: {
        '': 'mainRoute',
        'category/:categoryId': 'categoryRoute'
    },
    mainRoute: function () {
        this.doRoute(null);
    },
    categoryRoute: function (categoryId) {
        this.doRoute(categoryId);
    },
    doRoute: function (categoryId) {
        // We have no view, so emulate its actions by router self instead of making synthetic view
        catalogDispatcher.dispatch({
            eventName: 'change:category',
            categoryId: categoryId
        });
    },
    setCategory: function (categoryId) {
        this.navigate((null == categoryId) ? '' : 'category/' + categoryId);
    }
});

module.exports = Router;
