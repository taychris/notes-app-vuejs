import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Category } from '@/types'
import type { Note } from '@/types'

const dateFnsMock = vi.hoisted(() => {
  const formattedNow = '2024-01-02_03-04-05'
  return {
    formattedNow,
    format: vi.fn(() => formattedNow),
  }
})

const jsPdfMock = vi.hoisted(() => {
  const config = { pageHeight: 200, pageWidth: 420 }
  const behavior = {
    splitTextToSize: (text: string, _maxWidth: number) => [text],
  }
  const instances: Array<{ opts: unknown; doc: any }> = []

  const jsPDF = vi.fn(function (opts: unknown) {
    const doc = {
      internal: {
        pageSize: {
          getHeight: vi.fn(() => config.pageHeight),
          getWidth: vi.fn(() => config.pageWidth),
        },
      },
      setFontSize: vi.fn(),
      text: vi.fn(),
      splitTextToSize: vi.fn((text: string, maxWidth: number) =>
        behavior.splitTextToSize(text, maxWidth),
      ),
      setFont: vi.fn(),
      addPage: vi.fn(),
      setDrawColor: vi.fn(),
      line: vi.fn(),
      save: vi.fn(),
    }

    instances.push({ opts, doc })
    return doc
  })

  return {
    config,
    behavior,
    instances,
    jsPDF,
    reset: () => {
      instances.length = 0
      jsPDF.mockClear()
      behavior.splitTextToSize = (text: string) => [text]
    },
  }
})

vi.mock('date-fns', () => ({
  format: dateFnsMock.format,
}))

vi.mock('jspdf', () => ({
  jsPDF: jsPdfMock.jsPDF,
}))

const fixedNow = new Date('2024-01-02T03:04:05.000Z')

let exportNotesToJsonFile: typeof import('@/utils/exportNotes').exportNotesToJsonFile
let exportNotesToPdfFile: typeof import('@/utils/exportNotes').exportNotesToPdfFile

beforeAll(async () => {
  const mod = await import('@/utils/exportNotes')
  exportNotesToJsonFile = mod.exportNotesToJsonFile
  exportNotesToPdfFile = mod.exportNotesToPdfFile
})

