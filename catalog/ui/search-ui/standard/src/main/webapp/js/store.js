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
    'js/model/Workspace',
    'js/model/Source',
], function (Backbone, poller, Workspace, Source) {

    // initialize a backbone model and fetch it's state from the server
    var init = function (Model, opts) {
        opts = opts || {};
        var m = new Model();
        m.fetch();
        if (opts.poll !== undefined) {
            poller.get(m, opts.poll).start();
        }
        return m;
    };

    var Store = Backbone.Model.extend({
      initialize: function () {
        this.set('workspaces', init(Workspace.WorkspaceResult));
        this.set('sources', init(Source, { poll: { delay: 60000 } }));
      }
    });

    return new Store();
});
