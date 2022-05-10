import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Skeleton from '@mui/material/Skeleton'

import React from 'react'

export default function Categories ({ categories }) {
  return (
    <Paper
      elevation={1}
      sx={{
        maxWidth: '80%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      
      { 
        categories.length ? categories.map( cat => {

          return (

            <Tooltip key={cat._id} title={cat.description}>
              <Button
                variant={'outlined'}
                sx={{
                  width: '30%',
                  minHeight: '70px',
                  margin: '10px'
                }}
              >
                {cat.title}
              </Button>
            </Tooltip>

          )

        }) : <Skeleton variant="rectangular" width={800} height={118} />
      }

    </Paper>
  )
}