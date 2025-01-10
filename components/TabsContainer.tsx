'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import YearlyHourCounter from './timekeeper/YearlyHourCounter'
import PomodoroClock from './zen/PomodoroClock'
import { Clover, Hourglass } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import MusicPlayer from './zen/MusicPlayer'

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState<string>('timekeeper')
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  // Handle tab persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTab')
      if (savedTab) {
        setActiveTab(savedTab)
      }
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab)
    }
  }, [activeTab, mounted])

  if (!mounted) return null

  const tabs = [
    {
      id: 'timekeeper',
      label: 'The Timekeeper',
      icon: <Hourglass className="w-6 h-8" />,
      content: <YearlyHourCounter />
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: <Clover className="w-6 h-8" />,
      content: <PomodoroClock />
    }
  ]

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center bg-no-repeat p-2 pt-4 relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/vagabond.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-stone-700/60 border-gray-800">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-4 text-gray-300 transition-colors duration-200
                  data-[state=active]:text-white
                  data-[state=active]:bg-stone-900/80"
              >
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {!isMobile && <span>{tab.label}</span>}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-2">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="transition-opacity duration-200"
              >
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>

        {/* Music Player Section */}
        <div
          className={`w-full mt-2 ${activeTab !== 'focus' ? 'hidden' : ''}`}
        >
          <MusicPlayer />
        </div>
      </div>
    </div>
  )
}