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
import PopperJs from 'popper.js'
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
import { PopperProps } from '@material-ui/core'

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

const TOP_OFFSET = 0

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
    } & MouseCoordinatesType,
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

const useMapTarget = ({ mapModel }: { mapModel: Props['mapModel'] }) => {
  const getTarget = (): LazyQueryResult[] => {
    return mapModel.get('targetMetacard')
      ? [mapModel.get('targetMetacard')]
      : []
  }
  const [target, setTarget] = React.useState(getTarget())
  useListenTo(mapModel, 'change:targetMetacard', () => {
    setTarget(getTarget())
  })
  return target
}

type MouseCoordinatesType = {
  mouseLat?: number
  mouseLon?: number
  mouseX?: number
  mouseY?: number
}

const useMapMouseCoordinates = ({
  mapModel,
}: {
  mapModel: Props['mapModel']
}) => {
  const getMouseCoordinates = (): MouseCoordinatesType => {
    return {
      mouseLat: mapModel.get('mouseLat'),
      mouseLon: mapModel.get('mouseLon'),
      mouseX: mapModel.get('mouseX'),
      mouseY: mapModel.get('mouseY'),
    }
  }
  const [mouseCoordinates, setMouseCoordinates] = React.useState(
    getMouseCoordinates()
  )
  useListenTo(mapModel, 'change:mouseLat', () => {
    const newCoordinates = getMouseCoordinates()
    if (newCoordinates.mouseLat) {
      setMouseCoordinates(newCoordinates)
    }
  })
  return mouseCoordinates
}

const useTargetLocation = ({
  map,
  target,
}: {
  map: Props['map']
  target: LazyQueryResult[]
}) => {
  const dragRef = React.useRef(0)
  const [location, setLocation] = React.useState(
    undefined as undefined | LocationType
  )
  let popupAnimationFrameId: any

  React.useEffect(() => {
    setLocation(getLocation(map, target))
  }, [target])

  const startPopupAnimating = (map: any) => {
    if (target.length !== 0) {
      popupAnimationFrameId = window.requestAnimationFrame(() => {
        setLocation(getLocation(map, target))
        startPopupAnimating(map)
      })
    }
  }

  const handleCameraMoveEnd = () => {
    if (target.length !== 0) {
      window.cancelAnimationFrame(popupAnimationFrameId)
    }
  }

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
          // setOpen(mapTarget.mapTarget !== undefined)
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
  }, [target])
  return location
}

const HookPopupPreview = (props: Props) => {
  const popperRef = React.useRef<PopperJs>(null)
  const { map, selectionInterface, mapModel } = props
  const lazyResults = useLazyResultsFromSelectionInterface({
    selectionInterface,
  })
  const selectedResults = useLazyResultsSelectedResultsFromSelectionInterface({
    selectionInterface,
  })
  const selectedResultsArray = Object.values(selectedResults)
  const target = useMapTarget({ mapModel })
  const location = useTargetLocation({ map, target })
  const mouseCoordinates = useMapMouseCoordinates({ mapModel })
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    let timeoutId = undefined as undefined | number
    if (target.length > 0) {
      setOpen(true)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [target])

  if (target.length === 0) {
    return null
  }

  const left = getLeft(location)
  const top = getTop(location)
  if (!left || !top) {
    return null
  }
  console.log(popperRef)

  return (
    <div
      className="absolute"
      style={{
        left: mouseCoordinates.mouseX,
        top: mouseCoordinates.mouseY - 0,
      }}
    >
      <Tooltip
        open={true}
        placement="top"
        PopperProps={{
          popperRef: popperRef,
          modifiers: {
            offset: {
              offset: '0,20',
            },
          },
        }}
        title={
          <Paper
            elevation={Elevations.overlays}
            className={`p-1 overflow-auto max-w-sm`}
            style={
              {
                // maxHeight: '150px',
              }
            }
          >
            <ResultItem
              lazyResult={target[0]}
              measure={() => {
                if (popperRef.current) {
                  popperRef.current.update()
                }
              }}
              index={0}
              width={500}
            />
          </Paper>
        }
      >
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            width: '2px',
            height: '2px',
            background: 'red',
          }}
        ></div>
      </Tooltip>
    </div>
  )
}

export default hot(module)(HookPopupPreview)
