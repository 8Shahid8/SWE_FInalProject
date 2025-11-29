# Future Backend Transformation Plan: Aligning with Academic Requirements

## Executive Summary

The application currently runs on GitHub Pages with Firebase Authentication and basic Firestore profile storage. This document outlines a strategic plan to implement the **core academic requirements** of the project, focusing on privacy-by-design, contact tracing, and quarantine enforcement within a Firebase-centric, serverless architecture.

## Core Backend Philosophy

Our approach will continue to leverage Firebase as a Backend-as-a-Service (BaaS). This minimizes server-side code complexity and provides inherent scalability and security. Key services include:
-   **Firebase Authentication:** For secure user identity management (**R1**).
-   **Cloud Firestore:** For flexible, real-time data storage.
-   **Firebase Cloud Functions:** For executing secure, server-side logic.
-   **Firestore Security Rules:** For fine-grained, declarative access control (**R2, R5**).

---

## 🚀 Core Academic Feature Implementation Plan

This section details the implementation of the mandatory privacy and security features required for the project.

### 1. R3: Privacy-Preserving Contact Tracing (Anonymous Tokens)

**Goal:** To trace contacts without storing Personally Identifiable Information (PII) in logs.

-   **Actions:**
    -   **Anonymous Token Generation:** When a user books a service, a unique, non-identifiable token (e.g., `TKN-AB3F-CD89`) will be generated client-side.
    -   **Booking Record:** This token will be stored alongside the `clientId`, `providerId`, and `timestamp` in the `/bookings` collection in Firestore. The booking document will **not** contain names or addresses, only user IDs.
    -   **Data Structure (`/bookings/{bookingId}`):**
        ```json
        {
          "clientId": "user_uid_123",
          "providerId": "provider_uid_456",
          "serviceType": "Home Cleaning",
          "bookingDate": "2025-12-15T10:00:00Z",
          "status": "confirmed",
          "contactToken": "TKN-AB3F-CD89"
        }
        ```

### 2. R4: Automated Quarantine Enforcement

**Goal:** To automatically disable booking privileges for clients who have been exposed to a service provider who later tests positive.

-   **Actions:**
    -   **"Report Positive" Feature:** A service provider will have a button in their dashboard to "Report Positive Test."
    -   **Trigger Cloud Function:** This button will trigger a Firebase Cloud Function (`reportExposure`).
    -   **Cloud Function Logic (`reportExposure`):**
        1.  **Verify Caller:** The function will first verify that the caller is an authenticated `service-provider`.
        2.  **Query Bookings:** It will query the `/bookings` collection to find all bookings associated with the `providerId` within the last 14 days.
        3.  **Log Exposures:** For each recent booking, it will create a new document in an `/exposures` collection. This document will log the exposure **anonymously**, containing only the client's ID and a timestamp.
    -   **Data Structure (`/exposures/{exposureId}`):**
        ```json
        {
          "exposedClientId": "user_uid_123",
          "exposureDate": "2025-12-15",
          "quarantineStatus": "active"
        }
        ```
    -   **Client-Side Enforcement:** The frontend application (e.g., in `ProtectedRoute.jsx` or a custom hook) will query the `/exposures` collection for the current user's ID. If an `active` quarantine record is found, the UI will display a warning banner and all booking functionality will be disabled.

### 3. R2 & R5: RBAC and Input Validation via Firestore Security Rules

**Goal:** To enforce strict access control and data validation on the server side.

-   **Actions:**
    -   **Implement Strict Rules:** Write and deploy comprehensive Firestore security rules.
    -   **Example Rules:**
        -   **/users/{userId}:** A user can only read/write their own document. An admin can read any user document.
        -   **/bookings/{bookingId}:** A user can only create a booking for themselves. A user or provider can only read a booking if their UID is in the `clientId` or `providerId` field.
        -   **/exposures/{exposureId}:** A user can only read an exposure document if their UID matches the `exposedClientId`. Cloud Functions will have privileged write access.
        -   **Input Validation:** Rules will validate data types, lengths, and formats upon write operations to prevent malformed data (**R5**).

---

## Broader Functional Enhancements

### Admin Dashboard Transformation

-   **Actions:**
    -   **User Management:** Implement UI to change user roles or disable accounts (via Cloud Functions).
    -   **Service Request Management:** Add UI to view, filter, and assign service requests.
    -   **Privacy-Aware Logging View:** The admin dashboard will be able to view the `/exposures` collection to demonstrate that contact tracing logs are successfully being created **without any PII**, fulfilling a key requirement for the project demo.

### All Services Transformation (Bookings & Services)

-   **Actions:**
    -   **Service Request Forms:** Implement detailed forms for users to request services, which will create documents in the `/bookings` collection as described in the academic plan.
    -   **Provider & User Views:** Develop UI for providers to see assigned tasks and for users to track the status of their services.

### Assignment-Specific Security Feature Integration

-   **Actions:**
    -   **Audit Trails:** Use Cloud Functions to log every significant action (e.g., booking created, exposure reported) to an immutable `/audit` collection for administrative review.
    -   **Data Validation:** In addition to client-side checks, enforce strict data validation within all Cloud Functions before writing to the database.

## Prioritized Initial Next Steps

1.  **Implement Anonymous Token Booking:** Modify the booking form to generate and save the `contactToken` with each new booking.
2.  **Create `reportExposure` Cloud Function:** Set up the Firebase Cloud Functions environment and deploy the `reportExposure` function.
3.  **Implement "Report Positive" UI:** Add the button to the service provider's dashboard to trigger the function.
4.  **Implement Client-Side Quarantine Check:** Add the logic to the frontend to check the `/exposures` collection and disable booking functionality if the user is under quarantine.
5.  **Write and Deploy Firestore Security Rules:** Draft and deploy the security rules for the `/users`, `/bookings`, and `/exposures` collections.