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
    'text!templates/workspace/workspaces.handlebars',
    'js/CustomElements'
], function (Marionette, ich, _, $, workspacesTemplate, CustomElements) {

    ich.addTemplate('workspaces', workspacesTemplate);

    var selectedWorkspace;

    var Workspaces = Marionette.ItemView.extend({
        template: 'workspaces',
        tagName: CustomElements.register('workspaces'),
        modelEvents: {
            'all': 'rerender'
        },
        events: {
            'click .workspaces-list .workspace': 'showWorkspace',
            'click .workspaces-add': 'createWorkspace'
        },
        ui: {
            workspaceList: '.workspaces-list'
        },
        initialize: function(){
        },
        serializeData: function(){
            return _.extend(this.model.toJSON(), {currentWorkspace: this.model.getCurrentWorkspaceName()});
        },
        rerender: function(){
            this.render();
        },
        showWorkspace: function(event){
            var workspace = event.currentTarget;
            selectedWorkspace = workspace.getAttribute('data-id');
            
        },
        createWorkspace: function(){
            this.model.createWorkspace();
            this.scrollToNewWorkspace();
        },
        scrollToNewWorkspace: function(){
            this.ui.workspaceList[0].scrollTop = this.ui.workspaceList[0].scrollHeight;
        }
    });

    return Workspaces;
});