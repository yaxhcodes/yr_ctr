'use client'

import React, { useState, useEffect, useMemo } from 'react'

// Predefined YouTube Playlist IDs
const predefinedPlaylists = {
  Zimmer: 'PLzPUZygRisDaRz6HvENiVEI66rV1_E9F0',
  Nujabes: 'PL78919005D9B21949',
  Space: 'PLzPUZygRisDYLY86k9sLJwQ-lMfCmreKB',
  Soft: 'PLzPUZygRisDasnL-ix38DoDmm6c2vpzsL',
  Simpsonwave: 'PLgqUU6LMjmasfShYkWONWHgTkrBW-Xhi4',
  Ghibli: 'PLoHeY8_-p9bqCxws5RXtcVwkKxM-S-wdR',
  Academia: 'PLoDIwr-VVj-y151-PmbwGFQfA7aorugTz',
  Anime: 'PLl578ZPbYIlFcSxuka8Km37VgbUYUWI5p',
  Genshin: 'PLQanRFTDY9rFjeAgCdtmDSiH4kXp159xN'
}

export default function MusicPlayer() {
  // Load custom playlists from localStorage
  const [customPlaylists, setCustomPlaylists] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customPlaylists')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Merge predefined and custom playlists
  const allPlaylists: Record<string, string> = useMemo(() => ({
    ...predefinedPlaylists,
    ...customPlaylists
  }), [customPlaylists])

  // Music genre state
  const [musicGenre, setMusicGenre] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedGenre = localStorage.getItem('musicGenre')
      const isValid = savedGenre && allPlaylists.hasOwnProperty(savedGenre)
      return isValid ? savedGenre : 'zimmer'
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

  // Add playlist form state
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistId, setNewPlaylistId] = useState('')
  const [error, setError] = useState('')

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('musicGenre', musicGenre)
    localStorage.setItem('currentVideoIndex', currentVideoIndex.toString())
    localStorage.setItem('playbackTime', playbackTime.toString())
  }, [musicGenre, currentVideoIndex, playbackTime])

  // Handle adding new playlist
  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    if (!newPlaylistName.trim()) {
      setError('Please enter a playlist name')
      return
    }

    if (!newPlaylistId.trim()) {
      setError('Please enter a YouTube playlist ID')
      return
    }

    // Check for existing name
    if (allPlaylists.hasOwnProperty(newPlaylistName)) {
      setError('This name is already in use')
      return
    }

    // Update custom playlists
    const updatedPlaylists = {
      ...customPlaylists,
      [newPlaylistName.trim()]: newPlaylistId.trim()
    }

    setCustomPlaylists(updatedPlaylists)
    localStorage.setItem('customPlaylists', JSON.stringify(updatedPlaylists))

    // Reset form
    setNewPlaylistName('')
    setNewPlaylistId('')
  }

  // YouTube player parameters
  const getYouTubeParams = () => {
    return `list=${allPlaylists[musicGenre]}&index=${currentVideoIndex}&start=${Math.floor(playbackTime)}&autoplay=1&enablejsapi=1`
  }

  // Player state management (same as before)
  // ... [keep the existing player state management code]

  return (
    <div className="bg-stone-700/60 border-stone-900 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Focus Music</h2>

      {/* Genre Selector */}
      <div className="relative">
        <div className="flex space-x-3 mb-4 overflow-x-auto scrollbar-default pb-2">
          {Object.keys(allPlaylists).map((genre) => (
            <button
              key={genre}
              onClick={() => {
                setMusicGenre(genre)
                setCurrentVideoIndex(0)
                setPlaybackTime(0)
              }}
              className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                musicGenre === genre
                  ? 'bg-stone-300 text-black'
                  : 'bg-stone-800/30 text-gray-300 hover:bg-stone-400 hover:text-black'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Add Playlist Form */}
      <form onSubmit={handleAddPlaylist} className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 p-2 rounded bg-stone-800/30 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="YouTube Playlist ID"
            value={newPlaylistId}
            onChange={(e) => setNewPlaylistId(e.target.value)}
            className="flex-1 p-2 rounded bg-stone-800/30 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-300 text-black rounded hover:bg-stone-400 transition-colors"
          >
            Add
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

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