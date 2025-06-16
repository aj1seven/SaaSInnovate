import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, FileText, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileUpload } from "@shared/schema";

export function FileUploadComponent() {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentFiles } = useQuery<FileUpload[]>({
    queryKey: ["/api/files"],
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "File Uploaded",
        description: "File uploaded successfully and is ready for analysis.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFileMutation.mutate(files[0]);
    }
  }, [uploadFileMutation]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFileMutation.mutate(files[0]);
    }
  }, [uploadFileMutation]);

  const analyzeFile = (file: FileUpload) => {
    if (!file.content) {
      toast({
        title: "File Not Ready",
        description: "File content is not available for analysis.",
        variant: "destructive",
      });
      return;
    }

    // Trigger analysis with file content
    // This would typically integrate with the content analysis system
    toast({
      title: "Analysis Started",
      description: `Analyzing ${file.originalName}...`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <Card className="shadow-lg border-0 card-hover">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-xl">
        <CardTitle className="text-xl font-bold text-gray-900">Upload Documents</CardTitle>
        <p className="text-gray-600 text-sm">Drag and drop files or click to browse</p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-emerald-400 bg-emerald-50 transform scale-105"
              : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.csv"
            onChange={handleFileInput}
          />
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <CloudUpload className="text-white w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg">
                {uploadFileMutation.isPending ? "Uploading your file..." : "Drop files here or click to browse"}
              </p>
              <p className="text-gray-600 mt-2">
                AI will analyze your document content automatically
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">TXT</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">PDF</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">DOC</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">CSV</span>
            </div>
            <p className="text-xs text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
        </div>

        {recentFiles && recentFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent Uploads
            </h4>
            <div className="space-y-2">
              {recentFiles.slice(0, 5).map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                    <FileText className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • {getTimeAgo(file.uploadedAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => analyzeFile(file)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
