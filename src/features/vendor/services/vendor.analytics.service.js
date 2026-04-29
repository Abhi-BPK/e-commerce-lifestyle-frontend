// Vendor analytics service — real .NET Core API call.
// The backend returns a single object with all stats and chart series pre-computed.
// revenueData: [{ date, revenue }] — last 30 days
// topProducts:  [{ name, units }]  — top 5 by units sold
// orderStatusDist: [{ name, value, color }] — for the donut chart

import api from '../../../api/axios.instance'

// GET /api/vendor/analytics
export async function getAnalytics() {
  const response = await api.get('/vendor/analytics')
  return response.data
}
