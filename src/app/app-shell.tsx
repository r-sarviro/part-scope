import type { ReactNode } from 'react'
import { Link } from 'react-router'

import styles from './app-shell.module.css'
import { ThemeSwitcher } from './theme-switcher'

export type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.backdrop} aria-hidden="true" />
      <header className={styles.header}>
        <div className={['container', styles.headerInner].join(' ')}>
          <Link className={styles.brand} to="/">
            <img
              className={styles.mark}
              src="/favicon.svg"
              width={28}
              height={28}
              alt=""
            />
            <span className={styles.word}>Part Scope</span>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
