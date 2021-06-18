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
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import {
  useLazyResultsFromSelectionInterface,
  useLazyResultsSelectedResultsFromSelectionInterface,
} from '../../component/selection-interface/hooks'
import { Elevations } from '../../component/theme/theme'
import { LazyQueryResult } from '../../js/model/LazyQueryResult/LazyQueryResult'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import { useListenTo } from '../../component/selection-checkbox/useBackbone.hook'
import ResultItem from '../../component/results-visual/result-item'

export type LocationType = {
  left: number
  top: number
}

const Preview = styled.div`
  position: relative;
  min-width: 200px;
  height: 100%;
  min-height: 15px;
  max-height: 100px;
  padding: 2px;
  background-color: ${(props) => props.theme.backgroundContent};
  border: 1px solid;
  overflow-y: auto;
  overflow-x: auto;
  text-overflow: ellipsis;
`

const PreviewText = styled.p`
  font-family: 'Open Sans', arial, sans-serif;
  font-size: 14px;
  padding: 2px 4px;
  white-space: pre-line;
`

const TOP_OFFSET = 60

const DRAG_SENSITIVITY = 10

type Props = {
  map: any
  selectionInterface: {
    getSelectedResults: () => {
      models: LazyQueryResult[]
    } & Array<LazyQueryResult>
    getActiveSearchResults: () => {
      models: LazyQueryResult[]
    } & Array<LazyQueryResult>
    clearSelectedResults: () => void
    addSelectedResult: (metacard: LazyQueryResult) => void
  }
  mapModel: Backbone.Model<
    {
      targetMetacard: LazyQueryResult
    },
    any,
    any
  >
}

const getLeft = (location: undefined | LocationType) => {
  return location ? location.left : undefined
}

const getTop = (location: undefined | LocationType) => {
  return location ? location.top - TOP_OFFSET : undefined
}

/**
 * Get the pixel location from a metacard(s)
 * returns { left, top } relative to the map view
 */
const getLocation = (map: any, target: LazyQueryResult[]) => {
  if (target && target.length === 1) {
    const location = map.getWindowLocationsOfResults(target)
    const coordinates = location ? location[0] : undefined
    return coordinates
      ? { left: coordinates[0], top: coordinates[1] - 20 }
      : undefined
  }
  return
}

const HookPopupPreview = (props: Props) => {
  const { map, selectionInterface, mapModel } = props
  const lazyResults = useLazyResultsFromSelectionInterface({
    selectionInterface,
  })
  const selectedResults = useLazyResultsSelectedResultsFromSelectionInterface({
    selectionInterface,
  })
  const selectedResultsArray = Object.values(selectedResults)
  const [location, setLocation] = React.useState(
    undefined as undefined | LocationType
  )
  const dragRef = React.useRef(0)
  const [open, setOpen] = React.useState(false)

  const getTarget = (): LazyQueryResult[] => {
    return mapModel.get('targetMetacard')
      ? [mapModel.get('targetMetacard')]
      : []
    return Object.values(selectedResults)
  }

  useListenTo(mapModel, 'change:targetMetacard', () => {
    if (mapModel.get('targetMetacard')) {
      setLocation(getLocation(map, getTarget()))
      setOpen(true)
    } else {
      setOpen(false)
    }
  })

  let popupAnimationFrameId: any
  const startPopupAnimating = (map: any) => {
    if (getTarget().length !== 0) {
      popupAnimationFrameId = window.requestAnimationFrame(() => {
        const location = getLocation(map, getTarget())
        setLocation(location)
        startPopupAnimating(map)
      })
    }
  }

  const handleCameraMoveEnd = () => {
    if (getTarget().length !== 0) {
      window.cancelAnimationFrame(popupAnimationFrameId)
    }
  }

  React.useEffect(() => {
    setLocation(getLocation(map, getTarget()))
    if (selectedResultsArray.length !== 0) {
      setOpen(true)
    }
  }, [selectedResults])

  React.useEffect(() => {
    map.onMouseTrackingForPopup(
      () => {
        dragRef.current = 0
      },
      () => {
        dragRef.current += 1
      },
      (_event: any, mapTarget: any) => {
        if (DRAG_SENSITIVITY > dragRef.current) {
          setOpen(mapTarget.mapTarget !== undefined)
        }
      }
    )
  }, [])

  React.useEffect(() => {
    const onCameraMoveStart = () => {
      startPopupAnimating(map)
    }

    const onCameraMoveEnd = () => {
      handleCameraMoveEnd()
    }

    map.onCameraMoveStart(onCameraMoveStart)
    map.onCameraMoveEnd(onCameraMoveEnd)

    return () => {
      map.offCameraMoveStart(onCameraMoveStart)
      map.offCameraMoveEnd(onCameraMoveEnd)
      window.cancelAnimationFrame(popupAnimationFrameId)
    }
  }, [selectedResults])

  if (!open || selectedResultsArray.length === -1) {
    return null
  }

  const left = getLeft(location)
  const top = getTop(location)
  if (selectedResultsArray.length === 1 && (!left || !top)) {
    return null
  }

  console.log({ left, top })

  return (
    <div
      className={`absolute transform -translate-x-1/2 ${
        selectedResultsArray.length === 1
          ? '-translate-y-1/2'
          : '-translate-y-full'
      }`}
      style={{
        left: selectedResultsArray.length >= 0 ? left : 'calc(50%)',
        top: selectedResultsArray.length >= 0 ? top : 'calc(50% - 70px)',
      }}
    >
      <Tooltip
        open={true}
        title={
          <Paper
            elevation={Elevations.overlays}
            className={`p-1 overflow-auto max-w-sm`}
            style={{
              maxHeight: '150px',
            }}
          >
            <div className="flex flex-row flex-no-wrap items-center">
              <div className="flex-shrink-1 truncate">
                {(function () {
                  if (selectedResultsArray.length >= 0) {
                    const metacardJSON = getTarget()[0].plain
                    const previewText =
                      metacardJSON.metacard.properties['ext.extracted.text']
                    return (
                      <ResultItem
                        lazyResult={getTarget()[0]}
                        measure={() => {}}
                        index={0}
                        width={500}
                      />
                    )
                  } else if (selectedResultsArray.length > 1) {
                    return (
                      <div>
                        {selectedResultsArray.map((clusterModel) => {
                          return (
                            <Button
                              key={clusterModel.plain.id}
                              onClick={() => {
                                lazyResults.deselect()
                                lazyResults.select(clusterModel)
                              }}
                            >
                              {clusterModel.plain.metacard.properties.title}
                            </Button>
                          )
                        })}
                      </div>
                    )
                  }
                  return
                })()}
              </div>
              <Button
                className="flex-shrink-0"
                onClick={() => {
                  setOpen(false)
                }}
                size="small"
              >
                <CloseIcon />
              </Button>
            </div>
          </Paper>
        }
      >
        <div></div>
      </Tooltip>
    </div>
  )
}

export default hot(module)(HookPopupPreview)
