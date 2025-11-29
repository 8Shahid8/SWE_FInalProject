# Project Overview: SafeHands - Secure Software Engineering

## 🎯 **Project Goal (from Academic Brief)**

The core objective is to design and implement a **privacy-by-design home services application during COVID-19** that:
-   Enables users to book everyday services.
-   Integrates **contact tracing** and **quarantine enforcement**.
-   **Minimizes privacy risk** while maintaining functionality.
-   Uses **secure software engineering practices**.

---

## ✅ **Current Progress: Features Implemented**

### **1. Core Architecture & Setup**
*   **Firebase Backend:** Successfully migrated from a `localStorage`-based frontend prototype to a robust Firebase backend, utilizing:
    *   **Firebase Authentication** for secure user registration and login.
    *   **Cloud Firestore** for flexible, scalable data storage.
*   **Firestore Security Rules:** Implemented and deployed strict, role-based security rules (`firestore.rules`) to enforce access control across collections (`users`, `bookings`, `exposures`).
*   **Favicon:** Updated to a relevant "shield" icon.

### **2. Role-Based Access Control (RBAC) - Core Functionality Implemented**
The application now supports three distinct user roles with differentiated access and UI: `admin`, `service-provider`, and `user` (client).

*   **User Registration:**
    *   Signup form in `SafeHandsAuth.jsx` now allows users to choose their role (`user` or `service-provider`).
    *   User profiles in Firestore store the assigned role.
*   **Role-Aware Navigation & UI:**
    *   The main application header (`Layout.jsx`) dynamically adjusts based on the user's login status and role, displaying "Profile" and "Logout" for authenticated users, and conditionally showing "Admin" or "Provider Dashboard" links.
    *   The main "SafeHands" logo is also role-aware, directing admins to `/admin` and service providers to `/provider-dashboard` for a streamlined workflow.
*   **Login Redirection:** Users are now automatically redirected to their respective dashboards (`/admin` for admins, `/provider-dashboard` for service providers, `/` for regular users) upon successful login.

### **3. Admin Dashboard (`/admin`)**
*   **User Management:** Admins can view a list of all users and:
    *   Change user roles (e.g., promote to `service-provider` or `admin`, demote) via a dropdown directly in the UI.
    *   This is enforced by Firestore Security Rules on the backend.
*   **Booking Assignment:** The "Service Requests" tab now allows admins to:
    *   View all submitted service bookings.
    *   **Assign unassigned bookings** (initially marked with `DUMMY_PROVIDER_UID_FOR_TESTING`) to a specific `service-provider` using a dropdown list of available providers. This updates the `providerId` in Firestore and changes the booking status to `assigned`.

### **4. Service Provider Dashboard (`/provider-dashboard`)**
*   **Intuitive Layout:** Overhauled into a clear, tab-based interface similar to the Admin Dashboard.
*   **Real-time Bookings:** Uses Firestore's real-time listeners to instantly display bookings assigned to the logged-in provider. Updates automatically as bookings are assigned or status changes.
*   **Category-wise View:** Organizes assigned bookings by service category in distinct tabs.
*   **Detailed Booking Info:** Displays client names and full booking details.
*   **Status Management:** Providers can update the status of their assigned bookings (e.g., from `confirmed` to `accepted`, `in-progress`, `completed`).
*   **"Report Positive Test" Button:** UI element for this critical academic requirement is in place (currently triggers an alert, backend logic pending).

### **5. Client Booking Workflow**
*   **Service Card Navigation:** Clicking on a service card on the `Home.jsx` page now uses `react-router-dom` to navigate to the dedicated service booking page.
*   **Functional Booking Forms (All Services):** All primary service components (`HomeCleaning.jsx`, `GroceryDelivery.jsx`, `FoodDelivery.jsx`, `ParcelDelivery.jsx`, `MedicationDelivery.jsx`, `Covid19Testing.jsx`, `LaundryService.jsx`, `PetCare.jsx`) have been refactored to:
    *   Use authenticated user's ID (`clientId`).
    *   Include a hardcoded `providerId` (`DUMMY_PROVIDER_UID_FOR_TESTING`) for initial assignment.
    *   **Generate and store an anonymous `contactToken`** with each booking.
    *   Save detailed form data to the `bookings` collection in Firestore.

---

## ✅ **Progress on Academic Requirements**

