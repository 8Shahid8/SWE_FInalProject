# Secure Software Engineering Project: Course Alignment & Guidance

## 📚 **Course Context: Secure Software Engineering**

This project is undertaken within the context of a Secure Software Engineering course, focusing on principles and practices for developing robust, secure, and privacy-aware software systems. The course covers key areas such as:

*   **Software Development Lifecycle (SDL) & Security Integration**
*   **Software Vulnerabilities, Prediction, and Assessment** (e.g., SQL Injection, Code Injection)
*   **Software Security Requirements**
*   **Secure Coding Practices** (I, II, III)
*   **Threat Modelling** (with Stride, UML)
*   **Code Review & Static Analysers**
*   **Penetration Testing & Fuzzing**
*   **DevSecOps**

The Group Project, "Home Services.pdf", and associated deliverables (Report, Reflection, Demo) are central to demonstrating practical application of these concepts.

---

## 🚀 **Project Overview: Current State & Implemented Features**

Our "SafeHands" home services application has achieved significant progress, establishing a robust foundation aligned with secure development principles:

1.  **Firebase Backend & Security:**
    *   Fully functional backend using Firebase Authentication (for user identity) and Cloud Firestore (for data storage).
    *   **Strong Firestore Security Rules** are in place, providing server-side enforcement of data access based on user roles and data ownership.
2.  **Role-Based Access Control (RBAC):**
    *   **Complete Implementation:** Three distinct roles: `admin`, `service-provider`, `user` (client).
    *   **Role Selection at Signup:** Users choose their role during registration.
    *   **Role-Aware UI/UX:** Dynamic navigation and dashboard access based on the logged-in user's role.
    *   **Admin User Management:** Admins can view all users and securely update their roles (e.g., promoting a user to a service provider).
3.  **Service Provider Dashboard:**
    *   Intuitive, tab-based interface displaying assigned bookings in real-time, organized by service type.
    *   Providers can view client names, booking details, and update booking statuses (`confirmed`, `accepted`, `in-progress`, `completed`).
    *   **"Report Positive Test" button (UI ready):** Marks the initiation point for the critical contact tracing workflow.
4.  **Client Booking Workflow:**
    *   All core service pages (`HomeCleaning`, `GroceryDelivery`, `FoodDelivery`, `ParcelDelivery`, `MedicationDelivery`, `Covid19Testing`, `LaundryService`, `PetCare`) now support booking functionality.
    *   **Anonymous Token Generation (Privacy-by-Design):** Each new booking automatically generates and stores a unique `contactToken`, ensuring client identity is not directly linked in tracing logs.
5.  **Admin Booking Assignment:**
    *   Admins can view all pending service requests and assign them to specific service providers using a dropdown directly within the admin dashboard.

---

## ✅ **Alignment with Academic Criteria & Mandatory Requirements**

Our current progress directly addresses several mandatory requirements for a High Distinction, demonstrating a strong alignment with the course's secure software engineering principles:

| ID | Requirement                                  | Status      | Course Alignment                                                                                         |
|----|----------------------------------------------|-------------|----------------------------------------------------------------------------------------------------------|
| **R1** | **Secure Authentication**                    | **COMPLETE**| Leverages Firebase Auth (industry standard), demonstrating understanding of secure identity management (Week 1, Week 3).|
| **R2** | **Role-Based Access Control (RBAC)**         | **COMPLETE**| Implemented and enforced via Firestore Rules, showcasing least privilege principle and access control design (Week 3, Week 5). |
| **R3** | **Privacy-Preserving Contact Tracing**       | **IN PROGRESS**| Anonymous token generation is **complete**, directly addressing privacy-by-design and data minimization (Week 1, Week 3, Week 5). |
| **R4** | **Automated Quarantine Enforcement**         | **PENDING** | UI for "Report Positive Test" is ready. Core backend logic to identify and quarantine exposed clients is the next critical step (Week 3, Week 5).|
| **R5** | **Input Validation & Injection Prevention**  | **COMPLETE**| Client-side form validation, Firestore's NoSQL nature preventing SQLi, and rules-based data validation (Week 2, Week 3, Week 5). |
| **R6** | **Session Management (Bonus)**               | Not Started | Addressed implicitly by Firebase Auth, but explicit client-side timer could be added for completeness.      |
| **R7** | **Audit Logging (Bonus)**                    | Not Started | Planned for logging critical actions, directly supporting forensic capabilities (Week 3, Week 8).           |

