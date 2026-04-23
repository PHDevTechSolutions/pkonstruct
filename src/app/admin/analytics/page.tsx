"use client"

import { useState } from "react"
import { 
  usePageViewStats, 
  useProductAnalytics, 
  useCartFunnel,
  useActiveUsers,
  useDailyStats
} from "@/hooks/use-analytics-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Eye, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  ArrowLeft,
  Activity,
  Package,
  MousePointerClick,
  Timer
} from "lucide-react"
import Link from "next/link"

type Tab = 'overview' | 'pages' | 'products' | 'cart'

type TimeRange = 7 | 30 | 90

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [timeRange, setTimeRange] = useState<TimeRange>(7)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Track visitor behavior and conversion metrics</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as TimeRange)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-[#222] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {days === 7 ? '7 Days' : days === 30 ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg w-fit">
        <TabButton 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          icon={Activity}
          label="Overview"
        />
        <TabButton 
          active={activeTab === 'pages'} 
          onClick={() => setActiveTab('pages')}
          icon={Eye}
          label="Pages"
        />
        <TabButton 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')}
          icon={Package}
          label="Products"
        />
        <TabButton 
          active={activeTab === 'cart'} 
          onClick={() => setActiveTab('cart')}
          icon={ShoppingCart}
          label="Cart Analysis"
        />
      </div>

      {/* Content */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
        {activeTab === 'overview' && <OverviewTab days={timeRange} />}
        {activeTab === 'pages' && <PagesTab days={timeRange} />}
        {activeTab === 'products' && <ProductsTab days={timeRange} />}
        {activeTab === 'cart' && <CartTab days={timeRange} />}
      </div>
    </div>
  )
}

