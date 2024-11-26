from django.core.management.base import BaseCommand
from firebase_admin import auth
from firebase_app.firebase_admin import initialize_firebase_admin
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Set admin status for a Firebase user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user to make admin')
        parser.add_argument('--remove', action='store_true', help='Remove admin status instead of adding it')

    def handle(self, *args, **options):
        try:
            # Initialize Firebase Admin SDK
            initialize_firebase_admin()
            
            # Get user by email
            user = auth.get_user_by_email(options['email'])
            
            # Set or remove admin claim
            if options['remove']:
                claims = {k: v for k, v in (user.custom_claims or {}).items() if k != 'admin'}
                auth.set_custom_user_claims(user.uid, claims)
                self.stdout.write(self.style.SUCCESS(f'Successfully removed admin status from user {options["email"]}'))
            else:
                claims = dict(user.custom_claims or {})
                claims['admin'] = True
                auth.set_custom_user_claims(user.uid, claims)
                self.stdout.write(self.style.SUCCESS(f'Successfully set admin status for user {options["email"]}'))
                
        except auth.UserNotFoundError:
            self.stdout.write(self.style.ERROR(f'User with email {options["email"]} not found'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
