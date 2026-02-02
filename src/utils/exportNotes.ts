import type { Note } from '@/types'
import { format } from 'date-fns'

let jsPdfModulePromise: Promise<typeof import('jspdf')> | null = null

// lazy load jsPDF module for quicker initial load time
async function loadJsPdfModule() {
  jsPdfModulePromise ??= import('jspdf')
  return jsPdfModulePromise
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  // Allow the browser to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function exportNotesToJsonFile(notes: Note[], filenamePrefix: string, searchQuery?: string) {
  const filename = `${filenamePrefix}-${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.json`
  const payload = JSON.stringify(
    { exportedAt: new Date().toISOString(), searchQuery, notes },
    null,
    2,
  )
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
  downloadBlob(blob, filename)
}

export async function exportNotesToPdfFile(
  notes: Note[],
  filenamePrefix: string,
  searchQuery?: string,
) {
  const filename = `${filenamePrefix}-${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`

  const { jsPDF } = await loadJsPdfModule()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const margin = 40
  const lineHeight = 14
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2

  let y = margin

  const categories = Array.from(new Set(notes.map((n) => n.category)))
  const categoryLabel = categories.length === 1 ? categories[0] : 'Multiple'

  // Header
  doc.setFontSize(16)
  doc.text(doc.splitTextToSize(`Notes export (${notes.length})`, maxWidth), margin, y)
  y += 24

  doc.setFontSize(12)
  doc.text(doc.splitTextToSize(`Category: ${categoryLabel}`, maxWidth), margin, y)
  y += 20

  if (searchQuery) {
    doc.setFontSize(12)
    doc.text(doc.splitTextToSize(`Search query: ${searchQuery}`, maxWidth), margin, y)
    y += 20
  }

  // Export date
  doc.setFontSize(10)
  doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y)
  y += 40

  doc.setFontSize(12)

  const ensureSpace = (needed: number) => {
    if (y + needed <= pageHeight - margin) return
    doc.addPage()
    y = margin
  }

  // Notes content
  for (const note of notes) {
    const title = `${note.title} | ${note.category}`
    const description = note.description?.trim() ? note.description.trim() : '(No description)'
    const updatedAt = `Updated: ${new Date(note.updatedAt).toLocaleString()}`

    ensureSpace(60)

    // Title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(doc.splitTextToSize(title, maxWidth), margin, y)
    y += lineHeight * 1.5

    // Description
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    const descriptionLines = doc.splitTextToSize(description, maxWidth)
    for (const line of descriptionLines) {
      ensureSpace(lineHeight)
      doc.text(line, margin, y)
      y += lineHeight
    }

    // Add a bit more breathing room after the description
    y += 10

    // Updated at
    ensureSpace(lineHeight * 2)
    doc.setFontSize(10)
    doc.text(updatedAt, margin, y)
    y += lineHeight

    // Keep the separator close to the updated date
    y += 4
    ensureSpace(4)
    doc.setDrawColor(200)
    doc.line(margin, y, margin + maxWidth, y)

    // Add more space after the separator
    y += 30
  }

  doc.save(filename)
}
