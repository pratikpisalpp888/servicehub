# ServiceHub - Multi-Role Service Marketplace

A comprehensive MERN stack web application that connects users with local service providers. Built with React, Node.js, Express, and MongoDB.

## Features

### User Roles
1. **Regular Users** - Browse and book services
2. **Service Providers** - Register their business and manage bookings
3. **Admins** - Manage the platform and approve providers

### Key Functionality

#### For Users:
- Browse service providers in a clean, Urban Company-style interface
- Filter by service categories (Beauty, Carpenter, Electrician, Plumber, Paint, Home Cleaning)
- Search for specific services or providers
- View provider details, ratings, and reviews
- Book services with date/time selection
- Leave ratings and reviews after service completion
- Chat with an AI assistant for help

#### For Service Providers:
- Register business with detailed information
- Set visit charges for services
- Provide location coordinates for map integration
- Manage service bookings
- Wait for admin approval before going live

#### For Admins:
- Approve or reject service provider registration requests
- Manage existing providers
- Oversee platform operations

### Technical Features
- JWT authentication with role-based access control
- Responsive design with Tailwind CSS
- Google Maps integration for location services
- Geospatial queries for finding nearby providers
- Real-time chatbot with AI capabilities
- Payment processing (mock implementation)
- Review and rating system

## Tech Stack
- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt
- **Maps**: Google Maps API
- **AI**: OpenAI API (optional, with mock fallback)

## Setup Instructions

1. Clone the repository
2. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables (see `.env.example` files)
4. **For Google Maps Integration**:
   - Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Maps JavaScript API and Places API
   - Add your API key to `client/.env`:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```
5. Run the development servers:
   ```bash
   # In one terminal
   cd server && npm run dev
   
   # In another terminal
   cd client && npm run dev
   ```

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── pages/dashboards/ # Role-specific dashboards
│   │   ├── api.js          # API client
│   │   └── auth.js         # Authentication helpers
│   └── ...
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── ...
└── README.md
```

## Contributing
This project is a complete implementation of a multi-role service marketplace. Contributions are welcome for additional features and improvements.

## License
MIT License