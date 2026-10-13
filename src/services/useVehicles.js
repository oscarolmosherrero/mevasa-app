import { useEffect, useState } from 'react'
import { getVehicles } from './vehicles.js'

export function useVehicles(everyMs = 2000) {
  const [vehicles, setVehicles] = useState(() => getVehicles())
  useEffect(() => {
    const t = setInterval(() => setVehicles(getVehicles()), everyMs)
    return () => clearInterval(t)
  }, [everyMs])
  return vehicles
}
