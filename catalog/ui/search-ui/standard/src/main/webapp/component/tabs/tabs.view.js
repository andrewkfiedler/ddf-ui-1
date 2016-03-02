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

    var TabsView = Marionette.LayoutView.extend({
        template: 'Tabs',
        tagName: CustomElements.register('tabs'),
        modelEvents: {
            'all': 'rerender',
            'change:activeTab': 'showTab'
        },
        events: {
            'click .tabs-tab': 'changeTab'
        },
        regions: {
            'tabsContent': '.tabs-content'
        },
        initialize: function () {
        },
        rerender: function () {
            this.render();
        },
        showTab: function(){
            var currentTab = this.model.getActiveTab();
            this.$el.find('.tabs-tab').removeClass('is-active');
            this.$el.find('[data-id='+currentTab+']').addClass('is-active');
        },
        changeTab: function(event){
            var tab = event.currentTarget.getAttribute('data-id');
            this.model.setActiveTab(tab);
        }
    });

    return TabsView;
});