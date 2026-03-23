'use client'
import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen:   boolean
  onClose:  () => void
  title?:   string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          {title && <span className={styles.title}>{title}</span>}
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

/* ── PDF helper ─────────────────────────────────────── */
export function PdfViewer({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      className={styles.iframe}
      title="PDF viewer"
    />
  )
}