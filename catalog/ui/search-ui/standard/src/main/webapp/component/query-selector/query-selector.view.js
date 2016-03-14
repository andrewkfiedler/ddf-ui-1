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
/*global define*/
define([
    'marionette',
    'underscore',
    'jquery',
    'text!./query-selector.hbs',
    'js/CustomElements',
    'js/store'
], function (Marionette, _, $, querySelectorTemplate, CustomElements, store) {

    var QuerySelector = Marionette.LayoutView.extend({
        template: querySelectorTemplate,
        tagName: CustomElements.register('query-selector'),
        modelEvents: {
        },
        events: {
            'click .querySelector-add': 'addQuery',
            'click .querySelector-queryDetails': 'selectQuery'
        },
        ui: {
        },
        regions: {
        },
        initialize: function(){
            this.listenTo(this.model.get('searches'), 'all', this.render);
        },
        addQuery: function(){
            if (this.model.canAddQuery()){
                var queryId = this.model.addQuery();
                store.get('content').set('queryId', queryId);
            }
        },
        selectQuery: function(event){
            var queryId = event.currentTarget.getAttribute('data-id');
            store.get('content').set('queryId', queryId);
        },
        onRender: function(){
            this.handleMaxQueries();
        },
        handleMaxQueries: function(){
            this.$el.toggleClass('can-addQuery', this.model.canAddQuery());
        },
        test: function(){
            console.log('test');
        }
    });

    return QuerySelector;
});
