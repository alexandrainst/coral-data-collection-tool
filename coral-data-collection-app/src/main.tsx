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
import {
  experimental_formDataLink,
  httpBatchLink,
  splitLink,
} from '@trpc/client'
import { trpc } from './trpc.ts'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// Register wav extension for recordings
await register(await connect())

export const url = 'http://localhost:3333' //${document.location.protocol}//${document.location.host}
const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition: op => op.input instanceof FormData,
      true: experimental_formDataLink({
        url,
      }),
      false: httpBatchLink({
        url,
      }),
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
