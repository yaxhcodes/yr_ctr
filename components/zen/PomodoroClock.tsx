'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw, Settings } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { SettingsModal } from './SettingsModal'

export default function PomodoroClock() {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('pomodoroTime')
    return savedTime ? parseInt(savedTime, 10) : 25 * 60
  })
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem('pomodoroIsActive')
    return savedIsActive === 'true'
  })
  const [isBreak, setIsBreak] = useState(() => {
    const savedIsBreak = localStorage.getItem('pomodoroIsBreak')
    return savedIsBreak === 'true'
  })
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [videoData, setVideoData] = useState<{ youtube_id: string } | null>(null)

  const { toast } = useToast()
  const startTimeRef = useRef<number | null>(null)
  const accumulatedTimeRef = useRef(0)
  const totalTime = isBreak ? breakDuration * 60 : workDuration * 60

  // Save state to local storage
  useEffect(() => localStorage.setItem('pomodoroTime', time.toString()), [time])
  useEffect(() => localStorage.setItem('pomodoroIsActive', isActive.toString()), [isActive])
  useEffect(() => localStorage.setItem('pomodoroIsBreak', isBreak.toString()), [isBreak])

  // Fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch('https://video-tokin.onrender.com/api/check-new-video')
        const data = await response.json()
        setVideoData(data)
      } catch (error) {
        console.error('Error fetching video data:', error)
      }
    }
    fetchVideoData()
  }, [])

  // Update document title
  useEffect(() => {
    const mode = isBreak ? 'Break Mode' : 'Focus Mode'
    const formattedTime = formatTime(time)
    document.title = `${formattedTime} - ${mode}`
  }, [time, isBreak])

  // Accurate timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      startTimeRef.current = Date.now()
      interval = setInterval(() => {
        const currentTime = Date.now()
        const elapsedSeconds = Math.floor((currentTime - startTimeRef.current!) / 1000)
        const newTime = totalTime - elapsedSeconds - accumulatedTimeRef.current

        if (newTime <= 0) {
          setTime(0)
        } else {
          setTime(newTime)
        }
      }, 200)
    }

    return () => {
      clearInterval(interval)
      if (isActive && startTimeRef.current) {
        accumulatedTimeRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000)
      }
    }
  }, [isActive, totalTime])

  // Handle phase change
  useEffect(() => {
    if (time === 0) {
      setIsBreak(prev => !prev)
      setTime(isBreak ? workDuration * 60 : breakDuration * 60)
      accumulatedTimeRef.current = 0
      setIsActive(true)

      const today = new Date().toDateString()
      const lastCompletedDate = localStorage.getItem('lastCompletedDate')

      if (!isBreak && today !== lastCompletedDate) {
        toast({
          title: "Congrats! 🎉",
          description: "You have unlocked today's video!",
          variant: "default",
        })
        localStorage.setItem('lastCompletedDate', today)
      }

      toast({
        title: !isBreak ? "Congrats! 🎉" : "Break's Over! ⏰",
        description: !isBreak 
          ? "You completed the focus duration. Time for a break!"
          : "Time to focus again. Let's get back to work!",
        variant: "default",
      })

      if (Notification.permission === 'granted') {
        new Notification(isBreak ? 'Focus Time!' : 'Break Time!')
      }
    }
  }, [time, isBreak, workDuration, breakDuration, toast])

  const startTimer = () => setIsActive(true)
  const pauseTimer = () => setIsActive(false)
  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTime(workDuration * 60)
    accumulatedTimeRef.current = 0
    localStorage.removeItem('pomodoroTime')
    localStorage.removeItem('pomodoroIsActive')
    localStorage.removeItem('pomodoroIsBreak')
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSettings = () => setShowSettings(true)
  const saveSettings = () => {
    setTime(workDuration * 60)
    setShowSettings(false)
  }

  const progressPercentage = ((totalTime - time) / totalTime) * 100

  const handleVideoClick = () => {
    if (!isBreak) {
      toast({
        title: "Focus First! 🚀",
        description: "Complete your focus duration to unlock a life-changing video.",
        variant: "default",
      })
    }
  }

  return (
    <div className="flex flex-col">
      <Card className="w-full max-w-2xl shadow-lg bg-stone-700/60 border-none backdrop-blur-sm overflow-hidden relative">
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl font-bold text-white">
            {isBreak ? 'Break Time!' : 'Focus Time!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-48 h-48">
                  <CircularProgressbar
                    value={progressPercentage}
                    text={formatTime(time)}
                    styles={buildStyles({
                      textSize: '16px',
                      textColor: '#ffffff',
                      pathColor: '#d6d3d1',
                      trailColor: '#2d2a28',
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-300 hover:text-stone-400"
                onClick={isActive ? pauseTimer : startTimer}
              >
                {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-300 hover:text-stone-400"
                onClick={resetTimer}
              >
                <RefreshCw className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-stone-300 hover:text-stone-400"
                onClick={handleSettings}
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div>

            {isBreak && videoData && (
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Get to know something new!!</h2>
                <a
                  href={`https://www.youtube.com/watch?v=${videoData.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-stone-400"
                  onClick={handleVideoClick}
                >
                  Watch this video
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        workDuration={workDuration}
        setWorkDuration={setWorkDuration}
        breakDuration={breakDuration}
        setBreakDuration={setBreakDuration}
        onSave={saveSettings}
      />

      <Toaster />
    </div>
  )
}