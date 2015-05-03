var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var PageView = require('./page');

var PaginationView = Backbone.View.extend({
    tagName: 'nav',
    initialize: function (options) {
        this.pageTemplate = options.pageTemplate;

        this.collection.on('read', this.render, this);
    },
    render: function () {
        this.$el.empty();

        var fragment = document.createDocumentFragment();
        var listNode = document.createElement('ul');
        $(listNode).addClass('pagination');

        var pagesRange = 4; // number of pages before and after current
        var totalPages = Math.ceil(this.collection.state.totalRecords / this.collection.pageSize);
        var start = Math.max(1, this.collection.state.page - pagesRange);
        var end = Math.min(totalPages, start + 2 * pagesRange);

        var pageView = new PageView({
            template: this.pageTemplate,
            model: {
                page: start - 1,
                isCurrent: false,
                isEnabled: (start > 1),
                isAria: true,
                label: 'Previous',
                name: '&laquo;'
            }
        });
        listNode.appendChild(pageView.render().el);

        for (var i = start; i <= end; i++) {
            pageView = new PageView({
                template: this.pageTemplate,
                model: {
                    page: i,
                    isCurrent: (i == this.collection.state.page),
                    isEnabled: true,
                    isAria: false,
                    label: i,
                    name: i
                }
            });
            listNode.appendChild(pageView.render().el);
        }

        pageView = new PageView({
            template: this.pageTemplate,
            model: {
                page: end + 1,
                isCurrent: false,
                isEnabled: (totalPages - end  > 0),
                isAria: true,
                label: 'Next',
                name: '&raquo;'
            }
        });
        listNode.appendChild(pageView.render().el);

        fragment.appendChild(listNode);
        this.el.appendChild(fragment);

        this.trigger('render');
        return this;
    }
});

module.exports = PaginationView;