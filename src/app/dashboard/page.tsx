import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'System Dashboard',
  description: 'Real-time monitoring and error tracking dashboard'
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Error monitoring and performance tracking dashboard
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="text-lg font-medium text-blue-900">System Health</h3>
              <p className="mt-2 text-2xl font-bold text-blue-600">98%</p>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <h3 className="text-lg font-medium text-green-900">Active Services</h3>
              <p className="mt-2 text-2xl font-bold text-green-600">4/4</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-6">
              <h3 className="text-lg font-medium text-yellow-900">Error Rate</h3>
              <p className="mt-2 text-2xl font-bold text-yellow-600">0.5%</p>
            </div>

            <div className="rounded-lg bg-red-50 p-6">
              <h3 className="text-lg font-medium text-red-900">Alerts</h3>
              <p className="mt-2 text-2xl font-bold text-red-600">0</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-gray-600">
              Dashboard functionality is being enhanced. Check back soon for full
              monitoring capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
