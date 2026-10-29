import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router'

import { Card } from '@/shared/ui'

import styles from './not-found-page.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <title>Страница не найдена — Part Scope</title>
      <meta name="robots" content="noindex, follow" />
      <div className={['container', styles.stage].join(' ')}>
        <Card className={styles.panel}>
          <div className={styles.icon} aria-hidden="true">
            <FileQuestion size={18} />
          </div>
          <div className={styles.copy}>
            <h1 className={styles.title}>Страница не найдена</h1>
            <p className={styles.lead}>
              Проверьте адрес или вернитесь на главную.
            </p>
          </div>
          <Link className={styles.homeLink} to="/">
            На главную
          </Link>
        </Card>
      </div>
    </div>
  )
}
