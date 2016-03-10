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
    'text!./Lightbox.hbs',
    'js/CustomElements'
], function (Marionette, _, $, LightboxTemplate, CustomElements) {

    function disableTabbingToOutsideElements(view) {
        $('button').attr('tabindex', -1);
        $('input').attr('tabindex', -1);
        $('a').attr('tabindex', -1);
        view.$el.find('button').attr('tabindex', 0);
        view.$el.find('input').attr('tabindex', 0);
        view.$el.find('a').attr('tabindex', 0);
    }

    function enableTabbingToOutsideElements() {
        $('button').attr('tabindex', 0);
        $('input').attr('tabindex', 0);
        $('a').attr('tabindex', 0);
    }

    var LightboxView = Marionette.LayoutView.extend({
        template: LightboxTemplate,
        tagName: CustomElements.register('lightbox'),
        modelEvents: {
            'all': 'rerender',
            'change:open': 'handleOpen'
        },
        events: {
            'click': 'handleOutsideClick',
            'click .lightbox-close': 'close'
        },
        regions: {
            'lightboxContent': '.lightbox-content'
        },
        initialize: function () {
            $('body').append(this.el);
        },
        rerender: function () {
            this.render();
        },
        handleOpen: function () {
            this.$el.toggleClass('is-open', this.model.isOpen());
            if (this.model.isOpen()){
                disableTabbingToOutsideElements(this);
            }
        },
        handleOutsideClick: function (event) {
            if (event.target === this.el) {
                this.close();
            }
        },
        close: function () {
            enableTabbingToOutsideElements();
            window.location.hash = '#home';
        }
    });

    return LightboxView;
});
