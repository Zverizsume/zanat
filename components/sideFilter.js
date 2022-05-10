import React from 'react'

import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export default function SideFilter () {
  return (
    <Paper
      elevation={1}
      sx={{
        width:'max-content',
        padding: '20px'
      }}
    >
      <Stack>
        <Typography>
          Grad
        </Typography>
        <Typography>
          Zanat
        </Typography>
      </Stack>
    </Paper>
  )
}