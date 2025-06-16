import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

// Track OpenAI API usage
export let apiUsageStats = {
  totalRequests: 0,
  totalTokens: 0,
  successfulRequests: 0,
  failedRequests: 0
};

function trackUsage(tokens: number, success: boolean) {
  apiUsageStats.totalRequests++;
  apiUsageStats.totalTokens += tokens || 0;
  if (success) {
    apiUsageStats.successfulRequests++;
  } else {
    apiUsageStats.failedRequests++;
  }
}

export function getApiUsageStats() {
  return apiUsageStats;
}

export interface SentimentResult {
  overall: string;
  score: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence: number;
}

export interface KeywordResult {
  text: string;
  confidence: number;
  category?: string;
}

export interface AnalysisResult {
  sentiment?: SentimentResult;
  keywords?: KeywordResult[];
  summary?: string;
  topics?: string[];
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a detailed breakdown. Respond with JSON in this format: { 'overall': 'Positive/Negative/Neutral', 'score': number between -1 and 1, 'positive': percentage, 'neutral': percentage, 'negative': percentage, 'confidence': number between 0 and 1 }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const tokens = response.usage?.total_tokens || 0;
    trackUsage(tokens, true);

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overall: result.overall || "Neutral",
      score: Math.max(-1, Math.min(1, result.score || 0)),
      positive: Math.max(0, Math.min(100, result.positive || 0)),
      neutral: Math.max(0, Math.min(100, result.neutral || 0)),
      negative: Math.max(0, Math.min(100, result.negative || 0)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
    };
  } catch (error) {
    trackUsage(0, false);
    throw new Error("Failed to analyze sentiment: " + (error as Error).message);
  }
}

export async function extractKeywords(text: string): Promise<KeywordResult[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a keyword extraction expert. Extract the most important keywords and phrases from the text. Respond with JSON in this format: { 'keywords': [{ 'text': 'keyword', 'confidence': number between 0 and 1, 'category': 'optional category' }] }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const tokens = response.usage?.total_tokens || 0;
    trackUsage(tokens, true);

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return (result.keywords || []).map((keyword: any) => ({
      text: keyword.text || "",
      confidence: Math.max(0, Math.min(1, keyword.confidence || 0)),
      category: keyword.category,
    }));
  } catch (error) {
    trackUsage(0, false);
    throw new Error("Failed to extract keywords: " + (error as Error).message);
  }
}

export async function generateSummary(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content summarization expert. Create a concise, professional summary that captures the key points and main themes of the content.",
        },
        {
          role: "user",
          content: `Please summarize the following text concisely while maintaining key points:\n\n${text}`,
        },
      ],
    });

    const tokens = response.usage?.total_tokens || 0;
    trackUsage(tokens, true);

    return response.choices[0].message.content || "";
  } catch (error) {
    trackUsage(0, false);
    throw new Error("Failed to generate summary: " + (error as Error).message);
  }
}

export async function extractTopics(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a topic modeling expert. Identify the main topics and themes discussed in the text. Respond with JSON in this format: { 'topics': ['topic1', 'topic2', 'topic3'] }",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const tokens = response.usage?.total_tokens || 0;
    trackUsage(tokens, true);

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.topics || [];
  } catch (error) {
    trackUsage(0, false);
    throw new Error("Failed to extract topics: " + (error as Error).message);
  }
}

export async function performAnalysis(
  text: string,
  analysisTypes: string[]
): Promise<AnalysisResult> {
  const result: AnalysisResult = {};
  
  try {
    // Process each analysis type sequentially to avoid rate limits
    for (const type of analysisTypes) {
      console.log(`Processing analysis type: ${type}`);
      
      switch (type) {
        case "sentiment":
          result.sentiment = await analyzeSentiment(text);
          console.log(`Sentiment analysis completed`);
          break;
        case "keywords":
          result.keywords = await extractKeywords(text);
          console.log(`Keywords extraction completed`);
          break;
        case "summary":
          result.summary = await generateSummary(text);
          console.log(`Summary generation completed`);
          break;
        case "topics":
          result.topics = await extractTopics(text);
          console.log(`Topics extraction completed`);
          break;
        default:
          console.log(`Unknown analysis type: ${type}`);
      }
    }
    
    console.log(`Analysis completed with results:`, Object.keys(result));
    return result;
  } catch (error) {
    console.error(`Analysis failed:`, error);
    trackUsage(0, false);
    throw error;
  }
}
