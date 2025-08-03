# Frontend Authentication System

This is a Next.js frontend application with a complete authentication system that integrates with a Laravel backend API.

## Features

- **User Authentication**: Login and registration with form validation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Token Management**: Automatic token storage and API request authentication
- **User State Management**: Global authentication state using React Context
- **Responsive Design**: Modern UI with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your Laravel backend is running on `http://127.0.0.1:8000`

## Available Routes

- `/` - Landing page (redirects authenticated users to dashboard)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard page (requires authentication)

## Authentication Flow

1. **Login**: Users enter username and password, receive access token
2. **Registration**: Users create account with name, username, email, and password
3. **Token Storage**: Access tokens are stored in localStorage
4. **API Requests**: All authenticated requests include the Bearer token
5. **Auto Logout**: Expired/invalid tokens automatically redirect to login

## Components

- `AuthProvider`: Global authentication context provider
- `ProtectedRoute`: HOC for protecting routes
- `Login`: Login form component
- `Register`: Registration form component
- `Dashboard`: Protected dashboard page

## Services

- `api.ts`: Axios instance with interceptors for authentication
- `authService.ts`: Authentication service methods

## Environment Configuration

Update `src/environment/environment.ts` to point to your backend API:

```typescript
export const environment = {
    API_URL: "http://127.0.0.1:8000/api"
}
```

## Backend Requirements

The frontend expects the following Laravel API endpoints:

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user data

All endpoints should return appropriate JSON responses with access tokens for authentication.
