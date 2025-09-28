# ServiceHub

A full-stack MERN application for finding and booking local service providers in your area.

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Role-based access (user/provider/admin)

### Service Provider Management
- Provider registration and approval system
- Category-based service offerings
- Geospatial search for nearby providers
- Provider ratings and reviews

### Service Booking
- Search and filter providers by category
- View provider details with embedded maps
- Book services with date/time selection
- Address and special instructions
- Visit charge and payment processing

### Modern UI/UX
- Responsive design for all devices
- Urban Company-like provider cards
- Interactive maps with Google Maps integration
- Beautiful animations and transitions
- Clean, professional interface

## Technology Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt
- **Maps**: Google Maps Embed API
- **Deployment**: Docker-ready configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Maps API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd servicehub
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables:
- Create `.env` file in the server directory with:
  ```
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```
- Create `.env` file in the client directory with:
  ```
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  ```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd ../client
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

### For Users

1. **Register/Login**: Create an account or log in to access services
2. **Search Services**: Use the search bar or browse by category
3. **View Providers**: See provider details, ratings, and location on map
4. **Book Services**: Select date/time, enter address, and add notes
5. **Leave Reviews**: Rate and review service providers after booking

### For Service Providers

1. **Register as Provider**: Complete the provider registration form
2. **Wait for Approval**: Admin approval required for new providers
3. **Manage Bookings**: View and manage service appointments
4. **Build Reputation**: Collect ratings and reviews from customers

### For Admins

1. **Approve Providers**: Review and approve new provider requests
2. **Monitor System**: Oversee bookings and user activity
3. **Manage Content**: Ensure quality of service providers

## Key Features Implementation

### Provider Listing Page (Urban Company Style)
- Provider cards with name, category, address, and description
- Star rating system with average rating and review count
- Visit charges and distance clearly displayed
- Embedded Google Maps for each provider location
- "View Details" and "Directions" buttons
- Responsive grid layout for all screen sizes
- Toggle between list view and map view
- "View All Providers" functionality

### Booking System
- Name, date, and time selection
- Service address input
- Special instructions/notes field
- Booking summary with charges and taxes
- Payment processing integration

### Review System
- Star-based rating (1-5 stars)
- Written reviews with comments
- Average rating calculation
- Review count tracking

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Providers
- `POST /api/v1/providers/request` - Request to become a provider
- `GET /api/v1/providers/nearby` - Get nearby providers
- `GET /api/v1/admin/providers/pending` - Get pending provider requests (Admin)
- `PUT /api/v1/admin/providers/:id/request` - Approve/reject provider (Admin)

### Bookings
- `POST /api/v1/bookings` - Create a booking
- `POST /api/v1/bookings/:id/pay-visit-charge` - Pay visit charge
- `PUT /api/v1/bookings/:id/complete` - Complete booking
- `GET /api/v1/bookings/my-bookings` - Get user's bookings

### Reviews
- `POST /api/v1/reviews` - Add a review
- `GET /api/v1/reviews/:providerId` - Get provider reviews

### Chat
- `POST /api/v1/chat` - Send chat message

## Database Schema

### User
- name, email, phone, password, role

### Provider
- userId, businessName, categories, address, location (GeoJSON), approved, visitCharge, details, rating, reviewCount

### Booking
- userId, providerId, category, timeslot, address, notes, status, visitChargePaid

### Review
- providerId, userId, rating, comment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Urban Company's clean and intuitive design
- Google Maps for location services
- Tailwind CSS for responsive styling
- MongoDB for geospatial queries