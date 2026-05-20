import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-lg text-foreground">Scanify</span>
          </div>
          <Link to="/dashboard">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Go into App
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Transform Handwritten Documents into Digital Text
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Digitize handwritten documents with AI-powered OCR. Automatically extract text and classify documents with high accuracy using advanced transformer models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full sm:w-auto"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-card-foreground w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl overflow-hidden shadow-2xl border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-24 w-24 mx-auto text-purple-600 mb-4 animate-bounce" />
                  <p className="text-muted-foreground font-medium">
                    Upload any handwritten document
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to digitize and process handwritten documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-border bg-card rounded-xl hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Fast & Accurate
              </h3>
              <p className="text-muted-foreground">
                Advanced TrOCR model delivers high-accuracy text extraction from handwritten documents in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-border bg-card rounded-xl hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Auto Classification
              </h3>
              <p className="text-muted-foreground">
                Intelligent classification system automatically categorizes documents based on content and handwriting patterns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-border bg-card rounded-xl hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Easy to Use
              </h3>
              <p className="text-muted-foreground">
                Simple drag-and-drop interface makes digitizing documents effortless, no technical skills required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Upload</h3>
              <p className="text-muted-foreground text-sm">
                Upload a scanned image or photo of your handwritten document
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Process</h3>
              <p className="text-muted-foreground text-sm">
                AI processes and extracts text from handwritten content
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Classify</h3>
              <p className="text-muted-foreground text-sm">
                Document is automatically classified by type and category
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Export</h3>
              <p className="text-muted-foreground text-sm">
                Download results in your preferred format
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Digitize Your Documents?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start transforming your handwritten documents today with our advanced OCR technology.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-card text-purple-600 hover:bg-muted font-semibold"
            >
              Open Digitizer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-muted-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Scanify. All rights reserved.</p>
          <p className="text-sm mt-2">
            AI-Powered Handwritten Document Digitization & Classification
          </p>
        </div>
      </footer>
    </div>
  );
}
