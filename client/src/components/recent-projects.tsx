import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, ExternalLink, Download } from "lucide-react";
import type { Project } from "@shared/schema";

export function RecentProjects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300";
      case "active":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300";
      case "archived":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
      default:
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
    }
  };

  const getGradientByIndex = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-dark-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No projects yet. Create your first project to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${getGradientByIndex(index)} rounded-lg flex items-center justify-center`}>
                  <Network className="text-white w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {project.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {project.description || "No description"}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-400">
                      Updated {getTimeAgo(project.updatedAt)}
                    </span>
                    <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status === "active" ? "In Progress" : 
                       project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  >
                    <ExternalLink className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  >
                    <Download className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
