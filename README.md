# 🏋️ FitGym - MERN Stack Gym Management System

A comprehensive, full-stack gym management application built with MongoDB, Express.js, React (Vite), and Node.js. Features role-based authentication, membership management, workout tracking, nutrition planning, and booking system.

![FitGym Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=FitGym+Management+System)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Member, Trainer, Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 👥 User Management
- **Members**: View dashboard, manage profile, book sessions
- **Trainers**: Create workout/nutrition plans, manage bookings
- **Admins**: Full system management, user administration

### 💪 Fitness Features
- **Workout Plans**: Create, assign, and track workout routines
- **Nutrition Plans**: Meal planning and calorie tracking
- **Booking System**: Schedule personal training sessions
- **Membership Plans**: Flexible pricing tiers with different features

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Dark/Light mode toggle
- Framer Motion animations
- Mobile-first approach
- Modern component library

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Statistics and progress tracking
- Real-time data updates
- Interactive charts and graphs

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-management-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp config.env.example config.env
   # Edit config.env with your MongoDB URI and JWT secret

   # Frontend environment
   cd ../frontend
   copy env.example .env   # Windows (PowerShell)
   # or: cp env.example .env   # macOS/Linux
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend (runs on port 5000)
   npm run server

   # Terminal 2 - Frontend (runs on port 3000)
   npm run dev
   ```

5. **Seed the database** (optional)
   ```bash
   cd backend
   node scripts/seedData.js
   ```

## 📁 Project Structure

```
gym-management-app/
├── backend/                 # Express.js API server
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Authentication & error handling
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── config.env          # Environment variables
│   └── server.js           # Server entry point
├── frontend/               # React (Vite) application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   └── index.html          # HTML template
└── package.json            # Root package.json
```

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['member', 'trainer', 'admin'],
  membershipPlan: ObjectId,
  workouts: [ObjectId],
  nutritionPlan: ObjectId,
  isActive: Boolean,
  joinDate: Date
}
```

### MembershipPlan Model
```javascript
{
  name: String,
  price: Number,
  duration: ['monthly', 'quarterly', 'yearly'],
  features: [String],
  description: String,
  maxTrainings: Number,
  includesPersonalTraining: Boolean,
  includesNutritionPlan: Boolean
}
```

### WorkoutPlan Model
```javascript
{
  title: String,
  description: String,
  difficulty: ['beginner', 'intermediate', 'advanced'],
  duration: Number,
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    weight: String,
    restTime: String,
    instructions: String
  }],
  createdBy: ObjectId,
  category: String
}
```

### NutritionPlan Model
```javascript
{
  title: String,
  description: String,
  targetCalories: Number,
  meals: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    ingredients: [String],
    mealType: String
  }],
  createdBy: ObjectId,
  category: String
}
```

### Booking Model
```javascript
{
  memberId: ObjectId,
  trainerId: ObjectId,
  date: Date,
  time: String,
  duration: Number,
  status: ['pending', 'confirmed', 'completed', 'cancelled'],
  sessionType: String,
  notes: String
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Members
- `GET /api/members/dashboard` - Member dashboard data
- `GET /api/members/workouts` - Get workout plans
- `GET /api/members/nutrition` - Get nutrition plans
- `POST /api/members/workouts/:id/assign` - Assign workout plan
- `POST /api/members/nutrition/:id/assign` - Assign nutrition plan
- `GET /api/members/bookings` - Get member bookings
- `POST /api/members/bookings` - Create booking

### Trainers
- `GET /api/trainers/dashboard` - Trainer dashboard
- `POST /api/trainers/workouts` - Create workout plan
- `POST /api/trainers/nutrition` - Create nutrition plan
- `GET /api/trainers/bookings` - Get trainer bookings
- `PUT /api/trainers/bookings/:id` - Update booking status

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/membership-plans` - Get membership plans
- `POST /api/admin/membership-plans` - Create membership plan
- `PUT /api/admin/membership-plans/:id` - Update membership plan
- `DELETE /api/admin/membership-plans/:id` - Delete membership plan

### Public
- `GET /api/public/membership-plans` - Get public membership plans
- `GET /api/public/trainers` - Get public trainers
- `GET /api/public/workouts` - Get featured workouts
- `GET /api/public/stats` - Get gym statistics

## 🎨 Frontend Features

### Pages
- **Home**: Hero section, features, testimonials
- **About**: Company information, team, values
- **Membership Plans**: Pricing tiers and features
- **Trainers**: Trainer profiles and booking
- **Dashboard**: Role-specific dashboards
- **Authentication**: Login/Register forms

### Components
- **Responsive Navbar**: Mobile-friendly navigation
- **Theme Toggle**: Dark/Light mode switcher
- **Card Components**: Reusable UI cards
- **Form Components**: Input fields with validation
- **Loading States**: Spinners and skeleton loaders

### State Management
- **AuthContext**: User authentication state
- **ThemeContext**: Dark/Light mode state
- **Axios**: HTTP client with interceptors

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Development Tools
- **Nodemon** - Development server
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🔧 Configuration

### Environment Variables (Backend)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gym_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

### Scripts
```json
{
  "dev": "cd frontend && npm run dev",
  "server": "cd backend && npm run dev",
  "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install",
  "build": "cd frontend && npm run build",
  "start": "cd backend && npm start"
}
```

## 🧪 Testing

### Seed Data
The application includes a comprehensive seed script that creates:
- 1 Admin user (admin@fitgym.com / admin123)
- 2 Trainer users (john@fitgym.com, sarah@fitgym.com / trainer123)
- 2 Member users (mike@example.com, emily@example.com / member123)
- 3 Membership plans (Basic, Premium, Elite)
- 3 Workout plans (Beginner, HIIT, Strength)
- 2 Nutrition plans (Weight Loss, Muscle Gain)

### Test Accounts
- **Admin**: admin@fitgym.com / admin123
- **Trainer**: john@fitgym.com / trainer123
- **Member**: mike@example.com / member123

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or your preferred platform
4. Update CORS settings for production

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Payment integration (Stripe)
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social features and challenges
- [ ] Video workout tutorials
- [ ] Integration with fitness wearables
- [ ] Multi-language support
- [ ] Advanced reporting system
- [ ] Automated email campaigns

---

## ⬆️ Push to GitHub

Follow these steps to initialize Git, create a GitHub repo, and push safely (Windows PowerShell shown):

```powershell
# 1) From project root
cd C:\Users\Dell1\MY_GYM

# 2) Initialize git and create first commit
git init
git add .
# If config.env exists already, it's ignored by .gitignore
git commit -m "chore: initial commit"

# 3) Create a new GitHub repo (via web UI) and copy its URL, e.g.:
# https://github.com/<your-username>/my_gym.git

# 4) Add remote and push
git branch -M main
git remote add origin https://github.com/<your-username>/my_gym.git
git push -u origin main
```

Notes:
- Secrets are not committed: `.gitignore` ignores `backend/config.env` and any `*.env` files.
- Share environment examples: `backend/config.env.example` and `frontend/env.example` are provided.
- For subsequent updates: `git add -A && git commit -m "feat: ..." && git push`.

**Built with ❤️ by the FitGym Development Team**
