export interface SongRecommendation {
  title: string;
  artist: string;
  reason: string;
}

export interface SongRecommendationResponse {
  recommendations: SongRecommendation[];
  total: number;
}

export interface MoodPrompt {
  mood: string;
  customPrompt?: string;
}

export interface LLMResponse {
  content: string;
  error?: string;
}

export interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMServiceConfig {
  openaiApiKey: string;
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
} 