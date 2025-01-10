'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw, Settings } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function PomodoroClock() {
  // Load initial state from local storage or use defaults
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
  interface VideoData {
    youtube_id: string;
  }

  const [videoData, setVideoData] = useState<VideoData | null>(null)

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroTime', time.toString())
  }, [time])

  useEffect(() => {
    localStorage.setItem('pomodoroIsActive', isActive.toString())
  }, [isActive])

  useEffect(() => {
    localStorage.setItem('pomodoroIsBreak', isBreak.toString())
  }, [isBreak])

  // Fetch video data from the API endpoint
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

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      // When time reaches 0, toggle between Focus Time and Break Time
      setIsBreak((prevIsBreak) => !prevIsBreak)
      setTime(isBreak ? workDuration * 60 : breakDuration * 60) // Reset timer based on the next state
      setIsActive(true) // Automatically start the next timer

      // Send a notification when the timer switches
      if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
        new Notification(isBreak ? 'Focus Time!' : 'Break Time!')
      }
    }

    return () => clearInterval(interval)
  }, [isActive, time, isBreak, workDuration, breakDuration])

  const startTimer = () => setIsActive(true)
  const pauseTimer = () => setIsActive(false)
  const resetTimer = () => {
    setIsActive(false)
    setIsBreak(false)
    setTime(workDuration * 60)
    // Clear local storage on reset
    localStorage.removeItem('pomodoroTime')
    localStorage.removeItem('pomodoroIsActive')
    localStorage.removeItem('pomodoroIsBreak')
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
  }

  const saveSettings = () => {
    setTime(workDuration * 60)
    setShowSettings(false)
  }

  // Calculate progress percentage for the circular progress bar
  const totalTime = isBreak ? breakDuration * 60 : workDuration * 60
  const progressPercentage = ((totalTime - time) / totalTime) * 100

  return (
    <div className="flex flex-col">
      <Card className="w-full max-w-2xl shadow-lg bg-stone-700/60 border-none backdrop-blur-sm overflow-hidden relative">
        {/* <div className="absolute inset-0 bg-[url('/placeholder.jpeg?height=400&width=600')] opacity-10 bg-cover bg-center"></div> */}
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl font-bold text-white">
            {isBreak ? 'Break Time!' : 'Focus Time!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-6">
            <div className="text-center">
              {/* Circular Progress Bar */}
              <div className="flex justify-center">
                <div className="w-48 h-48">
                  <CircularProgressbar
                    value={progressPercentage}
                    text={formatTime(time)}
                    styles={buildStyles({
                      textSize: '16px',
                      textColor: '#ffffff',
                      pathColor: '#d6d3d1', // Red for the progress bar
                      trailColor: '#2d2a28', // Dark gray for the trail
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

            {showSettings && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300">Work Duration (minutes):</label>
                  <input
                    type="number"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value))}
                    className="w-20 p-2 bg-stone-800 text-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-300">Break Duration (minutes):</label>
                  <input
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="w-20 p-2 bg-stone-800 text-gray-300 rounded-lg"
                  />
                </div>
                <Button
                  className="w-full bg-stone-500 hover:text-stone-400 text-white"
                  onClick={saveSettings}
                >
                  Save
                </Button>
              </div>
            )}

            {isBreak && videoData && (
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Get to know something new!!</h2>
                <a
                  href={`https://www.youtube.com/watch?v=${videoData.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-stone-400"
                >
                  Watch this video
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}