---

## 💡 **Suggestions & Guidance for Next Steps (Course-Aligned)**

To fully complete this academic project and ensure it comprehensively meets the Secure Software Engineering course criteria, the following are the highest priorities:

### **Phase 1: Complete Automated Quarantine Enforcement (CRITICAL for R3 & R4)**

This is the most critical remaining functional requirement and directly demonstrates your understanding of security requirements and threat mitigation in a real-world scenario.

1.  **Implement Backend Logic for "Report Positive Test" (Firebase Cloud Function):**
    *   **Alignment:** This demonstrates server-side validation and secure logic execution (Week 5: Secure Coding, Week 6: Threat Modelling mitigation).
    *   **Action:** When a service provider clicks "Report Positive Test", this **must** trigger a Firebase Cloud Function. This function will:
        *   Verify the caller's identity and role (provider).
        *   Query the `bookings` collection to identify all clients (`clientId`) who received services from this provider within a specified risk window (e.g., 14 days prior to the `bookingDate` of the booking that triggered the report).
        *   For each identified client, create a new document in an `/exposures` Firestore collection.
        *   **Privacy-by-Design (R3):** Ensure `exposures` documents contain **ONLY** `exposedClientId` (UID), `exposureDate` (from the relevant booking), and `status` (`'active'`). **Crucially, do NOT include PII like names, addresses, or phone numbers directly in this collection.** Use the `contactToken` if needed to link back to a booking, but not for direct identification in the exposure record.
2.  **Implement Client-Side Quarantine Enforcement:**
    *   **Alignment:** Demonstrates client-side security mechanisms and UX considerations for security-sensitive events (Week 5: Secure Coding, Week 3: Software Security Requirements).
    *   **Action:**
        *   Modify `Layout.jsx` or a global state management mechanism to check if the `currentUser` has an `active` entry in the `/exposures` collection.
        *   If quarantined, display a clear, prominent "quarantine banner" across the application.
        *   **Disable all service booking forms** for the quarantined client. This prevents them from inadvertently spreading the infection further.

### **Phase 2: Testing, Reporting & Deliverables (CRITICAL for all assignments)**

1.  **Comprehensive Testing:**
    *   **Alignment:** Directly addresses the emphasis on testing in the SDL (Week 1, Week 8: Code Review, Static Analysers, Week 10: Penetration Testing).
    *   **Action:** Thoroughly test the entire application workflow, paying special attention to security aspects:
        *   Test all role permissions: Can a client access admin pages? Can a provider access another provider's bookings?
        *   Test the full quarantine cycle: Book service -> Admin assigns -> Provider reports positive -> Client sees banner/disabled booking.
        *   Attempt to create bookings with invalid data (R5).
2.  **Finalize Academic Deliverables:**
    *   **Alignment:** Direct requirement of the course (Week 7: Group Project Report, Individual Reflection, Project Demo & Presentation).
    *   **Action:**
        *   **Group Project Report:** Clearly document each implemented requirement (R1-R5). Explain *how* Firebase/React implements them. Include all Firestore security rules in an appendix.
        *   **Individual Reflection:** Detail your specific contributions and learnings from securing the application.
        *   **Project Demo Video:** Create a compelling video demonstrating all 5+ security features in action, especially the quarantine enforcement. *The demo should explicitly show the steps: Client books -> Admin assigns -> Provider reports positive -> Client is quarantined.*

### **Phase 3: Consider Bonus Features (If Time Permits & Course-Relevant)**

1.  **Audit Logging (R7):** Implementing this (e.g., Firebase Cloud Functions for logging critical events like role changes, successful logins, exposure reports) directly relates to forensic capabilities and security monitoring (Week 3: Security Requirements, Week 8: Static Analysers).
2.  **User Booking History:** Allow clients to view their past and upcoming bookings on their profile page.
3.  **Real-time Admin Dashboard:** Convert the Admin Dashboard's booking list to use real-time listeners for instant updates on new requests or status changes.

By focusing on these steps, especially the Automated Quarantine Enforcement, your project will comprehensively demonstrate strong secure software engineering practices, ensuring it meets all academic requirements.