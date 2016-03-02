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
    'icanhaz',
    'underscore',
    'jquery',
    'text!./workspaces.hbs',
    'js/CustomElements',
    'component/tabs/tabs',
    'component/tabs/tabs.view'
], function (Marionette, ich, _, $, workspacesTemplate, CustomElements, TabsModel, TabsView) {

    ich.addTemplate('workspaces', workspacesTemplate);

    var selectedWorkspace;

    var Workspaces = Marionette.LayoutView.extend({
        template: 'workspaces',
        tagName: CustomElements.register('workspaces'),
        modelEvents: {
            'all': 'rerender'
        },
        events: {
            'click .workspaces-list .workspace': 'changeWorkspace',
            'click .workspaces-add': 'createWorkspace'
        },
        ui: {
            workspaceList: '.workspaces-list'
        },
        regions: {
            'workspaceDetails': '.workspaces-details'
        },
        initialize: function(){
        },
        serializeData: function(){
            return _.extend(this.model.toJSON(), {currentWorkspace: this.model.getCurrentWorkspaceName()});
        },
        rerender: function(){
            this.render();
        },
        changeWorkspace: function(event){
            var workspace = event.currentTarget;
            selectedWorkspace = workspace.getAttribute('data-id');
            this.highlightSelectedWorkspace();
            this.workspaceDetails.show(new TabsView({
                model: new TabsModel()
            }));
        },
        highlightSelectedWorkspace: function(){
            this.$el.find('.workspaces-list .workspace').removeClass('is-selected');
            this.$el.find('[data-id='+selectedWorkspace+']').addClass('is-selected');
        },
        createWorkspace: function(){
            selectedWorkspace = this.model.createWorkspace();
            this.scrollToNewWorkspace();
            this.highlightSelectedWorkspace();
        },
        scrollToNewWorkspace: function(){
            this.ui.workspaceList[0].scrollTop = 0;
        }
    });

    return Workspaces;
});