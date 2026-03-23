'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

const links = [
  { href: '/',        label: 'Projects' },
  { href: '/about',   label: 'About'    },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.wordmark}>the lab</Link>
        <nav className={styles.links}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}