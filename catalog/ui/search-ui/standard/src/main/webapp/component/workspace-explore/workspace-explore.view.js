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
    'text!./workspace-explore.hbs',
    'js/CustomElements',
    'component/query-selector/query-selector.view',
    'component/result-selector/result-selector.view'
], function (Marionette, _, $, workspaceExploreTemplate, CustomElements, QuerySelectorView,
             ResultSelectorView) {

    var workspaceId;

    var WorkspaceExplore = Marionette.LayoutView.extend({
        template: workspaceExploreTemplate,
        tagName: CustomElements.register('workspace-explore'),
        modelEvents: {
        },
        events: {
        },
        regions: {
            workspaceExploreQueries: '.workspaceExplore-queries',
            workspaceExploreResults: '.workspaceExplore-results'
        },
        initialize: function () {
        },
        onBeforeShow: function(){
            var workspaceExploreView = this;
           this.workspaceExploreQueries.show(new QuerySelectorView({
                model: workspaceExploreView.model
            }));
            this.workspaceExploreResults.show(new ResultSelectorView({
                model: workspaceExploreView.model
            }));
        }
    });

    return WorkspaceExplore;
});
