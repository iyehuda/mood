from typing import Dict, Optional
from pydantic import BaseModel, Field

class PromptTemplate(BaseModel):
    """Model for prompt template."""
    template: str = Field(..., description="The prompt template string", examples=["You are a helpful assistant. {message}", "Generate a response for: {message}"])
    input_variables: Dict[str, str] = Field(default_factory=dict, description="Input variables and their descriptions", examples=[{"message": "The user's input"}, {"message": "The user's input", "context": "Additional context"}])
    examples: Optional[Dict[str, str]] = Field(None, description="Example inputs and outputs", examples=[{"input": "Hello", "output": "Hi there!"}, {"input": "How are you?", "output": "I'm doing well, thanks!"}])

class SongRecommendationPrompt(PromptTemplate):
    """Model for song recommendation prompt."""
    song_count: int = Field(default=5, description="Number of songs to recommend", examples=[5, 10])
    include_reason: bool = Field(default=True, description="Whether to include reason for each recommendation", examples=[True, False])
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "template": "You are a music expert...",
                    "input_variables": {
                        "message": "The user's mood or prompt",
                        "song_count": "Number of songs to recommend"
                    },
                    "song_count": 5,
                    "include_reason": True
                },
                {
                    "template": "Generate song recommendations...",
                    "input_variables": {
                        "message": "The user's mood",
                        "song_count": "Number of songs"
                    },
                    "song_count": 10,
                    "include_reason": False
                }
            ]
        } 