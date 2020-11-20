import * as React from 'react'
import { hot } from 'react-hot-loader'
import ResultItemCollection from './result-item.collection'
import Grid from '@material-ui/core/Grid'
import TableVisual from './table'
// @ts-ignore ts-migrate(6133) FIXME: 'CircularProgress' is declared but its value is ne... Remove this comment to see the full error message
import CircularProgress from '@material-ui/core/CircularProgress'
// @ts-ignore ts-migrate(6133) FIXME: 'useLazyResultsFromSelectionInterface' is declared... Remove this comment to see the full error message
import { useLazyResultsFromSelectionInterface } from '../selection-interface/hooks'
// @ts-ignore ts-migrate(6133) FIXME: 'useStatusOfLazyResults' is declared but its value... Remove this comment to see the full error message
import { useStatusOfLazyResults } from '../../js/model/LazyQueryResult/hooks'
import { TypedUserInstance } from '../singletons/TypedUser'

// this is what we save within the visual itself
type ResultsVisualState = {
  mode: ModeType
  attributesShown: string[]
}

const getDefaultResultsVisualState = (): ResultsVisualState => {
  return {
    mode: 'card',
    attributesShown: TypedUserInstance.getResultsAttributesShown(),
  }
}

export const getResultsVisualState = (container: Props['container']) => {
  const savedState = container.getState()
  const defaultState = getDefaultResultsVisualState()
  return {
    ...defaultState,
    ...savedState,
  }
}

export type ResultsVisualContainer = {
  getState: () => Partial<ResultsVisualState>
  setState: (newState: ResultsVisualState) => void
  extendState: (newState: Partial<ResultsVisualState>) => void
}

type Props = {
  selectionInterface: any
  container: ResultsVisualContainer
}

type ModeType = 'card' | 'table'

const ResultsVisualContext = React.createContext({
  state: getDefaultResultsVisualState(),
  setState: (() => {}) as (state: ResultsVisualState) => void,
  container: {
    getState: () => {
      return getDefaultResultsVisualState()
    },
    setState: () => {},
    extendState: () => {},
  } as ResultsVisualContainer,
  selectionInterface: {} as any,
})

const ResultsView = ({ selectionInterface, container }: Props) => {
  const [state, setState] = React.useState(getDefaultResultsVisualState())

  React.useEffect(() => {
    container.extendState({ ...state })
  }, [state])
  return (
    <ResultsVisualContext.Provider
      value={{
        state,
        setState,
      }}
    >
      <Grid
        container
        direction="column"
        className="w-full h-full bg-inherit"
        wrap="nowrap"
      >
        <Grid className="w-full h-full bg-inherit">
          {(() => {
            if (state.mode === 'card') {
              return (
                <ResultItemCollection
                  mode={state.mode}
                  setMode={setMode}
                  selectionInterface={selectionInterface}
                  container={container}
                />
              )
            } else {
              return (
                <TableVisual
                  selectionInterface={selectionInterface}
                  mode={mode}
                  setMode={setMode}
                  container={container}
                />
              )
            }
          })()}
        </Grid>
      </Grid>
    </ResultsVisualContext.Provider>
  )
}

export default hot(module)(ResultsView)
