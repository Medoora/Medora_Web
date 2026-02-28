'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import DashboardLayout from '@/components/layouts/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Download,
  Calendar,
  FileText,
  Tag,
  Star,
  Loader2
} from 'lucide-react'

interface DocumentData {
  id: string
  documentName: string
  description?: string
  documentDate?: string
  uploadedAt: any
  category?: string
  categoryLabel?: string
  tags?: string[]
  isStarred?: boolean
  cloudinary: {
    url: string
    thumbnailUrl?: string
    format: string
    bytes: number
  }
}

export default function ViewPage() {
  const { fileId } = useParams() as { fileId: string }
  const router = useRouter()

  const [document, setDocument] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = async () => {
      if (!fileId) return

      try {
        const snap = await getDoc(doc(db, 'documents', fileId))
        if (snap.exists()) {
          setDocument({ id: snap.id, ...(snap.data() as any) })
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [fileId])

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 KB'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '--'
    const date = timestamp.toDate?.() || new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  if (!document) return null

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {document.documentName}
              </h1>

              {document.isStarred && (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {document.categoryLabel && (
                <Badge variant="secondary">
                  {document.categoryLabel}
                </Badge>
              )}

              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Uploaded {formatDate(document.uploadedAt)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => window.open(document.cloudinary.url, '_blank')}
            className="shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Preview Card */}
<Card className="overflow-hidden border bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur">
  <CardContent className="p-6">
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-background flex items-center justify-center">

      {(() => {
        const format = document.cloudinary.format?.toLowerCase()

        const imageTypes = ['jpg', 'jpeg', 'png', 'webp']
        const isImage = imageTypes.includes(format)
        const isPDF = format === 'pdf'

        // IMAGE PREVIEW
        if (isImage) {
          return (
            <Image
              src={document.cloudinary.url}
              alt={document.documentName}
              fill
              className="object-contain"
            />
          )
        }

        // PDF PREVIEW (force inline)
        if (isPDF) {
          const pdfUrl = document.cloudinary.url
            .replace('/image/upload/', '/raw/upload/')
            .replace('/upload/', '/upload/fl_inline/')

          return (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
            />
          )
        }
      })()}

    </div>
  </CardContent>
</Card>
        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Metadata */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                File Details
              </h2>

              <div className="text-sm space-y-2 text-muted-foreground">
                <div>Format: {document.cloudinary.format?.toUpperCase()}</div>
                <div>Size: {formatBytes(document.cloudinary.bytes)}</div>
                {document.documentDate && (
                  <div>Document Date: {document.documentDate}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description & Tags */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Description & Tags
              </h2>

              {document.description ? (
                <p className="text-sm text-muted-foreground">
                  {document.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description added.
                </p>
              )}

              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}