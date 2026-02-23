import StatCard from "@/components/dashboard/overview/stat-card";
import RevenueChart from "@/components/dashboard/overview/revenue-chart";
import UserGrowthChart from "@/components/dashboard/overview/user-growth-chart";
import JobDistributionChart from "@/components/dashboard/overview/job-distribution-chart";
import RecentActivity from "@/components/dashboard/overview/recent-activity";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { AdminStats } from "@/types/AdminStats";
import { ActivityItem } from "@/types/ActivityItem";
import { Users, DollarSign, Briefcase, TriangleAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [statsRes, revenueRes, growthRes, activityRes] = await Promise.all([
    apiClient.get<APIResponse<AdminStats>>("/admin/stats"),
    apiClient.get<APIResponse<{ month: string; revenue: number; transactions: number }[]>>("/admin/revenue-chart"),
    apiClient.get<APIResponse<{ month: string; clients: number; sellers: number }[]>>("/admin/user-growth"),
    apiClient.get<APIResponse<ActivityItem[]>>("/admin/recent-activity"),
  ]);

  const stats = statsRes.data.data;
  const revenueData = revenueRes.data.data;
  const growthData = growthRes.data.data;
  const activities = activityRes.data.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend={stats.userGrowthPercent}
          trendLabel="vs last month"
          subtitle={`${stats.totalClients} clients, ${stats.totalSellers} sellers`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={stats.revenueGrowthPercent}
          trendLabel="vs last month"
          subtitle={`$${stats.totalRevenue.toLocaleString()} total`}
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs.toLocaleString()}
          icon={Briefcase}
          subtitle={`${stats.completedJobs} completed`}
        />
        <StatCard
          title="Open Disputes"
          value={stats.openDisputes.toLocaleString()}
          icon={TriangleAlert}
          subtitle={`${stats.pendingWithdrawals} pending withdrawals`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart data={revenueData} />
        <UserGrowthChart data={growthData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <JobDistributionChart
          activeJobs={stats.activeJobs}
          completedJobs={stats.completedJobs}
          totalJobs={stats.totalJobs}
        />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
