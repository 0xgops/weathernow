'use client'

import { useState } from 'react'

export default function WeatherPage() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<null | {
    name: string
    temp: number
    condition: string
    icon: string
  }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeather = async () => {
    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      const res = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch')
      }

      setWeather(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded shadow p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Weather Now</h1>

        <input
          type="text"
          placeholder="Enter city (e.g. Tokyo)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          onClick={getWeather}
          disabled={loading || !city}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>

        {weather && (
          <div className="text-center space-y-2">
            <div className="text-xl font-semibold">{weather.name}</div>
            <img src={weather.icon} alt={weather.condition} className="mx-auto" />
            <div className="text-lg">{weather.temp}°C — {weather.condition}</div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center">{error}</div>
        )}
      </div>
    </main>
  )
}