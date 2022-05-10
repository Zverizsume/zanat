import { Container, Stack } from '@mui/material'
import React from 'react'
import CategoriesCRUD from '../../components/dashboard/categoriesCRUD'
import SideNav from '../../components/dashboard/sideNav'

export default function Categories () {
  return (
    
    <Stack
      direction={'row'}
    >
      <SideNav />
      <Container
        maxWidth={'lg'}
      >
        <CategoriesCRUD />
      </Container>
    </Stack>
  )
}