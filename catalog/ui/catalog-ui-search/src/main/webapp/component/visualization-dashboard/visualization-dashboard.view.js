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
var $ = require('jquery');
var Marionette = require('marionette');
var MarionetteRegion = require('js/Marionette.Region');
var VisualizationCollectionView = require('component/visualization/visualization.collection.view');
var template = require('./visualization-dashboard.hbs');
var CustomElements = require('js/CustomElements');
var user = require('component/singletons/user-instance');
var GoldenLayout = require('golden-layout');
var CesiumView = require('component/visualization/maps/cesium/cesium.view');
var InspectorView = require('component/visualization/inspector/inspector.view');

function getVisualizations() {
    return user.get('user').get('preferences').get('visualizations');
}

module.exports = Marionette.LayoutView.extend({
    tagName: CustomElements.register('visualization-dashboard'),
    template: template,
    events: {
        'click > .dashboard-footer button': 'addVisualization'
    },
    regions: {
        'visualizations': '.dashboard-container'
    },
    initialize: function() {
        this.handleEmpty();
        this.listenTo(getVisualizations(), 'reset add remove update', this.handleEmpty);
    },
    onBeforeShow: function() {
        var config = {
            settings: {
                showPopoutIcon: false
            },
            content: [{
                type: 'row',
                content: [{
                    type: 'component',
                    componentName: 'cesium',
                    componentState: {}
                }, {
                    type: 'column',
                    content: [{
                        type: 'component',
                        componentName: 'inspector',
                        componentState: {}
                    }]
                }]
            }]
        };
        var myLayout = new GoldenLayout(config, this.$el.find('.dashboard-container'));
        var selectionInterface = this.options.selectionInterface;
        myLayout.registerComponent('cesium', function(container, componentState) {
            var cesiumView = new CesiumView({
                selectionInterface: selectionInterface
            });
            cesiumView.render();
            $(container.getElement()).append(cesiumView.$el);
        });
        myLayout.registerComponent('inspector', function(container, componentState) {
            var cesiumView = new InspectorView({
                selectionInterface: selectionInterface
            });
            cesiumView.render();
            $(container.getElement()).append(cesiumView.$el);
            setTimeout(function() {
                myLayout.updateSize();
            }, 0);
            other = container;
        });
        myLayout.init();
        $(window).on('resize', function() {
            myLayout.updateSize();
        });
        test = myLayout;
    },
    addVisualization: function() {
        getVisualizations().add({});
    },
    handleEmpty: function() {
        this.$el.toggleClass('is-empty', getVisualizations().length === 0);
    }
});