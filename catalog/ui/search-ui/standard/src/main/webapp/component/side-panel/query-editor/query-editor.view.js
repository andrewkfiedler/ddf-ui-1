define([
  'marionette',
  'text!./query-editor.hbs',
  './basic-editor/basic-editor.view'
  //'component/tabs/index'
], function (Marionette, queryEditor, BasicEditorView) {

  var QueryEditorView = Marionette.LayoutView.extend({
    template : queryEditor,
    className: 'query-editor',

    regions : {
      queryTabsRegion: '#query-tabs'
    },

    modelEvents: {
      'change': 'render'
    },

    events: {
      'click #close-query-editor': 'closeQuery'
    },

    closeQuery: function () {
      this.model.closeQuery()
    },

    serializeData: function () {
      return {
        title: 'New Query'
      }
    },

    initialize: function () {
    },

    onRender: function () {
      this.queryTabsRegion.show(new BasicEditorView())
    }
  })

  return QueryEditorView
})
