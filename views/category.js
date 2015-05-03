var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var catalogDispatcher = require('../dispatcher');

var CategoryView = Backbone.View.extend({
    tagName: 'li',
    initialize: function (options) {
        this.template = options.template;
        this.isCurrent = options.isCurrent;
    },
    events: {
        'click': function (event) {
            if (!this.isCurrent) {
                catalogDispatcher.dispatch({
                    eventName: 'change:category',
                    categoryId: this.model.get('id')
                });
            }
            return false;
        }
    },
    render: function () {
        this.$el.empty();
        this.$el.attr({ role: 'presentation' });
        if (this.isCurrent) {
            this.$el.addClass('active');
        }
        this.$el.html(this.template( this.model.toJSON() ));
        this.trigger('render');
        return this;
    }
});

module.exports = CategoryView;