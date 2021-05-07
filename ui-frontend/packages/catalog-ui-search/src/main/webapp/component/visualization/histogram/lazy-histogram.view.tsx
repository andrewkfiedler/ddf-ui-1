import CircularProgress from '@material-ui/core/CircularProgress'
import * as React from 'react'

const Marionette = require('marionette')
import Histogram from './histogram'

const ReactPortion = ({ selectionInterface }: { selectionInterface: any }) => {
  const [plotly, setPloty] = React.useState(null as any)
  React.useEffect(() => {
    // @ts-ignore
    require(['plotly.js/dist/plotly.js'], () => {
      setPloty(require('plotly.js/dist/plotly.js'))
    })
  })

  if (plotly === null) {
    return <CircularProgress />
  }
  return <Histogram selectionInterface={selectionInterface} Plotly={plotly} />
}

const LazyHistogramView = Marionette.LayoutView.extend({
  className: 'customElement',
  template() {
    return (
      <React.Fragment>
        <ReactPortion selectionInterface={this.options.selectionInterface} />
      </React.Fragment>
    )
  },
})

export default LazyHistogramView
