# EmployWise - User Management System

A responsive React application for user management with modern UI and UX practices.

## Features

- **User Authentication** - Secure login system with token-based authentication
- **User Listing** - View all users with pagination support
- **User Management** - Edit and delete user functionality
- **Responsive Design** - Optimized for mobile, tablet, and desktop devices
- **Modern UI/UX** - Clean interface with Material UI components
- **Error Handling** - Comprehensive error states with retry options

## Technologies Used

- **React** - Frontend library
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management with RTK Query
- **React Router** - Navigation and routing
- **Material UI** - Component library
- **React Toastify** - Toast notifications
- **Zod** - Form validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/bhaveshbalendra/employ-wise.git
   cd employ-wise
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Login

- Use the following credentials to log in:
  - Email: `eve.holt@reqres.in`
  - Password: `cityslicka`

### User Management

- View users list with pagination
- Edit user details by clicking the "Edit" button
- Delete users by clicking the "Delete" button
- Log out using the button in the top right corner

## Project Structure

```
src/
├── components/     # Reusable components
├── constants/      # Application constants
├── pages/          # Application pages
│   ├── login/      # Login page
│   ├── users-list/ # User list page
│   └── edit-user/  # Edit user page
├── store/          # Redux store configuration
│   └── slices/     # Redux slices and API endpoints
├── types/          # TypeScript type definitions
└── App.tsx         # Application entry point
```

## API Integration

This application uses the [ReqRes](https://reqres.in/) API for demonstration purposes:

- `GET /users?page={page}` - Fetch users with pagination
- `POST /login` - User authentication
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

## Responsive Design

The application is fully responsive and optimized for:

- Mobile devices (small screens)
- Tablets (medium screens)
- Desktops and laptops (large screens)

Responsive features include:

- Adaptive layouts for different screen sizes
- Properly sized components for touch interfaces
- Optimized typography and spacing
- Skeleton loaders that match the layout
