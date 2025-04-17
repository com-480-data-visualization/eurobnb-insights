import React from 'react'
import { ResponsiveParallelCoordinates } from '@nivo/parallel-coordinates'

export default function ParallelCoordinatesGraph() {
  const data = [
    { id: 'Amsterdam', city: 'Amsterdam', price: 120, rating: 4.5, distance: 2 },
    { id: 'Athens', city: 'Athens', price: 80, rating: 4.0, distance: 5 },
    { id: 'Paris', city: 'Paris', price: 150, rating: 4.8, distance: 1 },
    { id: 'Berlin', city: 'Berlin', price: 100, rating: 4.2, distance: 3 },
    { id: 'Rome', city: 'Rome', price: 90, rating: 4.1, distance: 4 },
  ]

  const variables = [
    { key: 'price', type: 'linear', min: 'auto', max: 'auto', ticksPosition: 'before', legend: 'Price ($)', legendPosition: 'start', legendOffset: -20 },
    { key: 'rating', type: 'linear', min: 0, max: 5, legend: 'Rating', legendPosition: 'start', legendOffset: -20 },
    { key: 'distance', type: 'linear', min: 0, max: 10, legend: 'Distance (km)', legendPosition: 'start', legendOffset: -20 },
  ]

  return (
    <div style={{ height: '500px' }}>
      <ResponsiveParallelCoordinates
        data={data}
        variables={variables}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        lineOpacity={0.8}
        lineWidth={2}
        colors={{ scheme: 'category10' }}
        axesTicksPosition="before"
      />
    </div>
  )
}