| ID | Requirement                                  | Status      | Details                                                                                                                                                                                                            |
|----|----------------------------------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **R1** | **Secure Authentication**                    | **COMPLETE**| Firebase Auth with email/password, hashing, session management handled by Firebase.                                                                                                                                  |
| **R2** | **Role-Based Access Control (RBAC)**         | **COMPLETE**| Roles (`user`, `service-provider`, `admin`) defined and enforced via Firestore rules. Role-based dashboards and navigation implemented. Admin can manage user roles.                                              |
| **R3** | **Privacy-Preserving Contact Tracing**       | **IN PROGRESS**| Anonymous `contactToken` generation and storage with bookings is **complete**. The system to identify and notify exposed clients is pending.                                                                   |
| **R4** | **Automated Quarantine Enforcement**         | **PENDING** | The "Report Positive Test" UI is ready, but the backend logic to flag exposed clients and disable their booking ability is pending.                                                                            |
| **R5** | **Input Validation & Injection Prevention**  | **COMPLETE**| Client-side validation on forms. Firestore (NoSQL) inherently prevents SQL injection. Security rules validate data types/structure during writes.                                                               |
| **R6** | **Session Management (Bonus)**               | Not Started | (Automatic client-side timer logout)                                                                                                                                                                                |
| **R7** | **Audit Logging (Bonus)**                    | Not Started | (Log all bookings, logins, exposure reports in Firestore)                                                                                                                                                           |

---

## 🚀 **Next Steps: Completing the Academic Project**

The project is in excellent shape, with the core RBAC and booking mechanisms fully operational. The immediate priority is to implement the remaining aspects of the **Privacy-Preserving Contact Tracing (R3)** and **Automated Quarantine Enforcement (R4)**.

### **Phase 1: Implement Automated Quarantine Enforcement (CRITICAL)**

1.  **Backend Logic for "Report Positive Test":**
    *   **Goal:** When a service provider clicks "Report Positive Test", the system needs to:
        *   Identify all bookings where this provider interacted with clients within a critical timeframe (e.g., last 14 days).
        *   **Crucially:** Create entries in an `/exposures` collection in Firestore for each client identified. These entries must contain only the `exposedClientId` (UID), `exposureDate`, `status` (e.g., `active`), and the anonymous `contactToken` from the relevant booking. **NO PII should be stored here.**
    *   **Implementation:** This will require a Firebase Cloud Function (`reportExposure`). The UI button in `ServiceProviderDashboard.jsx` will call this function.
    *   **Security Rule Update:** New Firestore rules for the `/exposures` collection will be needed (`allow write: if request.auth.uid == resource.data.providerId` and `allow read: if request.auth.uid == resource.data.exposedClientId`).

2.  **Client-Side Quarantine Enforcement:**
    *   **Goal:** Clients who are identified as exposed must be notified and have their booking ability disabled.
    *   **Implementation:**
        *   Modify the `Layout.jsx` or a global state to check if the `currentUser` has an active entry in the `/exposures` collection.
        *   If a client is `exposed` and `active`, display a prominent "quarantine banner" on the UI.
        *   **Disable all service booking forms** (e.g., in `HomeCleaning.jsx`, `MedicationDelivery.jsx`, etc.) if the client is quarantined.

### **Phase 2: Refinement & Verification**

1.  **Test All Workflows:** Thoroughly test the entire cycle:
    *   Client registration & booking.
    *   Admin assigning booking to provider.
    *   Provider viewing/updating booking.
    *   Provider reporting positive.
    *   Client being quarantined (notification + booking disabled).
    *   Admin user/booking management.
2.  **Prepare Demo Video:** Create the demonstration video, clearly showcasing each of the 5+ security features as outlined in the academic brief.
3.  **Complete Academic Deliverables:** Fill out the Group Project Report and Individual Reflection, using the implemented features as evidence.

---

### **Bonus / Future Improvements (if time permits)**

*   **Audit Logging (R7 Bonus):** Implement a simple audit trail in Firestore for critical actions (login, role change, booking creation, status update).
*   **User Profile View of Bookings:** Allow clients to view their own submitted bookings on their `/profile` page.
*   **Real-time Admin Dashboard:** Convert the Admin Dashboard's `users` and `bookings` lists to use real-time listeners for instant updates.
*   **Enhanced Service Provider Management:** Allow providers to "set availability" or "accept/reject" services before an admin assigns them.

The critical path for academic success is to complete Phase 1 and thoroughly test it. You've done excellent work getting us to this point!
