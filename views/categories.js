var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
Backbone.$ = $;
var CategoryView = require('./category');

var CategoriesView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function (options) {
        this.categoryTemplate = options.categoryTemplate;

        this.collection.on('read', this.render, this);
        this.collection.on('change:current', this.render, this);
    },
    render: function () {
        this.$el.empty();
        this.$el.addClass('nav nav-pills nav-stacked');

        var fragment = document.createDocumentFragment();
        var ResetCategoryModel = Backbone.Model.extend({});
        var resetCategoryView = new CategoryView({
            model: new ResetCategoryModel({ id: null, name: 'All categories' }),
            template: this.categoryTemplate,
            isCurrent: (null == this.collection.currentCategoryId)
        });
        fragment.appendChild(resetCategoryView.render().el);

        for (var i = 0; i < this.collection.length; i++) {
            var category = this.collection.at(i);
            var categoryView = new CategoryView({
                model: category,
                template: this.categoryTemplate,
                isCurrent: (category.get('id') == this.collection.currentCategoryId)
            });
            fragment.appendChild(categoryView.render().el);
        }
        this.el.appendChild(fragment);

        this.trigger('render');
        return this;
    }
});

module.exports = CategoriesView;