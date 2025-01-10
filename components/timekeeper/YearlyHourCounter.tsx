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
import { Hourglass } from 'lucide-react'

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
    <div className="flex flex-col py-0 font-space-grotesk">
      <Card className="w-full max-w-2xl shadow-lg bg-stone-700/60 border-none backdrop-blur-sm overflow-hidden relative">
        {/* <div className="absolute inset-0 bg-[url('/placeholder.jpeg?height=400&width=600')] opacity-10 bg-cover bg-center"></div> */}
        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-3xl font-bold text-white">Accelarate anon, the clock is ticking.</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-stone-300 mb-2 flex items-center justify-center">
                <Hourglass className="w-12 h-12 mr-4 animate-pulse text-stone-300" />
                <span className="tabular-nums">{timeInfo.remainingHours}</span>
                <span className="text-2xl ml-2 text-gray-300">/ {TOTAL_HOURS_IN_YEAR}</span>
              </div>
              <div className="text-xl text-gray-300">
                {formatTime(timeInfo.remainingHours, 60 - timeInfo.elapsedMinutes)} remaining
              </div>
            </div> 
            <Progress value={progressPercentage} className="h-2 w-full bg-stone-600">
              <div 
                className="h-full bg-gradient-to-r from-stone-900 to-stone-800"
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
            
            <div className="text-center text-sm text-stone-400">
              {currentTime}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anime Quotes Section */}
      <AnimeQuotes />
    </div>
  )
}

function InfoCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-stone-800 rounded-lg p-3 backdrop-blur-sm border border-stone-700">
      <div className="text-sm font-medium text-stone-300">{title}</div>
      <div className="text-2xl font-bold text-stone-500">{value}</div>
    </div>
  )
}