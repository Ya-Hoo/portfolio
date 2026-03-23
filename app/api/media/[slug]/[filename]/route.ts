import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { lookup } from 'mime-types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; filename: string }> }
) {
  const { slug, filename } = await params
  const filePath = path.join(
    process.cwd(),
    'content',
    'projects',
    slug,
    'media',
    filename
  )

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const mimeType = (lookup(filename) as string) || 'application/octet-stream'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}