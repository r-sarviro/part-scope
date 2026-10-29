import { useState } from 'react'

import { useSearchNavigation } from './use-search-navigation'

export function useArticleSearch(initialArticle = '') {
  const { submitArticle } = useSearchNavigation()
  const [draftArticle, setDraftArticle] = useState(initialArticle)

  return { draftArticle, setDraftArticle, submitArticle }
}
