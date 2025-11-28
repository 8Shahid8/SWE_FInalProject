# Quarantine Management System

A comprehensive web application built with React, Vite, and Tailwind CSS for managing quarantine services, contact tracing, and essential service bookings during COVID-19.

## Features

### 1. **User Authentication**
- Login/Registration system
- User profile management
- Quarantine status tracking

### 2. **Service Bookings**
Five essential services with contactless delivery:

- **Grocery Delivery** - Order groceries with item lists and delivery scheduling
- **Medication Delivery** - Prescription management and pharmacy coordination
- **COVID-19 Testing** - Book PCR/Rapid Antigen tests with home visit options
- **Food Delivery** - Order from multiple restaurants with real-time cart
- **Parcel Delivery** - Send/receive packages with tracking

### 3. **Manual Contact Tracing**
- Location check-in system
- Exposure reporting for positive cases
- Automatic contact notification
- Exposure history tracking
- Risk level assessment

### 4. **Quarantine Management**
- Self-report quarantine status
- Automatic service restrictions during quarantine
- Quarantine period tracking
- Status updates and notifications

### 5. **Admin Dashboard**
- View all bookings and their status
- Manage booking statuses
- Track contact tracing data
- Monitor quarantine statistics
- View exposure reports

## Project Structure

```
src/
├── components/
│   ├── Login.jsx                 # Authentication component
│   ├── ContactTracing.jsx        # Contact tracing functionality
│   ├── AdminDashboard.jsx        # Admin management panel
│   ├── GroceryDelivery.jsx       # Grocery booking
│   ├── MedicationDelivery.jsx    # Medication booking
│   ├── Covid19Testing.jsx        # COVID test booking
│   ├── FoodDelivery.jsx          # Food ordering
│   └── ParcelDelivery.jsx        # Parcel delivery booking
├── pages/
│   ├── Home.jsx                  # Landing page
│   ├── Services.jsx              # Services overview
│   └── Profile.jsx               # User profile
├── utils/
│   ├── auth.js                   # Authentication utilities
│   └── validation.js             # Form validation utilities
└── App.jsx                       # Main router and navigation
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone or create the project:**
```bash
npm create vite@latest quarantine-manager -- --template react
cd quarantine-manager
```

2. **Install dependencies:**
```bash
npm install
npm install react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure Tailwind CSS:**

Update `tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Copy all the component files** into the appropriate directories as shown in the project structure above.

5. **Update `src/main.jsx`:**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

6. **Run the development server:**
```bash
npm run dev
```

7. **Open your browser** and navigate to `http://localhost:5173`

## Usage Guide

### Getting Started

1. **Registration/Login:**
   - Click "Register" to create an account
   - Fill in your details (for demo, any email/password works)
   - Or click "Login" to access existing account

2. **Booking Services:**
   - Navigate to "Services" from the menu
   - Select any service (Grocery, Medication, Testing, Food, or Parcel)
   - Fill in the required information
   - Submit your booking
   - View bookings in Admin Dashboard

3. **Contact Tracing:**
   - Go to "Contact Tracing" menu
   - **Check-in:** Record locations you've visited
   - **Report Exposure:** Report positive COVID-19 test
   - **View History:** See your check-ins and potential exposures

4. **Managing Quarantine Status:**
   - Go to "Profile"
   - Click "Edit Profile"
   - Update your "Quarantine Status"
   - Set start and end dates if in active quarantine
   - Note: Some services are restricted during active quarantine

5. **Admin Features:**
   - Access admin dashboard by logging in with email containing "admin"
   - View all bookings and update their status
   - Monitor contact tracing data
   - Track quarantine statistics

## Key Features Explained

### Quarantine Restrictions
When a user is in active quarantine:
- Most services are restricted for safety
- COVID-19 testing remains available
- Warning messages displayed on service pages
- Status shown prominently in profile

### Contact Tracing System
- **Manual Check-ins:** Users record where they've been
- **Exposure Detection:** System checks for overlapping visits
- **Notifications:** Users alerted if they visited same location as positive case
- **Privacy:** Contact information kept confidential

