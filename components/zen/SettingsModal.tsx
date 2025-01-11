import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  workDuration: number
  setWorkDuration: (value: number) => void
  breakDuration: number
  setBreakDuration: (value: number) => void
  onSave: () => void
}

export function SettingsModal({
  isOpen,
  onClose,
  workDuration,
  setWorkDuration,
  breakDuration,
  setBreakDuration,
  onSave,
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-stone-800 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Work Duration (minutes):</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(Number(e.target.value))}
              className="w-20 p-2 bg-stone-700 text-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-300">Break Duration (minutes):</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-20 p-2 bg-stone-700 text-gray-300 rounded-lg"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-stone-500 hover:bg-stone-600 text-white"
            onClick={onSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}