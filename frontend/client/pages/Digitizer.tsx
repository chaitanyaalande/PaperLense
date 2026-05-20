import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ocrService } from "@/services/api";
import {
  Upload,
  ArrowLeft,
  FileText,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";

export default function Digitizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    document_type: string;
    confidence: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview
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

    try {
      const data = await ocrService.scanDocument(file);
      setResult(data);
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
      element.download = "digitized_text.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <div className="font-bold text-lg text-foreground">Handwritten Document Digitizer</div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Upload Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Document
              </h2>
              <p className="text-muted-foreground">
                Upload a clear image of your handwritten document. Supports JPG, PNG, and PDF formats.
              </p>
            </div>

            {/* Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mb-6 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition cursor-pointer bg-muted/50"
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">
                  Drop your file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse your computer
                </p>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Preview</h3>
                <div className="rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={preview}
                    alt="Document preview"
                    className="w-full h-80 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcess}
              disabled={!file || processing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 font-semibold"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Document"
              )}
            </Button>
          </div>

          {/* Right: Results Section */}
          <div>
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-8 text-center bg-muted/50">
                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-muted-foreground">
                  {file
                    ? "Click 'Process Document' to extract text"
                    : "Upload a document to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-green-600 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-semibold">Processing Complete</span>
                </div>

                {/* Classification */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Classification
                  </h3>
                  <p className="text-card-foreground mb-2">{result.document_type || "Unknown"}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Extracted Text */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Extracted Text
                  </h3>
                  <p className="text-card-foreground leading-relaxed mb-4 p-4 bg-card rounded-lg border border-purple-100">
                    {result.text}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCopyText}
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Process Another Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
