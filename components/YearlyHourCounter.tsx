'use client'

import { useState, useEffect } from 'react'
import { 
  getISTTime, 
  calculateTimeInfo, 
  formatTime, 
  formatISTDate,
  TOTAL_HOURS_IN_YEAR 
} from '@/utils/timeUtils'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import AnimeQuotes from './AnimeQuotes'
import { Hourglass, Zap } from 'lucide-react'

export default function YearlyHourCounter() {
  const [timeInfo, setTimeInfo] = useState({
    remainingHours: TOTAL_HOURS_IN_YEAR,
    dayOfYear: 1,
    weekOfYear: 1,
    elapsedHours: 0,
    elapsedMinutes: 0
  })
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const storedStartTime = localStorage.getItem('yearlyCounterStartTime')
    
    if (!storedStartTime) {
      const startTime = formatISTDate(new Date('2025-01-01T00:00:00+05:30'))
      localStorage.setItem('yearlyCounterStartTime', startTime)
    }

    const updateCounter = () => {
      const startTime = localStorage.getItem('yearlyCounterStartTime') as string
      const info = calculateTimeInfo(startTime)
      setTimeInfo(info)
      setCurrentTime(getISTTime().toLocaleString('en-US', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }))

      if (info.remainingHours <= 0) {
        const newStartTime = formatISTDate(new Date('2025-01-01T00:00:00+05:30'))
        localStorage.setItem('yearlyCounterStartTime', newStartTime)
      }
    }

    updateCounter()
    const intervalId = setInterval(updateCounter, 1000) // Update every second

    return () => clearInterval(intervalId)
  }, [])

  const progressPercentage = (timeInfo.elapsedHours / TOTAL_HOURS_IN_YEAR) * 100

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 dark">
      <Card className="w-full max-w-2xl shadow-lg bg-gray-900/80 border-purple-500/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/placeholder.jpeg?height=400&width=600')] opacity-10 bg-cover bg-center"></div>
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl font-bold text-purple-300">Accelarate anon, the clock is ticking.</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-400 mb-2 flex items-center justify-center">
                <Hourglass className="w-12 h-12 mr-4 animate-pulse text-yellow-400" />
                <span className="tabular-nums">{timeInfo.remainingHours}</span>
                <span className="text-2xl ml-2 text-purple-300">/ {TOTAL_HOURS_IN_YEAR}</span>
              </div>
              <div className="text-xl text-purple-200">
                {formatTime(timeInfo.remainingHours, 60 - timeInfo.elapsedMinutes)} remaining
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2 w-full bg-purple-900">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </Progress>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <InfoCard title="Day of Year" value={timeInfo.dayOfYear} />
              <InfoCard title="Week of Year" value={`${timeInfo.weekOfYear} / 52`} />
              <InfoCard 
                title="Elapsed Time" 
                value={`${timeInfo.elapsedHours}h ${timeInfo.elapsedMinutes}m`} 
              />
              <InfoCard 
                title="Elapsed Days" 
                value={`${Math.floor(timeInfo.elapsedHours / 24)} / 365`} 
              />
            </div>
            
            <div className="text-center text-sm text-purple-300">
              {currentTime}
            </div>
          </div>
        </CardContent>
      </Card>
      <AnimeQuotes />
      {/* <div className="mt-6 text-center text-purple-200 max-w-md">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-400" />
          Seize Every Moment!
        </h2>
        <p>Every second is a chance to change your life. Don't let the clock tick away your dreams. Rise up and make every hour count!</p>
      </div> */}
    </div>
  )
}

function InfoCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-purple-800/50 rounded-lg p-3 backdrop-blur-sm border border-purple-500/30">
      <div className="text-sm font-medium text-purple-200">{title}</div>
      <div className="text-2xl font-bold text-yellow-400">{value}</div>
    </div>
  )
}

