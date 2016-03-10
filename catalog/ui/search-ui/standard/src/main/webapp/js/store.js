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
    'backbone',
    'poller',
    'underscore',
    'js/model/Workspace',
    'js/model/source',
    'component/workspaces/workspaces',
    'js/model/Selected',
   'component/workspaces/workspaces',
    'component/content/content'
], function (Backbone, poller, _, Workspace, Source, Workspaces, Selected, Content) {

    // initialize a backbone model and fetch it's state from the server
    var init = function (Model, opts) {
        opts = _.extend({
            persisted: true,
            poll: false
        }, opts);
        var m = new Model();
        if (opts.persisted) {
            m.fetch();
            if (opts.poll) {
                poller.get(m, opts.poll).start();
            }
        }
        return m;
    };

    var Store = Backbone.Model.extend({
        initialize: function () {
            var self = this;
            this.set('workspaces', init(Workspace.WorkspaceResult));
            this.set('sources', init(Source, {
                poll: {
                    delay: 60000
                }
            }));
            this.set('componentWorkspaces', init(Workspaces, {
                persisted: false
            }));
            this.set('selected', init(Selected, {
                persisted: false
            }));
            this.set('content', init(Content, {
                persisted: false
            }));
            this.get('workspaces').on('change:currentWorkspace',function(){
                self.updateContentOnWorkspaceChange();
            });
        },
        updateContentOnWorkspaceChange: function(){
            this.get('content').setWorkspaceId(this.get('workspaces').get('currentWorkspace'));
        }
    });

    return new Store();
});
