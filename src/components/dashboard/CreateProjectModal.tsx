import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea } from '@/components/ui'
import type { ProjectInput } from '@/types'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onCreate: (input: ProjectInput) => Promise<unknown>
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [totalDays, setTotalDays] = useState('90')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      totalDays: parseInt(totalDays) || 90,
    })
    setLoading(false)
    setTitle('')
    setDescription('')
    setDueDate('')
    setTotalDays('90')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Project Title"
          placeholder="e.g., 90-Day Interview Prep"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          id="description"
          label="Description"
          placeholder="What's this project about?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Input
            id="totalDays"
            label="Duration (days)"
            type="number"
            min="1"
            max="365"
            value={totalDays}
            onChange={(e) => setTotalDays(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  )
}
