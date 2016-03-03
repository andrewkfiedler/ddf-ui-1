define([
  'marionette',
  'text!./side-panel.hbs',
  './explore/index',
  './query-editor/index',
  'js/store'
], function (Marionette, sidePanel, ExploreView, QueryEditorView, store) {

  var state = store.get('side-panel')

  var SidePanelView = Marionette.LayoutView.extend({
    template : sidePanel,
    className: 'side-panel',

    regions : {
      workspacesRegion: '#explore',
      searchRegion: '#saved-items',
      editQueryRegion: '#edit-query'
    },

    modelEvents: {
        'change': 'render'
    },

    events: {
      'shown.bs.tab .tabs-below>.nav-tabs>li>a': 'tabShown'
    },

    tabShown: function(e) {
      //wreqr.vent.trigger('workspace:tabshown', e.target.hash);
    },

    onRender: function() {
      var workspace = this.model
      if (workspace) {
        this.workspacesRegion.show(new ExploreView({ model: workspace }));
        var query = workspace.getSelectedQuery()
        if (query) {
          this.editQueryRegion.show(new QueryEditorView({ model: query }));
        }
      }
    }
  })

  return SidePanelView
})
