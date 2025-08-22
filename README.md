# SwiftBooks - Advanced Money Manager

SwiftBooks is a modern, feature-rich money management application built for individuals, families, and small businesses. Track income, manage expenses, handle multi-currency transactions, and gain insights through powerful analytics.

## 🚀 Features

### Core Features
- ✅ **Multi-Currency Support** - INR, USD, EUR with real-time conversion
- ✅ **Transaction Management** - Income, Expenses, Transfers, Loans
- ✅ **Smart Categories** - Customizable expense and income categories
- ✅ **Receipt Management** - Upload and store receipt images
- ✅ **Analytics & Insights** - Beautiful charts and spending insights
- ✅ **Budget Planning** - Set and track budgets by category
- ✅ **Goal Tracking** - Set financial goals and monitor progress

### Advanced Features
- 🔐 **Secure Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📊 **Advanced Analytics** - Category breakdowns, trend analysis
- 📤 **Data Export** - Export transactions to CSV/PDF
- 🔄 **Real-time Sync** - Cloud-based data synchronization
- 🎯 **Smart Insights** - AI-powered spending recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Chart.js** - Data visualization
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Joi** - Data validation

## 📁 Project Structure

SwiftBooks/
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ └── utils/
│ └── public/
├── backend/ # Node.js backend
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── utils/
└── docs/ # Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
git clone https://github.com/Royal-dudy99/SwiftBooks.git
cd SwiftBooks

2. **Setup Backend**
cd backend
npm install
cp .env.example .env

Edit .env with your MongoDB URI and other settings
npm run dev

3. **Setup Frontend**
cd frontend
npm install
npm start

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
MONGODB_URI=mongodb://localhost:27017/swiftbooks
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
PORT=5000

### Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

## 📝 API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Transaction Endpoints
- GET /api/transactions - Get user transactions
- POST /api/transactions - Create new transaction
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction
- GET /api/transactions/analytics - Get analytics data

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ for learning and portfolio purposes
- Created by ROYAL DUDY - AIT Pune Computer Engineering Student
- Special thanks to the open-source community

## 📧 Contact

- GitHub: [@Royal-dudy99](https://github.com/Royal-dudy99)
- Email: royaldudy99@gmail.com
- LinkedIn: *(to be added)*

---

**Made with ❤️ by Computer Engineering Student at AIT Pune**