beforeEach(() => {
  jsPdfMock.reset()
  dateFnsMock.format.mockClear()

  vi.useFakeTimers()
  vi.setSystemTime(fixedNow)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function extractTextArgs(textCalls: Array<unknown[]>): string[] {
  return textCalls.map((call) => {
    const arg = call[0]
    if (Array.isArray(arg)) return arg.join('\n')
    return String(arg)
  })
}

function getLast<T>(items: T[]): T {
  const last = items[items.length - 1]
  if (!last) throw new Error('Expected at least one item')
  return last
}

async function readBlobText(blob: unknown): Promise<string> {
  const maybeBlob = blob as any
  if (typeof maybeBlob?.text === 'function') return await maybeBlob.text()
  if (Array.isArray(maybeBlob?.parts)) return String(maybeBlob.parts[0])
  throw new Error('Unable to read blob payload in this test environment')
}

describe('exportNotesToJsonFile', () => {
  it('downloads a JSON file with exported notes', async () => {
    let createdBlob: unknown = null
    const createObjectURLMock = vi.fn((blob: unknown) => {
      createdBlob = blob
      return 'blob:http://localhost/mock'
    })
    const revokeObjectURLMock = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock,
    } as any)

    class MockBlob {
      parts: unknown[]
      type: string
      constructor(parts: unknown[], options?: { type?: string }) {
        this.parts = parts
        this.type = options?.type ?? ''
      }
      async text() {
        return String(this.parts[0] ?? '')
      }
    }
    vi.stubGlobal('Blob', MockBlob as any)

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    let createdAnchor: HTMLAnchorElement | null = null
    const originalAppendChild = document.body.appendChild.bind(document.body)
    vi.spyOn(document.body, 'appendChild').mockImplementation((node: any) => {
      if (node instanceof HTMLAnchorElement) createdAnchor = node
      return originalAppendChild(node)
    })

    const notes: Note[] = [
      {
        id: 'n1',
        title: 'T1',
        description: 'D1',
        category: Category.WORK,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    exportNotesToJsonFile(notes, 'notes')

    expect(dateFnsMock.format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd_HH-mm-ss')
    expect(createdAnchor).not.toBeNull()
    expect(createdAnchor!.download).toBe(`notes-${dateFnsMock.formattedNow}.json`)
    expect(createdAnchor!.href).toBe('blob:http://localhost/mock')
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(createdAnchor!.isConnected).toBe(false)

    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    expect(createdBlob).not.toBeNull()
    const blob = createdBlob as any
    expect(blob.type).toBe('application/json;charset=utf-8')

    const payloadText = await readBlobText(blob)
    expect(payloadText).toBe(
      JSON.stringify(
        {
          exportedAt: fixedNow.toISOString(),
          notes,
        },
        null,
        2,
      ),
    )

    expect(revokeObjectURLMock).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/mock')
  })

  it('includes the search query in the exported payload when provided', async () => {
    let createdBlob: unknown = null
    const createObjectURLMock = vi.fn((blob: unknown) => {
      createdBlob = blob
      return 'blob:http://localhost/mock'
    })
    vi.stubGlobal('URL', { createObjectURL: createObjectURLMock, revokeObjectURL: vi.fn() } as any)

    class MockBlob {
      parts: unknown[]
      type: string
      constructor(parts: unknown[], options?: { type?: string }) {
        this.parts = parts
        this.type = options?.type ?? ''
      }
      async text() {
        return String(this.parts[0] ?? '')
      }
    }
    vi.stubGlobal('Blob', MockBlob as any)

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    const notes: Note[] = [
      {
        id: 'n1',
        title: 'T1',
        description: 'D1',
        category: Category.PERSONAL,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    exportNotesToJsonFile(notes, 'notes', 'hello world')

    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    expect(createdBlob).not.toBeNull()
    const blob = createdBlob as any
    const payload = JSON.parse(await readBlobText(blob))
    expect(payload).toEqual({
      exportedAt: fixedNow.toISOString(),
      searchQuery: 'hello world',
      notes,
    })
  })
})

describe('exportNotesToPdfFile', () => {
  it('renders the PDF header and saves a timestamped file', async () => {
    const notes: Note[] = [
      {
        id: 'n1',
        title: 'T1',
        description: 'D1',
        category: Category.WORK,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'n2',
        title: 'T2',
        description: 'D2',
        category: Category.WORK,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    exportNotesToPdfFile(notes, 'notes', 'q')

    expect(dateFnsMock.format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd_HH-mm-ss')
    expect(jsPdfMock.jsPDF).toHaveBeenCalledWith({ unit: 'pt', format: 'a4' })

    const doc = getLast(jsPdfMock.instances).doc

    const texts = extractTextArgs(doc.text.mock.calls)
    expect(texts.some((t) => t.includes('Notes export (2)'))).toBe(true)
    expect(texts.some((t) => t.includes(`Category: ${Category.WORK}`))).toBe(true)
    expect(texts.some((t) => t.includes('Search query: q'))).toBe(true)
    expect(texts.some((t) => t.startsWith('Exported: '))).toBe(true)

    expect(doc.save).toHaveBeenCalledWith(`notes-${dateFnsMock.formattedNow}.pdf`)
  })

  it('uses a single category label when all notes match, otherwise uses "Multiple"', async () => {
    const mixedNotes: Note[] = [
      {
        id: 'n1',
        title: 'T1',
        description: 'D1',
        category: Category.PERSONAL,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'n2',
        title: 'T2',
        description: 'D2',
        category: Category.WORK,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    exportNotesToPdfFile(mixedNotes, 'notes')

    const doc = getLast(jsPdfMock.instances).doc
    const texts = extractTextArgs(doc.text.mock.calls)
    expect(texts.some((t) => t.includes('Category: Multiple'))).toBe(true)
  })

  it('trims note descriptions and falls back to "(No description)" for blank descriptions', async () => {
    const notes: Note[] = [
      {
        id: 'n1',
        title: 'Trim',
        description: '  Hello  ',
        category: Category.IDEAS,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'n2',
        title: 'Blank',
        description: '   ',
        category: Category.IDEAS,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    exportNotesToPdfFile(notes, 'notes')

    const doc = getLast(jsPdfMock.instances).doc
    expect(doc.splitTextToSize).toHaveBeenCalledWith('Hello', expect.any(Number))
    expect(doc.splitTextToSize).toHaveBeenCalledWith('(No description)', expect.any(Number))
  })

  it('adds new pages when content exceeds available space', async () => {
    const longLines = Array.from({ length: 40 }, (_, i) => `Line ${i + 1}`)
    const notes: Note[] = [
      {
        id: 'n1',
        title: 'Long',
        description: 'Long description',
        category: Category.TODO,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]

    jsPdfMock.behavior.splitTextToSize = (text) => {
      if (text === 'Long description') return longLines
      return [text]
    }
    exportNotesToPdfFile(notes, 'notes')

    const doc = getLast(jsPdfMock.instances).doc
    expect(doc.addPage.mock.calls.length).toBeGreaterThan(1)
  })

  it('renders each note with title and updated timestamp', async () => {
    const note: Note = {
      id: 'n1',
      title: 'My Title',
      description: 'Desc',
      category: Category.OTHER,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-03T04:05:06.000Z',
    }

    exportNotesToPdfFile([note], 'notes')

    const doc = getLast(jsPdfMock.instances).doc
    const texts = extractTextArgs(doc.text.mock.calls)
    expect(texts.some((t) => t.includes(`My Title | ${Category.OTHER}`))).toBe(true)
    expect(
      texts.some((t) => t.includes(`Updated: ${new Date(note.updatedAt).toLocaleString()}`)),
    ).toBe(true)
  })
})
