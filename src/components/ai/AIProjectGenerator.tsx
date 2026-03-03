import { useState, type FormEvent } from 'react'
import { Sparkles, Check, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button, TextArea, Card, Badge } from '@/components/ui'
import { useAI } from '@/hooks/useAI'
import { useProjects } from '@/hooks/useProjects'
import { useUIStore } from '@/store/ui.store'

interface AIProjectGeneratorProps {
  open: boolean
  onClose: () => void
}

export function AIProjectGenerator({ open, onClose }: AIProjectGeneratorProps) {
  const { isGenerating, error, generateProject } = useAI()
  const { createProject } = useProjects()
  const addToast = useUIStore((s) => s.addToast)

  const [description, setDescription] = useState('')
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof generateProject>> | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleGenerate(e: FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    const result = await generateProject(description.trim())
    if (result) setPlan(result)
  }

  async function handleConfirm() {
    if (!plan) return
    setCreating(true)

    const project = await createProject({
      title: plan.title,
      description: plan.description,
      totalDays: plan.totalDays,
      phases: plan.phases,
      categories: plan.categories,
    })

    if (project) {
      // Bulk create goals via the project page
      addToast(`Project "${plan.title}" created with ${plan.goals.length} goals ready to import.`, 'success')
      onClose()
    }
    setCreating(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="AI Project Generator" className="max-w-2xl">
      {!plan ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <TextArea
            label="Describe your project"
            placeholder="e.g., Learn Kubernetes in 30 days, Master React testing, 90-day DSA preparation..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={isGenerating} className="w-full">
            <Sparkles className="h-4 w-4" />
            Generate Plan
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{plan.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{plan.totalDays} days</Badge>
            <Badge variant="purple">{plan.phases.length} phases</Badge>
            <Badge variant="success">{plan.goals.length} goals</Badge>
            {plan.categories.map(c => <Badge key={c}>{c}</Badge>)}
          </div>

          {plan.phases.length > 0 && (
            <Card className="p-3">
              <h4 className="mb-2 text-sm font-semibold">Phases</h4>
              {plan.phases.map((p, i) => (
                <div key={i} className="border-l-2 border-brand-300 py-1 pl-3 text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-2 text-xs text-gray-400">Day {p.startDay}-{p.endDay}</span>
                </div>
              ))}
            </Card>
          )}

          <Card className="max-h-48 overflow-y-auto p-3 scrollbar-thin">
            <h4 className="mb-2 text-sm font-semibold">Goals Preview</h4>
            {plan.goals.slice(0, 20).map((g, i) => (
              <div key={i} className="flex items-center gap-2 py-1 text-sm">
                <span className="text-xs text-gray-400">
                  {g.day ? `D${g.day}` : `${i + 1}`}
                </span>
                <span>{g.title}</span>
                <Badge variant="purple" className="ml-auto">{g.category}</Badge>
              </div>
            ))}
            {plan.goals.length > 20 && (
              <p className="mt-2 text-xs text-gray-400">...and {plan.goals.length - 20} more</p>
            )}
          </Card>

          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setPlan(null)}>
              <X className="h-4 w-4" /> Regenerate
            </Button>
            <Button className="flex-1" onClick={handleConfirm} loading={creating}>
              <Check className="h-4 w-4" /> Create Project
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
