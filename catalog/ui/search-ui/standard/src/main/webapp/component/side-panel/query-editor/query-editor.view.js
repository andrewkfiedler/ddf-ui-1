define([
  'marionette',
  'text!./query-editor.hbs',
  './basic-editor/basic-editor.view',
  'js/store'
  //'component/tabs/index'
], function (Marionette, queryEditor, BasicEditorView, store) {

  var selected = store.get('selected')

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
      selected.reset()
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
