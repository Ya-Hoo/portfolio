import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { lookup } from 'mime-types'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string; filename: string } }
) {
  const filePath = path.join(
    process.cwd(),
    'content',
    'projects',
    params.slug,
    'files',
    params.filename
  )

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const mimeType = (lookup(params.filename) as string) || 'application/octet-stream'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${params.filename}"`,
      // Aggressive caching for static assets in dev — tune for production
      'Cache-Control': 'public, max-age=3600',
    },
  })
}