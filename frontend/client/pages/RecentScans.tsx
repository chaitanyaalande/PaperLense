import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2, ArrowLeft, Search } from "lucide-react";
import { ocrService } from "@/services/api";
import { logActivity } from "@/utils/activity";

const CATEGORIES = [
  "All", "Cheque", "Handwritten_Notes", "ID_Document",
  "Invoice", "Letter", "Medical", "Payment_Receipt", "Other",
];

export default function RecentScans() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [scans, setScans] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    ocrService.getAllDocuments().then(data => setScans(data));
  }, []);

  const handleView = (doc: any) => {
    window.open(`http://127.0.0.1:8000${doc.url}`, "_blank");
  };

  const handleDownload = async (doc: any) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000${doc.url}`);
      const blob = await response.blob();
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = doc.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      const ext = doc.name.split('.').pop()?.toUpperCase() || 'FILE';
      const downloadRecord = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        fileName: doc.name,
        fileType: ext,
        category: doc.category.replace(/_/g, " "),
        downloadDate: new Date().toISOString().split('T')[0],
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        url: doc.url
      };
      const existingDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
      localStorage.setItem('downloads', JSON.stringify([downloadRecord, ...existingDownloads]));
      logActivity("downloaded", doc.name, doc.category.replace(/_/g, " "));
    } catch (e) {
      alert("Failed to download document");
    }
  };

  const handleDelete = async (doc: any) => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await ocrService.deleteDocument(doc.category, doc.name);
      setScans(prev => prev.filter(s => s.id !== doc.id));
      logActivity("deleted", doc.name, doc.category.replace(/_/g, " "));
    } catch (e) {
      alert("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredScans = scans
    .filter((scan) => {
      const matchesSearch =
        scan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.preview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || scan.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "accuracy") return b.accuracy - a.accuracy;
      return 0;
    });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recent Scans</h1>
            <p className="text-muted-foreground mt-2">View and manage your scanned documents</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-border">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Search Documents</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or content..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white"
                      : "bg-muted text-card-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-background text-foreground"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="accuracy">Highest Accuracy</option>
            </select>
          </div>
        </div>

        {/* Scans List */}
        <div className="grid gap-6">
          {filteredScans.length > 0 ? (
            filteredScans.map((scan) => (
              <div
                key={scan.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition p-6 flex gap-6"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={`http://127.0.0.1:8000${scan.thumbnail}`}
                    alt={scan.name}
                    className="w-24 h-24 rounded-lg object-cover border border-border"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">{scan.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full whitespace-nowrap ml-2">
                      {scan.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{scan.preview}</p>
                  <span className="text-xs text-muted-foreground">{scan.date}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleView(scan)}
                    className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(scan)}
                    className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(scan)}
                    disabled={deletingId === scan.id}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-muted-foreground hover:text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No scans found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
