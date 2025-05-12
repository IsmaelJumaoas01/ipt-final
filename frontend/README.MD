# User Management System - Frontend

## Introduction
An Angular 17 frontend application for managing user accounts with features like email sign-up, verification, authentication, role-based authorization, and CRUD operations.

## Team Members & Responsibilities

### Frontend Developers
1. **Ismael Jose Jumao-as** - Email Sign-Up, Verification, and Authentication
   - Implement email sign-up functionality
   - Implement email verification process
   - Implement authentication system
   - Branch: `frontend-signup-auth`

2. **Prince Dominic Lazaga** - Profile Management, Admin Dashboard, and Fake Backend
   - Implement profile management system
   - Implement admin dashboard
   - Implement fake backend for development
   - Branch: `frontend-profile-admin-fake-backend`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/IsmaelJumaoas01/user-management-system
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure environment:
Make sure `useFakeBackend` is set to `true` in `src/environments/environment.ts`:
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:4000',
    useFakeBackend: true  // Set this to true to use fake backend
};
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Features

### Authentication (Developer 3)
- User registration
- Email verification
- Login/Logout
- JWT token management

### User Management (Developer 4)
- Profile management
- Admin dashboard
- User list and management
- Role-based access control
- Fake backend implementation

## Testing

### Functional Testing (Tester 1)
- Test user registration flow
- Test email verification process
- Test authentication process
- Test profile management
- Test admin dashboard functionality
- Validate all user flows

### Security Testing (Tester 2)
- Test for unauthorized access
- Test for XSS vulnerabilities
- Test for CSRF vulnerabilities
- Test role-based access control
- Validate edge cases
- Test token management

## 🔧 Development with Fake Backend

The fake backend provides the following features:
- User registration and login
- Email verification simulation
- Password reset functionality
- User management (for admin)
- Profile management

### Important Notes
- No actual emails are sent - verification/reset links are shown in browser alerts
- Data is stored in browser localStorage
- Refresh the page to clear fake data
- Admin account is created automatically (email: admin@example.com, password: admin)

## 📦 Dependencies
- Angular 17
- Bootstrap 5
- Font Awesome
- RxJS
- TypeScript

## 🛠️ Build
```bash
npm run build
```

## 🧪 Test
```bash
npm test
```

## 📝 License
This project is licensed under the MIT License.
