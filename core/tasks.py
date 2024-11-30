from celery import shared_task
from celery.utils.log import get_task_logger
from django.core.mail import send_mail
from typing import Dict, Any

logger = get_task_logger(__name__)

@shared_task(
    name='core.tasks.process_ai_request',
    bind=True,
    max_retries=3,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def process_ai_request(self, data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process an AI request asynchronously.
    
    Args:
        data (Dict[str, Any]): The input data for AI processing
            - model: str, the AI model to use
            - inputs: Dict, the model inputs
            - options: Dict, processing options
    
    Returns:
        Dict[str, Any]: The processing results
            - status: str, processing status
            - results: Dict, the model outputs
            - metadata: Dict, processing metadata
    
    Raises:
        ValueError: If input data is invalid
        RuntimeError: If processing fails
    """
    try:
        logger.info(f"Processing AI request: {data}")
        
        # Validate input
        if not isinstance(data, dict) or 'model' not in data:
            raise ValueError("Invalid input data format")
            
        # TODO: Implement actual AI processing logic
        result = {
            'status': 'completed',
            'results': {'placeholder': 'AI processing result'},
            'metadata': {'processing_time': 0}
        }
        
        logger.info(f"AI processing completed: {result}")
        return result
        
    except Exception as exc:
        logger.error(f"Error processing AI request: {exc}", exc_info=True)
        raise self.retry(exc=exc)

@shared_task(
    name='core.tasks.send_notification',
    bind=True,
    max_retries=3,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def send_notification(self, user_email: str, subject: str, message: str) -> bool:
    """
    Send an email notification asynchronously.
    
    Args:
        user_email (str): Recipient email address
        subject (str): Email subject
        message (str): Email message body
    
    Returns:
        bool: True if email was sent successfully
    
    Raises:
        Exception: If email sending fails
    """
    try:
        logger.info(f"Sending notification to {user_email}")
        
        send_mail(
            subject=subject,
            message=message,
            from_email=None,  # Uses DEFAULT_FROM_EMAIL
            recipient_list=[user_email],
            fail_silently=False,
        )
        
        logger.info(f"Notification sent successfully to {user_email}")
        return True
        
    except Exception as exc:
        logger.error(f"Error sending notification: {exc}", exc_info=True)
        raise self.retry(exc=exc)

@shared_task(
    name='core.tasks.test_celery_task',
    bind=True,
    max_retries=3,
    autoretry_for=(Exception,),
    retry_backoff=True
)
def test_celery_task(self) -> str:
    """
    A simple task for testing Celery functionality.
    
    Returns:
        str: 'test_success' if the task executes successfully
    
    Raises:
        Exception: If task execution fails
    """
    try:
        logger.info("Running Celery test task")
        return 'test_success'
    except Exception as exc:
        logger.error(f"Error in test task: {exc}", exc_info=True)
        raise self.retry(exc=exc)
