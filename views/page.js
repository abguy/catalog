var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var catalogDispatcher = require('../dispatcher');

var PageView = Backbone.View.extend({
    tagName: 'li',
    initialize: function (options) {
        this.template = options.template;
    },
    events: {
        'click a': function (event) {
            if (!this.model.isEnabled || this.model.isCurrent) {
                return false;
            }
            catalogDispatcher.dispatch({
                eventName: 'change:page',
                categoryId: this.model.page
            });
            return false;
        }
    },
    render: function () {
        this.$el.empty();
        if (!this.model.isEnabled) {
            this.$el.addClass('disabled');
        }
        if (this.model.isCurrent) {
            this.$el.addClass('active');
        }

        this.$el.html(this.template(this.model));
        this.trigger('render');
        return this;
    }
});

module.exports = PageView;