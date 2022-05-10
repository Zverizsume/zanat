import React, { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import axios from 'axios'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import Layout from '../components/layout'
import SideFilter from '../components/sideFilter'
import Categories from '../components/home/categories'

const pageSEOData = {
  title : 'Home',
  desc : 'Home page',
  canonical : 'http://localhost:3000'
}

export default function Home() {

  const { data: session, status } = useSession()

  const [ categories, setCategories ] = useState([])

  useEffect( () => {

    console.log(status)

    if ( status !== 'loading') {

      axios.get('/api/categories')
          .then( res => {
              setCategories( res.data.data )
          })
          .catch( err => {
            console.log(err)
          })

    }

  }, [status])

  return (
    
      <Layout pageSEOData={pageSEOData}>
        <Container
          maxWidth={'lg'}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            sx={{
              mt: '30px'
            }}
          >
            <SideFilter />
            <Categories categories={ categories } />
            <SideFilter />
          </Stack>
        </Container>
      </Layout>
  )
}
