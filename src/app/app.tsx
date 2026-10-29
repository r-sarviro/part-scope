import { RouterProvider } from 'react-router'

import { ThemeProvider } from '@/shared/lib'

import { QueryProvider } from './query-provider'
import { router } from './router'

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  )
}
