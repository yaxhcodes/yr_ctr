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
    ...customPlaylists,
    ...predefinedPlaylists
  }), [customPlaylists])

  const playlistOrder = useMemo(() => {
    const customNames = Object.keys(customPlaylists)
    const predefinedNames = Object.keys(predefinedPlaylists).filter(
      name => !customPlaylists.hasOwnProperty(name)
    )
    return [...customNames, ...predefinedNames]
  }, [customPlaylists])

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

  const handleDeletePlaylist = (e: React.MouseEvent, playlistName: string) => {
    e.stopPropagation()
    const updated = { ...customPlaylists }
    delete updated[playlistName]
    setCustomPlaylists(updated)
    localStorage.setItem('customPlaylists', JSON.stringify(updated))

    if (musicGenre === playlistName) {
      setMusicGenre('Zimmer')
      setCurrentVideoIndex(0)
      setPlaybackTime(0)
    }
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
              className="absolute left-0 top-1 z-30 h-8 w-8 p-0 rounded-md 
                        sm:rounded-lg sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 
                        bg-stone-300 hover:bg-stone-400 text-black transition-all
                        shadow-[4px_0_8px_2px_rgba(68,64,60,0.95)]"
            >
              <FaPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Playlist</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-stone-700 border-stone-600 max-w-md opacity-95">
            <DialogHeader>
              <DialogTitle className="text-stone-100">Add New Playlist</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-100">Playlist Name</label>
                  <Input
                    placeholder="My Playlist"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="bg-stone-800 border-stone-600 focus:ring-2 focus:ring-stone-400 text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-stone-100">YouTube Playlist ID</label>
                  <Input
                    placeholder="PLzPUZygRisDaRz6HvENiVEI66rV1_E9F0"
                    value={newPlaylistId}
                    onChange={(e) => setNewPlaylistId(e.target.value)}
                    className="bg-stone-800 border-stone-600 focus:ring-2 focus:ring-stone-400 text-white"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>}

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

        
        <div className="flex overflow-x-auto scrollbar-default pb-2 pl-10 lg:pl-34 md:pl-34 sm:pl-24 pt-1 gap-2 scroll-px-4 sm:scroll-px-24">          
            {playlistOrder.map((genre) => {
            const isCustom = customPlaylists.hasOwnProperty(genre)
            return (
              <div key={genre} className="relative flex-shrink-0">
                <div className="relative group">
                  <button
                    onClick={() => {
                      setMusicGenre(genre);
                      setCurrentVideoIndex(0);
                      setPlaybackTime(0);
                    }}
                    className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                      musicGenre === genre
                        ? 'bg-stone-300 text-black'
                        : 'bg-stone-800/50 text-stone-200 hover:bg-stone-400 hover:text-black'
                    }`}
                  >
                    {genre}
                    {isCustom && (
                      <span
                        onClick={(e) => handleDeletePlaylist(e, genre)}
                        className="absolute -top-0.5 -right-0.5 bg-red-700 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs hover:bg-red-800 shadow-md cursor-pointer"
                        aria-label={`Delete ${genre} playlist`}
                      >
                        ×
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/videoseries?${getYouTubeParams()}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg border border-stone-600"
        />
      </div>
    </div>
  )
}