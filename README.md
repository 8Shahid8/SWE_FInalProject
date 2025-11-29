# 🛡️ SafeHands - Your Trusted Service Partner

[![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

SafeHands is a modern, reliable web platform designed to connect users with essential everyday services, with a strong emphasis on safety, security, and convenience. The platform includes robust features for managing services, users, and providers, along with an integrated COVID-19 contact tracing and quarantine management system.

## ✨ Key Features

- **Role-Based Authentication**: Secure login and registration for three distinct roles:
    - **Clients**: Can browse and book services.
    - **Service Providers**: Can view and manage their assigned bookings.
    - **Admins**: Have full oversight of the platform, including user management, service requests, and provider administration.
- **Comprehensive Service Catalog**: A wide range of bookable services including:
    - 🚚 Delivery Services (Groceries, Food, Parcels)
    - 💊 Medication Delivery
    - 🧪 COVID-19 Testing
    - 🧹 Home Cleaning
    - 🧺 Laundry Service
    - 🐾 Pet Care
- **Admin Dashboard**: A powerful interface for admins to manage users, roles, service requests, and system-wide settings.
- **Provider Dashboard**: A dedicated dashboard for service providers to track, accept, and update the status of their assigned tasks.
- **COVID-19 Safety Module**:
    - Users can self-report a positive COVID-19 status.
    - Admins can view reports and place users under quarantine, which restricts their ability to book new services.
    - A contact tracing feature to help identify potential exposures.
- **User Profile Management**: Users can view and update their personal information.
- **Session Management**: Automatic logout after a period of inactivity for enhanced security.
- **Audit Logging**: Key actions are logged for traceability and security purposes.

## 🚀 Tech Stack

- **Frontend**:
    - [React](https://reactjs.org/) (v19)
    - [Vite](https://vitejs.dev/)
    - [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**:
    - [Firebase](https://firebase.google.com/)
        - Firestore (Database)
        - Firebase Authentication
- **Icons**:
    - [Lucide React](https://lucide.dev/)

## 📂 Project Structure

The project follows a standard Vite + React structure.

```
safehands/
├── public/              # Static assets
└── src/
    ├── assets/          # Images, SVGs
    ├── components/      # Reusable React components
    ├── context/         # React Context providers (e.g., QuarantineContext)
    ├── pages/           # Main page components for routing
    ├── utils/           # Utility functions (auth, database, validation)
    ├── App.jsx          # Main application component with routing
    ├── main.jsx         # Entry point of the application
    └── firebase.js      # Firebase configuration
```

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/8Shahid8/SWE_FInalProject.git
    cd SWE_FInalProject
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd safehands
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Set up Firebase:**
    - The project uses Firebase for its backend. The configuration is located in `src/firebase.js`.
    - You will need to create your own Firebase project and replace the placeholder configuration with your own project's credentials.
    ```javascript
    // src/firebase.js
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

5.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 🚀 Project Demonstration

### 1. User Authentication

Users can sign up as a "Client" or a "Service Provider". The login page provides a clean interface for authentication.

`[Screenshot of the Login/Register page]`
*The image would show the SafeHands authentication page with options to sign in or sign up.*

### 2. Booking a Service

Once logged in, clients can browse the available services on the home page and click on any service to initiate a booking request.

`[Screenshot of the Home Page with service cards]`
*The image would show the main dashboard with cards for Grocery Delivery, Home Cleaning, etc.*

### 3. Admin Dashboard

Admins have access to a comprehensive dashboard where they can:
- View platform-wide statistics.
- Manage all users and change their roles.
- View and assign all service requests.
- Manage users who have reported a positive COVID-19 status, with options to quarantine or free them.

`[Screenshot of the Admin Dashboard showing User Management or Positive Reports]`
*The image would show the admin panel with a table of users, their roles, and their COVID-19 status, along with action buttons.*

### 4. Service Provider Dashboard

Service providers have a simplified dashboard focused on their tasks. They can:
- See a list of bookings assigned to them, categorized by service type.
- Update the status of a booking (e.g., 'Accepted', 'In Progress', 'Completed').
- Report a positive COVID-19 test result to an admin.

`[Screenshot of the Service Provider Dashboard]`
*The image would show a list of assigned bookings for a specific service, with options to change the status of each booking.*

### 5. Quarantine Management

The platform has a built-in system to handle COVID-19 exposures:
- A user can self-report as positive from their profile page.
- This user then appears in the "Positive Reports" section of the Admin Dashboard.
- The admin can quarantine the user, which restricts their account from booking new services.
- A prominent alert is displayed to the quarantined user in their UI.

`[Screenshot of a user's profile under quarantine]`
*The image would show the quarantine alert banner at the top of the page, informing the user of their status and restrictions.*

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

_This README was generated with the help of the Gemini CLI Agent._
