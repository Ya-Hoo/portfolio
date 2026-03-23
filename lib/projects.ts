import fs from 'fs'
import path from 'path'

export type ProjectStatus = 'active' | 'wip' | 'done'
export type ProjectCategory = 'Mechanical' | 'Electronics' | 'Software' | 'Fabrication' | 'Research'

export interface ProjectMeta {
  slug:        string
  title:       string
  description: string
  status:      ProjectStatus
  category:    ProjectCategory
  tags:        string[]          // tech stack tags
  updatedAt:   string            // ISO date string "2024-03-10"
  section:     'fun' | 'work'
  repoUrl?:    string
  links?:      { label: string; url: string }[]
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects')

export function getAllProjects(): ProjectMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const slugs = fs.readdirSync(CONTENT_DIR).filter(f =>
    fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()
  )

  const projects = slugs
    .map(slug => {
      const metaPath = path.join(CONTENT_DIR, slug, 'meta.json')
      if (!fs.existsSync(metaPath)) return null
      const raw = fs.readFileSync(metaPath, 'utf-8')
      const meta = JSON.parse(raw) as Omit<ProjectMeta, 'slug'>
      return { slug, ...meta } as ProjectMeta
    })
    .filter(Boolean) as ProjectMeta[]

  // Sort by updatedAt descending
  return projects.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getProjectBySlug(slug: string): ProjectMeta | null {
  const metaPath = path.join(CONTENT_DIR, slug, 'meta.json')
  if (!fs.existsSync(metaPath)) return null
  const raw = fs.readFileSync(metaPath, 'utf-8')
  const meta = JSON.parse(raw) as Omit<ProjectMeta, 'slug'>
  return { slug, ...meta }
}

export interface FileItem {
  filename: string
  ext:      string
  size:     string
  url:      string
}

export interface MediaItem {
  filename: string
  type:     'image' | 'video'
  url:      string
}

export function getProjectFiles(slug: string): FileItem[] {
  const filesDir = path.join(CONTENT_DIR, slug, 'files')
  if (!fs.existsSync(filesDir)) return []

  return fs.readdirSync(filesDir).map(filename => {
    const filePath = path.join(filesDir, filename)
    const stats = fs.statSync(filePath)
    const ext = path.extname(filename).toLowerCase().slice(1)
    return {
      filename,
      ext,
      size: formatBytes(stats.size),
      url: `/project-files/${slug}/${filename}`,
    }
  })
}

export function getProjectMedia(slug: string): MediaItem[] {
  const mediaDir = path.join(CONTENT_DIR, slug, 'media')
  if (!fs.existsSync(mediaDir)) return []
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov']
  const videoExts = ['mp4', 'mov']
  return fs.readdirSync(mediaDir)
    .filter(f => imageExts.includes(path.extname(f).toLowerCase().slice(1)))
    .map((filename): MediaItem => ({
      filename,
      type: videoExts.includes(path.extname(filename).toLowerCase().slice(1)) ? 'video' : 'image',
      url: `/project-media/${slug}/${filename}`,
    }))
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}