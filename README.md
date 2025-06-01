# Pet Care Service Management System

A comprehensive web application for managing pet care services, appointments, and employee scheduling. Built with Node.js, Express, MongoDB, React and TypeScript.

🔗 **Live Demo**: [https://pet-care.thuannguyen2kx.site/](https://pet-care.thuannguyen2kx.site/)  
⚠️ *Note: Please wait 2–3 minutes for the server to fully start.*

## Demo Accounts

### 🛠 Administrator
- **Email**: `petcare@gmail.com`
- **Password**: `1234qwer`

### 👨‍⚕️ Employee
- **Email**: `haidong@gmail.com`
- **Password**: `1234qwer`

## Features

### For Customers
- Book appointments for pet care services
- View available time slots
- Track appointment status
- Manage pet profiles
- View service history
- View social pet(create post, comment, reaction)
- Payment with Stripe
### For Employees
- View and manage work schedules
- Handle appointments
- Manage user
- Track assigned services
- Update availability
- Manage social pet

### For Administrators
- Manage services and pricing
- Employee scheduling
- View analytics and reports
- Handle customer feedback
- Manage payment
- AI assistant create content(create post, service)

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

### Frontend
- React
- TypeScript
- TailwindCSS
- React Query
- Zustand

## Getting Started

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 4.4
- npm >= 7.0.0

### Installation

1. Clone the repository
```bash
git clone https://github.com/thuannguyen2kx/pet-care.git
cd pet-care
```

2. Install backend dependencies
```bash
cd backend
npm install      # or: bun install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install      # or: bun install
```

4. Set up environment variables
```bash
# Backend (.env)
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb_url
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL="http://localhost:5173/google/oauth/callback"

JWT_SECRET="jwt_sercret"
JWT_EXPIRES_IN='1d'

GOOGLE_CLIENT_ID="google_client_id"
GOOGLE_CLIENT_SECRET="google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:8000/api/auth/google/callback"

#cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=no-reply@petcare.com

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend (.env)
VITE_API_BASE_URL="http://localhost:8000/api"
VITE_BASE_PATH="/"
VITE_GEMINI_API_KEY=your_gemini_api_key
```

5. Start development servers
```bash
# Backend
cd backend
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
```

## Project Structure
```
pet-care/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas and models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Express middlewares
│   │   ├── config/          # Configuration (DB, environment)
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API integration layer
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # Base UI components (Button, Modal, etc.)
│   │   │   └── common/      # Shared components across features
│   │   ├── features/        # Feature-based components
│   │   │   ├── appointments/
│   │   │   ├── employees/
│   │   │   ├── services/
│   │   │   ├── pets/
│   │   │   ├── users/
│   │   │   └── posts/
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Application layouts (e.g., DashboardLayout)
│   │   ├── pages/           # Route-based pages
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # Global TypeScript types/interfaces
│   │   └── utils/           # Helper functions
│   └── package.json
│
└── README.md

```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact

Your Name - fe.thanhthuan@gmail.com
Project Link: https://github.com/thuannguyen2kx/pet-care