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
/*global require*/
var Marionette = require('marionette');
var CustomElements = require('js/CustomElements');
var template = require('./inspector.hbs')
var MetacardTabsView = require('component/tabs/metacard/tabs-metacard.view');
var MetacardsTabsView = require('component/tabs/metacards/tabs-metacards.view');
var MetacardsTitleView = require('component/metacard-title/metacard-title.view');

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('inspector'),
    template: template,
    regions: {
        'inspectorTabs': '> .inspector-container > .container-tabs',
        'inspectorTitle': '> .inspector-container > .container-title'
    },
    initialize: function() {
        this.setupListeners();
    },
    setupListeners: function() {
        this.listenTo(this.options.selectionInterface.getSelectedResults(), 'update add remove reset', this.showInspector);
    },
    onRender: function() {
        this.showInspector();
    },
    showInspector: function() {
        var selectedResults = this.options.selectionInterface.getSelectedResults();
        this.$el.toggleClass('is-empty', selectedResults.length === 0);
        if (selectedResults.length === 0) {
            this.$el.addClass('is-empty');
            this.inspectorTabs.empty();
            this.inspectorTitle.empty();
        } else {
            this.$el.removeClass('is-empty');
            this.handleResults(selectedResults);
        }
    },
    handleResults: function(selectedResults) {
        this.inspectorTitle.show(new MetacardsTitleView({
            model: selectedResults
        }));
        if (selectedResults.length === 1) {
            this.inspectorTabs.show(new MetacardTabsView({
                selectionInterface: this.options.selectionInterface
            }));
        } else {
            this.inspectorTabs.show(new MetacardsTabsView({
                selectionInterface: this.options.selectionInterface
            }));
        }
    }
});