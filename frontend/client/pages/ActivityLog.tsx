import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { ActivityType, Activity, getActivities, deleteActivity, clearAllActivities } from "@/utils/activity";

const ACTIVITY_COLORS: { [key in ActivityType]: string } = {
  scanned: "bg-blue-100 text-blue-700",
  classified: "bg-purple-100 text-purple-700",
  downloaded: "bg-green-100 text-green-700",
  deleted: "bg-red-100 text-red-700",
};

const ACTIVITY_ICONS: { [key in ActivityType]: string } = {
  scanned: "📄",
  classified: "🏷️",
  downloaded: "⬇️",
  deleted: "🗑️",
};

const ACTIVITY_LABELS: { [key in ActivityType]: string } = {
  scanned: "Document Scanned",
  classified: "Document Classified",
  downloaded: "Document Downloaded",
  deleted: "Document Deleted",
};

export default function ActivityLog() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<"all" | ActivityType>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  const handleDeleteActivity = (id: number) => {
    const updated = deleteActivity(id);
    setActivities(updated);
  };

  const handleClearAll = () => {
    if (!confirm("Clear all activity history? This cannot be undone.")) return;
    clearAllActivities();
    setActivities([]);
  };

  const getTimeAgo = (timestampStr: string) => {
    const activityDate = new Date(timestampStr.replace(" ", "T"));
    const diffSeconds = Math.floor((Date.now() - activityDate.getTime()) / 1000);
    if (diffSeconds < 60) return "Just now";
    const diffMins = Math.floor(diffSeconds / 60);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const filteredActivities = activities.filter((activity) => {
    if (selectedFilter !== "all" && activity.type !== selectedFilter) return false;
    if (selectedDate && !activity.timestamp.startsWith(selectedDate)) return false;
    return true;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
            <p className="text-muted-foreground mt-2">
              Track all your document processing activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activities.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Filter by Activity Type
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedFilter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-muted text-card-foreground hover:bg-muted/80"
                }`}
              >
                All Activities
              </button>
              {(["scanned", "classified", "downloaded", "deleted"] as ActivityType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedFilter === type
                      ? "bg-purple-600 text-white"
                      : "bg-muted text-card-foreground hover:bg-muted/80"
                  }`}
                >
                  {ACTIVITY_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Filter by Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {activities.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredActivities.length} of {activities.length} activities
          </p>
        )}

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, idx) => {
              const isLast = idx === filteredActivities.length - 1;
              return (
                <div key={activity.id} className="relative">
                  {!isLast && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted"></div>
                  )}

                  <div className="bg-card rounded-xl border border-border p-6 relative z-10">
                    <div className="flex gap-4">
                      {/* Timeline Dot */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg border-4 border-white shadow">
                          {ACTIVITY_ICONS[activity.type]}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ACTIVITY_COLORS[activity.type]}`}>
                            {ACTIVITY_LABELS[activity.type]}
                          </span>
                          {activity.category && (
                            <span className="px-3 py-1 bg-muted text-card-foreground rounded-full text-xs font-semibold">
                              {activity.category}
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-foreground mb-2 truncate">
                          {activity.document}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{activity.timestamp}</span>
                          <span>{getTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition text-muted-foreground hover:text-red-600 self-start"
                        title="Remove this activity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">
                No activities found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}