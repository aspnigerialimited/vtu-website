# VTU Website - Virtual Top-Up Platform

A complete VTU (Virtual Top-Up) platform for buying airtime and data bundles with integrated payment processing.

## Features

✅ User Registration & Login with JWT Authentication
✅ Airtime Purchase System
✅ Data Bundle Purchase System
✅ Wallet Balance Management
✅ Paystack Payment Integration
✅ Admin Dashboard with Analytics
✅ Transaction History
✅ Security Features (Rate Limiting, Helmet, CORS)

## Project Structure

```
vtu-website/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Transaction.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── transactions.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB
- Paystack Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aspnigerialimited/vtu-website.git
   cd vtu-website/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - MongoDB URI
   - JWT Secret
   - Paystack API Keys

4. **Start the server**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:type` - Get services by type (airtime/data)

### Transactions
- `GET /api/transactions` - Get user transactions (Requires Auth)
- `POST /api/transactions/buy-airtime` - Buy airtime (Requires Auth)
- `POST /api/transactions/buy-data` - Buy data (Requires Auth)

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment (Requires Auth)
- `POST /api/payments/verify/:reference` - Verify payment (Requires Auth)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats (Admin Only)
- `GET /api/admin/transactions` - All transactions (Admin Only)
- `GET /api/admin/users` - All users (Admin Only)

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/vtu-website
JWT_SECRET=your-secret-key
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Paystack API
- **Security**: Helmet, CORS, Rate Limiting
- **Password**: Bcryptjs

## Coming Soon

- React Frontend
- Admin Dashboard UI
- User Dashboard UI
- Email Notifications
- SMS Notifications
- More Payment Gateways

## License

ISC

## Support

For support, contact: support@aspnigerialimited.com
