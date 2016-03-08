/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
/*global define*/

define([
    'marionette',
    'component/lightbox/lightbox.view.instance',
    'component/workspaces/Workspaces.view',
    'js/store'
], function (Marionette, lightboxViewInstance, WorkspacesView, store) {

    function closeLightbox(){
        lightboxViewInstance.model.close();
    }

    var Router = Marionette.AppRouter.extend({
        controller: {
            openWorkspaces: function(){
                lightboxViewInstance.model.updateTitle('Workspaces');
                lightboxViewInstance.model.open();
                lightboxViewInstance.lightboxContent.show(new WorkspacesView({
                    model: store.get('componentWorkspaces')
                }));
            },
            openWorkspace: function(workspaceId){
                closeLightbox();
                store.get('workspaces').setCurrentWorkspace(workspaceId);
            },
            home: function(){
                closeLightbox();
            }
        },
        appRoutes: {
            'workspaces': 'openWorkspaces',
            'workspace/:id': 'openWorkspace',
            'home': 'home'
        }
    });

    return new Router();
});