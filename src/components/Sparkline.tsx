import React from 'react'

import { cn } from '@/lib/utils'

export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  strokeColor?: string
  strokeWidth?: number
  className?: string
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 100,
  height = 40,
  strokeColor = 'hsl(var(--primary))',
  strokeWidth = 2,
  className
}) => {
  if (data.length < 2) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      data-testid="sparkline-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      aria-label="Sparkline chart"
    >
      <polyline
        data-testid="sparkline-polyline"
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
