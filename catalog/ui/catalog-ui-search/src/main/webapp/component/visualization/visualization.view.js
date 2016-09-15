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
    'wreqr',
    'marionette',
    'js/CustomElements',
    './visualization.hbs',
    'component/visualization/maps/cesium/cesium.view',
    'component/visualization/maps/openlayers/openlayers.view',
    'component/visualization/histogram/histogram.view',
    'component/visualization/table/table.view',
    'component/visualization/inspector/inspector.view',
    'component/singletons/user-instance',
    'maptype',
    'component/visualization-selector/visualization-selector.view',
    'jquery-ui/resizable'
], function(wreqr, Marionette, CustomElements, template, CesiumView, OpenlayersView, HistogramView,
    TableView, InspectorView, user, maptype, VisualizationSelectorView) {

    function getActiveVisualization() {
        return user.get('user').get('preferences').get('visualization');
    }

    function getPreferences() {
        return user.get('user').get('preferences');
    }

    return Marionette.LayoutView.extend({
        tagName: CustomElements.register('visualization'),
        template: template,
        regions: {
            activeVisualization: '.visualization-container',
            visualizationSelector: '.visualization-selector'
        },
        events: {
            'click > .visualization-title .visualization-close': 'handleClose'
        },
        initialize: function() {
            this.listenTo(getPreferences(), 'change:visualization', this.onBeforeShow);
            this.listenTo(this.model, 'change:type', this.handleType);
            this.updateSize();
        },
        onBeforeShow: function() {
            this.handleType();
            this.visualizationSelector.show(new VisualizationSelectorView({
                model: this.model
            }));
        },
        onRender: function() {
            this.enableResizing();
        },
        showOpenlayers: function() {
            this.activeVisualization.show(new OpenlayersView({
                selectionInterface: this.options.selectionInterface
            }));
        },
        showCesium: function() {
            this.activeVisualization.show(new CesiumView({
                selectionInterface: this.options.selectionInterface
            }));
        },
        showMap: function() {
            if (maptype.is3d()) {
                this.showCesium();
            } else if (maptype.is2d()) {
                this.showOpenlayers();
            }
        },
        showHistogram: function() {
            this.activeVisualization.show(new HistogramView({
                selectionInterface: this.options.selectionInterface
            }));
        },
        showTable: function() {
            this.activeVisualization.show(new TableView({
                selectionInterface: this.options.selectionInterface
            }));
        },
        showInspector: function() {
            this.activeVisualization.show(new InspectorView({
                selectionInterface: this.options.selectionInterface
            }));
        },
        handleType: function() {
            this.$el.toggleClass('is-empty', !this.model.get('type'));
            switch (this.model.get('type')) {
                case 'cesium':
                    this.showCesium();
                    this.$el.find('> .visualization-title .title-type').html('3D Map');
                    break;
                case 'openlayers':
                    this.showOpenlayers();
                    this.$el.find('> .visualization-title .title-type').html('2D Map');
                    break;
                case 'table':
                    this.showTable();
                    this.$el.find('> .visualization-title .title-type').html('Table');
                    break;
                case 'histogram':
                    this.showHistogram();
                    this.$el.find('> .visualization-title .title-type').html('Histogram');
                    break;
                case 'inspector':
                    this.$el.find('> .visualization-title .title-type').html('Inspector');
                    this.showInspector();
                    break;
                default:
                    this.$el.find('> .visualization-title .title-type').html('Please select a visualization from below to continue.');
                    this.activeVisualization.empty();
                    break;
            };
        },
        updateSize: function() {
            this.$el.width(this.model.get('width'))
                .height(this.model.get('height'));
        },
        handleClose: function() {
            this.model.collection.remove(this.model);
        },
        enableResizing: function() {
            this.$el.resizable();
        }
    });

});