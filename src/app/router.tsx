import { createBrowserRouter, type RouteObject } from 'react-router'

import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

import { RootLayout, SearchRoute } from './routes'

export function createAppRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'search', element: <SearchRoute /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}

export const router = createBrowserRouter(createAppRoutes())
