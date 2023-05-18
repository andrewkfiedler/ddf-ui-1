/* Copyright (c) Connexta, LLC */

import isEqualWith from 'lodash.isequalwith'
import React from 'react'
import SelectionInterfaceModel from '../selection-interface/selection-interface.model'
import { LazyQueryResult } from '../../js/model/LazyQueryResult/LazyQueryResult'
import { LazyQueryResults } from '../../js/model/LazyQueryResult/LazyQueryResults'
import { useStatusOfLazyResults } from '../../js/model/LazyQueryResult/hooks'
import { QueryStartAndEndType } from '../../js/model/Query.methods'
import { QueryAttributesType } from '../../js/model/Query.shared-types'
import { useQuery } from '../../js/model/TypedQuery'
import { fuzzyResultCount } from '../result-selector/fuzzy-results'
import { useLazyResultsFromSelectionInterface } from '../selection-interface/hooks'
import CQL from '../../js/cql'

type TransformedStatusOfLazyResultsType = {
  resultMessage: string
  pending: boolean
  failed: boolean
  warnings: boolean
  currentAsOf: number
  isSearching: boolean
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  firstPage: () => void
  lastPage: () => void
  hasFirstPage: boolean
  hasLastPage: boolean
  startAndEnd: QueryStartAndEndType
  hasBeenRun: boolean
}

type RestResultsType = {
  lazyResults: LazyQueryResults | null
  refetch: () => void
} & TransformedStatusOfLazyResultsType

export function isRestResult(
  thing: any | LazyQueryResult
): thing is LazyQueryResult {
  return (thing as LazyQueryResult).plain !== undefined
}

const UNRUN_SEARCH_MESSAGE = 'Has not been run'

export const useTransformedStatusOfLazyResults = ({
  lazyResults,
}: {
  lazyResults: LazyQueryResults
}) => {
  const statusOfLazyResults = useStatusOfLazyResults({ lazyResults })
  const transformedStatus = React.useMemo(() => {
    const statusBySource = Object.values(statusOfLazyResults.status)
    let resultMessage = '',
      pending = false,
      failed = false,
      warnings = false
    if (statusBySource.length === 0) {
      resultMessage = UNRUN_SEARCH_MESSAGE
    } else {
      const sourcesThatHaveReturned = statusBySource.filter(
        (status) => status.hasReturned
      )

      if (sourcesThatHaveReturned.length > 0) {
        const results = statusBySource
          .filter((status) => status.hasReturned)
          .filter((status) => status.successful)

        let available = 0
        let possible = 0

        results.forEach((result) => {
          available += result.count
          possible += result.hits
        })

        resultMessage = `${available} hit${
          available === 1 ? '' : 's'
        } out of ${fuzzyResultCount(possible)} possible`
      } else {
        resultMessage = 'Searching...'
      }

      failed = sourcesThatHaveReturned.some((status) => !status.successful)
      warnings = sourcesThatHaveReturned.some(
        (status) => status.warnings && status.warnings.length > 0
      )
      pending = statusOfLazyResults.isSearching
    }
    return {
      resultMessage,
      hasBeenRun: resultMessage !== UNRUN_SEARCH_MESSAGE,
      pending,
      failed,
      warnings,
      currentAsOf: statusOfLazyResults.currentAsOf,
      isSearching: statusOfLazyResults.isSearching,
    }
  }, [statusOfLazyResults])
  return transformedStatus
}

