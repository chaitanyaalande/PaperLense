import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  TrendingUp,
  Download,
} from "lucide-react";

export default function Dashboard() {

  // Mock data
  const stats = [
    { label: "Total Documents", value: "156", icon: FileText, color: "from-blue-600 to-blue-400" },
    { label: "Classified Documents", value: "142", icon: TrendingUp, color: "from-purple-600 to-purple-400" },
    { label: "Total Downloads", value: "89", icon: Download, color: "from-green-600 to-green-400" },
    { label: "Avg Accuracy", value: "94.2%", icon: TrendingUp, color: "from-orange-600 to-orange-400" },
  ];

  const categoryData = [
    { category: "Invoice", count: 23, percentage: 19 },
    { category: "Assignment", count: 18, percentage: 14 },
    { category: "Notes", count: 42, percentage: 34 },
    { category: "Reports", count: 15, percentage: 12 },
    { category: "Personal", count: 31, percentage: 16 },
    { category: "Others", count: 7, percentage: 5 },
  ];

  const monthlyData = [
    { month: "Jan", uploads: 12 },
    { month: "Feb", uploads: 19 },
    { month: "Mar", uploads: 8 },
    { month: "Apr", uploads: 22 },
    { month: "May", uploads: 18 },
    { month: "Jun", uploads: 25 },
  ];

  const accuracyTrend = [
    { month: "Week 1", accuracy: 89 },
    { month: "Week 2", accuracy: 90 },
    { month: "Week 3", accuracy: 92 },
    { month: "Week 4", accuracy: 94 },
  ];

  const maxValue = Math.max(...categoryData.map((d) => d.count));
  const maxMonthly = Math.max(...monthlyData.map((d) => d.uploads));



  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back to Scanify!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your Scanify dashboard summary
            </p>
          </div>
          <Link to="/new-scan">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Start New Scan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Documents by Category */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Documents by Category
            </h3>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition"
                      style={{ width: `${(item.count / maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Uploads */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Monthly Document Uploads
            </h3>
            <div className="flex items-end justify-between gap-3 h-64">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2">
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${(item.uploads / maxMonthly) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.month}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.uploads}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Trend */}
          <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-foreground mb-6">
              AI Classification Accuracy Trend
            </h3>
            <div className="flex items-end justify-between gap-4 h-40">
              {accuracyTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-semibold text-card-foreground mb-2">
                    {item.accuracy}%
                  </div>
                  <div className="w-full flex items-end justify-center mb-2">
                    <div
                      className="w-2/3 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition hover:from-green-700 hover:to-green-500"
                      style={{ height: `${(item.accuracy / 100) * 120}px` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Performance Summary</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-purple-100 text-sm mb-2">Processing Speed</p>
              <p className="text-2xl font-bold">2.3s avg</p>
              <p className="text-purple-100 text-xs mt-1">per document</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-2">Classification Rate</p>
              <p className="text-2xl font-bold">91%</p>
              <p className="text-purple-100 text-xs mt-1">successful auto-categorization</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm mb-2">Storage Used</p>
              <p className="text-2xl font-bold">2.4 GB</p>
              <p className="text-purple-100 text-xs mt-1">of 10 GB quota</p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

