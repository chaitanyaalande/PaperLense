import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Trash2, FileText } from "lucide-react";
import { logActivity } from "@/utils/activity";

export default function Downloads() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('downloads') || '[]');
    setDownloads(stored);
  }, []);

  const toggleSelectAll = () => {
    if (selectedItems.length === downloads.length && downloads.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(downloads.map((item) => item.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkDelete = () => {
    if (confirm("Are you sure you want to remove these files from history?")) {
      const deletedFiles = downloads.filter((item) => selectedItems.includes(item.id));
      deletedFiles.forEach(file => logActivity("deleted", file.fileName));

      const updated = downloads.filter((item) => !selectedItems.includes(item.id));
      setDownloads(updated);
      localStorage.setItem('downloads', JSON.stringify(updated));
      setSelectedItems([]);
    }
  };

  const handleDelete = (id: number) => {
    const fileToDelete = downloads.find((item) => item.id === id);
    if (fileToDelete) logActivity("deleted", fileToDelete.fileName);

    const updated = downloads.filter((item) => item.id !== id);
    setDownloads(updated);
    localStorage.setItem('downloads', JSON.stringify(updated));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const handleRedownload = (url?: string) => {
    if (url) {
      window.open(`http://127.0.0.1:8000${url}`, '_blank');
    }
  };

  const getFileIcon = (fileType: string) => {
    const colors: { [key: string]: string } = {
      TXT: "text-blue-600",
      DOCX: "text-blue-700",
      PDF: "text-red-600",
    };
    return <FileText className={`h-5 w-5 ${colors[fileType] || "text-muted-foreground"}`} />;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Downloads</h1>
            <p className="text-muted-foreground mt-2">
              Manage your downloaded documents
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Downloads Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Toolbar */}
          {selectedItems.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-900">
                {selectedItems.length} selected
              </span>
              <Button
                onClick={handleBulkDelete}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === downloads.length &&
                        downloads.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-border text-purple-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {downloads.length > 0 ? (
                  downloads.map((download) => (
                    <tr
                      key={download.id}
                      className="hover:bg-muted/50 transition"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(download.id)}
                          onChange={() => toggleSelect(download.id)}
                          className="w-4 h-4 rounded border-border text-purple-600"
                        />
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        {getFileIcon(download.fileType)}
                        <span className="font-medium text-foreground">
                          {download.fileName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-card-foreground">
                        <span className="inline-block px-2 py-1 bg-muted text-card-foreground text-xs font-semibold rounded">
                          {download.fileType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-card-foreground">
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                          {download.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {download.size}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {download.downloadDate}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                        <button onClick={() => handleRedownload(download.url)} className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground">
                          <Download className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(download.id)} className="p-2 hover:bg-red-50 rounded-lg transition text-muted-foreground hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No downloads yet. Download documents from the Classification view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Total Downloads: <span className="font-semibold">{downloads.length}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
