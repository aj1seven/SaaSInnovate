import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertAnalysisSchema, insertProjectSchema, insertFileUploadSchema } from "@shared/schema";
import { performAnalysis, getApiUsageStats } from "./services/openai";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  const currentUserId = 1; // For demo purposes, using fixed user ID

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const analyses = await storage.getAnalysesByUserId(currentUserId);
      const projects = await storage.getProjectsByUserId(currentUserId);
      const completedAnalyses = analyses.filter(a => a.status === "completed");
      const activeProjects = projects.filter(p => p.status === "active");
      const apiStats = getApiUsageStats();
      
      res.json({
        totalAnalyses: analyses.length,
        apiUsage: apiStats.totalTokens, // Real OpenAI token usage
        successRate: completedAnalyses.length / Math.max(analyses.length, 1) * 100,
        activeProjects: activeProjects.length,
        apiRequests: apiStats.totalRequests,
        apiSuccessRate: apiStats.totalRequests > 0 ? (apiStats.successfulRequests / apiStats.totalRequests) * 100 : 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(currentUserId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Create project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData, currentUserId);
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  // Get analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAnalysesByUserId(currentUserId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  // Create analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      console.log("Creating new analysis:", req.body);
      const validatedData = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis(validatedData, currentUserId);
      
      console.log("Analysis created with ID:", analysis.id);
      
      // Process analysis asynchronously
      setImmediate(() => {
        processAnalysisAsync(analysis.id, validatedData.content, validatedData.analysisTypes);
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Analysis creation failed:", error);
      res.status(400).json({ error: "Invalid analysis data" });
    }
  });

  // Get file uploads
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getFileUploadsByUserId(currentUserId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  // Upload file
  app.post("/api/files", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileData = {
        filename: `${Date.now()}-${req.file.originalname}`,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        content: req.file.buffer.toString("utf-8"),
      };

      const validatedData = insertFileUploadSchema.parse(fileData);
      const file = await storage.createFileUpload(validatedData, currentUserId);
      
      res.json(file);
    } catch (error) {
      res.status(400).json({ error: "Failed to upload file" });
    }
  });

  // Export analysis results
  app.get("/api/analyses/:id/export", async (req, res) => {
    try {
      const analysis = await storage.getAnalysis(parseInt(req.params.id));
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      const format = req.query.format || "json";
      
      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="analysis-${analysis.id}.csv"`);
        res.send(convertToCSV(analysis));
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="analysis-${analysis.id}.json"`);
        res.json(analysis);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to export analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processAnalysisAsync(analysisId: number, content: string, analysisTypes: string[]) {
  try {
    console.log(`Starting analysis ${analysisId} with types:`, analysisTypes);
    await storage.updateAnalysis(analysisId, { status: "processing" });
    
    const results = await performAnalysis(content, analysisTypes);
    console.log(`Analysis ${analysisId} completed with results:`, Object.keys(results));
    
    await storage.updateAnalysis(analysisId, {
      status: "completed",
      results: results as any,
    });
    
    console.log(`Analysis ${analysisId} saved successfully`);
  } catch (error) {
    console.error(`Analysis ${analysisId} failed:`, error);
    await storage.updateAnalysis(analysisId, { 
      status: "failed",
      results: { error: (error as Error).message } as any,
    });
  }
}

function convertToCSV(analysis: any): string {
  const headers = ["ID", "Content", "Status", "Created At", "Results"];
  const row = [
    analysis.id,
    `"${analysis.content.replace(/"/g, '""')}"`,
    analysis.status,
    analysis.createdAt,
    `"${JSON.stringify(analysis.results).replace(/"/g, '""')}"`,
  ];
  
  return [headers.join(","), row.join(",")].join("\n");
}
