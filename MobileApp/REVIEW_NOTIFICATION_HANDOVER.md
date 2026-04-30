# Review & Notification Module Handover

## Overview

This module adds customer reviews and ERP notifications with the same demo style as the Customer Management module:

- JWT login with `admin` and `sales`
- Review create/list/stats for both roles
- Review approve/reject/delete for admin
- Automatic notification when a review is created or its status changes
- Low ratings (`1` or `2`) automatically create an urgent admin notification
- Review search and status filters for quick lookup
- Admin-created manual notifications
- Per-user read/unread notification tracking
- Deterministic seed data on every backend start

## Setup

Backend:

```bash
cd MobileApp/backend
npm install
npm run dev
```

Mobile:

```bash
cd MobileApp/mobile
npm install
npx expo start --lan
```

The current API URL is configured in:

```text
MobileApp/mobile/src/api/apiClient.js
```

Current value:

```javascript
const DEV_URL = 'http://172.28.9.55:5000/api';
```

Change the IP if your laptop Wi-Fi IP changes.

## Demo Login

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin123` | Admin |
| `sales` | `sales123` | Sales |

## API Endpoints

| Method | Endpoint | Auth | Admin Only | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/login` | No | No | Login and receive JWT |
| `GET` | `/api/reviews` | Yes | No | List reviews |
| `GET` | `/api/reviews/stats` | Yes | No | Review totals and average rating |
| `GET` | `/api/reviews/:id` | Yes | No | Get one review |
| `POST` | `/api/reviews` | Yes | No | Create review |
| `PUT` | `/api/reviews/:id` | Yes | Yes | Update review/status |
| `DELETE` | `/api/reviews/:id` | Yes | Yes | Delete review |
| `GET` | `/api/notifications` | Yes | No | List role-visible notifications |
| `POST` | `/api/notifications` | Yes | Yes | Create manual notification |
| `PUT` | `/api/notifications/:id/read` | Yes | No | Mark one notification as read |
| `PUT` | `/api/notifications/read-all` | Yes | No | Mark all visible notifications as read |
| `DELETE` | `/api/notifications/:id` | Yes | Yes | Delete notification |

## Seeded Data

On every backend start, the seeder wipes and recreates:

- 2 users
- 4 demo reviews
- 2 demo notifications

This is intentional for viva/demo consistency.
