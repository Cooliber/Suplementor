import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface EffectData {
  date: string
  mood: number
  focus: number
  energy: number
  sleep: number
}

interface EffectOverTimeChartProps {
  data: EffectData[]
}

const EffectOverTimeChart: React.FC<EffectOverTimeChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="focus" stroke="#82ca9d" />
      <Line type="monotone" dataKey="energy" stroke="#ffc658" />
      <Line type="monotone" dataKey="sleep" stroke="#ff7300" />
    </LineChart>
  </ResponsiveContainer>
)

export default EffectOverTimeChart
