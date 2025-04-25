from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field


class LLMServiceConfig(BaseModel):
    """Model for LLM service configuration."""
    llm_model: str = Field(..., description="Name of the model to use", examples=["gpt-3.5-turbo", "gpt-4"])
    temperature: float = Field(default=0.7, description="Temperature setting for model creativity", examples=[0.7, 0.5])
    convert_system_message_to_human: bool = Field(default=True,
                                                  description="Whether to convert system messages to human messages",
                                                  examples=[True, False])


class LLMChainConfig(BaseModel):
    """Model for LLM chain configuration."""
    prompt_template: str = Field(..., description="The prompt template string",
                                 examples=["You are a helpful assistant. {message}",
                                           "Generate a response for: {message}"])
    input_variables: List[str] = Field(default=["message"], description="Input variables for the prompt template",
                                       examples=[["message"], ["message", "context"]])
    output_parser: Optional[Any] = Field(None, description="The output parser to use")


class LLMResponse(BaseModel):
    """Model for LLM response."""
    content: Union[str, Dict[str, Any]] = Field(..., description="The generated response content",
                                                examples=["This is a response", {"key": "value"}])
    error: Optional[str] = Field(None, description="Error message if any", examples=["Invalid input", "Model error"])


class LLMStreamChunk(BaseModel):
    """Model for LLM stream chunk."""
    content: str = Field(..., description="The chunk content", examples=["Hello", " world", "!"])
    is_final: bool = Field(default=False, description="Whether this is the final chunk", examples=[False, True])
