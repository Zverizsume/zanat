import React from 'react'
import { SessionProvider } from 'next-auth/react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import '../styles/globals.css'

const clientSideEmotionCache = createEmotionCache()

export default function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } }) {
  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}
