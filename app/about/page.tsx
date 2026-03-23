import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>About</h1>
      <div className={styles.body}>
        <p>
          Hi - I'm Gia Phu (pronounced: Ya-Foo) and I love to build things.
        </p>
        <p>
            This is where I document what I'm working on, whether it's for work or just for fun.
        </p>
        <p>
          If something here catches your eye, feel free to reach out.
        </p>

        <div className={styles.links}>
          <a href="https://github.com/Ya-Hoo" target="_blank" rel="noopener noreferrer">
            GitHub: Ya-Hoo ↗
          </a>
          <a href="mailto:huynhgiaphu3004@gmail.com">
            Email: huynhgiaphu3004@gmail.com ↗
          </a>
        </div>
      </div>
    </div>
  )
}