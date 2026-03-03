import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select } from '@/components/ui'
import type { GoalInput, GoalPriority } from '@/types'

interface GoalFormProps {
  open: boolean
  onClose: () => void
  onCreate: (input: GoalInput) => Promise<unknown>
  projectSlug: string
  categories: string[]
}

export function GoalForm({ open, onClose, onCreate, projectSlug, categories }: GoalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0] ?? 'general')
  const [priority, setPriority] = useState<GoalPriority>('medium')
  const [day, setDay] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      projectSlug,
      day: day ? parseInt(day) : undefined,
    })
    setLoading(false)
    setTitle('')
    setDescription('')
    setDay('')
    onClose()
  }

  const categoryOptions = [
    ...categories.map(c => ({ value: c, label: c })),
    { value: 'general', label: 'general' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Add Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="goal-title"
          label="Title"
          placeholder="e.g., Solve Two Sum problem"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          id="goal-desc"
          label="Description"
          placeholder="Details, links, notes..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-3">
          <Select
            id="goal-category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
          <Select
            id="goal-priority"
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
            options={priorityOptions}
          />
          <Input
            id="goal-day"
            label="Day"
            type="number"
            min="1"
            placeholder="Optional"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Goal
          </Button>
        </div>
      </form>
    </Modal>
  )
}