### Service Booking Flow
1. User selects service type
2. Fills service-specific form
3. System validates quarantine status
4. Booking saved to localStorage
5. Admin can track and update status

## Data Storage

This application uses **localStorage** for demo purposes:
- User authentication data
- Service bookings
- Check-in history
- Exposure reports
- Quarantine status

**Note:** In production, implement proper backend API with database.

## Admin Access

To access admin features:
- Register/Login with email containing "admin" (e.g., admin@example.com)
- Admin dashboard link appears in navigation
- Full access to all bookings and statistics

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with localStorage support

## Development Notes

### Adding New Services
1. Create new component in `src/components/`
2. Add route in `App.jsx`
3. Add service card in `Home.jsx` and `Services.jsx`
4. Update icons and colors as needed

### Customization
- Colors: Update Tailwind classes throughout components
- Icons: Import additional icons from `lucide-react`
- Services: Modify service forms in respective components
- Validation: Update `utils/validation.js` for custom rules

## Security Considerations

**Important:** This is a demonstration project. For production use:

1. Implement proper backend authentication
2. Use secure password hashing (bcrypt, argon2)
3. Add JWT or session-based authentication
4. Implement HTTPS
5. Add CSRF protection
6. Sanitize all user inputs
7. Use proper database instead of localStorage
8. Add rate limiting
9. Implement proper access control

## Future Enhancements

Potential improvements:
- Real-time notifications (WebSockets)
- Payment gateway integration
- SMS/Email notifications
- GPS-based automatic check-in
- QR code scanning for locations
- Multi-language support
- Dark mode
- Mobile app version
- Integration with health authorities
- Vaccine certificate verification

## Troubleshooting

### Common Issues

**Routes not working:**
- Ensure react-router-dom is installed
- Check that BrowserRouter wraps all routes

**Tailwind classes not applying:**
- Verify tailwind.config.js content paths
- Check that @tailwind directives are in index.css
- Restart dev server

**localStorage data not persisting:**
- Check browser privacy settings
- Ensure localStorage is not disabled
- Try different browser

## License

MIT License - Feel free to use this project for learning or development.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component code comments
3. Ensure all dependencies are installed correctly

---

**Built with ❤️ using React, Vite, and Tailwind CSS**


📦 Complete Project Structure
Pages (3 files)

Home.jsx - Landing page with hero section and service cards
Services.jsx - Service overview with quarantine status checking
Profile.jsx - User profile management and quarantine status

Components (10 files)

Login.jsx - Authentication with login/register
ContactTracing.jsx - Manual contact tracing with check-ins and exposure reporting
AdminDashboard.jsx - Full admin panel with statistics and booking management
GroceryDelivery.jsx - Grocery ordering with item list management
MedicationDelivery.jsx - Prescription and medication delivery
Covid19Testing.jsx - COVID-19 test booking with multiple test types
FoodDelivery.jsx - Restaurant food ordering with cart
ParcelDelivery.jsx - Parcel delivery with tracking

Utilities (2 files)

auth.js - Authentication helper functions
validation.js - Form validation utilities

Main App (1 file)

App.jsx - Router configuration with navigation and protected routes

Documentation

README.md - Complete setup instructions and usage guide

🎯 Key Features Implemented
✅ 5 Service Bookings - All with unique forms and functionality
✅ Manual Contact Tracing - Check-in system and exposure reporting
✅ Quarantine Status Management - Self-reporting with service restrictions
✅ Admin Dashboard - Booking management and statistics
✅ Responsive Design - Mobile-friendly with Tailwind CSS
✅ Complete Navigation - Protected routes and menu system
🚀 To Get Started

Create a new Vite + React project
Install dependencies (react-router-dom, lucide-react, tailwindcss)
Copy all the components/pages/utils files into your project
Follow the README.md setup instructions
Run npm run dev

The system is ready to use with localStorage for data persistence. All services have quarantine restrictions, contact tracing is functional, and the admin dashboard tracks everything!
