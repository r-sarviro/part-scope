import { QueryClient } from '@tanstack/react-query'

/** QueryClient для тестов: без ретраев, предсказуемые тайминги. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
