/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define, alert*/
define([
    'marionette',
    'icanhaz',
    'underscore',
    'jquery',
    'text!./tabs.hbs',
    'js/CustomElements'
], function (Marionette, ich, _, $, TabsTemplate, CustomElements) {

    ich.addTemplate('Tabs', TabsTemplate);

    /** This is an abstract view.  It should not be used directly.  It should be extended,
     *  and determineContent should be overwritten.
     */

    var TabsView = Marionette.LayoutView.extend({
        template: 'Tabs',
        tagName: CustomElements.register('tabs'),
        modelEvents: {
            'change:activeTab': 'handleTabChange'
        },
        events: {
            'click .tabs-tab': 'changeTab'
        },
        regions: {
            'tabsContent': '.tabs-content'
        },
        initialize: function () {
            var view = this;
            $(window).on('resize', function () {
                view._resizeHandler();
            });
        },
        onRender: function () {
            this.showTab();
            this.determineContent();
        },
        onShow: function () {
            this._resizeHandler();
        },
        handleTabChange: function () {
            this.showTab();
            this.determineContent();
        },
        showTab: function () {
            var currentTab = this.model.getActiveTab();
            this.$el.find('.is-active').removeClass('is-active');
            this.$el.find('[data-id=' + currentTab + ']').addClass('is-active');
        },
        serializeData: function () {
            return _.extend(this.model.toJSON(), {tabTitles: Object.keys(this.model.get('tabs'))});
        },
        determineContent: function () {
            throw 'You need to override determine content by extending this view.';
        },
        changeTab: function (event) {
            var tab = event.currentTarget.getAttribute('data-id');
            this.model.setActiveTab(tab);
        },
        _widthWhenCollapsed: [],
        _resizeHandler: function () {
            var view = this;
            var menu = view.el.querySelector('.tabs-list');
            console.log('scrollWidth:'+menu.scrollWidth);
            console.log('clientWidth:'+menu.clientWidth);
            if (view._hasMergeableTabs() && menu.scrollWidth > menu.clientWidth) {
                view._widthWhenCollapsed.push(menu.scrollWidth+1);
                view._mergeTab();
                view._resizeHandler();
            } else {
                if (view._widthWhenCollapsed.length !== 0
                    && menu.clientWidth > view._widthWhenCollapsed[view._widthWhenCollapsed.length - 1]) {
                    view._widthWhenCollapsed.pop();
                    view._unmergeTab();
                    view._resizeHandler();
                }
            }
            if (menu.querySelectorAll('.is-merged').length > 0) {
                var alreadyCollapsed = menu.classList.contains('is-collapsed');
                if (!alreadyCollapsed) {
                    menu.classList.add('is-collapsed');
                    view._resizeHandler();
                }
            } else {
                menu.classList.remove('is-collapsed');
            }
        },
        _hasMergeableTabs: function(){
            return this.$el.find('.tabs-list .tabs-expanded > .tabs-tab:not(.is-merged)').length !==0;
        },
        _mergeTab: function () {
            this.$el.find('.tabs-list .tabs-expanded > .tabs-tab:not(.is-merged)')
                .last().addClass('is-merged');
        },
        _unmergeTab: function () {
            this.$el.find('.tabs-list .tabs-expanded > .tabs-tab.is-merged')
                .first().removeClass('is-merged');
        }
    });

    return TabsView;
});