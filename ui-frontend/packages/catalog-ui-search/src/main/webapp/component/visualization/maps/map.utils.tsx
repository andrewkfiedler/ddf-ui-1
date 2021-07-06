import * as React from 'react'

export type WaitForMapLoadType = {
  mapView: {
    hasLoadedMap: boolean
    map: any
    mapModel: any
    options: {
      selectionInterface: any
    }
  }
  children: ({
    mapView,
  }: {
    mapView: WaitForMapLoadType['mapView']
  }) => React.ReactNode
}

export const WaitForMapLoad = ({ mapView, children }: WaitForMapLoadType) => {
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    let intervalId = setInterval(() => {
      if (mapView.hasLoadedMap) {
        clearInterval(intervalId)
        setLoading(false)
      }
    }, 1000)
  }, [])

  return loading ? null : children({ mapView })
}
