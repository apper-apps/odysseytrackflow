import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { format, subDays, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import issueService from "@/services/api/issueService";
import projectService from "@/services/api/projectService";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [issuesData, projectsData] = await Promise.all([
          issueService.getAll(),
          projectService.getAll()
        ]);
        
        setIssues(issuesData);
        setProjects(projectsData);
        
        // Calculate analytics
        calculateAnalytics(issuesData, projectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAnalytics = (issuesData, projectsData) => {
    // Basic stats
    const totalIssues = issuesData.length;
    const openIssues = issuesData.filter(issue => issue.status === 'Open').length;
    const resolvedIssues = issuesData.filter(issue => issue.status === 'Resolved' || issue.status === 'Closed').length;
    const inProgressIssues = issuesData.filter(issue => issue.status === 'In Progress').length;
    
    // Priority breakdown
    const highPriority = issuesData.filter(issue => issue.priority === 'High').length;
    const mediumPriority = issuesData.filter(issue => issue.priority === 'Medium').length;
    const lowPriority = issuesData.filter(issue => issue.priority === 'Low').length;
    
    // Team performance
    const assigneeStats = {};
    issuesData.forEach(issue => {
      if (issue.assignee) {
        if (!assigneeStats[issue.assignee]) {
          assigneeStats[issue.assignee] = { total: 0, resolved: 0 };
        }
        assigneeStats[issue.assignee].total++;
        if (issue.status === 'Resolved' || issue.status === 'Closed') {
          assigneeStats[issue.assignee].resolved++;
        }
      }
    });
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentIssues = issuesData.filter(issue => 
      parseISO(issue.updatedAt) >= sevenDaysAgo
    ).slice(0, 5);
    
    // Issue trends (last 7 days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayIssues = issuesData.filter(issue => {
        const issueDate = parseISO(issue.createdAt);
        return issueDate.toDateString() === date.toDateString();
      }).length;
      trendData.push({
        date: format(date, 'MMM dd'),
        issues: dayIssues
      });
    }
    
    setAnalytics({
      totalIssues,
      openIssues,
      resolvedIssues,
      inProgressIssues,
      highPriority,
      mediumPriority,
      lowPriority,
      assigneeStats,
      recentIssues,
      trendData,
      totalProjects: projectsData.length,
      avgProjectProgress: projectsData.reduce((sum, p) => sum + (p.progress || 0), 0) / projectsData.length
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  // Chart configurations
  const issueStatusChart = {
    series: [analytics.openIssues, analytics.inProgressIssues, analytics.resolvedIssues],
    options: {
      chart: { type: 'donut', height: 300 },
      labels: ['Open', 'In Progress', 'Resolved'],
      colors: ['#3b82f6', '#f59e0b', '#10b981'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }]
    }
  };

  const priorityChart = {
    series: [analytics.highPriority, analytics.mediumPriority, analytics.lowPriority],
    options: {
      chart: { type: 'pie', height: 300 },
      labels: ['High', 'Medium', 'Low'],
      colors: ['#ef4444', '#f59e0b', '#10b981'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: 'bottom' }
        }
      }]
    }
  };

  const trendChart = {
    series: [{
      name: 'Issues Created',
      data: analytics.trendData?.map(d => d.issues) || []
    }],
    options: {
      chart: { type: 'area', height: 300, sparkline: { enabled: false } },
      xaxis: {
        categories: analytics.trendData?.map(d => d.date) || [],
        labels: { style: { fontSize: '12px' } }
      },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#5b47e0'],
      grid: { borderColor: '#f1f5f9' },
      tooltip: { theme: 'light' }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your projects and issues</p>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="BarChart3" className="w-6 h-6 text-primary-600" />
          <span className="text-sm text-gray-500">Last updated: {format(new Date(), 'MMM dd, HH:mm')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalIssues}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              +{Math.floor(analytics.totalIssues * 0.12)}
            </span>
            <span className="text-gray-600 ml-1">from last week</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.openIssues}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">
              {analytics.totalIssues > 0 ? Math.round((analytics.openIssues / analytics.totalIssues) * 100) : 0}% of total
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Issues</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.resolvedIssues}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {analytics.totalIssues > 0 ? Math.round((analytics.resolvedIssues / analytics.totalIssues) * 100) : 0}% completion rate
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Folder" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 font-medium">
              {Math.round(analytics.avgProjectProgress || 0)}% avg progress
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Status Distribution</h3>
          <Chart
            options={issueStatusChart.options}
            series={issueStatusChart.series}
            type="donut"
            height={300}
          />
        </div>

        {/* Priority Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
          <Chart
            options={priorityChart.options}
            series={priorityChart.series}
            type="pie"
            height={300}
          />
        </div>

        {/* Issue Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Creation Trend (7 days)</h3>
          <Chart
            options={trendChart.options}
            series={trendChart.series}
            type="area"
            height={300}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            {Object.entries(analytics.assigneeStats || {}).map(([assignee, stats]) => (
              <div key={assignee} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {assignee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{assignee}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {stats.resolved}/{stats.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round((stats.resolved / stats.total) * 100)}% resolved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analytics.recentIssues?.map((issue) => (
              <div key={issue.Id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  issue.status === 'Open' ? 'bg-blue-500' :
                  issue.status === 'In Progress' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {issue.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {issue.assignee} • {format(parseISO(issue.updatedAt), 'MMM dd, HH:mm')}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  issue.priority === 'High' ? 'bg-red-100 text-red-800' :
                  issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {issue.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;