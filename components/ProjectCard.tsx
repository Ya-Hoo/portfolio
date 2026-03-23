import Link from 'next/link'
import type { ProjectMeta } from '@/lib/projects'
import styles from './ProjectCard.module.css'

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  wip:    'In Progress',
  done:   'Complete',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <Link href={`/projects/${project.slug}`} className={styles.card}>

      {/* ── Status corner triangle ── */}
      <span
        className={`${styles.statusCorner} ${styles[project.status]}`}
        title={STATUS_LABELS[project.status]}
        aria-label={`Status: ${STATUS_LABELS[project.status]}`}
      >
        <span className={styles.statusDot} />
        <span className={styles.statusTooltip}>{STATUS_LABELS[project.status]}</span>
      </span>

      {/* ── Title + category ── */}
      <div className={styles.top}>
        <h3 className={styles.title}>{project.title}</h3>
        <span className={styles.category}>{project.category}</span>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.bottom}>
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <span className={styles.date}>Updated {formatDate(project.updatedAt)}</span>
      </div>

    </Link>
  )
}