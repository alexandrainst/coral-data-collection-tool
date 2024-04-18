import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { theme } from './theme.ts'
import { connect } from 'extendable-media-recorder-wav-encoder'
import { register } from 'extendable-media-recorder'
import { httpBatchLink } from '@trpc/client'
import { trpc } from './trpc.ts'

// Register wav extension for recordings
await register(await connect())

export const domainName = 'http://localhost:3333' //`${document.location.protocol}//${document.location.host}`
const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${domainName}/trpc`,
      // You can pass any HTTP headers you wish here
    }),
  ],
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createTheme(theme)}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
)
