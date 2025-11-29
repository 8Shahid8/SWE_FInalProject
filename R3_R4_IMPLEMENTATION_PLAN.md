# R3 & R4 Implementation Plan: Automated Contact Tracing & Quarantine

## 🎯 **Objective**
This document outlines the step-by-step process to implement the backend logic for a service provider reporting a positive COVID-19 test, and the corresponding frontend logic to notify and restrict exposed clients. This will fulfill the core academic requirements for **R3: Privacy-Preserving Contact Tracing** and **R4: Automated Quarantine Enforcement**.

---

## 💡 **The Process: An Overview**
For this feature to be secure and automated, we must use a **Firebase Cloud Function**. This moves the sensitive logic of identifying exposed clients to a trusted, server-side environment.

The process is as follows:
1.  **Setup Firebase Cloud Functions:** A one-time setup to enable backend code.
2.  **Write the Cloud Function:** Create the backend logic that runs when a provider reports a positive test.
3.  **Deploy the Cloud Function:** Upload the backend logic to Firebase's servers.
4.  **Connect the Frontend:** Update the "Report Positive Test" button to trigger the Cloud Function.
5.  **Enforce Quarantine on the Client:** Implement the UI changes (banner, disabled forms) for exposed users.
6.  **Secure the New Data:** Update Firestore security rules for the new `/exposures` collection.

---

### **Step 1: Setup Firebase Cloud Functions**
First, we need to initialize the Cloud Functions environment in your project.

**Action:** Run the following command in your project's **root directory**:
```bash
firebase init functions
```
**Answer the prompts as follows:**
1.  **"Please choose an option:"** -> `Use an existing project`
2.  **"Select a default Firebase project for this directory:"** -> Choose your `safehands-` project.
3.  **"What language would you like to use to write Cloud Functions?"** -> `JavaScript`
4.  **"Do you want to use ESLint...?"** -> `No`
5.  **"Do you want to install dependencies with npm now?"** -> `Yes`

---

### **Step 2: Write the `reportExposure` Cloud Function**
This is the secure backend logic that performs the contact tracing.

**Action:** A new folder named `functions` will have been created. Open the `functions/index.js` file and **replace its entire content** with this code:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.reportExposure = functions.https.onCall(async (data, context) => {
  // 1. Verify the user calling this function is an authenticated service-provider.
  if (!context.auth || !context.auth.token.role === 'service-provider') {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Request must be made by an authenticated service provider."
    );
  }

  const providerId = context.auth.uid;
  const db = admin.firestore();

  try {
    // 2. Define the risk window (e.g., last 14 days).
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // 3. Find all recent bookings for this provider.
    const bookingsSnapshot = await db.collection("bookings")
      .where("providerId", "==", providerId)
      .where("bookingDate", ">=", twoWeeksAgo)
      .get();

    if (bookingsSnapshot.empty) {
      return { success: true, message: "No recent clients to notify." };
    }

    const exposedClientIds = new Set();
    bookingsSnapshot.forEach(doc => {
      exposedClientIds.add(doc.data().clientId);
    });

    // 4. Create a document in the /exposures collection for each exposed client.
    const batch = db.batch();
    exposedClientIds.forEach(clientId => {
      const exposureRef = db.collection("exposures").doc(clientId);
      // This document contains NO PII, just the quarantine status.
      batch.set(exposureRef, {
        status: "active",
        exposureDate: new Date(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    await batch.commit();
    return { success: true, message: `Notified ${exposedClientIds.size} client(s).` };

  } catch (error) {
    console.error("Error in reportExposure function:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while processing the report."
    );
  }
});
```

---

### **Step 3: Deploy the Cloud Function**

**Action:** Run this command from your project's **root directory** to upload the function to Firebase:
```bash
firebase deploy --only functions
```

---

### **Step 4: Connect the Frontend Button**
Now, we'll update the "Report Positive Test" button to call our new backend logic.

**Action:** I will modify `safehands/src/pages/ServiceProviderDashboard.jsx` to call this Cloud Function.

---

### **Step 5: Implement Client-Side Quarantine Enforcement**
We need a way for the app to know if the current user is quarantined.

**Action 1:** I will add a new real-time listener function to `safehands/src/utils/database.js` called `onExposureUpdateForUser`.

**Action 2:** I will modify `safehands/src/components/Layout.jsx` to:
*   Use the new `onExposureUpdateForUser` listener.
*   Keep a `quarantineStatus` state.
*   Conditionally render a prominent banner at the top of the page if the user is quarantined.

**Action 3:** I will modify a sample booking form (e.g., `HomeCleaning.jsx`) to disable the "submit" button if the user is quarantined.

---

### **Step 6: Secure the `/exposures` Collection**
Finally, we must update our security rules.

**Action:** I will add the following rule to `firestore.rules` to protect the new collection:
```js
    // Exposures Collection (for contact tracing):
    match /exposures/{userId} {
        // READ: Only the exposed user or an admin can read the document.
        allow read: if request.auth != null && 
                     (request.auth.uid == userId || getUserRole(request.auth.uid) == 'admin');
        
        // WRITE: No one can write directly from the client. This will be handled by the Cloud Function.
        allow write: if false;
    }
```
This ensures a user's exposure status remains private and can't be tampered with.