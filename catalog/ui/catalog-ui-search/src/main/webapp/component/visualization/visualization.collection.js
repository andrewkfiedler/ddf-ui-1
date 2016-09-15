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
/*global require, Math*/
var Backbone = require('backbone');
var _ = require('underscore');
var VisualiationModel = require('./visualization');

function findMaxOrder(collection) {
    return collection.reduce(function(maxOrder, visualizationModel) {
        return Math.max(maxOrder, visualizationModel.order);
    }, -1);
}

module.exports = Backbone.Collection.extend({
    model: VisualiationModel,
    initialize: function() {
        this.listenTo(this, 'add', this.onAdd);
    },
    comparator: 'order',
    onAdd: function(model) {
        model.set('order', findMaxOrder(this) + 1);
    }
});