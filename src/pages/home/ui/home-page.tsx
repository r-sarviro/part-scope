import { ArticleSearchForm, useArticleSearch } from '@/features/search-parts'
import { Card } from '@/shared/ui'

import styles from './home-page.module.css'

export function HomePage() {
  const { draftArticle, setDraftArticle, submitArticle } = useArticleSearch()

  return (
    <div className={styles.page}>
      <div className={['container', styles.stage].join(' ')}>
        <div className={styles.copy}>
          <h1 className={styles.title}>Поиск автозапчастей</h1>
          <p className={styles.lead}>
            Введите артикул, чтобы найти производителей и аналоги
          </p>
        </div>
        <Card className={styles.searchCard}>
          <ArticleSearchForm
            value={draftArticle}
            onChange={setDraftArticle}
            onSubmit={submitArticle}
          />
        </Card>
      </div>
    </div>
  )
}
