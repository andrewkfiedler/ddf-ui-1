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
    'text!./result-selector.hbs',
    'js/CustomElements',
    'js/store'
], function (Marionette, _, $, resultSelectorTemplate, CustomElements, store) {

    var ResultSelector = Marionette.LayoutView.extend({
        setDefaultModel: function(){
            this.model = store.getCurrentWorkspace();
        },
        template: resultSelectorTemplate,
        tagName: CustomElements.register('result-selector'),
        modelEvents: {
        },
        events: {
        },
        ui: {
        },
        regions: {
        },
        initialize: function(options){
            if (options.model === undefined){
                this.setDefaultModel();
            }
        }
    });

    return ResultSelector;
});
