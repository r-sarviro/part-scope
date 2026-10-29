import { Outlet, useLocation } from 'react-router'

import { parseSearchQuery } from '@/features/search-parts'
import { PartsSearchPage } from '@/pages/parts-search'

import { AppShell } from './app-shell'

export function RootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export function SearchRoute() {
  const location = useLocation()
  const article = parseSearchQuery(location.search).number

  return (
    <>
      <title>Поиск — Part Scope</title>
      <meta name="robots" content="noindex, follow" />
      <PartsSearchPage key={article} />
    </>
  )
}
