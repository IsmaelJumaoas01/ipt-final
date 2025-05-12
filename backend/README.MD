# User Management System - Backend

## Introduction
A Node.js + MySQL backend API for managing user accounts with features like email sign-up, verification, authentication, role-based authorization, and CRUD operations.

## Team Members & Responsibilities

### Backend Developers
1. **Paul Christian Patiño** - Email Sign-Up, Verification, and Authentication
   - Implement email sign-up functionality
   - Implement email verification process
   - Implement authentication system
   - Branch: `backend-signup-auth`

2. **Arnold Cutad Jr** - Role-Based Authorization, Forgot Password, and CRUD
   - Implement role-based authorization system
   - Implement forgot password functionality
   - Implement reset password functionality
   - Implement CRUD operations for user management
   - Branch: `backend-authorization-crud`

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/IsmaelJumaoas01/user-management-system
cd backend
```

2. Install dependencies with legacy peer deps (required for Ethereal email):
```bash
npm install --legacy-peer-deps
```

3. Configure the database:
   - Create a MySQL database
   - Update the `config.json` file with your database credentials:
   ```json
   {
     "development": {
       "username": "your_username",
       "password": "your_password",
       "database": "your_database",
       "host": "localhost",
       "dialect": "mysql"
     }
   }
   ```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:4000`

## Testing with Ethereal Email and Thunder Client

### 1. Setting up Ethereal Email
Ethereal Email is used for testing email functionality without sending actual emails.

1. Install Ethereal:
```bash
npm install nodemailer
```

2. The system is already configured to use Ethereal for testing. When you start the server, it will automatically create a test account.

### 2. Testing with Thunder Client/Postman

#### Authentication Endpoints

1. **Register a New User**
   - Method: POST
   - URL: `http://localhost:4000/accounts/register`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "password": "yourpassword",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```
   - Check Ethereal inbox for verification email

2. **Verify Email**
   - Method: POST
   - URL: `http://localhost:4000/accounts/verify-email`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "verificationCode": "code_from_email"
   }
   ```

3. **Authenticate User**
   - Method: POST
   - URL: `http://localhost:4000/accounts/authenticate`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "password": "yourpassword"
   }
   ```
   - Save the returned token for subsequent requests

#### Account Management Endpoints

1. **Forgot Password**
   - Method: POST
   - URL: `http://localhost:4000/accounts/forgot-password`
   - Body:
   ```json
   {
     "email": "test@example.com"
   }
   ```
   - Check Ethereal inbox for reset code

2. **Reset Password**
   - Method: POST
   - URL: `http://localhost:4000/accounts/reset-password`
   - Body:
   ```json
   {
     "email": "test@example.com",
     "resetCode": "code_from_email",
     "newPassword": "newpassword"
   }
   ```

3. **Get All Accounts** (Admin only)
   - Method: GET
   - URL: `http://localhost:4000/accounts`
   - Headers:
   ```
   Authorization: Bearer your_token
   ```

4. **Get Account by ID** (Admin only)
   - Method: GET
   - URL: `http://localhost:4000/accounts/{id}`
   - Headers:
   ```
   Authorization: Bearer your_token
   ```

5. **Update Account** (Admin only)
   - Method: PUT
   - URL: `http://localhost:4000/accounts/{id}`
   - Headers:
   ```
   Authorization: Bearer your_token
   ```
   - Body:
   ```json
   {
     "firstName": "Updated",
     "lastName": "Name",
     "email": "updated@example.com"
   }
   ```

6. **Delete Account** (Admin only)
   - Method: DELETE
   - URL: `http://localhost:4000/accounts/{id}`
   - Headers:
   ```
   Authorization: Bearer your_token
   ```

## Testing Workflow

1. Start the server:
```bash
npm start
```

2. Open Thunder Client/Postman and import the following environment variables:
   - `base_url`: `http://localhost:4000`
   - `token`: (will be set after authentication)

3. Follow this sequence to test all functionality:
   - Register a new user
   - Verify the email using the code from Ethereal
   - Authenticate to get the token
   - Test forgot password and reset password
   - Test CRUD operations with the admin token

4. Monitor the Ethereal inbox for all email communications:
   - Verification emails
   - Password reset emails
   - Other system notifications

## Troubleshooting

1. If you encounter dependency issues:
```bash
npm install --legacy-peer-deps
```

2. If database connection fails:
   - Verify your MySQL credentials in `config.json`
   - Ensure MySQL service is running
   - Check if the database exists

3. If email sending fails:
   - Check Ethereal connection
   - Verify email configuration in the code
   - Check server logs for error messages
