# Quick Setup Guide for ContentAI Pro

## What You Need Before Starting

1. **Node.js 18 or higher** - Download from https://nodejs.org
2. **OpenAI API Key** - Get from https://platform.openai.com/api-keys
3. **Text editor** - VS Code, Sublime Text, or any code editor

## 5-Minute Setup Process

### Step 1: Download and Extract
```bash
# Navigate to your project folder
cd contentai-pro
```

### Step 2: Install Dependencies
```bash
npm install
```
This installs all required packages (React, Express, OpenAI SDK, etc.)

### Step 3: Setup Environment
```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
NODE_ENV=development
```

### Step 4: Start the Application
```bash
npm run dev
```

### Step 5: Open in Browser
Go to: http://localhost:5000

## What Each Feature Does

**Sentiment Analysis**: Determines if content is positive, negative, or neutral with confidence scores

**Keyword Extraction**: Finds the most important words and phrases in your content

**Content Summarization**: Creates short summaries of long text while keeping key points

**Topic Identification**: Discovers what themes and subjects your content discusses

## How to Test It

1. **Try with text**: Paste a product review or social media post
2. **Upload a file**: Use a .txt or .doc file
3. **Select analysis types**: Choose what insights you want
4. **Click "Start AI Analysis"**: Wait for AI to process your content
5. **View results**: See sentiment scores, keywords, and summaries

## Troubleshooting

**"Cannot find module" errors**: Run `npm install` again

**API key not working**: 
- Check if you copied the full key (starts with sk-)
- Verify your OpenAI account has credits
- Make sure no extra spaces in .env file

**Port 5000 already in use**: 
- Close other applications using port 5000
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

**File upload not working**: 
- Check file size (max 10MB)
- Use supported formats: TXT, PDF, DOC, CSV

## Project Structure
```
contentai-pro/
├── client/          # Frontend (React + TypeScript)
├── server/          # Backend (Express + OpenAI)
├── shared/          # Common types and schemas
├── .env            # Your API keys (create this)
├── package.json    # Dependencies
└── README.md       # Full documentation
```

This platform is perfect for content creators, marketers, researchers, and anyone who needs to understand their text content better.