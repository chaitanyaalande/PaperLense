import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
// Kept filename but content changed
import { Button } from "@/components/ui/button";
import {
  Upload,
  Camera,
  ArrowLeft,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import { ocrService } from "@/services/api";
import { logActivity } from "@/utils/activity";
const CATEGORIES = [
  "Cheque",
  "Handwritten_Notes",
  "ID_Document",
  "Invoice",
  "Letter",
  "Medical",
  "Payment_Receipt",
  "Other",
];

export default function NewScan() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    document_type: string;
    confidence: number;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Others");
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
      setResult(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setResult(null);

    try {
      const data = await ocrService.scanDocument(file);

      setResult(data);
      if (data.document_type) {
        setSelectedCategory(data.document_type);
      }
    } catch (error) {
      console.error("Scanning error:", error);
      alert("Error scanning document. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result?.text) {
      const element = document.createElement("a");
      const file = new Blob([result.text], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `scan_${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setSelectedCategory("Others");
  };

  const [saving, setSaving] = useState(false);

  const handleSaveAndClassify = async () => {
    if (!file || !result) return;
    
    setSaving(true);
    try {
      await ocrService.saveClassifiedDocument(
        file, 
        result.document_type, 
        result.text, 
        result.confidence
      );
      
      logActivity("scanned", file.name, result.document_type);
      logActivity("classified", file.name, result.document_type);
      
      alert(`Document saved in 'classified_docs/${result.document_type}' successfully!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scanify Document Scanner</h1>
            <p className="text-muted-foreground mt-2">
              Upload and classify documents with Scanify AI
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="border-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Upload Section */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Upload Document
              </h2>

              {!preview ? (
                <>
                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple-400 hover:bg-muted/50 transition cursor-pointer bg-muted/20 mb-6"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer block">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="font-semibold text-foreground mb-1">
                        Drop your image here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </label>
                  </div>

                  {/* Camera Option */}
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">or</p>
                    <Button
                      variant="outline"
                      className="border-border text-foreground"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture with Camera
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Preview */}
                  <div className="mb-6 rounded-lg overflow-hidden border border-border bg-muted">
                    <img
                      src={preview}
                      alt="Document preview"
                      className="w-full h-96 object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">File:</span> {file?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Size:</span>{" "}
                      {(file?.size || 0) / 1024 > 1024
                        ? ((file?.size || 0) / (1024 * 1024)).toFixed(2) + " MB"
                        : ((file?.size || 0) / 1024).toFixed(2) + " KB"}
                    </p>
                  </div>

                  {/* Upload New Button */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input-2"
                    />
                    <label htmlFor="file-input-2">
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground cursor-pointer"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Different Image
                        </span>
                      </Button>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-6">
            {!result ? (
              <div className="bg-card rounded-xl border border-border p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {preview
                    ? "Click 'Convert to Text' to extract text"
                    : "Upload a document to get started"}
                </p>
              </div>
            ) : (
              <>
                {/* Classification */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Classification
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Document Type
                    </label>
                    <div className="text-lg font-bold text-primary">
                      {result.document_type || "Unknown"}
                    </div>
                  </div>


                </div>

                {/* Extracted Text */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Extracted Text
                  </h3>
                  <div className="bg-muted p-4 rounded-lg border border-border mb-4 max-h-64 overflow-y-auto">
                    <p className="text-foreground leading-relaxed text-sm whitespace-pre-wrap">
                      {result.text}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleCopyText}
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="border-border text-foreground hover:bg-muted"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Save Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleSaveAndClassify}
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save & Classify"
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Scan Again
                  </Button>
                </div>
              </>
            )}

            {/* Convert Button */}
            {preview && !result && (
              <Button
                onClick={handleProcess}
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 font-semibold"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Convert to Text"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Layout>
  );
}

