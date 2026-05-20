import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Moon,
  Globe,
  Wifi,
  Bell,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Settings() {
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const [multiLanguage, setMultiLanguage] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your preferences
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border overflow-hidden sticky top-20">
              <nav className="flex flex-col">
                {[
                  { id: "appearance", label: "Appearance" },
                  { id: "features", label: "Features" },
                  { id: "notifications", label: "Notifications" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className="px-6 py-3 text-left text-sm font-medium text-foreground hover:bg-muted border-b border-border last:border-b-0 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Appearance */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Appearance
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`relative w-12 h-6 rounded-full transition ${theme === 'dark' ? "bg-purple-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition ${theme === 'dark' ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Features</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Multi-language OCR
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Coming soon: Support for multiple languages
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMultiLanguage(!multiLanguage)}
                    disabled
                    className={`relative w-12 h-6 rounded-full transition opacity-50 cursor-not-allowed ${multiLanguage ? "bg-purple-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition ${multiLanguage ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Offline Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Coming soon: Process documents without internet
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOfflineMode(!offlineMode)}
                    disabled
                    className={`relative w-12 h-6 rounded-full transition opacity-50 cursor-not-allowed ${offlineMode ? "bg-purple-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition ${offlineMode ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Notifications
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get notifications via email
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-12 h-6 rounded-full transition ${emailNotifications ? "bg-purple-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition ${emailNotifications ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get instant push notifications
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative w-12 h-6 rounded-full transition ${pushNotifications ? "bg-purple-600" : "bg-slate-300"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-card rounded-full transition ${pushNotifications ? "translate-x-6" : ""
                        }`}
                    ></div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
