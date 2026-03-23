'use client'
import { useState } from 'react'
import Modal, { PdfViewer } from '@/components/Modal'
import type { FileItem, MediaItem } from '@/lib/projects'
import styles from './ProjectPageClient.module.css'

interface Props {
  files:    FileItem[]
  media:    MediaItem[]
  links?:   { label: string; url: string }[]
  repoUrl?: string
}

// Which extensions belong to each type label shown in the file list
const CAD_EXTS  = ['stl', 'step', 'stp', 'obj', 'gltf', 'glb', 'f3d', 'iges']
const DOC_EXTS  = ['pdf', 'md', 'txt', 'docx']

function fileTypeLabel(ext: string): string {
  if (CAD_EXTS.includes(ext)) return '3D'
  if (DOC_EXTS.includes(ext)) return ext.toUpperCase()
  return ext.toUpperCase()
}

function fileAction(ext: string): string {
  return ext === 'pdf' ? 'View' : 'Download'
}

export default function ProjectPageClient({ files, media, links, repoUrl }: Props) {
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [lightbox,   setLightbox]   = useState<MediaItem | null>(null)

  return (
    <>
      {/* ── 3. Files ───────────────────────────────────────── */}
      {files.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>Files</h2>
          <p className={styles.hint}>
            PDFs open in a viewer · all other files download directly
          </p>
          <ul className={styles.fileList}>
            {files.map(file => (
              <li key={file.filename} className={styles.fileRow}>
                <span className={styles.fileTypeBadge}>{fileTypeLabel(file.ext)}</span>
                <span className={styles.fileName}>{file.filename}</span>
                <span className={styles.fileSize}>{file.size}</span>
                <button
                  className={styles.fileAction}
                  onClick={() => setActiveFile(file)}
                >
                  {fileAction(file.ext)}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 4. Gallery ─────────────────────────────────────── */}
      {media.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>Gallery</h2>
          <div className={styles.gallery}>
            {media.map(item => (
              <button
                key={item.filename}
                className={styles.thumb}
                onClick={() => setLightbox(item)}
                aria-label={`View ${item.filename}`}
              >
                {item.type === 'image' ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.url} alt={item.filename} />
                ) : (
                  <>
                    <video src={item.url} muted playsInline />
                    {/* Video play indicator */}
                    <span className={styles.playBadge} aria-hidden="true">▶</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Code & Links ───────────────────────────────────── */}
      {(repoUrl || (links && links.length > 0)) && (
        <section className={styles.section}>
          <h2 className={styles.heading}>Links</h2>
          <ul className={styles.linkList}>
            {repoUrl && (
              <li>
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                  <span>GitHub Repository</span>
                  <span className={styles.arrow}>↗</span>
                </a>
              </li>
            )}
            {links?.map(link => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.extLink}>
                  <span>{link.label}</span>
                  <span className={styles.arrow}>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── File modal (PDF viewer or download prompt) ─────── */}
      <Modal
        isOpen={!!activeFile}
        onClose={() => setActiveFile(null)}
        title={activeFile?.filename}
      >
        {activeFile?.ext === 'pdf' ? (
          <PdfViewer url={activeFile.url} />
        ) : (
          <div className={styles.downloadPrompt}>
            <p className={styles.downloadName}>{activeFile?.filename}</p>
            <p className={styles.downloadMeta}>
              {activeFile?.ext.toUpperCase()} · {activeFile?.size}
            </p>
            <a href={activeFile?.url} download className={styles.downloadBtn}>
              Download ↓
            </a>
          </div>
        )}
      </Modal>

      {/* ── Media lightbox ─────────────────────────────────── */}
      <Modal
        isOpen={!!lightbox}
        onClose={() => setLightbox(null)}
        title={lightbox?.filename}
      >
        {lightbox?.type === 'image' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={lightbox.url} alt={lightbox.filename} className={styles.lightboxImg} />
        ) : lightbox?.type === 'video' ? (
          <video
            src={lightbox.url}
            controls
            autoPlay
            className={styles.lightboxImg}
          />
        ) : null}
      </Modal>
    </>
  )
}