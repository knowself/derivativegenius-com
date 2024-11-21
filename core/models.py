from django.db import models
from django.contrib.auth.models import User

class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    theme = models.CharField(max_length=10, default='light', choices=[('light', 'Light'), ('dark', 'Dark')])
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(user__isnull=False) | models.Q(session_key__isnull=False),
                name='user_or_session_required'
            )
        ]
