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
            $(window).on('resize',function(){
                view._resizeHandler();
            });
        },
        onRender: function(){
            this.showTab();
            this.determineContent();
        },
        onShow: function(){
            this._resizeHandler();
        },
        handleTabChange: function(){
            this.showTab();
            this.determineContent();
        },
        showTab: function(){
            var currentTab = this.model.getActiveTab();
            this.$el.find('.is-active').removeClass('is-active');
            this.$el.find('[data-id='+currentTab+']').addClass('is-active');
        },
        serializeData: function () {
            return _.extend(this.model.toJSON(), {tabTitles: Object.keys(this.model.get('tabs'))});
        },
        determineContent: function(){
            throw 'You need to override determine content by extending this view.';
        },
        changeTab: function(event){
            var tab = event.currentTarget.getAttribute('data-id');
            this.model.setActiveTab(tab);
        },
        _collapsed: false,
        _widthWhenCollapsed: 0,
        _resizeHandler: function(){
            var view = this;
            var menu = view.el.querySelector('.tabs-list');
            var collapsedDropdown = view.el.querySelector('.tabs-collapsed');
            if (view._collapsed) {
                if (menu.clientWidth > view._widthWhenCollapsed) {
                    view._collapsed = false;
                    menu.classList.remove('is-collapsed');
                    menu.classList.remove('is-dropdown');
                    $(menu).off('click');
                }
            } else {
                if (menu.scrollWidth !== menu.clientWidth) {
                    view._collapsed = true;
                    view._widthWhenCollapsed = menu.scrollWidth;
                    menu.classList.add('is-collapsed');
                    menu.classList.add('is-dropdown');
                    $(collapsedDropdown).off('click').on('click', function () {
                        menu.classList.toggle('is-open');
                        if (menu.classList.contains('is-open')) {
                            $('body').on('click.menubar', function (e) {
                                if (e.target !== menu && $(menu).find(e.target).length === 0) {
                                    $('body').off('click.menubar');
                                    menu.classList.remove('is-open');
                                }
                            });
                        } else {
                            $('body').off('click.menubar');
                        }
                    });
                }
            }
        }
    });

    return TabsView;
});