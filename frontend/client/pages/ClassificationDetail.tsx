import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ocrService } from "@/services/api";
import { logActivity } from "@/utils/activity";

export default function ClassificationDetail() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoryName = category || "";

  useEffect(() => {
    if (categoryName) {
      ocrService.getCategoryDocuments(categoryName).then(data => setDocuments(data));
    }
  }, [categoryName]);

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
        id: Date.now() + Math.random(),
        fileName: doc.name,
        fileType: ext,
        category: categoryName.replace(/_/g, " "),
        downloadDate: new Date().toISOString().split('T')[0],
        size: `${(blob.size / 1024).toFixed(1)} KB`,
        url: doc.url
      };
      const existingDownloads = JSON.parse(localStorage.getItem('downloads') || '[]');
      localStorage.setItem('downloads', JSON.stringify([downloadRecord, ...existingDownloads]));
      logActivity("downloaded", doc.name, categoryName.replace(/_/g, " "));
    } catch (e) {
      alert("Failed to download document");
    }
  };

  const handleDelete = async (doc: any) => {
    if (!confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await ocrService.deleteDocument(categoryName, doc.name);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      logActivity("deleted", doc.name, categoryName.replace(/_/g, " "));
    } catch (e) {
      alert("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {categoryName.replace(/_/g, " ")} Documents
            </h1>
            <p className="text-muted-foreground mt-2">
              {documents.length} documents in this category
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/classification")} className="border-border">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Documents List */}
        <div className="grid gap-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{doc.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{doc.preview}</p>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleView(doc)}
                      className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      disabled={deletingId === doc.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition text-muted-foreground hover:text-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No documents found in this category</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
