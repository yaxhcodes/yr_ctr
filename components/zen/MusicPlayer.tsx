'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  const [customPlaylists, setCustomPlaylists] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customPlaylists')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  const allPlaylists: Record<string, string> = useMemo(() => ({
    ...predefinedPlaylists,
    ...customPlaylists
  }), [customPlaylists])

  const [musicGenre, setMusicGenre] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedGenre = localStorage.getItem('musicGenre')
      return savedGenre && allPlaylists.hasOwnProperty(savedGenre) ? savedGenre : 'Zimmer'
    }
    return 'Zimmer'
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

  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistId, setNewPlaylistId] = useState('')
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('musicGenre', musicGenre)
    localStorage.setItem('currentVideoIndex', currentVideoIndex.toString())
    localStorage.setItem('playbackTime', playbackTime.toString())
  }, [musicGenre, currentVideoIndex, playbackTime])

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newPlaylistName.trim()) {
      setError('Please enter a playlist name')
      return
    }

    if (!newPlaylistId.trim()) {
      setError('Please enter a YouTube playlist ID')
      return
    }

    if (allPlaylists.hasOwnProperty(newPlaylistName)) {
      setError('This name is already in use')
      return
    }

    const updatedPlaylists = {
      ...customPlaylists,
      [newPlaylistName.trim()]: newPlaylistId.trim()
    }

    setCustomPlaylists(updatedPlaylists)
    localStorage.setItem('customPlaylists', JSON.stringify(updatedPlaylists))
    setNewPlaylistName('')
    setNewPlaylistId('')
    setDialogOpen(false)
  }

  const getYouTubeParams = () => {
    return `list=${allPlaylists[musicGenre]}&index=${currentVideoIndex}&start=${Math.floor(playbackTime)}&autoplay=1&enablejsapi=1`
  }

  return (
    <div className="bg-stone-700/60 border-stone-900 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Lock in Music</h2>

      <div className="relative mb-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="absolute left-0 top-0 z-10 h-8 w-8 p-0 rounded-full 
                        sm:rounded-lg sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 
                        bg-stone-300 hover:bg-stone-400 text-black transition-all"
              style={{ zIndex: 20 }}
            >
              <FaPlus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Add Playlist</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-stone-700 border-stone-600 max-w-md opacity-85">
            <DialogHeader>
              <DialogTitle className="text-stone-400">Add New Playlist</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-stone-300">Playlist Name</label>
                  <Input
                    placeholder="My Playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="bg-stone-800 border-stone-500 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-stone-300">YouTube Playlist ID</label>
                  <Input
                    placeholder="PLzPUZygRisDaRz6HvENiVEI66rV1_E9F0"
                    value={newPlaylistId}
                    onChange={(e) => setNewPlaylistId(e.target.value)}
                    className="bg-stone-800 border-stone-500 text-white"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm animate-pulse">⚠️ {error}</p>}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-stone-300 text-black hover:bg-stone-400"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-stone-300 text-black hover:bg-stone-400"
                >
                  Add Playlist
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex space-x-3 overflow-x-auto scrollbar-default pb-2 pl-10 sm:pl-18 lg:pl-36">
        {Object.keys({...customPlaylists, ...predefinedPlaylists}).map((genre) => (
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