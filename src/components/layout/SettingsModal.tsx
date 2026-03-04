import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { geminiKey, setGeminiKey, repo } = useAuthStore()
  const addToast = useUIStore((s) => s.addToast)
  const [key, setKey] = useState(geminiKey ?? '')

  function handleSave() {
    setGeminiKey(key.trim())
    addToast(key.trim() ? 'Gemini API key saved' : 'Gemini API key removed', 'success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Repo: <strong>{repo?.fullName ?? 'Not set'}</strong>
          </p>
        </div>

        <Input
          id="gemini-key"
          label="Google Gemini API Key"
          type="password"
          placeholder="AIzaSy..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <p className="text-xs text-gray-400">
          Enables AI project generation and daily suggestions. Free tier: 15 req/min.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}
