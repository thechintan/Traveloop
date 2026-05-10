# Traveloop 🌍

Traveloop is a personalized, intelligent, and collaborative mobile platform that transforms the way individuals plan and experience travel. It empowers users to dream, design, and organize trips with ease through a mobile-first design.

## Architecture

The project is split into two primary directories:
- **`backend/`**: A Node.js and Express REST API powered by a local, purely native SQLite database.
- **`mobile/`**: A React Native mobile application built using Expo, featuring a premium dark-mode aesthetic.

---

## 🚀 Getting Started

### 1. Starting the Backend Server
The backend uses Node's built-in SQLite database, which means there are no C++ compilation steps required!

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with demo cities, activities, and users:
   ```bash
   node db/seed.js
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server will start running on `http://localhost:5000`.*

---

### 2. Starting the Mobile App
The mobile app is built with Expo SDK 54. 

1. Open a **new** terminal window and navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install the base npm packages (we use `--legacy-peer-deps` to bypass any strict React 19 versioning conflicts during installation):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Allow Expo to fetch the exact native modules matching the SDK version:
   ```bash
   npx expo install react react-native react-native-safe-area-context react-native-screens
   ```
4. Start the Expo development server:
   ```bash
   npx expo start --clear
   ```

You can now open the app on your phone using the **Expo Go** app, or press `a` in the terminal to launch an Android Emulator.

---

## 🔑 Demo Accounts

You can log into the mobile app instantly using the pre-configured demo accounts created during the database seeding step:

**User Account (Recommended)**
- **Email:** `demo@traveloop.com`
- **Password:** `demo123`

**Admin Account**
- **Email:** `admin@traveloop.com`
- **Password:** `demo123`

---

## 🛠 Tech Stack
- **Backend**: Node.js v24+, Express.js, `node:sqlite` (Built-in Relational DB), JSON Web Tokens (JWT) for authentication.
- **Mobile Frontend**: React Native, Expo (SDK 54), React Navigation v6, Axios, Lucide Icons.
