import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
  Legend,
} from 'recharts'
import { Button, Card, CardHeader, CardTitle, FullPageSpinner, ProgressBar } from '@/components/ui'
import { useGoals } from '@/hooks/useGoals'
import { useCheckins } from '@/hooks/useCheckins'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useStreak } from '@/hooks/useStreak'
import { useProjectStore } from '@/store/project.store'
import { useAuthStore } from '@/store/auth.store'
import { milestoneService, configService } from '@/services/github'
import { projectPath } from '@/config/routes'

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#eab308', '#ef4444', '#06b6d4', '#ec4899']

export function AnalyticsPage() {
  const { slug } = useParams<{ slug: string }>()
  const repo = useAuthStore((s) => s.repo)
  const { setActiveProject, setActiveConfig } = useProjectStore()
  const { allGoals, isLoading: goalsLoading } = useGoals(slug ?? '')

  const [dailyLogNumber, setDailyLogNumber] = useState<number | null>(null)
  const { checkIns } = useCheckins(dailyLogNumber)
  const { categoryBreakdown, progressOverTime, dailyActivity, overallStats } = useAnalytics(allGoals, checkIns)
  const { streakData } = useStreak(checkIns)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!repo || !slug) return
    loadProject()
    async function loadProject() {
      try {
        const project = await milestoneService.getProjectBySlug(repo!.owner, repo!.name, slug!)
        if (project) {
          setActiveProject(project)
          const config = await configService.getProjectConfig(repo!.owner, repo!.name, slug!)
          setActiveConfig(config)
          if (config?.dailyLogIssueNumber) {
            setDailyLogNumber(config.dailyLogIssueNumber)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, slug])

  if (loading || goalsLoading) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to={projectPath(slug ?? '')}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallStats.done}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallStats.completion}%</p>
          <p className="text-xs text-gray-500">Progress</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{streakData.currentStreak}d</p>
          <p className="text-xs text-gray-500">Current Streak</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-500">{streakData.longestStreak}d</p>
          <p className="text-xs text-gray-500">Best Streak</p>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
          {categoryBreakdown.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="w-24 text-sm font-medium truncate">{cat.category}</span>
                    <ProgressBar value={cat.completed} max={cat.total} className="flex-1" showLabel />
                    <span className="text-xs text-gray-400">{cat.completed}/{cat.total}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">No data yet</p>
          )}
        </Card>

        {/* Progress Over Time */}
        <Card>
          <CardHeader><CardTitle>Progress Over Time</CardTitle></CardHeader>
          {progressOverTime.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completedCumulative" name="Completed" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">No check-in data yet</p>
          )}
        </Card>
      </div>

      {/* Daily Activity */}
      {dailyActivity.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Daily Activity</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}
