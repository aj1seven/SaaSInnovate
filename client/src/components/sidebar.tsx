import { Brain, ChartLine, Upload, Folder, Download, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine, current: true },
  { name: "Analyses", href: "/analyses", icon: Upload, current: false },
  { name: "Projects", href: "/projects", icon: Folder, current: false },
  { name: "Exports", href: "/exports", icon: Download, current: false },
  { name: "Analytics", href: "/analytics", icon: BarChart3, current: false },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Brain className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">ContentAI Pro</h1>
            <p className="text-xs text-gray-500">Smart Content Analysis</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-dark-600">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">SW</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Sarah Wilson</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
