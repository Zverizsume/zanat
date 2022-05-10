import React, { useState } from 'react'
import { signIn, getProviders, getCsrfToken, getSession } from 'next-auth/react'

import Container from '@mui/material/Container'
import Layout from '../components/layout'

import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import GoogleIcon from '@mui/icons-material/Google'

const pageSEOData = {
  title : 'Register',
  desc : 'Register page',
  canonical : 'http://localhost:3000/register'
}

const REDIRECT_URL = '/'

export default function Home({providers, csrfToken}) {

  return (
    
      <Layout pageSEOData={pageSEOData}>
        <Container
          maxWidth={'lg'}
          sx={{
            height: '100%'
          }}
        >
          <Stack
            spacing={2}
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
              {
                Object.values(providers).map( provider => {

                  // console.log(provider)

                  if ( provider.name === 'Credentials' ) 

                  return (

                    <Paper
                      key={provider.id}
                      sx={{
                        padding:'20px'
                      }}
                    >
                      <Stack
                        component={'form'}
                        method='post'
                        action={provider.signinUrl}
                        spacing={3}
                      >
                        <TextField sx={{ display: 'none' }} type={'hidden'} defaultValue={csrfToken} name={'csrfToken'} />
                        <TextField variant='outlined' label={'Username'} name={'username'} type='text' required />
                        <TextField variant='outlined' label={'Email'} name={'email'} type='email' required />
                        <TextField variant='outlined' label={'Password'} name={'password'} type='password' required />
                        <TextField variant='outlined' label={'Password again'} name={'password'} type='password' required />
                        <Button variant='contained' type='submit'>Register</Button>
                        <Typography>
                          Imate registrovan nalog? Ulogujte se <Link href={'/login'}>ovde</Link>.
                        </Typography>
                      </Stack>
                    </Paper>

                  )

                  return(

                    <Box
                      key={provider.id}
                    >
                      <Button variant={'contained'} startIcon={<GoogleIcon />} onClick={() => signIn(provider.id)}>
                        Uloguj se pomoću { provider.name === 'Google' ? 'gmail-a' : provider.name}
                      </Button>
                    </Box>

                  )

                })
              }
          </Stack>
        </Container>
      </Layout>
  )
}

export async function getServerSideProps(ctx) {
  
  const session = await getSession(ctx)

  if ( session ) {

    ctx.res.writeHead(302, { Location: REDIRECT_URL }).end()

    return {
      props: {}
    }

  }

  const providers = await getProviders()
  const csrfToken = await getCsrfToken()
  return {
    props: { providers, csrfToken },
  }
}