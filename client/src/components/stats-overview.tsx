import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Server, CheckCircle, FolderOpen, ArrowUp, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Stats {
  totalAnalyses: number;
  apiUsage: number;
  successRate: number;
  activeProjects: number;
  apiRequests: number;
  apiSuccessRate: number;
}

export function StatsOverview() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 dark:bg-dark-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Failed to load statistics</div>;
  }

  const statCards = [
    {
      title: "Total Analyses",
      value: stats.totalAnalyses.toLocaleString(),
      icon: ChartLine,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-white",
      change: `${stats.totalAnalyses > 0 ? '+' : ''}${stats.totalAnalyses}`,
      changeText: "completed",
      changePositive: true,
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      title: "OpenAI Tokens Used",
      value: stats.apiUsage.toLocaleString(),
      icon: Server,
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      iconColor: "text-white",
      subtitle: `${stats.apiRequests} API requests`,
      bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      title: "AI Success Rate",
      value: `${stats.apiSuccessRate.toFixed(1)}%`,
      icon: CheckCircle,
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      iconColor: "text-white",
      change: stats.apiRequests > 0 ? `${stats.apiRequests - (stats.apiRequests * stats.apiSuccessRate / 100)} failed` : "No failures",
      changeText: "requests",
      changePositive: stats.apiSuccessRate > 90,
      bgGradient: "bg-gradient-to-br from-green-50 to-green-100",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects.toString(),
      icon: FolderOpen,
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconColor: "text-white",
      change: `${stats.activeProjects > 0 ? '+' : ''}${stats.activeProjects}`,
      changeText: "in progress",
      changePositive: true,
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.title} className={`shadow-xl border-0 overflow-hidden ${stat.bgGradient || 'bg-white'} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className={`${stat.iconColor} w-7 h-7`} />
                </div>
              </div>
              
              {stat.change && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/30">
                  <div className="flex items-center text-sm">
                    <span className={`flex items-center font-semibold ${
                      stat.changePositive ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {stat.changePositive ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowUp className="w-4 h-4 mr-1 rotate-180" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-gray-600 ml-2 font-medium">
                      {stat.changeText}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
