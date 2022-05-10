import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import AddOutlined from '@mui/icons-material/AddOutlined'

import DataTable from './dataTable'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
})

const headCells = [
  {
    id: '_id',
    numeric: false,
    dataType: 'text',
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'title',
    numeric: true,
    dataType: 'text',
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'description',
    numeric: true,
    dataType: 'text',
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'createdAt',
    numeric: true,
    dataType: 'date',
    disablePadding: false,
    label: 'Created At'
  },
  {
    id: 'updatedAt',
    dataType: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Updated At'
  }
]

export default function CategoriesCRUD () {

  const [ catTitle, setCatTitle ] = useState('')
  const [ catDesc, setCatDesc ] = useState('')

  const [ editCatTitle, setEditCatTitle ] = useState('')
  const [ editCatDesc, setEditCatDesc ] = useState('')

  const [ categories, setCategories ] = useState([])

  const [ deleteDialogOpen, setDeleteDialogOpen ] = useState(false)
  const [ editDialogOpen, setEditDialogOpen ] = useState(false)

  const [ selectedRows, setSelectedRows ] = useState([])

  const [ snackBar, setSnackBar ] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const openDeleteDialogHandler = ( selectedRows ) => {

    setSelectedRows(selectedRows)

    setDeleteDialogOpen(true)
  }

  const closeDeleteDialogHandler = () => {
    setDeleteDialogOpen(false)
  }

  const openEditDialogHandler = ( selectedRows ) => {

    setSelectedRows(selectedRows)

    let id = selectedRows[0]

    let category = categories[ categories.findIndex( cat => cat._id === id ) ]
    setEditCatTitle( category.title )
    setEditCatDesc( category.description )

    setEditDialogOpen(true)
  }

  const closeEditDialogHandler = () => {
    setEditDialogOpen(false)
  }

  const addCategoryHandler = (e) => {
    e.preventDefault()

    axios.post('/api/categories', {
      title: catTitle,
      description: catDesc
    }).then( res => {
      console.log(res.data.data)
      getTableData()
      displaySnackBarHandler(`Successfuly added category ${res.data.data.title}!`, 'success')
    }).catch( err => {
      console.log('Error adding category: ' + err)
    })
  }

  const categoryDeleteHandler = () => {

    axios.delete('/api/categories', {
      data: {
        ids : selectedRows
      }
    }).then( res => {
      setSelectedRows([])
      getTableData()
      displaySnackBarHandler(`Successfuly deleted ${ res.data.data.deletedCount } category/es`, 'success')
      closeDeleteDialogHandler()
    }).catch( err => {
      console.log(err)
    })

  }

  const categoryEditHandler = (e) => {

    e.preventDefault()

    let category = categories.find( cat => cat._id === selectedRows[0])

    if( editCatDesc === category.description && editCatTitle === category.title )
    {

      displaySnackBarHandler('Nothing edited!', 'info')
      closeEditDialogHandler()

    } else {

      axios.put('/api/categories',{
        id: selectedRows[0],
        title: editCatTitle,
        description: editCatDesc
      }).then( res => {
        getTableData()
        displaySnackBarHandler(`Successfuly edited category ${res.data.data.title}!`, 'success')
        closeEditDialogHandler()
      }).catch( err => {
        console.log(err)
      })

    }

  }

  const snackBarCloseHandler = () => {

    setSnackBar( prevState => ({
      ...prevState,
      open: false
    }))

  }

  const displaySnackBarHandler = (message, severity) => {
    
    let snackBar = {
      open: true,
      message: message,
      severity: severity
    }

    setSnackBar(snackBar)

  }

  const getTableData = () => {

    axios.get('/api/categories')
         .then( res => {

            let categories = res.data.data

            setCategories(categories)

         })
         .catch( err => {
            console.log('Error fetching categories: ' + err )
         })
  }

  useEffect(() => {

    getTableData()

  },[])

  return (
    <Box
      pt={'20px'}
    >
      <Paper
        variant='outlined'
        sx={{
          maxWidth:'300px',
          p: '20px'
        }}
      >
        <Typography>
          Dodaj Kategoriju
        </Typography>
        <Stack 
          component={'form'} 
          spacing={2}
          onSubmit={addCategoryHandler}
          sx={{
            pt: '30px'
          }}
        >
          <TextField variant='outlined' label='Naziv' value={catTitle} onChange={(e) => setCatTitle(e.target.value)} required/>
          <TextField variant='outlined' multiline maxRows={5} label='Opis' value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
          <IconButton sx={{ width: 'fit-content', ml: 'auto !important', mr: 'auto !important' }} type='submit' variant='outlined'><AddOutlined sx={{ color: 'rgb(76, 175, 80)' }} /></IconButton>
        </Stack>
      </Paper>

      {
        categories.length && (

          <DataTable 
            title={'Table'}
            headCells={headCells}
            dataRows={categories}
            deleteRowHandler={openDeleteDialogHandler}
            editRowHandler={openEditDialogHandler}
            paginationOptions={[5, 15, 25]}
          />

        )
      }

      <Dialog
        open={deleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteDialogHandler}
      >
        <DialogTitle>{"Deleting record/s"}</DialogTitle>
        <DialogContent>
          { categories.length && selectedRows.length && (

            <DialogContentText id="alert-dialog-slide-description">
              {`You are about to delete ${selectedRows.length} record/s?`}
            </DialogContentText>

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={categoryDeleteHandler}>Yes</Button>
          <Button onClick={closeDeleteDialogHandler}>No</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialogOpen}
        TransitionComponent={Transition}
        onClose={closeEditDialogHandler}
        keepMounted
      >
        <Box 
          component='form'
          onSubmit={categoryEditHandler}
        >
          <DialogTitle>{"Editing record"}</DialogTitle>
          <DialogContent>
            { categories.length && selectedRows.length && (
              <>
                <DialogContentText
                  marginBottom={'20px'}
                >
                  {`Editing record - ${categories[categories.findIndex( cat => cat._id === selectedRows[0] )].title} -`}
                </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={editCatTitle}
                    onChange={(e) => setEditCatTitle(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    multiline
                    fullWidth
                    variant="outlined"
                    value={editCatDesc}
                    onChange={(e) => setEditCatDesc(e.target.value)}
                  />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button type='submit'>Save</Button>
            <Button onClick={closeEditDialogHandler}>Exit</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
        open={snackBar.open}
        onClose={snackBarCloseHandler}
        autoHideDuration={5000}
      >
        <Alert
          onClose={snackBarCloseHandler}
          severity={snackBar.severity} 
          sx={{ width: '100%' }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>

    </Box>
  )
}