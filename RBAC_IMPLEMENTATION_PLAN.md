# RBAC Implementation Plan

This document outlines the three-phase plan to implement a robust Role-Based Access Control (RBAC) system for the SafeHands application. The plan covers backend security enforcement, frontend UI/UX adaptations, and secure admin capabilities.

---

### **Phase 1: Fortify the Backend with Firestore Security Rules**

This is the most critical step, providing non-bypassable, server-side enforcement of access control.

**Action:** Replace the current Firestore rules with the following strict, role-aware ruleset.

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to get the role of the requesting user from their profile
    function getUserRole(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data.role;
    }

    // Users Collection:
    match /users/{userId} {
      // READ: An admin can read any profile. A user can only read their own.
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || getUserRole(request.auth.uid) == 'admin');
      
      // CREATE: A user can create their own profile during signup.
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;

      // UPDATE: A user can update their own profile. An admin can update any profile (to change roles).
      allow update: if request.auth != null &&
                     (request.auth.uid == userId || getUserRole(request.auth.uid) == 'admin');

      // DELETE: No one can delete user profiles from the client.
      allow delete: if false;
    }

    // Bookings Collection:
    match /bookings/{bookingId} {
      // READ: Admin, or the client/provider involved in the booking.
      allow read: if request.auth != null &&
                   (getUserRole(request.auth.uid) == 'admin' ||
                    resource.data.clientId == request.auth.uid ||
                    resource.data.providerId == request.auth.uid);

      // CREATE: Only authenticated 'user' role can create a booking for themselves.
      allow create: if request.auth != null &&
                     getUserRole(request.auth.uid) == 'user' &&
                     request.resource.data.clientId == request.auth.uid;

      // UPDATE: Admin, or the client/provider involved can update (e.g., change status).
      allow update: if request.auth != null &&
                     (getUserRole(request.auth.uid) == 'admin' ||
                      resource.data.clientId == request.auth.uid ||
                      resource.data.providerId == request.auth.uid);
      
      allow delete: if false;
    }

    // Exposures Collection (for contact tracing):
    match /exposures/{exposureId} {
        // READ: Admin, or the user who was exposed.
        allow read: if request.auth != null && 
                     (getUserRole(request.auth.uid) == 'admin' ||
                      resource.data.exposedClientId == request.auth.uid);
        
        // WRITE: No one can write directly. This will be handled by a secure Cloud Function.
        allow write: if false;
    }
  }
}
```

---

### **Phase 2: Adapt the Frontend for Roles**

This phase focuses on modifying the UI/UX for role selection at signup and ensuring navigation adapts based on the logged-in user's role.

**1. Modify Signup Form (`safehands/src/components/SafeHandsAuth.jsx`):**
    -   Add a dropdown or radio button group to the registration form for role selection: "Client" (`user`) or "Service Provider" (`service-provider`).
    -   **Security Suggestion:** Register providers with a `pending-provider` role, requiring admin approval before they gain full provider privileges.

**2. Update Registration Logic (`safehands/src/utils/auth.js`):**
    -   Modify the `firebaseRegister` function to accept the selected `role` and save it to the new user's document in Firestore.

**3. Implement Role-Aware Navigation Header (`safehands/src/components/Layout.jsx`):**
    -   The main navigation bar will be updated to reflect the user's authentication state and role.
    -   **If Not Authenticated:**
        -   Display "Login" and "Sign Up" links.
    -   **If Authenticated:**
        -   Hide "Login" and "Sign Up" links.
        -   Display a link to the user's "Profile" page.
        -   Display a "Logout" button.
        -   **Conditionally display a link to the "Admin" dashboard ONLY if the user's role is `admin`.**
        -   **Conditionally display a link to the "Provider Dashboard" ONLY if the user's role is `service-provider`.**

---

### **Phase 3: Implement Secure Admin User Management**

This phase enables an admin to securely manage user roles using a Firebase Cloud Function, as direct client-side updates will be blocked by our new security rules.

**1. Bootstrap the First Admin (Manual Step):**
    -   After creating your own user account, navigate to the Firebase Console -> Firestore Database -> `users` collection.
    -   Find your user document and manually change the `role` field from `"user"` to `"admin"`. This establishes the first super admin.

**2. Create "Set User Role" Cloud Function:**
    -   A secure, callable Cloud Function will be created to handle role changes.
    -   **Logic:** The function will receive a `userId` and a `newRole`. It will first verify that the user making the call is an admin before securely updating the target user's role in Firestore.

**3. Update Admin Dashboard (`safehands/src/components/AdminDashboard.jsx`):**
    -   In the "User Management" table, a dropdown menu or "Edit" button will be added next to each user.
    -   This control will allow the admin to select a new role for a user (e.g., approve a `pending-provider` to `service-provider`) by calling the `setUserRole` Cloud Function.
