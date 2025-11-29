# R3 & R4 Implementation Plan (Free Tier): Admin-Led Quarantine

## 🎯 **Objective**
This document outlines a revised, step-by-step process to implement contact tracing (R3) and quarantine enforcement (R4) **without using Firebase Cloud Functions**, ensuring the project remains on the free "Spark" plan. This approach uses a secure, admin-led workflow.

---

## 💡 **The Process: An Overview**
Instead of a fully automated backend function, we will create a secure, manual workflow where a trusted admin is responsible for initiating the quarantine process.

1.  **Provider Submits Report:** A provider reports a positive test, creating a "task" for the admin.
2.  **Admin Reviews Report:** The admin sees a list of all positive test reports in their dashboard.
3.  **Admin Processes Report:** The admin clicks a button to securely find and flag all exposed clients.
4.  **Client Is Quarantined:** The application's UI reacts to the flag, showing a banner and disabling booking functionality for the exposed client.
5.  **Secure with Rules:** Firestore Security Rules will ensure only the correct roles can perform each step.

---

### **Step 1: Provider "Report Positive Test" Action**
When a provider clicks the button, it creates a report document for the admin to review.

**Action:**
1.  Create a new `/exposure_reports` collection in Firestore (you can do this by simply writing the first document to it).
2.  I will modify `safehands/src/pages/ServiceProviderDashboard.jsx`.
3.  The `handleReportPositive` function will be updated to write a new document to `/exposure_reports` containing `{ providerId, providerName, reportTimestamp, status: 'pending' }`.

---

### **Step 2: Admin Dashboard - "Exposure Reports" Tab**
The admin needs a dedicated view to see and action these reports.

**Action:**
1.  I will modify `safehands/src/components/AdminDashboard.jsx` to:
    *   Add a new "Exposure Reports" tab to the sidebar navigation.
    *   Create a new component/view for this tab that fetches and displays all documents from the `/exposure_reports` collection.
    *   Each report in the list will have a "Process Report" button, which will be disabled if the report's `status` is already `'processed'`.

---

### **Step 3: Admin "Process Report" Logic**
This is the core of the manual contact tracing.

**Action:**
1.  In `AdminDashboard.jsx`, the "Process Report" button will trigger a new `handleProcessReport` function. This function will:
    *   Query the `bookings` collection for all bookings made by the reported `providerId` within the last 14 days.
    *   For each unique `clientId` found, it will create a new document in the `/exposures` collection with the structure `{ status: 'active', exposureDate: new Date() }`.
    *   After processing, it will update the original report document in `/exposure_reports` to set its `status` to `'processed'`.

---

### **Step 4: Implement Client-Side Quarantine Enforcement**
This part of the plan remains the same as the Cloud Function approach.

**Action:**
1.  I will create a new real-time listener function in `safehands/src/utils/database.js`: `onExposureUpdateForUser(userId, callback)`.
2.  I will modify `safehands/src/components/Layout.jsx` to use this listener and conditionally display a quarantine banner if the logged-in user is affected.
3.  I will modify the booking forms (e.g., `HomeCleaning.jsx`) to disable the submit button if the user is quarantined.

---

### **Step 5: Update Firestore Security Rules**
We need to add rules for our two new collections.

**Action:** I will update `firestore.rules` with the following:
```js
    // ... existing rules ...

    // Exposure Reports (for admin review):
    match /exposure_reports/{reportId} {
        // CREATE: A provider can create a report for themselves.
        allow create: if request.auth != null && request.resource.data.providerId == request.auth.uid;
        // READ, UPDATE: Only admins can read reports and update their status.
        allow read, update: if request.auth != null && getUserRole(request.auth.uid) == 'admin';
        allow delete: if false;
    }

    // Exposures Collection (for contact tracing):
    match /exposures/{userId} {
        // READ: Only the exposed user or an admin can read the document.
        allow read: if request.auth != null && 
                     (request.auth.uid == userId || getUserRole(request.auth.uid) == 'admin');
        
        // CREATE, UPDATE: Only an admin can create or update an exposure record.
        allow create, update: if request.auth != null && getUserRole(request.auth.uid) == 'admin';
        allow delete: if false;
    }
```
This ensures the entire workflow is secure and can only be performed by the appropriate roles, even without a Cloud Function.
