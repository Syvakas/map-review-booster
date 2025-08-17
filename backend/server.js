import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Security middleware
app.use(helmet());

// CORS configuration - allow frontend on port 8081 and Vercel
app.use(cors({
  origin: [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'http://localhost:5173', // Vite default port
    'http://127.0.0.1:5173',
    'https://map-review-booster.vercel.app' // Vercel production URL
  ],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Review rewrite endpoint with validation
app.post('/api/rewrite',
  // Input validation
  body('text')
    .isString()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Text must be between 10 and 2000 characters')
    .trim()
    .escape(),
  body('keywords')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null) return true;
      if (typeof value === 'string') {
        return value.length <= 200;
      }
      if (Array.isArray(value)) {
        const joinedKeywords = value.join(', ');
        return joinedKeywords.length <= 200;
      }
      return false;
    })
    .withMessage('Keywords must be less than 200 characters'),
  
  async (req, res) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { text, keywords } = req.body;
      
      // Handle keywords as either string or array
      let keywordsString = '';
      if (keywords) {
        if (Array.isArray(keywords)) {
          keywordsString = keywords.join(', ');
        } else if (typeof keywords === 'string') {
          keywordsString = keywords;
        }
      }

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'OpenAI API key not configured'
        });
      }

      // Prepare the prompt for OpenAI
      const systemPrompt = `You are an expert copywriter specializing in creating engaging, descriptive, and SEO-friendly review content. Your task is to transform basic reviews into compelling, detailed descriptions that:

1. Maintain the original sentiment and key points
2. Add descriptive details and context
3. Use natural, engaging language
4. Incorporate relevant keywords naturally
5. Make the content more discoverable and appealing
6. Keep the tone authentic and trustworthy

Always respond in the same language as the input text.`;

      const userPrompt = `Transform this review into a more descriptive and SEO-friendly version:

Original review: "${text}"

${keywordsString ? `Please naturally incorporate these keywords if relevant: ${keywordsString}` : ''}

Provide only the improved review text, nothing else.`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: process.env.MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });

      const improvedText = completion.choices[0]?.message?.content?.trim();

      if (!improvedText) {
        return res.status(500).json({
          error: 'Failed to generate improved text'
        });
      }

      // Return the improved text
      res.json({
        success: true,
        improvedText: improvedText,
        originalLength: text.length,
        improvedLength: improvedText.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error in /api/rewrite:', error);
      
      // Handle specific OpenAI errors
      if (error.code === 'insufficient_quota') {
        return res.status(429).json({
          error: 'OpenAI API quota exceeded. Please try again later.'
        });
      }
      
      if (error.code === 'invalid_api_key') {
        return res.status(401).json({
          error: 'Invalid OpenAI API key'
        });
      }

      if (error.code === 'rate_limit_exceeded') {
        return res.status(429).json({
          error: 'OpenAI API rate limit exceeded. Please try again later.'
        });
      }

      // Generic error response
      res.status(500).json({
        error: 'Internal server error. Please try again later.',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    }
  }
);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/rewrite'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart Review Enhancer Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔄 API endpoint: http://localhost:${PORT}/api/rewrite`);
  console.log(`🔑 OpenAI API configured: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`🌐 CORS enabled for frontend ports`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});