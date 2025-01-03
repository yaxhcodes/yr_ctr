export const TOTAL_HOURS_IN_YEAR = 8760
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7

export function getISTTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
}

export function calculateTimeInfo(startTime: string): {
    remainingHours: number
    dayOfYear: number
    weekOfYear: number
    elapsedHours: number
    elapsedMinutes: number
  } {
    const currentTime = getISTTime()
    const parsedStartTime = new Date(startTime)
    
    // Calculate elapsed time including partial hours
    const elapsedMilliseconds = currentTime.getTime() - parsedStartTime.getTime()
    const elapsedHours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60))
    const elapsedMinutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    // Calculate remaining hours more accurately
    const remainingHours = TOTAL_HOURS_IN_YEAR - (elapsedMilliseconds / (1000 * 60 * 60))
    
    // Calculate day and week
    const dayOfYear = Math.floor(elapsedHours / HOURS_IN_DAY) + 1
    const weekOfYear = Math.floor((dayOfYear - 1) / DAYS_IN_WEEK) + 1
  
    return { 
      remainingHours: Math.floor(remainingHours), 
      dayOfYear, 
      weekOfYear, 
      elapsedHours,
      elapsedMinutes 
    }
  }

export function formatTime(hours: number, minutes: number = 0): string {
  const days = Math.floor(hours / HOURS_IN_DAY)
  const remainingHours = hours % HOURS_IN_DAY
  return `${days} days, ${remainingHours} hours${minutes ? `, ${minutes} minutes` : ''}`
}

export function formatISTDate(date: Date): string {
  return date.toISOString()
}

