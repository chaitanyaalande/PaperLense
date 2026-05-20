import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen, FileText, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ocrService } from "@/services/api";

const CATEGORIES = [
  { name: "Cheque", icon: "💵", count: 0, color: "from-teal-600 to-teal-400" },
  { name: "Handwritten_Notes", icon: "📝", count: 0, color: "from-yellow-600 to-yellow-400" },
  { name: "ID_Document", icon: "🪪", count: 0, color: "from-indigo-600 to-indigo-400" },
  { name: "Invoice", icon: "📄", count: 0, color: "from-blue-600 to-blue-400" },
  { name: "Letter", icon: "✉️", count: 0, color: "from-slate-600 to-slate-400" },
  { name: "Medical", icon: "🏥", count: 0, color: "from-red-600 to-red-400" },
  { name: "Payment_Receipt", icon: "🧾", count: 0, color: "from-green-600 to-green-400" },
  { name: "Other", icon: "📦", count: 0, color: "from-gray-600 to-gray-400" },
];

export default function Classification() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    ocrService.getCategories().then(data => setCounts(data));
  }, []);

  const categoriesWithCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: counts[cat.name] || 0
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Classification Folders
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse documents by category
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

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => (
            <button
              key={category.name}
              onClick={() =>
                navigate(`/classification/${category.name}`)
              }
              className="bg-card rounded-xl border border-border hover:border-purple-300 hover:shadow-lg transition overflow-hidden group"
            >
              {/* Header */}
              <div
                className={`h-24 bg-gradient-to-br ${category.color} flex items-center justify-center text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                <span className="text-4xl">{category.icon}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-purple-600 transition">
                  {category.name.replace(/_/g, " ")}
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {category.count}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">documents</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Total Documents</h3>
          <p className="text-4xl font-bold mb-4">
            {categoriesWithCounts.reduce((sum, cat) => sum + cat.count, 0)}
          </p>
          <p className="text-purple-100">
            All your handwritten documents organized by category
          </p>
        </div>
      </div>
    </Layout>
  );
}
