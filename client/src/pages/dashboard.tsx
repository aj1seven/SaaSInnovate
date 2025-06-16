import { Moon, Sun, Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { StatsOverview } from "@/components/stats-overview";
import { ContentInput } from "@/components/content-input";
import { FileUploadComponent } from "@/components/file-upload";
import { AnalysisResults } from "@/components/analysis-results";
import { RecentProjects } from "@/components/recent-projects";

export default function Dashboard() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-8 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 animated-gradient opacity-5"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                Welcome to Your <span className="gradient-text">AI Content Analysis Hub</span>
              </h2>
              <p className="text-gray-700 text-xl font-medium leading-relaxed">
                Transform your content with intelligent analysis - Get sentiment insights, extract keywords, generate summaries, and discover topics using advanced AI
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-slow"></div>
                  <span className="font-medium">AI Models Active</span>
                </div>
                <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
                <div className="text-sm text-gray-600 font-medium">
                  Powered by OpenAI GPT-4o
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-3 hover:bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-gray-700" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-3 hover:bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full pulse-slow"></span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-3 hover:bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <UserCircle className="w-6 h-6 text-gray-700" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8 space-y-8">
          {/* Stats Overview */}
          <div className="mb-8">
            <StatsOverview />
          </div>
          
          {/* Content Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContentInput />
            <FileUploadComponent />
          </div>
          
          {/* Analysis Results */}
          <div className="mt-8">
            <AnalysisResults />
          </div>
          
          {/* Recent Projects */}
          <div className="mt-8">
            <RecentProjects />
          </div>
        </div>
      </main>
    </div>
  );
}
