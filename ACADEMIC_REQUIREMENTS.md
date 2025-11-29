# Academic Requirements for Secure Software Engineering Project

This document outlines the core academic requirements for the SafeHands application, based on the official project brief. It details the mandatory features, technical specifications, and deliverables required to achieve a High Distinction.

---

## 🎯 Official Project Goal
The primary objective is to design and implement a **privacy-by-design home services application** for the COVID-19 era. The application must:
- Allow users to book everyday services (e.g., plumbing, cleaning).
- Integrate **contact tracing** and **quarantine enforcement**.
- Minimize privacy risks while maintaining functionality, adhering to secure software engineering practices.

---

## ✅ Mandatory Features (for High Distinction)

### 1. At Least 5 Explicit Security/Privacy Requirements
These must be defined, implemented, and documented.

| ID | Requirement | Implementation Strategy (Firebase) |
|----|-------------|------------------------------------|
| **R1** | **Secure Authentication** | Use Firebase Authentication with email/password and hashed passwords. |
| **R2** | **Role-Based Access Control (RBAC)** | Define user roles (`client`, `provider`, `admin`) and enforce access rights using Firestore security rules. |
| **R3** | **Privacy-Preserving Contact Tracing** | Log contact events using anonymous tokens (e.g., `TKN-AB3F`) instead of Personally Identifiable Information (PII). |
| **R4** | **Automated Quarantine Enforcement** | Automatically flag exposed clients and disable their booking functionality when a provider reports a positive test. |
| **R5** | **Input Validation & Injection Prevention** | Implement client-side validation and leverage Firestore's NoSQL structure to prevent SQL injection. Sanitize all inputs. |
| **R6** | **Session Management (Bonus)** | Implement an automatic client-side logout timer (e.g., after 30 minutes of inactivity). |
| **R7** | **Audit Logging (Bonus)** | Log critical events such as bookings, logins, and exposure reports in a dedicated Firestore collection. |

### 2. Core Application Functionalities
- User registration with role selection (`client` / `provider`).
- Service booking functionality (selecting a service and date).
- A feature for service providers to report a "positive test."
- An automated notification and booking restriction for clients exposed to a positive case.
- An admin dashboard to view and manage service requests.

> **Critical Privacy Note:** Contact tracing logs must **never** store full names, addresses, or phone numbers. Only user IDs and anonymous tokens should be used to protect user privacy.

---

### 🛡️ 3. Technical Implementation Requirements

| Requirement | Action |
|---|---|
| **Backend** | Utilize **Firebase Firestore and Firebase Authentication**. The free tier is sufficient. |
| **Security Rules** | Implement Firestore security rules to enforce RBAC and ensure data is only accessible by authorized users. |
| **No PII in Tracing** | The contact tracing data collection should strictly contain non-identifiable data: `token`, `timestamp`, and `riskStatus`. |
| **Live Prototype** | The application must be deployed and functional. Using GitHub Pages for the frontend and Firebase for the backend is the recommended approach. |
| **Demo Video** | A video demonstrating all five core security features in action is mandatory. |

---

### 📄 4. Academic Deliverables

#### A. Group Project Report
- List and detail the 5+ security requirements.
- Present the system design, including UI/UX screenshots.
- Explain how each requirement is implemented using Firebase.
- Include the full Firestore security rules in an appendix.

#### B. Individual Reflection
- Describe your specific contributions to the project (e.g., "I implemented the privacy-preserving token system for contact tracing").
- Provide evidence of your work (code snippets, video timestamps).
- Reflect on the key learnings regarding secure software design.

#### C. Demonstration Video
- The video must clearly show the following workflow:
  1. A client registers, books a service, and receives an anonymous token.
  2. A provider registers and reports a positive test.
  3. The client logs back in, sees a quarantine alert, and finds the booking feature disabled.
  4. (Optional) An admin view showing exposure logs without any PII.

---

## 🚀 Immediate Action Plan

1.  **Set Up Firebase:** Create a project, enable Email/Password Authentication, and set up Firestore Database.
2.  **Connect Frontend:** Replace `localStorage` logic with Firebase SDK calls for registration, booking, and managing exposures.
3.  **Write Security Rules:** Implement Firestore rules to enforce access control (e.g., a user can only see their own bookings).
4.  **Test & Record:** Thoroughly test the implemented features and record a 3-5 minute demonstration video.
5.  **Write Reports:** Draft the group and individual reports, ensuring they align with the academic rubrics and clearly state how the requirements were met.
