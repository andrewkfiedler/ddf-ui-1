/* Copyright (c) Connexta, LLC */
import Button from '@mui/material/Button'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import * as React from 'react'

type PaginationProps = {
  setPageSize: (size: number) => void
  pageSize: number
  pageSizes: number[]
  pageLabel: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  lastPage: () => void
  firstPage: () => void
}

export const Pagination = ({
  pageLabel,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
  firstPage,
}: PaginationProps) => {
  return (
    <div data-id="pagination-container" className="flex items-center space-x-2">
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center flex-nowrap">
          <Button
            data-id="first-page-button"
            onClick={firstPage}
            disabled={!hasPreviousPage}
          >
            <FirstPageIcon />
          </Button>
          <Button
            data-id="previous-page-button"
            onClick={previousPage}
            disabled={!hasPreviousPage}
          >
            <KeyboardArrowLeft />
          </Button>

          <Button
            data-id="next-page-button"
            onClick={nextPage}
            disabled={!hasNextPage}
          >
            <KeyboardArrowRight />
          </Button>
          <Button
            data-id="last-page-button"
            onClick={lastPage}
            disabled={!hasNextPage}
          >
            <LastPageIcon />
          </Button>
        </div>
        <div> {pageLabel} </div>
      </div>
    </div>
  )
}
