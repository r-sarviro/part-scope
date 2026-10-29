import { QueryClient, type DefaultOptions } from '@tanstack/react-query'

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 20_000,
    refetchOnWindowFocus: false,
    retry: 1,
  },
}

export function createQueryClient(
  options: DefaultOptions = defaultOptions,
): QueryClient {
  return new QueryClient({ defaultOptions: options })
}