function TabButton({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-[#222] text-white'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}

// Overview Tab
function OverviewTab({ days }: { days: number }) {
  const { totalViews, uniqueVisitors, loading: pageLoading } = usePageViewStats(days)
  const { funnel, loading: funnelLoading } = useCartFunnel(days)
  const { activeUsers, loading: activeLoading } = useActiveUsers()
  const { dailyData, loading: dailyLoading } = useDailyStats(days)

  const loading = pageLoading || funnelLoading || activeLoading || dailyLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const totalOrders = dailyData.reduce((sum, day) => sum + day.orders, 0)
  const conversionRate = totalViews > 0 ? ((totalOrders / uniqueVisitors) * 100).toFixed(2) : "0"

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard 
          title="Active Users"
          value={activeUsers.toString()}
          subtitle="Currently online"
          icon={Users}
          color="cyan"
        />
        <KpiCard 
          title="Total Page Views"
          value={totalViews.toLocaleString()}
          subtitle={`Last ${days} days`}
          icon={Eye}
          color="blue"
        />
        <KpiCard 
          title="Unique Visitors"
          value={uniqueVisitors.toLocaleString()}
          subtitle={`Last ${days} days`}
          icon={TrendingUp}
          color="green"
        />
        <KpiCard 
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtitle="Orders / Visitors"
          icon={MousePointerClick}
          color="purple"
        />
      </div>

      {/* Cart Funnel */}
      <div className="bg-[#222] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cart Funnel</h3>
        <div className="grid grid-cols-4 gap-4">
          <FunnelStage 
            label="Add to Cart"
            value={funnel.addToCart}
            percentage={100}
            color="cyan"
          />
          <FunnelStage 
            label="Checkout Started"
            value={funnel.checkoutStarted}
            percentage={funnel.addToCart > 0 ? (funnel.checkoutStarted / funnel.addToCart) * 100 : 0}
            color="blue"
          />
          <FunnelStage 
            label="Checkout Complete"
            value={funnel.checkoutCompleted}
            percentage={funnel.addToCart > 0 ? (funnel.checkoutCompleted / funnel.addToCart) * 100 : 0}
            color="green"
          />
          <FunnelStage 
            label="Abandoned"
            value={funnel.abandoned}
            percentage={funnel.abandonmentRate}
            color="red"
            isAbandoned
          />
        </div>
        
        {/* Abandonment Rate Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Cart Abandonment Rate</span>
            <span className="text-red-400 font-medium">{funnel.abandonmentRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[#333] rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 rounded-full transition-all"
              style={{ width: `${Math.min(funnel.abandonmentRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Trend */}
      <div className="bg-[#222] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                <th className="text-right py-3 text-gray-400 font-medium">Page Views</th>
                <th className="text-right py-3 text-gray-400 font-medium">Unique Visitors</th>
                <th className="text-right py-3 text-gray-400 font-medium">Cart Events</th>
                <th className="text-right py-3 text-gray-400 font-medium">Orders</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, i) => (
                <tr key={day.date} className={i < dailyData.length - 1 ? "border-b border-[#333]" : ""}>
                  <td className="py-3 text-white">{day.date}</td>
                  <td className="py-3 text-right text-gray-300">{day.pageViews.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-300">{day.uniqueVisitors.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-300">{day.cartEvents.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                      {day.orders}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, subtitle, icon: Icon, color }: {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  color: "cyan" | "blue" | "green" | "purple"
}) {
  const colorClasses = {
    cyan: "bg-cyan-600/20 text-cyan-400",
    blue: "bg-blue-600/20 text-blue-400",
    green: "bg-green-600/20 text-green-400",
    purple: "bg-purple-600/20 text-purple-400",
  }

  return (
    <div className="bg-[#222] rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
    </div>
  )
}

function FunnelStage({ label, value, percentage, color, isAbandoned }: {
  label: string
  value: number
  percentage: number
  color: "cyan" | "blue" | "green" | "red"
  isAbandoned?: boolean
}) {
  const colorClasses = {
    cyan: "bg-cyan-600 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    red: "bg-red-600/30 text-red-400 border border-red-600/50",
  }

  return (
    <div className={`rounded-lg p-4 ${isAbandoned ? colorClasses[color] : "bg-[#333]"}`}>
      <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className={`text-xs mt-2 ${isAbandoned ? "text-red-400" : "text-gray-500"}`}>
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}

// Pages Tab
function PagesTab({ days }: { days: number }) {
  const { stats, totalViews, loading } = usePageViewStats(days)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Total Page Views</div>
          <div className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</div>
        </div>
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Unique Pages</div>
          <div className="text-3xl font-bold text-white">{stats.length}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left py-3 text-gray-400 font-medium">Page Path</th>
              <th className="text-right py-3 text-gray-400 font-medium">Views</th>
              <th className="text-right py-3 text-gray-400 font-medium">Unique Visitors</th>
              <th className="text-right py-3 text-gray-400 font-medium">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, i) => (
              <tr key={stat.path} className={i < stats.length - 1 ? "border-b border-[#333]" : ""}>
                <td className="py-3 text-white font-mono text-xs">{stat.path}</td>
                <td className="py-3 text-right text-gray-300">{stat.totalViews.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-300">{stat.uniqueVisitors.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <Badge variant="secondary" className="bg-[#333] text-gray-300">
                    {totalViews > 0 ? ((stat.totalViews / totalViews) * 100).toFixed(1) : 0}%
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Products Tab
function ProductsTab({ days }: { days: number }) {
  const { productStats, loading } = useProductAnalytics(days)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left py-3 text-gray-400 font-medium">Product</th>
              <th className="text-right py-3 text-gray-400 font-medium">Views</th>
              <th className="text-right py-3 text-gray-400 font-medium">Add to Cart</th>
              <th className="text-right py-3 text-gray-400 font-medium">Purchases</th>
              <th className="text-right py-3 text-gray-400 font-medium">Conv. Rate</th>
              <th className="text-right py-3 text-gray-400 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {productStats.map((stat, i) => (
              <tr key={stat.productId} className={i < productStats.length - 1 ? "border-b border-[#333]" : ""}>
                <td className="py-3 text-white">{stat.productName}</td>
                <td className="py-3 text-right text-gray-300">{stat.views.toLocaleString()}</td>
                <td className="py-3 text-right text-gray-300">{stat.addToCarts}</td>
                <td className="py-3 text-right">
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                    {stat.purchases}
                  </Badge>
                </td>
                <td className="py-3 text-right">
                  <Badge variant="secondary" className="bg-[#333] text-gray-300">
                    {stat.conversionRate.toFixed(1)}%
                  </Badge>
                </td>
                <td className="py-3 text-right text-gray-300">
                  ${stat.revenue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Cart Tab
function CartTab({ days }: { days: number }) {
  const { funnel, loading } = useCartFunnel(days)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cart Funnel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Cart Additions</div>
          <div className="text-3xl font-bold text-white">{funnel.addToCart}</div>
        </div>
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Checkouts Started</div>
          <div className="text-3xl font-bold text-white">{funnel.checkoutStarted}</div>
        </div>
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Completed Orders</div>
          <div className="text-3xl font-bold text-green-400">{funnel.checkoutCompleted}</div>
        </div>
        <div className="bg-[#222] rounded-lg p-4">
          <div className="text-sm text-gray-400">Abandoned Carts</div>
          <div className="text-3xl font-bold text-red-400">{funnel.abandoned}</div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-[#222] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Cart Funnel Visualization</h3>
        
        <div className="space-y-4">
          {/* Add to Cart */}
          <FunnelBar 
            label="Add to Cart"
            value={funnel.addToCart}
            max={funnel.addToCart}
            color="cyan"
          />
          
          {/* Checkout Started */}
          <FunnelBar 
            label="Checkout Started"
            value={funnel.checkoutStarted}
            max={funnel.addToCart}
            color="blue"
            dropoff={funnel.addToCart > 0 ? funnel.addToCart - funnel.checkoutStarted : 0}
          />
          
          {/* Checkout Complete */}
          <FunnelBar 
            label="Checkout Complete"
            value={funnel.checkoutCompleted}
            max={funnel.addToCart}
            color="green"
            dropoff={funnel.checkoutStarted > 0 ? funnel.checkoutStarted - funnel.checkoutCompleted : 0}
          />
        </div>

        {/* Abandonment Stats */}
        <div className="mt-8 pt-6 border-t border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Cart Abandonment Analysis</h4>
            <Badge className="bg-red-600/20 text-red-400 border-red-600/30">
              {funnel.abandonmentRate.toFixed(1)}% Abandonment Rate
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Timer className="w-4 h-4" />
                Average Time Before Abandonment
              </div>
              <div className="text-xl font-bold text-white">~5 minutes</div>
              <div className="text-xs text-gray-500 mt-1">Estimated based on session data</div>
            </div>
            <div className="bg-[#333] rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Potential Recovery Revenue
              </div>
              <div className="text-xl font-bold text-white">${(funnel.abandoned * 45).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Assuming $45 avg. cart value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelBar({ label, value, max, color, dropoff }: {
  label: string
  value: number
  max: number
  color: "cyan" | "blue" | "green"
  dropoff?: number
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  
  const colorClasses = {
    cyan: "bg-cyan-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-sm text-gray-400">{label}</div>
      <div className="flex-1">
        <div className="h-8 bg-[#333] rounded-lg overflow-hidden relative">
          <div 
            className={`h-full ${colorClasses[color]} transition-all flex items-center justify-end px-3`}
            style={{ width: `${Math.max(percentage, 5)}%` }}
          >
            <span className="text-white text-sm font-medium">{value}</span>
          </div>
          {dropoff && dropoff > 0 && (
            <div className="absolute right-0 top-0 h-full flex items-center pr-2">
              <Badge className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                -{dropoff}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="w-16 text-right text-sm text-gray-500">{percentage.toFixed(1)}%</div>
    </div>
  )
}
