import { getAllProjects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import styles from './page.module.css'

export default function HomePage() {
  const all      = getAllProjects()
  const fun      = all.filter(p => p.section === 'fun')
  const work     = all.filter(p => p.section === 'work')

  return (
    <div className={styles.page}>
      <section className={styles.bio}>
        <h1 className={styles.heading}>the lab</h1>
        <p className={styles.tagline}>
          A collection of things I'm building — some for work, some just because.
        </p>
      </section>

      <hr className={styles.divider} />

      <ProjectSection title="Work" projects={work} />
      <ProjectSection title="Fun" projects={fun} />
    </div>
  )
}

function ProjectSection({
  title,
  projects,
}: {
  title: string
  projects: ReturnType<typeof getAllProjects>
}) {
  if (projects.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {projects.map(p => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  )
}