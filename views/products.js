var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var ProductView = require('./product');

var ProductsView = Backbone.View.extend({
    tagName: 'div',
    initialize: function (options) {
        this.productTemplate = options.productTemplate;

        this.collection.on('read', this.render, this);
    },
    render: function () {
        this.$el.empty();

        var fragment = document.createDocumentFragment();

        for (var i = 0; i < this.collection.length; i++) {
            // @fixme Condition is ugly hardcoded here, but it is a requirement
            if (0 == i / 4 % 1) {
                var row = document.createElement('div');
                $(row).addClass('row');
                fragment.appendChild(row);
            }
            var product = this.collection.at(i);
            var productView = new ProductView({
                model: product,
                template: this.productTemplate
            });
            row.appendChild(productView.render().el);
        }
        this.el.appendChild(fragment);

        this.trigger('render');
        return this;
    }
});

module.exports = ProductsView;