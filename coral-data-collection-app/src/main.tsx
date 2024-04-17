import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ApiProvider } from './api/ApiProvider.tsx'
import { theme } from './theme.ts'
import { connect } from 'extendable-media-recorder-wav-encoder'
import { register } from 'extendable-media-recorder'

// Register wav extension for recordings
await register(await connect())

export const domainName = `${document.location.protocol}//${document.location.host}`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider theme={createTheme(theme)}>
        <ApiProvider domainName={domainName}>
          <App />
        </ApiProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
