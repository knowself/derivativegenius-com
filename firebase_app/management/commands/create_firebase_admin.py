from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from firebase_admin import auth
from firebase_app.firebase_admin import initialize_firebase_admin, get_auth

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a new admin user in both Django and Firebase'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address for the admin user')
        parser.add_argument('password', type=str, help='Password for the admin user')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        self.stdout.write('Creating new admin user...')

        try:
            # Initialize Firebase Admin SDK
            firebase_auth = get_auth()

            # Create user in Firebase
            firebase_user = None
            try:
                firebase_user = firebase_auth.get_user_by_email(email)
                self.stdout.write(self.style.WARNING(f'User {email} already exists in Firebase'))
            except auth.UserNotFoundError:
                firebase_user = firebase_auth.create_user(
                    email=email,
                    password=password,
                    email_verified=True
                )
                self.stdout.write(self.style.SUCCESS(f'Created Firebase user: {email}'))

            # Set custom claims for admin
            auth.set_custom_user_claims(firebase_user.uid, {
                'admin': True,
                'staff': True
            })

            # Create Django superuser
            try:
                user = User.objects.get(email=email)
                self.stdout.write(self.style.WARNING(f'User {email} already exists in Django'))
            except User.DoesNotExist:
                user = User.objects.create_superuser(
                    username=email,
                    email=email,
                    password=password
                )
                self.stdout.write(self.style.SUCCESS(f'Created Django superuser: {email}'))

            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))
            self.stdout.write('You can now log in at /firebase/auth/')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin user: {str(e)}'))
