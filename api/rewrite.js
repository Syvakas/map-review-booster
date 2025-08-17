import { body, validationResult } from 'express-validator';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple function to detect language based on character sets
function detectLanguage(text) {
  // Greek character range
  const greekRegex = /[\u0370-\u03FF\u1F00-\u1FFF]/;
  // Cyrillic character range
  const cyrillicRegex = /[\u0400-\u04FF]/;
  // Arabic character range
  const arabicRegex = /[\u0600-\u06FF]/;
  // Hebrew character range
  const hebrewRegex = /[\u0590-\u05FF]/;
  // Chinese character range
  const chineseRegex = /[\u4E00-\u9FFF]/;
  // Japanese character ranges
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/;
  // Korean character range
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/;

  if (greekRegex.test(text)) return "Greek";
  if (cyrillicRegex.test(text)) return "Cyrillic";
  if (arabicRegex.test(text)) return "Arabic";
  if (hebrewRegex.test(text)) return "Hebrew";
  if (chineseRegex.test(text)) return "Chinese";
  if (japaneseRegex.test(text)) return "Japanese";
  if (koreanRegex.test(text)) return "Korean";
  return "English or Latin-based";
}

// Validation middleware for serverless
function validateInput(req) {
  const { text, keywords } = req.body;
  
  // Validate text
  if (!text || typeof text !== 'string') {
    return { error: 'Text is required and must be a string' };
  }
  
  if (text.length < 10 || text.length > 2000) {
    return { error: 'Text must be between 10 and 2000 characters' };
  }
  
  // Validate keywords
  if (keywords !== undefined && keywords !== null) {
    if (typeof keywords === 'string' && keywords.length > 200) {
      return { error: 'Keywords must be less than 200 characters' };
    }
    if (Array.isArray(keywords) && keywords.join(', ').length > 200) {
      return { error: 'Keywords must be less than 200 characters' };
    }
  }
  
  return null;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    // Validate input
    const validationError = validateInput(req);
    if (validationError) {
      return res.status(400).json(validationError);
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

CRITICAL INSTRUCTION: You MUST ALWAYS respond in the EXACT SAME LANGUAGE as the input text. 

Examples:
- If input is "Αυτό είναι ένα καλό εστιατόριο" (Greek), respond in Greek like "Αυτό είναι ένα εξαιρετικό εστιατόριο με υπέροχη ατμόσφαιρα..."
- If input is "This is a good restaurant" (English), respond in English like "This is an exceptional restaurant with wonderful atmosphere..."

NEVER translate to another language. If you receive Greek text, you MUST respond in Greek.`;

    const userPrompt = `Transform this review into a more descriptive and SEO-friendly version. YOU MUST RESPOND IN THE EXACT SAME LANGUAGE AS THE ORIGINAL REVIEW - DO NOT TRANSLATE:

Original Review (Language: ${detectLanguage(text)}): "${text}"

${keywordsString ? `Please naturally incorporate these keywords if relevant: ${keywordsString}` : ''}

CRITICAL INSTRUCTION: Your response MUST be in the EXACT SAME LANGUAGE as the original review. DO NOT translate to any other language under any circumstances.

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
      presence_penalty: 0.1,
      response_format: { type: "text" }
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