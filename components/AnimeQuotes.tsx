'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Quote } from 'lucide-react'

interface Quote {
  id: number
  english: string
}

const DESIRED_ANIME = [
  'hajime no ippo',
  'ghost in the shell',
  'slam dunk',
  'haikyuu!!',
  'barakamon',
  'ergo proxy',
  'tengen toppa gurren lagann',
  'one punch man',
  'mushishi',
  'eureka seven',
  'no game no life',
  'diamond no ace',
  'tokyo ghoul',

];

export default function AnimeQuotes() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchQuote = async () => {
    setIsLoading(true);
    setQuote(null);
    
    for (let attempts = 0; attempts < DESIRED_ANIME.length; attempts++) {
      try {
        const randomIndex = Math.floor(Math.random() * DESIRED_ANIME.length);
        const randomAnime = DESIRED_ANIME[randomIndex];
        const encodedAnime = encodeURIComponent(randomAnime);
        const response = await fetch(`https://katanime.vercel.app/api/getbyanime?anime=${encodedAnime}&page=1`);
        const data = await response.json();
        
        if (data.sukses && data.result && data.result.length > 0) {
          const randomQuote = data.result[Math.floor(Math.random() * data.result.length)];
          setQuote({ id: randomQuote.id, english: randomQuote.english });
          break;
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <Card className="w-full max-w-2xl mt-8 shadow-lg bg-gray-900/80 border-purple-500/50 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/placeholder.jpeg?height=200&width=600')] opacity-10 bg-cover bg-center"></div>
      <CardContent className="p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-purple-400 hover:text-purple-200"
          onClick={fetchQuote}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <div className="flex items-center justify-center min-h-[120px]">
          {quote ? (
            <div className="text-center">
              <Quote className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-purple-200 italic text-lg leading-relaxed">
                "{quote.english}"
              </p>
            </div>
          ) : (
            <p className="text-center text-purple-300">
              {isLoading ? 'Seeking wisdom...' : 'No quote found. Refresh for inspiration.'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