export const useSelectionInterface = ({
  passedInAttributes,
}: {
  passedInAttributes?: QueryAttributesType
}) => {
  const [processingAttributeChange, setProcessingAttributeChange] =
    React.useState(false)
  const [attributes, setAttributes] = React.useState<
    QueryAttributesType | undefined
  >(passedInAttributes)
  const [queryModel] = useQuery({
    attributes,
  })
  const [selectionInterface] = React.useState(
    new SelectionInterfaceModel({
      currentQuery: queryModel,
    })
  )
  const { setState, state } = useSearchDetails({ selectionInterface })
  React.useEffect(() => {
    setProcessingAttributeChange(true)
    const timeoutId = window.setTimeout(() => {
      if (
        !isEqualWith(
          attributes,
          passedInAttributes,
          (objValue, othValue, key) => {
            if (key === 'filterTree') {
              return CQL.write(objValue) === CQL.write(othValue)
            } else {
              return undefined
            }
          }
        )
      ) {
        setAttributes(passedInAttributes)
      }
      setProcessingAttributeChange(false)
    }, 500)

    return () => {
      window.clearTimeout(timeoutId)
      setProcessingAttributeChange(false)
    }
  }, [passedInAttributes])

  React.useEffect(() => {
    setProcessingAttributeChange(false)
    selectionInterface.getCurrentQuery().set(attributes)
    selectionInterface.getCurrentQuery().cancelCurrentSearches()
    setState({
      ...state,
      isSearching: true,
      lazyResults: null,
      refetch: () => {
        selectionInterface.getCurrentQuery().startSearch()
      },
    })
    selectionInterface.getCurrentQuery().startSearchFromFirstPage()
  }, [attributes])

  return { state, setState, processingAttributeChange }
}

export const useSearchDetails = ({
  selectionInterface,
}: {
  selectionInterface?: any
}) => {
  const [state, setState] = React.useState<RestResultsType>({
    lazyResults: null,
    currentAsOf: Date.now(),
    refetch: () => {},
    resultMessage: UNRUN_SEARCH_MESSAGE,
    pending: true,
    failed: false,
    warnings: false,
    isSearching: true,
    hasBeenRun: false,
    hasNextPage: false,
    hasPreviousPage: false,
    previousPage: () => {},
    nextPage: () => {},
    firstPage: () => {},
    lastPage: () => {},
    hasFirstPage: false,
    hasLastPage: false,
    startAndEnd: {
      start: 0,
      end: 0,
      hits: 0,
    },
  })

  const lazyResults = useLazyResultsFromSelectionInterface({
    selectionInterface,
  })

  const transformedStatusOfLazyResults = useTransformedStatusOfLazyResults({
    lazyResults,
  })

  React.useEffect(() => {
    setState({
      ...state,
      lazyResults,
      ...transformedStatusOfLazyResults,
      refetch: () => {
        selectionInterface.getCurrentQuery().startSearch()
      },
      hasPreviousPage: selectionInterface
        .getCurrentQuery()
        .hasPreviousServerPage(),
      hasNextPage: selectionInterface.getCurrentQuery().hasNextServerPage(),
      previousPage: () => {
        selectionInterface.getCurrentQuery().getPreviousServerPage()
      },
      nextPage: () => {
        selectionInterface.getCurrentQuery().getNextServerPage()
      },
      hasFirstPage: selectionInterface
        .getCurrentQuery()
        .getHasFirstServerPage(),
      hasLastPage: selectionInterface.getCurrentQuery().getHasLastServerPage(),
      lastPage: () => {
        selectionInterface.getCurrentQuery().getLastServerPage()
      },
      firstPage: () => {
        selectionInterface.getCurrentQuery().getFirstServerPage()
      },
      startAndEnd: selectionInterface
        .getCurrentQuery()
        .getCurrentStartAndEndForSourceGroup(),
    })
  }, [lazyResults, transformedStatusOfLazyResults])

  return { state, setState }
}

export const usePageMessage = ({
  restResults,
}: {
  restResults: RestResultsType
}) => {
  const [pageMessage, setPageMessage] = React.useState('Nothing found')

  React.useEffect(() => {
    if (restResults.isSearching) {
      setPageMessage('Searching . . .')
    } else if (restResults.lazyResults?.isEmpty()) {
      setPageMessage('Nothing found')
    } else {
      setPageMessage(
        `${restResults.startAndEnd.start}-${restResults.startAndEnd.end} of ${restResults.startAndEnd.hits}`
      )
    }
  }, [restResults])

  return pageMessage
}
