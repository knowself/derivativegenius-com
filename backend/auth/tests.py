from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch, MagicMock
from firebase_admin import auth as firebase_auth

class FirebaseAuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.mock_token = 'mock-firebase-token'
        self.mock_user_data = {
            'uid': 'test-uid',
            'email': 'test@derivativegenius.com',
            'email_verified': True
        }

    @patch('firebase_admin.auth.verify_id_token')
    def test_session_endpoint_with_valid_token(self, mock_verify_token):
        # Mock Firebase token verification
        mock_verify_token.return_value = self.mock_user_data

        response = self.client.get(
            reverse('auth_session'),
            HTTP_AUTHORIZATION=f'Bearer {self.mock_token}'
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('user', response.json())
        self.assertEqual(response.json()['user']['uid'], self.mock_user_data['uid'])

    @patch('firebase_admin.auth.verify_id_token')
    def test_session_endpoint_with_invalid_token(self, mock_verify_token):
        # Mock Firebase token verification failure
        mock_verify_token.side_effect = firebase_auth.InvalidIdTokenError('Invalid token')

        response = self.client.get(
            reverse('auth_session'),
            HTTP_AUTHORIZATION='Bearer invalid-token'
        )

        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    def test_session_endpoint_without_token(self):
        response = self.client.get(reverse('auth_session'))
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    def test_session_endpoint_with_malformed_token(self):
        response = self.client.get(
            reverse('auth_session'),
            HTTP_AUTHORIZATION='malformed-token'
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.json())

    @patch('firebase_admin.auth.verify_id_token')
    def test_admin_access(self, mock_verify_token):
        # Mock Firebase token verification for admin user
        admin_data = {**self.mock_user_data, 'email': 'admin@derivativegenius.com'}
        mock_verify_token.return_value = admin_data

        response = self.client.get(
            reverse('auth_session'),
            HTTP_AUTHORIZATION=f'Bearer {self.mock_token}'
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['user']['isAdmin'])

    def test_health_check(self):
        response = self.client.get(reverse('health_check'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.json())
        self.assertEqual(response.json()['status'], 'ok')

    @patch('firebase_admin.auth.verify_id_token')
    def test_signout_endpoint(self, mock_verify_token):
        # Mock Firebase token verification
        mock_verify_token.return_value = self.mock_user_data

        response = self.client.post(
            reverse('auth_signout'),
            HTTP_AUTHORIZATION=f'Bearer {self.mock_token}'
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('success', response.json())

    def test_csrf_token_is_set(self):
        response = self.client.get(reverse('health_check'))
        self.assertTrue(response.cookies.get('csrftoken'))

class FirebaseConfigTests(TestCase):
    @patch('firebase_admin.initialize_app')
    def test_firebase_initialization(self, mock_initialize):
        from django.conf import settings
        
        # Verify that Firebase credentials are properly configured
        self.assertTrue(hasattr(settings, 'FIREBASE_CREDENTIALS'))
        self.assertIsNotNone(settings.FIREBASE_CREDENTIALS)
        
        # Verify that required Firebase settings are present
        required_fields = ['type', 'project_id', 'private_key_id', 'private_key', 
                         'client_email', 'client_id', 'auth_uri', 'token_uri']
        
        for field in required_fields:
            self.assertIn(field, settings.FIREBASE_CREDENTIALS)
