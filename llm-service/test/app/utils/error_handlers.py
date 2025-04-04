import logging
import traceback
from typing import Dict, Any, Callable, Type, Optional

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

logger = logging.getLogger(__name__)

class ErrorHandlingUtils:
    """Utility class for handling errors and exceptions."""
    
    @staticmethod
    def handle_validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        """
        Handle FastAPI request validation errors.
        
        Args:
            request: FastAPI request object
            exc: Validation exception
            
        Returns:
            JSON response with error details
        """
        logger.error(f"Validation error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": "Validation error",
                "errors": exc.errors(),
                "path": request.url.path
            }
        )
    
    @staticmethod
    def handle_pydantic_validation_error(request: Request, exc: ValidationError) -> JSONResponse:
        """
        Handle Pydantic validation errors.
        
        Args:
            request: FastAPI request object
            exc: Validation exception
            
        Returns:
            JSON response with error details
        """
        logger.error(f"Pydantic validation error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": "Validation error",
                "errors": exc.errors(),
                "path": request.url.path
            }
        )
    
    @staticmethod
    def handle_general_exception(request: Request, exc: Exception) -> JSONResponse:
        """
        Handle general exceptions.
        
        Args:
            request: FastAPI request object
            exc: Exception
            
        Returns:
            JSON response with error details
        """
        logger.error(f"Unhandled exception: {exc}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "message": str(exc),
                "path": request.url.path
            }
        )
    
    @staticmethod
    def get_exception_handlers() -> Dict[Type[Exception], Callable]:
        """
        Get exception handlers for FastAPI app.
        
        Returns:
            Dictionary mapping exception types to handler functions
        """
        return {
            RequestValidationError: ErrorHandlingUtils.handle_validation_error,
            ValidationError: ErrorHandlingUtils.handle_pydantic_validation_error,
            Exception: ErrorHandlingUtils.handle_general_exception
        }

def log_error(error_message: str, error: Optional[Exception] = None, log_traceback: bool = True) -> None:
    """
    Log an error with optional traceback.
    
    Args:
        error_message: Error message to log
        error: Exception object
        log_traceback: Whether to log traceback
    """
    if error:
        logger.error(f"{error_message}: {str(error)}")
        if log_traceback:
            logger.error(traceback.format_exc())
    else:
        logger.error(error_message) 