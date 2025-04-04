import OpenAI from 'openai';
import { 
  SongRecommendation, 
  SongRecommendationResponse, 
  MoodPrompt, 
  LLMResponse, 
  LLMConfig, 
  LLMServiceConfig 
} from '../models';

export class LLMService {
  private openai: OpenAI;
  private defaultConfig: LLMConfig;

  constructor(config: LLMServiceConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
    this.defaultConfig = {
      model: config.defaultModel,
      temperature: config.defaultTemperature,
      maxTokens: config.defaultMaxTokens,
    };
  }

  private async callLLM(prompt: string, config?: Partial<LLMConfig>): Promise<LLMResponse> {
    try {
      const finalConfig = { ...this.defaultConfig, ...config };
      const response = await this.openai.chat.completions.create({
        model: finalConfig.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: finalConfig.temperature,
        max_tokens: finalConfig.maxTokens,
      });

      return {
        content: response.choices[0]?.message?.content || '',
      };
    } catch (error) {
      console.error('Error calling LLM:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private parseSongRecommendations(content: string): SongRecommendation[] {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      return lines.map(line => {
        const [title, artist, ...reasonParts] = line.split(' - ');
        return {
          title: title.trim(),
          artist: artist.trim(),
          reason: reasonParts.join(' - ').trim(),
        };
      });
    } catch (error) {
      console.error('Error parsing song recommendations:', error);
      return [];
    }
  }

  async getSongRecommendations(moodPrompt: MoodPrompt): Promise<SongRecommendationResponse> {
    const prompt = this.buildPrompt(moodPrompt);
    const response = await this.callLLM(prompt);

    if (response.error) {
      throw new Error(response.error);
    }

    const recommendations = this.parseSongRecommendations(response.content);
    return {
      recommendations,
      total: recommendations.length,
    };
  }

  private buildPrompt(moodPrompt: MoodPrompt): string {
    const { mood, customPrompt } = moodPrompt;
    const basePrompt = `Generate a list of 5 songs that match the mood: ${mood}.`;
    const customPromptText = customPrompt ? ` Consider this additional context: ${customPrompt}.` : '';
    const formatInstructions = `
Format each song as:
Title - Artist - Reason why this song matches the mood

Example:
Bohemian Rhapsody - Queen - Epic and emotional journey that captures intense feelings
Happy - Pharrell Williams - Upbeat and cheerful melody that radiates positivity`;

    return `${basePrompt}${customPromptText}${formatInstructions}`;
  }
} 