define([
  'marionette',
  'text!./side-panel.hbs',
  './explore/index',
  './query-editor/index',
  'js/store'
], function (Marionette, sidePanel, ExploreView, QueryEditorView, store) {

  var selected = store.get('selected')

  var SidePanelView = Marionette.LayoutView.extend({
    template : sidePanel,
    className: 'side-panel',

    regions : {
      workspacesRegion: '#explore',
      searchRegion: '#saved-items',
      selectedRegion: '#selected'
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

    initialize: function () {
      this.listenTo(selected, 'change', this.renderSelected)
    },

    renderSelected: function () {
      switch (selected.get('type')) {
        case 'query':
          this.selectedRegion.show(new QueryEditorView({ model: selected.get('object') }))
          this.selectedRegion.$el.show()
          break;
        case 'metacard':
          this.selectedRegion.$el.show()
          break;
        default:
          this.selectedRegion.$el.hide()
      }
    },

    onRender: function() {
      this.workspacesRegion.show(new ExploreView({ model: this.model }))
      this.renderSelected();
    }
  })

  return SidePanelView
})
