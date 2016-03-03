define([
  'marionette',
  'text!./queries-results-layout.hbs',
  './queries.view',
  './results.view'
], function (Marionette, layout, QueriesView, ResultsView) {

  var QueryResultsView = Marionette.LayoutView.extend({
    template: layout,
    className: 'height-full queries-results',
    events: {
      'click #add-query': 'addQuery'
    },
    regions: {
      queries: '#queries',
      results: '#results',
    },
    addQuery: function () {
      this.model.addQuery()
    },
    initialize: function () {
      this.searches = this.model.get('searches')
      this.metacards = this.model.get('metacards')
    },
    hasQueries: function () {
      return this.searches.length > 0
    },
    serializeData: function () {
      return {
        showHelp: !this.hasQueries()
      }
    },
    onRender: function () {
      if (this.hasQueries()) {
        this.queries.show(new QueriesView({ collection: this.searches }))
        this.results.show(new ResultsView({ collection: this.searches.getResults() }))
      }
    }
  })

  return QueryResultsView
})
