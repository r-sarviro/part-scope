import { Search } from 'lucide-react'
import type { ChangeEvent, FormEvent, HTMLAttributes } from 'react'

import { Button, Input } from '@/shared/ui'

import styles from './article-search-form.module.css'

export type ArticleSearchFormProps = {
  value: string
  onChange?: (value: string) => void
  onSubmit?: (article: string) => void
  submitDisabled?: boolean
} & Omit<HTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'>

export function ArticleSearchForm({
  value,
  onChange,
  onSubmit,
  submitDisabled = false,
  className,
  ...rest
}: ArticleSearchFormProps) {
  const classes = [styles.form, className].filter(Boolean).join(' ')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form className={classes} onSubmit={handleSubmit} {...rest}>
      <Input
        className={styles.field}
        label="Артикул детали"
        type="search"
        name="article"
        value={value}
        onChange={handleChange}
        leadingIcon={<Search size={18} />}
        clearable
        onClear={() => onChange?.('')}
        autoComplete="off"
        spellCheck={false}
        disabled={submitDisabled}
      />
      <Button
        className={styles.submit}
        type="submit"
        variant="primary"
        size="lg"
        disabled={submitDisabled}
      >
        Найти
      </Button>
    </form>
  )
}
