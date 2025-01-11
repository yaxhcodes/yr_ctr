'use client'

import React, { useState, useEffect } from 'react'

// YouTube Playlist IDs
const playlists = {
  zimmer: 'PLzPUZygRisDaRz6HvENiVEI66rV1_E9F0',
  nujabes: 'PL78919005D9B21949',
  space: 'PLzPUZygRisDYLY86k9sLJwQ-lMfCmreKB',
  soft: 'PLzPUZygRisDasnL-ix38DoDmm6c2vpzsL',
  simpsonwave: 'PLgqUU6LMjmasfShYkWONWHgTkrBW-Xhi4',
  ghibli: 'PLoHeY8_-p9bqCxws5RXtcVwkKxM-S-wdR',
  academia: 'PLoDIwr-VVj-y151-PmbwGFQfA7aorugTz',
  anime: 'PLl578ZPbYIlFcSxuka8Km37VgbUYUWI5p',
  genshin: 'PLQanRFTDY9rFjeAgCdtmDSiH4kXp159xN'
  
}

export default function MusicPlayer() {
  const [musicGenre, setMusicGenre] = useState<keyof typeof playlists>(() => {
    if (typeof window !== 'undefined') {
      const savedGenre = localStorage.getItem('musicGenre')
      return (savedGenre as keyof typeof playlists) || 'zimmer'
    }
    return 'zimmer'
  })

  const [currentVideoIndex, setCurrentVideoIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('currentVideoIndex')
      return savedIndex ? parseInt(savedIndex) : 0
    }
    return 0
  })

  const [playbackTime, setPlaybackTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('playbackTime')
      return savedTime ? parseFloat(savedTime) : 0
    }
    return 0
  })

  // const hasInitialSeek = useRef(false)
  // const playerRef = useRef<YT.Player | null>(null)

  // Save state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicGenre', musicGenre)
    }
  }, [musicGenre])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentVideoIndex', currentVideoIndex.toString())
    }
  }, [currentVideoIndex])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playbackTime', playbackTime.toString())
    }
  }, [playbackTime])

  // Function to create YouTube player parameters
  const getYouTubeParams = () => {
    return `list=${playlists[musicGenre]}&index=${currentVideoIndex}&start=${Math.floor(playbackTime)}&autoplay=1&enablejsapi=1`
  }

  // Handle player state changes
  const handlePlayerStateChange = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      if (data.event === 'onStateChange') {
        if (data.info === 0 || data.info === 1) {
          const player = event.target as unknown as YT.Player
          setCurrentVideoIndex(player.getPlaylistIndex())
        }
      }
    } catch {
      // Handle parsing error silently
    }
  }

  // Add event listener for YouTube player messages
  useEffect(() => {
    window.addEventListener('message', handlePlayerStateChange)
    return () => {
      window.removeEventListener('message', handlePlayerStateChange)
    }
  }, [])

  // Save playback time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.querySelector('iframe')
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'getCurrentTime' }),
          '*'
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-stone-700/60 border-stone-900 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Focus Music</h2>

      {/* Genre Selector */}
      <div className="relative">
        <div className="flex space-x-3 mb-4 overflow-x-auto scrollbar-default pb-2">
          {Object.keys(playlists).map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setMusicGenre(genre as keyof typeof playlists)
                setCurrentVideoIndex(0)
                setPlaybackTime(0)
              }}
              className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                musicGenre === genre
                  ? 'bg-stone-300 text-black'
                  : 'bg-stone-800/30 text-gray-300 hover:bg-stone-400 hover:text-black'
              }`}
              style={{ userSelect: 'none' }}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Player */}
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/videoseries?${getYouTubeParams()}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  )
}