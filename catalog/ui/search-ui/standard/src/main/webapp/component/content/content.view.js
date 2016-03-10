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
    'text!./content.hbs',
    'js/CustomElements',
    'component/tabs/workspace-content/tabs-workspace-content',
    'component/tabs/workspace-content/tabs-workspace-content.view',
    'maptype',
    'text!templates/map.handlebars'
], function (Marionette, _, $, contentTemplate, CustomElements, WorkspaceContentTabs,
             WorkspaceContentTabsView, maptype, map) {

    var ContentView = Marionette.LayoutView.extend({
        template: contentTemplate,
        tagName: CustomElements.register('content'),
        modelEvents: {
            'change:workspaceId': 'updatePanelOne'
        },
        events: {
        },
        ui: {
        },
        regions: {
            'panelOne': '.content-panelOne',
            'panelTwo': '.content-panelTwo',
            'panelThree': '.content-panelThree'
        },
        initialize: function(){
            $('body').append(this.el);
            var contentView = this;
            if (maptype.is3d()) {
                var Map3d = Marionette.LayoutView.extend({
                    template: map,
                    className: 'height-full',
                    regions: { mapDrawingPopup: '#mapDrawingPopup' },
                    onShow: function () {
                        require([
                            'js/controllers/cesium.controller',
                            'js/widgets/cesium.bbox',
                            'js/widgets/cesium.circle',
                            'js/widgets/cesium.polygon',
                            'js/widgets/filter.cesium.geometry.group'
                        ], function (GeoController, DrawBbox, DrawCircle, DrawPolygon, FilterCesiumGeometryGroup) {
                            var geoController = new GeoController();
                            new FilterCesiumGeometryGroup.Controller({ geoController: geoController });
                            new DrawBbox.Controller({
                                scene: geoController.scene,
                                notificationEl: contentView._mapView.mapDrawingPopup.el
                            });
                            new DrawCircle.Controller({
                                scene: geoController.scene,
                                notificationEl: contentView._mapView.mapDrawingPopup.el
                            });
                            new DrawPolygon.Controller({
                                scene: geoController.scene,
                                notificationEl: contentView._mapView.mapDrawingPopup.el,
                                drawHelper: geoController.drawHelper,
                                geoController: geoController
                            });
                        });
                    }
                });
                this._mapView = new Map3d();
            } else if (maptype.is2d()) {
                var Map2d = Marionette.LayoutView.extend({
                    template: map,
                    className: 'height-full',
                    regions: { mapDrawingPopup: '#mapDrawingPopup' },
                    onShow: function () {
                        require([
                            'js/controllers/openlayers.controller',
                            'js/widgets/openlayers.bbox',
                            'js/widgets/openlayers.polygon',
                            'js/widgets/filter.openlayers.geometry.group'
                        ], function (GeoController, DrawBbox, DrawPolygon, FilterCesiumGeometryGroup) {
                            var geoController = new GeoController();
                            new FilterCesiumGeometryGroup.Controller({ geoController: geoController });
                            new DrawBbox.Controller({
                                map: geoController.mapViewer,
                                notificationEl: contentView._mapView.mapDrawingPopup.el
                            });
                            new DrawPolygon.Controller({
                                map: geoController.mapViewer,
                                notificationEl: contentView._mapView.mapDrawingPopup.el
                            });
                        });
                    }
                });
                this._mapView = new Map2d();
            }
        },
        onRender: function(){
            this.updatePanelOne();
            this.hidePanelTwo();
            this.panelThree.show(this._mapView);
        },
        onBeforeShow: function(){
        },
        updatePanelOne: function(){
            var contentView = this;
            this.panelOne.show(new WorkspaceContentTabsView({
                model: new WorkspaceContentTabs({
                    'workspaceId': contentView.model.get('workspaceId')
                })
            }));
        },
        hidePanelTwo: function(){
            this.$el.addClass('hide-panelTwo');
        },
        _mapView: undefined

    });

    return ContentView;
});
