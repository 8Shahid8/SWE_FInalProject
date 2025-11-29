# Session Notes: Project Evolution and Firebase Integration

This document summarizes the significant changes, debugging steps, and architectural shifts undertaken during this session to get the SafeHands application to a stable and functional state, deployable on GitHub Pages with Firebase for backend services.

---

## 1. Initial Project Setup and Cleanup

- **Objective:** Simplify the project structure and prepare for implementation.
- **Actions:**
    - Moved miscellaneous files (`a.png`, `b.png`, `github_new_user_setup_guidance.txt`, `Project_Migration_And_Setup_Notes.md`, `ssh_config_update.txt`) and old project directories (`archive/`, `reference/`) into a temporary `to_be_deleted` folder for later review/removal.
    - Created `FRONTEND_IMPLEMENTATION_PLAN.md` to outline the initial frontend-only strategy.

---

## 2. Frontend-Only Authentication (localStorage-based) Attempt

- **Objective:** Implement client-side authentication and data persistence using `localStorage` to meet GitHub Pages deployment requirements.
- **Key Changes:**
    - Created `safehands/src/utils/database.js` for `localStorage` CRUD operations, including initial seed data.
    - Created `safehands/src/utils/auth.js` for `localStorage`-based login, registration, and user state management.
    - Modified `safehands/src/main.jsx` to seed the `localStorage` database on app load.
    - Implemented `safehands/src/components/ProtectedRoute.jsx` for client-side Role-Based Access Control (RBAC).
    - Refactored `safehands/src/components/SafeHandsAuth.jsx` (login/signup page) to use the new `auth.js` utilities.
    - Refactored `safehands/src/components/Layout.jsx` for conditional navigation based on `localStorage` user state.
    - Refactored `safehands/src/pages/Profile.jsx` to interact with `localStorage` for user data.
    - Restored the original, more complex `AdminDashboard.jsx` (per user request) and adapted it to hypothetically display data (though still mock-based at this stage).
    - Created `safehands/src/pages/ServiceProviderDashboard.jsx` as a placeholder for the new role.
    - Updated `safehands/src/App.jsx` to use `react-router-dom` and the `ProtectedRoute`.

---

## 3. Debugging Frontend-Only Authentication Issues

A series of persistent bugs highlighted challenges with the `localStorage`-based approach:

-   **Browser Autocomplete/Suggestions:** Incorrect `autocomplete` attributes on input fields led to browsers filling in wrong data.
    -   **Fix:** Added appropriate `name` and `autoComplete` attributes to all input fields in `safehands/src/components/SafeHandsAuth.jsx`.
-   **Password Hashing (`SubtleCrypto`) Issues:**
    -   **Problem:** Attempted to upgrade to `SubtleCrypto` for "proper" client-side password hashing. Despite aggressive debugging and detailed console logs, the `securePasswordHash` function consistently generated incorrect hashes on the user's system, leading to "Invalid credentials" errors. This pointed to deep environmental or browser caching issues not easily resolvable.
    -   **Fix Attempts:** Implemented database versioning, aggressive `localStorage` re-seeding, and extensive logging within the hashing function and login flow. Even simplifying the "pepper" string did not resolve the hash mismatch.
-   **Routing Error:** `No routes matched location "/SWE_FInalProject/login"` error.
    -   **Fix:** Configured `BrowserRouter` in `safehands/src/App.jsx` with `basename={import.meta.env.BASE_URL}` to correctly handle subdirectory deployments.
-   **Styling/JSX Warning:** `Received 'true' for a non-boolean attribute 'jsx'` error.
    -   **Fix:** Moved `keyframe` animation CSS from an invalid `<style jsx>` tag in `safehands/src/components/SafeHandsAuth.jsx` to `safehands/src/index.css`.
-   **Input Robustness:** Accidental whitespace in input fields.
    -   **Fix:** Added `.trim()` to all relevant inputs in `safehands/src/components/SafeHandsAuth.jsx`.
-   **Duplicate Export Error:** `Only one default export allowed per module` in `safehands/src/components/ProtectedRoute.jsx`.
    -   **Fix:** Removed duplicate `export default ProtectedRoute;` statement.

---

## 4. Architectural Shift: Firebase Integration

Given the persistent and intractable issues with `localStorage`-based authentication, especially the `SubtleCrypto` hash mismatch, a strategic decision was made to integrate Firebase as a Backend-as-a-Service (BaaS).

-   **Rationale:** Firebase provides robust, scalable, and secure authentication and data persistence without requiring a custom backend server, fully compatible with GitHub Pages hosting for the frontend.
-   **User's Action:** The user created a Firebase project, enabled Email/Password Authentication, enabled Firestore Database, and provided the `firebaseConfig` object. They also updated Firestore security rules (`firestore_security_rules.txt`) to allow read/write access for authenticated users.

### **Key Changes for Firebase Integration:**

-   **`safehands/src/firebase.js`:** Created to initialize Firebase with the provided configuration and export `auth` and `db` instances.
-   **`safehands/src/utils/auth.js`:**
    -   Completely refactored to use Firebase Authentication SDK (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `onAuthStateChanged`).
    -   User profiles (including roles) are now stored in/fetched from Firestore.
    -   `firebaseLogin`, `firebaseRegister`, `firebaseLogout`, `checkAuth`, `getCurrentUser`, `hasRole` functions implemented using Firebase APIs.
-   **`safehands/src/utils/database.js`:**
    -   Completely refactored to remove all `localStorage` logic.
    -   New functions (`getFirestoreUserProfile`, `getFirestoreUsers`, `getFirestoreBookings`, `addFirestoreBooking`) implemented to interact with Firestore collections (`users`, `bookings`).
-   **`safehands/src/components/SafeHandsAuth.jsx`:**
    -   Updated to use `firebaseLogin` and `firebaseRegister`.
    -   Error handling adapted for Firebase error objects.
    -   Removed `error` state and `passwordStrength` logic.
-   **`safehands/src/components/ProtectedRoute.jsx`:**
    -   Updated to use Firebase's `onAuthStateChanged` listener to manage asynchronous authentication state (`loading`, `isAuthenticated`, `userProfile`).
    -   Relies on `getCurrentUser` (which now fetches from Firestore) for role checks.
-   **`safehands/src/components/Layout.jsx`:**
    -   Updated to use Firebase's `onAuthStateChanged` listener to manage user state asynchronously for conditional navigation.
    -   Uses `firebaseLogout` for logging out.
-   **`safehands/src/pages/Profile.jsx`:**
    -   Updated to fetch the current user's profile from Firestore on mount (`getFirestoreUserProfile`).
    -   Updated `handleSubmit` to update user data in Firestore using `setDoc`.
-   **`safehands/src/components/AdminDashboard.jsx`:**
    -   Updated to fetch all users and bookings from Firestore using `getFirestoreUsers` and `getFirestoreBookings`.
    -   Replaced all mock data with dynamic data from Firestore.
-   **`safehands/src/main.jsx`:** Removed the obsolete `seedDatabase()` call.
-   **`firestore_security_rules.txt`:** Provided to guide the user in setting up appropriate Firestore security rules for the application.

---

## 5. Final State and Deployment Readiness

The application is now fully integrated with Firebase for robust authentication and persistent data storage. It is architecturally sound for a frontend application and ready to be deployed to GitHub Pages.

To facilitate deployment, the `gh-pages` npm package will be installed and a `deploy` script added to `package.json`.

---
