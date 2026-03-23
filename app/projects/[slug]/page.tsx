import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug, getProjectFiles, getProjectMedia, getAllProjects } from '@/lib/projects'
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import ProjectPageClient from './ProjectPageClient'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getAllProjects().map(p => ({ slug: p.slug }))
}

function loadMdx(slug: string, filename: string): string | null {
  const filePath = path.join(process.cwd(), 'content', 'projects', slug, filename)
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : null
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  wip:    'In Progress',
  done:   'Complete',
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const files        = getProjectFiles(slug)
  const media        = getProjectMedia(slug)
  const devlogSource = loadMdx(slug, 'devlog.mdx')
  const notesSource  = loadMdx(slug, 'notes.mdx')

  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────── */}
      <div className={styles.header}>
        <Link href="/" className={styles.back}>← Back</Link>

        {/* Title row: title left, status badge right */}
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{project.title}</h1>
          <span className={`${styles.status} ${styles[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        {/* Category pill, sits directly under the title */}
        <span className={styles.category}>{project.category}</span>

        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── 1. Development Log ─────────────────────── */}
      {devlogSource && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Development Log</h2>
          <div className={`prose ${styles.prose}`}>
            <MDXRemote source={devlogSource} />
          </div>
        </section>
      )}

      {/* ── 2. Notes ───────────────────────────────── */}
      {notesSource && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Notes</h2>
          <div className={`prose ${styles.prose}`}>
            <MDXRemote source={notesSource} />
          </div>
        </section>
      )}

      {/* ── 3. Files + 4. Gallery (client, interactive) */}
      <ProjectPageClient
        files={files}
        media={media}
        links={project.links}
        repoUrl={project.repoUrl}
      />

    </div>
  )
}