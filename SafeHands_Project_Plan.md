# SafeHands Project Plan: Simple & Effective Features

This document outlines a streamlined plan for the SafeHands project, focusing on meeting assignment requirements with simple and effective implementations.

## Core Features (Simple Implementation)

### 1. Basic User System
-   Simple registration (name, email, password, postcode)
-   Three roles: **User**, **Service Provider**, **Admin**
-   Login/logout functionality

### 2. Five Services Booking
-   Simple forms for each service:
    -   **Grocery Delivery** (item list, delivery address)
    -   **Medication Delivery** (prescription details, pharmacy)
    -   **COVID-19 Testing** (test type, preferred date)
    -   **Food Delivery** (restaurant choice, menu items)
    -   **Parcel Delivery** (package details, pickup/delivery addresses)

### 3. Manual Contact Tracing (Simple Alternative)
-   **Service Check-in**: Users manually enter where they went and when
-   **Exposure Log**: Simple form to report positive COVID test
-   **Manual Notifications**: System shows if you visited same location as positive case

### 4. Quarantine Status
-   Users can self-report quarantine status
-   System shows quarantine status on profiles
-   Simple restriction: "Cannot book services while in quarantine"

## Security & Privacy Features (Assignment-Focused)

### 5 Security Requirements to Document:

**R01: Password Encryption**
-   *Description*: All passwords hashed using bcrypt before storage
-   *Rationale*: Prevents password theft if database is compromised

**R02: Input Validation**
-   *Description*: All user inputs validated to prevent XSS and SQL injection
-   *Rationale*: Protects against common web application attacks

**R03: Session Management**
-   *Description*: Secure session tokens with expiration for authenticated users
-   *Rationale*: Prevents session hijacking and unauthorized access

**R04: Role-Based Access Control**
-   *Description*: Different permissions for Users, Providers, and Admins
-   *Rationale*: Ensures users only access appropriate functions and data

**R05: Data Minimization**
-   *Description*: Collect only essential information needed for services
-   *Rationale*: Reduces privacy risks by limiting data collection

## Simple Technical Implementation

**Frontend (Vite + React):**
-   5-6 main pages: Home, Login, Service Booking, Contact Tracing, Profile, Admin
-   Simple forms with validation
-   Basic styling - focus on functionality

**Backend (Simple Node.js/Express):**
-   REST API for CRUD operations
-   Basic authentication
-   Simple SQLite database

**Database Tables:**
```sql
Users (id, email, password_hash, role, postcode, quarantine_status)
Services (id, type, description, provider_id, status)
Bookings (id, user_id, service_id, date, status)
TracingLogs (id, user_id, location, date, exposed)
```

## Assignment Alignment Made Simple

#### For **System Design**:
-   **Class Diagram**: Show User, Service, Booking, TracingLog classes
-   **Sequence Diagrams**: User booking flow & contact tracing reporting

#### For **Implementation**:
-   Working booking system for 2-3 services
-   Basic contact tracing form
-   Admin dashboard to view reports

#### For **Security**:
-   Password hashing (bcrypt)
-   Input validation on all forms
-   Simple session management
-   Role-based page access

## Minimal Viable Demo Features

**What you can demonstrate in 5 minutes:**
1.  **User registers** and logs in
2.  **Books a service** (Grocery delivery)
3.  **Reports contact tracing** (Manual check-in)
4.  **Admin views** all bookings and tracing data
5.  **Shows security features** (hashed passwords, input validation)

## Simple Project Structure

```
src/
├── components/
│   ├── Login.jsx
│   ├── ServiceBooking.jsx
│   ├── ContactTracing.jsx
│   └── AdminDashboard.jsx
├── pages/
│   ├── Home.jsx
│   ├── Services.jsx
│   └── Profile.jsx
└── utils/
    ├── auth.js
    └── validation.js
```

## Timeline (6 Weeks)

**Week 1-2**: Basic React app with login and service pages
**Week 3-4**: Backend API and database
**Week 5**: Security features and contact tracing
**Week 6**: Polish, documentation, and video demo
