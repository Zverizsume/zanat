import Link from 'next/link'
import React from 'react'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import CssBaseline from '@mui/material/CssBaseline'

import Home from '@mui/icons-material/Home'
import Group from '@mui/icons-material/Group'
import Category from '@mui/icons-material/Category'
import App from '@mui/icons-material/Apps'

const ButtonLink = ( {href, children, ...props} ) => {
  return (
    <Link href={href} passHref>
      <Button {...props}>
        {children}
      </Button>
    </Link>
  )
}

const drawerWidth = 240

export default function SideNav () {

  return (
    <>
      <CssBaseline />
      <Drawer
        variant='permanent'
        anchor='left'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          }
        }}
      >
        <Toolbar>
          <Typography
            textAlign={'center'}
            variant='h5'
          >
            Dashboard
          </Typography>
        </Toolbar>
        <Divider/>
        <Stack
          spacing={2}
          marginTop={'20px'}
          padding='10px'
        >
          <ButtonLink href='/dashboard' variant='outlined' startIcon={<Home />} > Pocetna</ButtonLink>
          <ButtonLink href='/dashboard/users' variant='outlined' startIcon={<Group />} >Korisnici</ButtonLink>
          <ButtonLink href='/dashboard/categories' variant='outlined' startIcon={<Category />} >Kategorije</ButtonLink>
          <ButtonLink href='/' variant='outlined' startIcon={<App />} >Back to App</ButtonLink>
        </Stack>
      </Drawer>
    </>
  )
}