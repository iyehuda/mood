import logging
from typing import Any, Dict, Optional, Union

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

from app.core.config import settings
from app.models.llm import LLMServiceConfig, LLMChainConfig, LLMResponse

logger = logging.getLogger(__name__)

class LLMService:
    """Service for interacting with the Language Model."""
    
    def __init__(self, config: Optional[LLMServiceConfig] = None):
        """
        Initialize the LLM service.
        
        Args:
            config: Configuration for the LLM service
        """
        try:
            self.config = config or LLMServiceConfig(
                llm_model=settings.MODEL_NAME,
                temperature=settings.TEMPERATURE
            )
            
            logger.info(f"Initializing LLM service with model: {self.config.llm_model}")
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
                model=self.config.llm_model,
                temperature=self.config.temperature,
                convert_system_message_to_human=self.config.convert_system_message_to_human,
            )
        except Exception as e:
            logger.error(f"Error initializing model: {e}")
            raise
    
    def create_chain(self, chain_config: LLMChainConfig) -> Union[LLMChain, Any]:
        """
        Create a LangChain chain.
        
        Args:
            chain_config: Configuration for the LLM chain
            
        Returns:
            LangChain chain
        """
        try:
            prompt = PromptTemplate(
                template=chain_config.prompt_template,
                input_variables=chain_config.input_variables,
            )
            
            if chain_config.output_parser:
                return prompt | self._llm | chain_config.output_parser
            
            return LLMChain(
                llm=self._llm,
                prompt=prompt,
                verbose=True
            )
        except Exception as e:
            logger.error(f"Error creating chain: {e}")
            raise
    
    async def generate_response(self, prompt_template: str, inputs: Dict[str, Any], 
                         output_parser: Optional[Any] = None) -> LLMResponse:
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
            chain_config = LLMChainConfig(
                prompt_template=prompt_template,
                input_variables=list(inputs.keys()),
                output_parser=output_parser
            )
            
            chain = self.create_chain(chain_config)
            
            logger.info(f"Generating response with inputs: {inputs}")
            # Use ainvoke for async operation
            response = await chain.ainvoke(inputs)
            
            return LLMResponse(content=response)
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return LLMResponse(content="", error=str(e)) 