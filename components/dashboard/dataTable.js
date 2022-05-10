import React, { useState } from 'react'
import DayJS from 'dayjs'
import DayJSUtc from 'dayjs/plugin/utc'
import DayJSTimezone from 'dayjs/plugin/timezone'

DayJS.extend(DayJSUtc)
DayJS.extend(DayJSTimezone)

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'

import visuallyHidden from '@mui/utils/visuallyHidden'

function descendingComparator( a, b, sortOrderBy ) {

  if (b[sortOrderBy] < a[sortOrderBy]) {

    return -1

  }
  if (b[sortOrderBy] > a[sortOrderBy]) {

    return 1

  }

  return 0

}

function getComparator( sortOrder, sortOrderBy ) {

  return sortOrder === 'desc'
    ? (a, b) => descendingComparator(a, b, sortOrderBy)
    : (a, b) => -descendingComparator(a, b, sortOrderBy)

}

function stableSort( array, comparator ) {

  const stabilizedThis = array.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {

    const order = comparator(a[0], b[0])

    if (order !== 0) {

      return order

    }

    return a[1] - b[1]

  })

  return stabilizedThis.map((el) => el[0])

}

function EnhancedTableHead( props ) {

  const { headCells } = props
  const { sortOrder } = props
  const { sortOrderBy } = props
  const { numOfSelectedRows } = props
  const { rowCount } = props
  const { onRequestSort } = props
  const { onSelectAllRowsClick } = props

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numOfSelectedRows > 0 && numOfSelectedRows < rowCount}
            checked={rowCount > 0 && numOfSelectedRows === rowCount}
            onChange={onSelectAllRowsClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {
          headCells.map( headCell => (

            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={sortOrderBy === headCell.id ? sortOrder : false}
            >
              <TableSortLabel
                active={sortOrderBy === headCell.id}
                direction={sortOrderBy === headCell.id ? sortOrder : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {sortOrderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>

        ))}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = (props) => {

  const { numOfSelectedRows } = props
  const { deleteRowHandler } = props
  const { editRowHandler } = props
  const { tableTitle } = props
  const { selectedRows } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numOfSelectedRows > 0 && {
          bgcolor: 'rgba(255, 255, 255, .5)'
        }),
      }}
    >
      {numOfSelectedRows > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numOfSelectedRows} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableTitle}
        </Typography>
      )}

      {numOfSelectedRows === 1 && (

        <Tooltip title="Edit">
          <IconButton onClick={() => editRowHandler(selectedRows)}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

      )}

      {numOfSelectedRows > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => deleteRowHandler(selectedRows)}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default function DataTable ({ title, paginationOptions, headCells, dataRows, deleteRowHandler, editRowHandler }) {

  const [ sortOrder, setSortOrder ] = useState('desc')
  const [ sortOrderBy, setSortOrderBy ] = useState('_id')

  const [ selectedRows, setSelectedRows ] = useState([])

  const [ dense, setDense ] = useState(false)
  const [ currentPage, setCurrentPage ] = useState(0)
  const [ rowsPerPage, setRowsPerPage ] = useState(5)

  const deleteTableRowHandler = () => {
    deleteRowHandler(selectedRows)
    setSelectedRows([])
  }

  const editTableRowHandler = () => {
    editRowHandler(selectedRows)
    setSelectedRows([])
  }

  const requestSortHandler = ( event, property ) => {

    const isAsc = sortOrderBy === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortOrderBy(property)

  }

  const selectAllRowsClickHandler = ( e ) => {

    if (e.target.checked) {

      const newSelectedRows = dataRows.map( row => row._id)
      setSelectedRows(newSelectedRows)
      return

    }

    setSelectedRows([])

  }

  const rowClickHandler = ( event, id ) => {

    const selectedIndex = selectedRows.indexOf(id)
    let newSelectedRows = []

    if (selectedIndex === -1) {

      newSelectedRows = newSelectedRows.concat(selectedRows, id)

    } else if (selectedIndex === 0) {

      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1))

    } else if (selectedIndex === selectedRows.length - 1) {

      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1))

    } else if (selectedIndex > 0) {

      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      )

    }

    setSelectedRows(newSelectedRows)

  }

  const changePageHandler = ( event, newPage ) => {
    setCurrentPage(newPage)
  }

  const changeRowsPerPageHandler = ( e ) => {
    console.log(e.target.value)
    setRowsPerPage(parseInt(e.target.value, 10))
    setCurrentPage(0)
  }

  const changeDenseHandler = ( e ) => {
    setDense(e.target.checked)
  }

  const isRowSelected = ( id ) => {
    return selectedRows.indexOf( id ) !== -1
  }

  return (

    <Box>
      <EnhancedTableToolbar 
        numOfSelectedRows={selectedRows.length}
        tableTitle={title}
        deleteRowHandler={deleteTableRowHandler}
        editRowHandler={editTableRowHandler}
        selectedRows={selectedRows}
      />
      <TableContainer>
        <Table
          size={ dense ? 'small' : 'medium' }
        >
          <EnhancedTableHead
            numOfSelectedRows={selectedRows.length}
            sortOrder={sortOrder}
            sortOrderBy={sortOrderBy}
            onSelectAllRowsClick={selectAllRowsClickHandler}
            onRequestSort={requestSortHandler}
            rowCount={dataRows.length}
            headCells={headCells}
          />
          <TableBody>

            { 
              stableSort( dataRows, getComparator(sortOrder, sortOrderBy) )
              .slice( currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage )
              .map( ( row, index ) => {

                let isSelected = isRowSelected( row._id )
                let labelId = `enhanced-table-checkbox-${index}`

                return (

                  <TableRow
                    hover
                    key={row._id}
                    onClick={ (e) => rowClickHandler( e, row._id ) }
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    selected={isSelected}
                  >
                    <TableCell
                      padding='checkbox'
                    >
                      <Checkbox 
                        color="primary"
                        checked={isSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    {
                      headCells.map( ( headCell, index ) => {

                        return (

                          <TableCell
                            key={row._id + index}
                            align={headCell.numeric ? 'right' : 'left'}
                          >
                            { 
                              
                              headCell.dataType === 'date' ?
                              DayJS(row[headCell.id]).tz("Europe/Belgrade", true).format('DD/MMM/YY HH:mm:ss').toString()
                              : row[headCell.id]
                            }
                          </TableCell>

                        )

                      })
                    }
                  </TableRow>

                )

              })
            }

          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={paginationOptions} // array of option for rowsPerPage, examp: [5, 10, 25]
        component="div"
        count={dataRows.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={changePageHandler}
        onRowsPerPageChange={changeRowsPerPageHandler}
      />
      <FormControlLabel
        control={<Switch checked={dense} onChange={changeDenseHandler} />}
        label="Dense Table"
      />
    </Box>

  )

}