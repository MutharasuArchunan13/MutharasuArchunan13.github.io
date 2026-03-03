import { useState, type FormEvent } from 'react'
import { Clipboard, Check, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button, TextArea, Badge } from '@/components/ui'
import { useAI } from '@/hooks/useAI'
import type { GoalInput } from '@/types'

interface AIContentParserProps {
  open: boolean
  onClose: () => void
  projectSlug: string
  onImport: (goals: GoalInput[]) => Promise<void>
}

export function AIContentParser({ open, onClose, projectSlug, onImport }: AIContentParserProps) {
  const { isGenerating, error, parseContent } = useAI()
  const [text, setText] = useState('')
  const [goals, setGoals] = useState<GoalInput[] | null>(null)
  const [importing, setImporting] = useState(false)

  async function handleParse(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const result = await parseContent(text.trim(), projectSlug)
    if (result) setGoals(result)
  }

  async function handleImport() {
    if (!goals) return
    setImporting(true)
    await onImport(goals)
    setImporting(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Import from Content" className="max-w-2xl">
      {!goals ? (
        <form onSubmit={handleParse} className="space-y-4">
          <TextArea
            label="Paste syllabus, roadmap, or outline"
            placeholder="Paste any structured content here... AI will parse it into goals."
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={isGenerating} className="w-full">
            <Clipboard className="h-4 w-4" />
            Parse Content
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{goals.length} goals extracted</p>

          <div className="max-h-64 space-y-1 overflow-y-auto scrollbar-thin">
            {goals.map((g, i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-gray-200 p-2 text-sm dark:border-gray-700">
                <span className="flex-1">{g.title}</span>
                <Badge variant="purple">{g.category}</Badge>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setGoals(null)}>
              <X className="h-4 w-4" /> Re-parse
            </Button>
            <Button className="flex-1" onClick={handleImport} loading={importing}>
              <Check className="h-4 w-4" /> Import All
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
