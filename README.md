# ContentAI Pro - AI-Powered Content Analysis Platform

A modern SaaS application that uses OpenAI's GPT-4o to provide intelligent content analysis including sentiment analysis, keyword extraction, summarization, and topic modeling.

## What This Application Does

ContentAI Pro transforms any content you provide into actionable insights:

### Core Features
- ** Sentiment Analysis** - Determines emotional tone (positive, negative, neutral) with confidence scores
- ** Keyword Extraction** - Identifies the most important terms and phrases in your content
- ** Content Summarization** - Creates concise summaries while preserving key information
- ** Topic Identification** - Discovers main themes and subjects discussed
- ** File Upload Support** - Analyze documents (TXT, PDF, DOC, CSV files up to 10MB)
- ** Project Management** - Organize analyses into projects for better workflow
- ** Analytics Dashboard** - Track usage statistics and success rates
- ** Export Results** - Download analysis results in JSON or CSV format

### Perfect For
- Content creators analyzing audience engagement
- Marketers understanding campaign effectiveness
- Researchers processing large amounts of text
- Businesses monitoring brand sentiment
- Students and academics analyzing literature

##  How to Run This Project Locally

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)
- OpenAI API key

### Step 1: Clone and Setup
```bash
# Clone the repository (if downloading from GitHub)
git clone <repository-url>
cd contentai-pro

# Or if you downloaded the files directly, navigate to the project folder
cd contentai-pro

# Install all dependencies
npm install
```

### Step 2: Environment Configuration
1. Create a `.env` file in the root directory:
```bash
# Create the environment file
touch .env
```

2. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### Step 3: Start the Application
```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api

### Step 4: Using the Application

1. **Open your browser** and go to http://localhost:5000
2. **Start analyzing content** by:
   - Typing or pasting text in the "Text" tab
   - Uploading a file in the "File" tab
   - Entering a URL in the "URL" tab
3. **Select analysis types** you want (sentiment, keywords, summary, topics)
4. **Click "Start AI Analysis"** and wait for results
5. **View results** in the dashboard below
6. **Export data** using the download button

## Project Structure

```
contentai-pro/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utility functions
├── server/                # Backend Express application
│   ├── services/         # OpenAI integration
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data management
├── shared/               # Shared types and schemas
└── package.json         # Dependencies and scripts
```

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Check TypeScript types

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Professional component library
- **TanStack Query** - Data fetching and caching

### Backend
- **Express.js** - Fast web framework
- **OpenAI API** - GPT-4o for content analysis
- **Multer** - File upload handling
- **TypeScript** - Type-safe server code

## Getting Your OpenAI API Key

1. Visit https://platform.openai.com
2. Create an account or sign in
3. Go to the API section
4. Create a new API key
5. Copy the key (starts with "sk-")
6. Add it to your `.env` file

## Usage Tips

- **Best Results**: Provide clear, well-written content for more accurate analysis
- **File Uploads**: Ensure files are text-readable (PDFs with text, not scanned images)
- **Multiple Types**: Select multiple analysis types for comprehensive insights
- **Project Organization**: Create projects to group related analyses
- **Export Data**: Use the export feature to save results for external use

## Troubleshooting

### Common Issues

**Application won't start:**
- Ensure Node.js 18+ is installed: `node --version`
- Check if all dependencies are installed: `npm install`
- Verify the OpenAI API key is correctly set in `.env`

**Analysis not working:**
- Verify your OpenAI API key is valid and has credits
- Check browser console for error messages
- Ensure you have internet connectivity

**File uploads failing:**
- Check file size (max 10MB)
- Ensure file format is supported (TXT, PDF, DOC, CSV)
- Try with a different file

### Getting Help
- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure your OpenAI account has sufficient credits

## Features in Detail

### Sentiment Analysis
Analyzes emotional tone with:
- Overall sentiment classification
- Confidence scores
- Percentage breakdown (positive/neutral/negative)

### Keyword Extraction
Identifies important terms with:
- Relevance scoring
- Category classification
- Confidence levels

### Content Summarization
Creates concise summaries that:
- Preserve key information
- Maintain original context
- Provide adjustable length

### Topic Modeling
Discovers themes by:
- Identifying main subjects
- Clustering related concepts
- Providing topic confidence

This application provides a complete solution for AI-powered content analysis, perfect for anyone looking to gain deeper insights from their text content.
