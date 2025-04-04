import express from 'express';
import cors from 'cors';
import { LLMService } from './services/llm.service';
import { MoodPrompt, SongRecommendationResponse } from './models';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize LLM service
const llmService = new LLMService({
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  defaultModel: 'gpt-3.5-turbo',
  defaultTemperature: 0.7,
  defaultMaxTokens: 500,
});

// Routes
app.post('/api/recommendations', async (req, res) => {
  try {
    const moodPrompt: MoodPrompt = req.body;
    const recommendations: SongRecommendationResponse = await llmService.getSongRecommendations(moodPrompt);
    res.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate song recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`LLM service running on port ${port}`);
}); 