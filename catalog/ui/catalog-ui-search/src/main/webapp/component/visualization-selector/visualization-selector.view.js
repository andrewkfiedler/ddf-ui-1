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
/*global require*/
var Marionette = require('marionette');
var CustomElements = require('js/CustomElements');
var user = require('component/singletons/user-instance');
var template = require('./visualization-selector.hbs')

function getVisualizations() {
    return user.get('user').get('preferences').get('visualizations');
}

module.exports = Marionette.ItemView.extend({
    tagName: CustomElements.register('visualization-selector'),
    template: template,
    className: 'is-list has-list-highlighting is-inline',
    events: {
        'click > *': 'handleTypeSelection'
    },
    handleTypeSelection: function(e) {
        this.model.set('type', e.currentTarget.getAttribute('data-type'));
    }
});