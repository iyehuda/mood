import logging
from typing import Any, Dict, Generator, Optional

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """Service for interacting with the Language Model."""
    
    def __init__(self, model_name: Optional[str] = None, temperature: Optional[float] = None):
        """
        Initialize the LLM service.
        
        Args:
            model_name: Name of the model to use
            temperature: Temperature setting for model creativity
        """
        try:
            self.model_name = model_name or settings.MODEL_NAME
            self.temperature = temperature or settings.TEMPERATURE
            
            logger.info(f"Initializing LLM service with model: {self.model_name}")
            self._llm = self._initialize_model()
        except Exception as e:
            logger.error(f"Error initializing LLM service: {e}")
            raise
    
    def _initialize_model(self) -> ChatGoogleGenerativeAI:
        """
        Initialize the language model.
        
        Returns:
            Initialized ChatGoogleGenerativeAI model
        """
        try:
            return ChatGoogleGenerativeAI(
                model=self.model_name,
                temperature=self.temperature,
                convert_system_message_to_human=True,
            )
        except Exception as e:
            logger.error(f"Error initializing model: {e}")
            raise
    
    def create_chain(self, prompt_template: str, output_parser: Any = None, 
                   input_variables: Optional[list] = None) -> Any:
        """
        Create a LangChain chain.
        
        Args:
            prompt_template: The prompt template string
            output_parser: The output parser to use
            input_variables: Input variables for the prompt template
            
        Returns:
            LangChain chain
        """
        try:
            prompt = PromptTemplate(
                template=prompt_template,
                input_variables=input_variables or ["message"],
            )
            
            if output_parser:
                return prompt | self._llm | output_parser
            
            return LLMChain(
                llm=self._llm,
                prompt=prompt,
                verbose=True
            )
        except Exception as e:
            logger.error(f"Error creating chain: {e}")
            raise
    
    def generate_response(self, prompt_template: str, inputs: Dict[str, Any], 
                         output_parser: Optional[Any] = None) -> Any:
        """
        Generate a response from the language model.
        
        Args:
            prompt_template: The prompt template string
            inputs: Input variables and their values
            output_parser: Optional output parser
            
        Returns:
            Generated response
        """
        try:
            chain = self.create_chain(
                prompt_template=prompt_template, 
                output_parser=output_parser,
                input_variables=list(inputs.keys())
            )
            
            logger.info(f"Generating response with inputs: {inputs}")
            if output_parser:
                return chain.invoke(inputs)
            else:
                return chain.invoke(inputs)
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    async def stream_response(self, prompt_template: str, inputs: Dict[str, Any], 
                            output_parser: Optional[Any] = None) -> Generator[str, None, None]:
        """
        Stream a response from the language model.
        
        Args:
            prompt_template: The prompt template string
            inputs: Input variables and their values
            output_parser: Optional output parser
            
        Yields:
            Chunks of the generated response
        """
        try:
            chain = self.create_chain(
                prompt_template=prompt_template, 
                output_parser=output_parser,
                input_variables=list(inputs.keys())
            )
            
            logger.info(f"Streaming response with inputs: {inputs}")
            async for chunk in chain.astream(inputs):
                yield chunk
        except Exception as e:
            logger.error(f"Error streaming response: {e}")
            raise 