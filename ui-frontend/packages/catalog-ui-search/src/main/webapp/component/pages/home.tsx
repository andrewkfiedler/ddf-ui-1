import * as React from 'react'
import { GoldenLayout } from '../golden-layout/golden-layout'
import {
  SplitPane,
  useResizableGridContext,
} from '../resizable-grid/resizable-grid'
const SelectionInterfaceModel = require('../selection-interface/selection-interface.model')
const Query = require('../../js/model/Query.js')
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import QueryAddView from '../query-add/query-add'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

import MRC from '../../react-component/marionette-region-container'
import Button from '@material-ui/core/Button'
import { Dropdown } from '@connexta/atlas/atoms/dropdown'
import SearchInteractions from '../search-interactions'
import { BetterClickAwayListener } from '../better-click-away-listener/better-click-away-listener'
import MoreVert from '@material-ui/icons/MoreVert'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import { Elevations } from '../theme/theme'
import SearchIcon from '@material-ui/icons/SearchTwoTone'

const LeftTop = ({ selectionInterface }: { selectionInterface: any }) => {
  const { closed, setClosed, lastLength, setLength } = useResizableGridContext()

  if (closed) {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        className="w-full py-4 px-2"
      >
        <Grid item className="w-full">
          <Button
            fullWidth
            variant="text"
            color="primary"
            size="small"
            onClick={() => {
              setClosed(false)
              setLength(lastLength)
            }}
          >
            <Box color="text.primary">
              <KeyboardArrowRightIcon color="inherit" />
              <KeyboardArrowRightIcon color="inherit" className="-ml-5" />
            </Box>
          </Button>
        </Grid>
        <Grid item className="mt-3 w-full">
          <Dropdown
            content={context => {
              return (
                <BetterClickAwayListener
                  onClickAway={() => {
                    context.deepCloseAndRefocus.bind(context)()
                  }}
                >
                  <Paper>
                    <SearchInteractions
                      model={selectionInterface.getCurrentQuery()}
                      onClose={() => {
                        context.deepCloseAndRefocus.bind(context)()
                      }}
                    />
                  </Paper>
                </BetterClickAwayListener>
              )
            }}
          >
            {({ handleClick }) => {
              return (
                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handleClick}
                >
                  <Box color="text.primary">
                    <MoreVert />
                  </Box>
                </Button>
              )
            }}
          </Dropdown>
        </Grid>
        <Grid item className="mt-3 w-full">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              selectionInterface.getCurrentQuery().startSearchFromFirstPage()
            }}
          >
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
    )
  }
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      className="w-full max-h-16 h-16 px-2"
    >
      <Grid item>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => {
            setClosed(true)
          }}
        >
          Collapse
          <Box color="text.primary">
            <KeyboardArrowLeftIcon color="inherit" />
            <KeyboardArrowLeftIcon color="inherit" className="-ml-5" />
          </Box>
        </Button>
      </Grid>
      <Grid item className="ml-auto">
        <Dropdown
          content={context => {
            return (
              <BetterClickAwayListener
                onClickAway={() => {
                  context.deepCloseAndRefocus.bind(context)()
                }}
              >
                <Paper>
                  <SearchInteractions
                    model={selectionInterface.getCurrentQuery()}
                    onClose={() => {
                      context.deepCloseAndRefocus.bind(context)()
                    }}
                  />
                </Paper>
              </BetterClickAwayListener>
            )
          }}
        >
          {({ handleClick }) => {
            return (
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={handleClick}
              >
                Options
                <Box color="text.primary">
                  <MoreVert color="inherit" />
                </Box>
              </Button>
            )
          }}
        </Dropdown>
      </Grid>
      <Grid item className="ml-3">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            selectionInterface.getCurrentQuery().startSearchFromFirstPage()
          }}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  )
}

const LeftBottom = ({ selectionInterface }: { selectionInterface: any }) => {
  const { closed } = useResizableGridContext()

  return (
    <>
      <MRC
        className={`w-full pb-64 ${closed ? 'hidden' : ''}`}
        defaultStyling={false}
        view={QueryAddView}
        viewOptions={{
          selectionInterface,
          model: selectionInterface.getCurrentQuery(),
        }}
      />
    </>
  )
}

export const HomePage = () => {
  let urlBasedQuery = location.hash.split('?defaultQuery=')[1]
  if (urlBasedQuery) {
    urlBasedQuery = new Query.Model(
      JSON.parse(decodeURIComponent(urlBasedQuery))
    )
    ;(urlBasedQuery as any).startSearchFromFirstPage()
  }
  const [isSaved, setIsSaved] = React.useState(false)

  const [queryModel, setQueryModel] = React.useState(
    urlBasedQuery || new Query.Model()
  )
  const [selectionInterface] = React.useState(
    new SelectionInterfaceModel({
      currentQuery: queryModel,
    })
  )
  return (
    <div className="w-full h-full">
      <SplitPane variant="horizontal" collapsedLength={80}>
        <div className="h-full w-full py-2">
          <Paper
            elevation={Elevations.panels}
            className="h-full overflow-auto w-full"
          >
            <LeftTop selectionInterface={selectionInterface} />
            <Divider />
            <LeftBottom selectionInterface={selectionInterface} />
          </Paper>
        </div>
        <div className="w-full h-full">
          <GoldenLayout selectionInterface={selectionInterface} />
        </div>
      </SplitPane>
    </div>
  )
}