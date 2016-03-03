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
    'underscore',
    'jquery',
    '../tabs.view',
    'component/workspace-basic/workspace-basic.view',
    'js/store'
], function (Marionette, _, $, TabsView, BasicView, store) {

    var WorkspaceTabsView = TabsView.extend({
        initialize: function(){
            var view = this;
            this.model.on({
                'change:activeTab': function(){
                    view.determineContent();
                }
            });
        },
        determineContent: function(){
            var activeTab = this.model.getActiveTab();
            switch(activeTab){
                case 'Basic':
                    this.openBasicView();
                    break;
                case 'Advanced':
                    this.openAdvancedView();
                    break;
                case 'History':
                    this.openHistoryView();
                    break;
                case 'Associations':
                    this.openAssocationsView();
                    break;
            }
        },
        openBasicView: function(){
            this.tabsContent.show(new BasicView({
                model: this.model.getAssociatedWorkspace()
            }));
        },
        openAdvancedView: function(){

        },
        openHistoryView: function(){

        },
        openAssocationsView: function(){

        }
    });

    return WorkspaceTabsView;
});