import React from "react"

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'

import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

import {styled} from '@mui/material/styles'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

const NavLogo = styled(Typography)(() => ({
  flexGrow: "1",
  cursor: "pointer"
}))

const NavLinksWrapper = styled(Stack)(() => ({
  marginLeft: "10px",
}))

export default function Navbar({navHeight}) {

  const { data: session, status} = useSession()

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const stringAvatar = (name) => {
    return `${name.split(' ')[0][0]}`
  }

  return (
    <AppBar 
      position="static"
      sx={{
        height: {navHeight},
        maxHeight: {navHeight}
      }}
    >
      <CssBaseline />
      <Toolbar>
        <Container 
          maxWidth='lg'
          sx={{
            display: 'flex'
          }} 
        >
          <NavLogo variant="h4">
            Zanatlije
          </NavLogo>
            <NavLinksWrapper
              direction={'row'}
              spacing={2}
            >
              <Link href="/" passHref>
                <Button variant="contained">Home</Button>
              </Link>

              <Link href="/dashboard" passHref>
                <Button variant="contained">Dashboard</Button>
              </Link>
              { session ? (
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar>
                    { stringAvatar(session.user.name) }
                    </Avatar>
                  </IconButton>
                </Tooltip>
              ) : <Button onClick={() => signIn()} variant='contained'>Login</Button>}
            </NavLinksWrapper>
          </Container>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: 'rgba(249, 199, 79, .9)',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href='/profile' passHref>
          <MenuItem>
            <Avatar /> Profile
          </MenuItem>
        </Link>
        <Divider />
        <Link href='/settings'>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() => signOut()}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}