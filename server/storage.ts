import { users, projects, analyses, fileUploads, type User, type InsertUser, type Project, type InsertProject, type Analysis, type InsertAnalysis, type FileUpload, type InsertFileUpload } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject, userId: number): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  
  // Analyses
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getAnalysesByUserId(userId: number): Promise<Analysis[]>;
  getAnalysesByProjectId(projectId: number): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis, userId: number): Promise<Analysis>;
  updateAnalysis(id: number, updates: Partial<Analysis>): Promise<Analysis | undefined>;
  
  // File Uploads
  getFileUpload(id: number): Promise<FileUpload | undefined>;
  getFileUploadsByUserId(userId: number): Promise<FileUpload[]>;
  createFileUpload(fileUpload: InsertFileUpload, userId: number): Promise<FileUpload>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private analyses: Map<number, Analysis>;
  private fileUploads: Map<number, FileUpload>;
  private currentUserId: number = 1;
  private currentProjectId: number = 1;
  private currentAnalysisId: number = 1;
  private currentFileUploadId: number = 1;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.analyses = new Map();
    this.fileUploads = new Map();
    
    // Create a default user
    const defaultUser: User = {
      id: 1,
      username: "demo",
      password: "demo",
      name: "Sarah Wilson",
      plan: "Pro",
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      plan: "Pro",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject, userId: number): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      id,
      name: insertProject.name,
      description: insertProject.description || null,
      status: insertProject.status || "active",
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    return this.analyses.get(id);
  }

  async getAnalysesByUserId(userId: number): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).filter(
      (analysis) => analysis.userId === userId,
    );
  }

  async getAnalysesByProjectId(projectId: number): Promise<Analysis[]> {
    return Array.from(this.analyses.values()).filter(
      (analysis) => analysis.projectId === projectId,
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis, userId: number): Promise<Analysis> {
    const id = this.currentAnalysisId++;
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      userId,
      projectId: insertAnalysis.projectId || null,
      status: "pending",
      results: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async updateAnalysis(id: number, updates: Partial<Analysis>): Promise<Analysis | undefined> {
    const analysis = this.analyses.get(id);
    if (!analysis) return undefined;
    
    const updatedAnalysis = { ...analysis, ...updates };
    if (updates.status === "completed" && !updatedAnalysis.completedAt) {
      updatedAnalysis.completedAt = new Date();
    }
    this.analyses.set(id, updatedAnalysis);
    return updatedAnalysis;
  }

  async getFileUpload(id: number): Promise<FileUpload | undefined> {
    return this.fileUploads.get(id);
  }

  async getFileUploadsByUserId(userId: number): Promise<FileUpload[]> {
    return Array.from(this.fileUploads.values()).filter(
      (file) => file.userId === userId,
    );
  }

  async createFileUpload(insertFileUpload: InsertFileUpload, userId: number): Promise<FileUpload> {
    const id = this.currentFileUploadId++;
    const fileUpload: FileUpload = {
      id,
      filename: insertFileUpload.filename,
      originalName: insertFileUpload.originalName,
      mimeType: insertFileUpload.mimeType,
      size: insertFileUpload.size,
      content: insertFileUpload.content || null,
      userId,
      uploadedAt: new Date(),
    };
    this.fileUploads.set(id, fileUpload);
    return fileUpload;
  }
}

export const storage = new MemStorage();
