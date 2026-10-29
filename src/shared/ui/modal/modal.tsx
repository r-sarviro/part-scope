import { X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'

import { Button } from '../button'

import styles from './modal.module.css'

export type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children?: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (open) {
      if (!dialog.open) {
        showDialog(dialog)
      }
      return
    }

    if (dialog.open) {
      closeDialog(dialog)
    }
  }, [open])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Escape') {
      return
    }
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <Button
            type="button"
            variant="icon"
            size="sm"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  )
}

function showDialog(dialog: HTMLDialogElement) {
  try {
    dialog.showModal()
  } catch {
    dialog.setAttribute('open', '')
  }
}

function closeDialog(dialog: HTMLDialogElement) {
  try {
    dialog.close()
  } catch {
    dialog.removeAttribute('open')
  }
}
