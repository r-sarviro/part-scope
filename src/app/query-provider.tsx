import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

import { createQueryClient } from './query-client'

type QueryProviderProps = {
  children: ReactNode
  client?: QueryClient
}

export function QueryProvider({ children, client }: QueryProviderProps) {
  const [queryClient] = useState(() => client ?? createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
