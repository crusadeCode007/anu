# University ERP Module - Customer Management & Segmentation System

This is a fully standalone, integration-ready module for a University Group ERP System focusing on B2B Customer Management and Segmentation.

It features a Node.js + Express backend running natively with MongoDB Atlas and a React Native Expo Go compatible frontend with full CRUD operations, image uploads, dynamic segmentation, and dashboard analytics.

## Directory Structure
- `/backend` - Node.js Express server
- `/mobile` - Expo React Native application

---

## 🚀 1. Backend Setup Guide

The backend handles all business logic, securely storing data and computing the tiering logic dynamically.

### Requirements
- Node.js (v18+)
- MongoDB Atlas cluster URL

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Update the `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/crm_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_for_viva
```
*Note: The system will run perfectly with a local mongodb (`mongodb://127.0.0.1:27017/crm_db`) as currently configured if you do not have an Atlas URL ready.*

### Running the Server
```bash
npm run dev
```
**Upon first start up, the backend will automatically seed:**
- 1 Admin user (`username: admin`, `password: admin123`)
- 3 Segment Rules (Normal, Gold, Platinum)
- 10 Mock Customers

---

## 📱 2. Mobile Setup Guide (Expo Go)

The mobile app has a sleek dark-mode UI with robust error-prevention logic.

### Requirements
- Node.js (v18+)
- Expo Go App on your physical device (iOS/Android)
- Your computer and mobile device **must be on the same WiFi network**.

### Installation
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Connecting to the Local API
You MUST configure the mobile app to talk to your local backend server's IP address.
1. Find your computer's local IP address (e.g., `192.168.1.5`).
2. Open `mobile/src/api/apiClient.js`
3. Update line 5:
   ```javascript
   const DEV_URL = 'http://YOUR.IP.ADDRESS.HERE:5000/api'; 
   ```

### Running the App
```bash
npx expo start
```
Scan the QR code with the Expo Go app.

---

## 📡 3. Dev vs Production Switching

The mobile app relies on the `isProd` boolean in `mobile/src/api/apiClient.js` to switch targets.
- **For Local Testing:** Set `const isProd = false;` (uses Local IP)
- **For Production:** Set `const isProd = true;` (uses Render URL)

---

## 🧪 4. Postman API Testing Guide

All protected routes require a JWT token in the header.

### Authentication
- `POST /api/auth/login`
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns your `token`.

### Usage
Include header for all subsequent calls: 
`Authorization: Bearer <your_token>`

### Customer Endpoints
- `GET /api/customers` - Returns paginated customer list (7 per page) with dynamically computed segments. Append `?page=1&search=term`.
- `POST /api/customers` - Form-Data. Keys: `companyName`, `email`, `phone`, optionally `image` (File).
- `PUT /api/customers/:id` - Form-Data. Optionally `removeImage`='true' to delete image.
- `DELETE /api/customers/:id` - Deletes a target customer.
- `POST /api/customers/:id/purchase` - Body: `{ "amount": 5000 }` - Instantly increments purchase amount.

### Dashboard & Rules
- `GET /api/dashboard` - Returns aggregation metrics for PieChart.
- `GET /api/rules` - Returns default active logic rules.
- `PUT /api/rules/:id` - Updates specific segmentation tier thresholds.

---

## ☁️ 5. Deployment Guide

### Backend (Render)
1. Push your code to GitHub.
2. Create a "Web Service" on Render.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add your Environment Variables (`MONGO_URI` with Atlas URL, `JWT_SECRET`).

### Mobile
1. Once your backend is running on Render, grab the URL (e.g., `https://my-api.onrender.com`).
2. Go to `mobile/src/api/apiClient.js`.
3. Set `PROD_URL` to `https://my-api.onrender.com/api`.
4. Change `isProd = true`.

🎯 *This application is ready for the University Viva. Zero missing dependencies. Built with strict null-safety frontend checks.*
