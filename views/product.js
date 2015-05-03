var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var ProductView = Backbone.View.extend({
    tagName: 'div',
    initialize: function (options) {
        this.template = options.template;
    },
    events: {
        'click .btn': function (event) {
            this.$el.find('.btn').addClass('hidden');
            this.$el.find('h4').removeClass('hidden');
            return false;
        }
    },
    render: function () {
        this.$el.empty();
        this.$el.addClass('col-sm-6 col-md-3');

        this.$el.html(this.template( this.model.toJSON() ));
        this.trigger('render');
        return this;
    }
});

module.exports = ProductView;