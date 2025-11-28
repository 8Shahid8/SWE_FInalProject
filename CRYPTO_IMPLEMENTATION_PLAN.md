# Plan: Upgrading to Cryptographic Hashing for Authentication

## 1. Objective

This plan details the steps required to replace the current simple `btoa` password encoding with a robust, one-way cryptographic hash for user registration and login. We will use the browser's built-in **`SubtleCrypto` API**, which is the modern standard for client-side cryptographic operations.

This upgrade will provide a more secure and technically impressive demonstration of password handling within our frontend-only application.

## 2. The Core Changes

The primary file to be modified is **`safehands/src/utils/auth.js`**. We will also need to update the `database.js` seed data and the `SafeHandsAuth.jsx` component to handle the asynchronous nature of the Crypto API.

---

## 3. Implementation Steps

### Step 1: Create the Secure Hashing Function

In `auth.js`, we will first create a new `async` function that takes a password and returns a secure SHA-256 hash.

```javascript
// A real cryptographic hashing function using the browser's built-in Crypto API
const securePasswordHash = async (password) => {
  const encoder = new TextEncoder();
  // A "pepper" is a secret value added to the password before hashing.
  const data = encoder.encode(password + 'a-strong-pepper-for-safehands'); 
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Convert the buffer to a hex string for easy storage
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
```

### Step 2: Update the Database with New Hashes

Because we are changing the hashing method, the old passwords stored in our seed data will no longer work. We must replace them with new, pre-computed SHA-256 hashes.

I will update **`safehands/src/utils/database.js`** with the new hashes for our default users:
- `user@safehands.com` (password: `password`)
- `admin@safehands.com` (password: `admin123`)

The `initialDB` object will be modified as follows:

```javascript
// The 'passwordHash' values will be replaced with real SHA-256 hashes.
const initialDB = {
  users: [
    {
      id: 1,
      email: 'user@safehands.com',
      passwordHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // "password"
      role: 'user',
      covidStatus: 'negative',
    },
    {
      id: 2,
      email: 'admin@safehands.com',
      passwordHash: '3a34027438218423e84915b225739e1b5850654be8e05c865778018a164b2848', // "admin123"
      role: 'admin',
      covidStatus: 'negative',
    },
  ],
  // ... rest of the database
};
```

### Step 3: Refactor `mockRegister` and `mockLogin` to be Asynchronous

Both registration and login functions must now be `async` to use the new `securePasswordHash` function.

**New `mockRegister` in `auth.js`:**
```javascript
export const mockRegister = async (userData) => {
  const db = getDB();
  // Await the result of the secure hashing function
  const passwordHash = await securePasswordHash(userData.password);

  const existingUser = db.users.find(u => u.email === userData.email);
  if (existingUser) {
    return { success: false, error: 'User with this email already exists.' };
  }

  const newUser = {
    id: Date.now(),
    email: userData.email,
    passwordHash, // Store the new secure hash
    name: userData.name,
    role: 'user',
    // ... other fields
  };

  db.users.push(newUser);
  saveDB(db);

  sessionStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true, user: newUser };
};
```

**New `mockLogin` in `auth.js`:**
```javascript
export const mockLogin = async (email, password) => {
  const db = getDB();
  // Hash the entered password to compare it with the stored hash
  const passwordHash = await securePasswordHash(password);

  const user = db.users.find(
    (u) => u.email === email && u.passwordHash === passwordHash
  );

  if (user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials' };
};
```

### Step 4: Update the UI Component to Handle `async` Functions

Finally, we need to update the `handleSignIn` and `handleSignUp` functions in **`safehands/src/components/SafeHandsAuth.jsx`** to use `async/await` syntax.

**New `handleSignIn` and `handleSignUp` in `SafeHandsAuth.jsx`:**
```javascript
  const handleSignIn = async () => { // <-- Mark as async
    setError('');
    const result = await mockLogin(signInData.email, signInData.password); // <-- Use await
    if (result.success) {
      // ... success logic
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleSignUp = async () => { // <-- Mark as async
    setError('');
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const result = await mockRegister({ // <-- Use await
      // ... user data
    });
    if (result.success) {
      // ... success logic
    } else {
      setError(result.error || 'Registration failed.');
    }
  };
```

By following these steps, we will create a much more secure and realistic authentication simulation that is still fully compatible with a serverless GitHub Pages deployment.
