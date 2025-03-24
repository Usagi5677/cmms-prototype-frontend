# CMMS - Asset Management System

A comprehensive **Computerized Maintenance Management System (CMMS)** designed for asset tracking, maintenance scheduling, and task management. This system helps organizations efficiently manage their machinery, vessels, vehicles, and other assets by providing structured workflows, checklists, and utilization insights.

---

## 🚀 Features

### 🏠 Dashboard
- View zones, locations, divisions, hull types, brands, and engines.
- See assigned entities, users, and tasks.
- Monitor asset utilization for vehicles, vessels, and machines.

### 📋 Tasks
- View assigned tasks categorized by **daily** and **weekly** schedules.

### ⚠️ Issues
- Track machines, assets, vessels, and vehicles with reported issues.

### 🔧 Maintenance
- View assets currently undergoing maintenance.

### 📊 Utilization
- Analyze breakdown frequencies for different asset types.

### 🚢 Assets
- View lists of **machinery, vessels, and vehicles**.

### 🗑️ Disposal
- Manage and track disposed assets.

### 👥 Users & Roles
- View all users and their roles.
- Create and manage roles with custom permissions.

### 📌 Assignments
- Bulk-assign assets to **users, divisions, locations, and brands**.

### 📑 Templates
- Create and store checklists for asset maintenance.

### 🛠️ Developer API
- Generate API keys with expiration and permissions.

### ⚙️ Configuration
- Modify asset-related settings (locations, zones, hull types, engines, inter-service colors, etc.).

### 🔍 Asset Details
- Detailed asset view with:
  - Assignment to users
  - Editable information
  - Checklists
  - Periodic maintenance
  - Spare part requests
  - Breakdown logs
  - Change history
  - Image gallery

### 🔔 Notifications & Automation
- **Cron jobs** for generating checklists at scheduled intervals.
- **Role-based access control (RBAC)** to restrict user actions based on assigned roles.

---

## 🛠️ Tech Stack

### Frontend
- **React** + **TypeScript**
- **GraphQL** with **Apollo Client**

### Backend
- **NestJS** + **TypeScript**
- **Apollo GraphQL**
- **Redis** (caching & background jobs)
- **Prisma** (database ORM)
- **PostgreSQL**

---

## 📸 Screenshots
| ![Screenshot 2025-03-24 at 16-00-55 CMMS](https://github.com/user-attachments/assets/5fb18ef1-4c36-4d12-b3c4-475781672714) | ![Screenshot 2025-03-24 at 15-58-13 CMMS](https://github.com/user-attachments/assets/09c900be-cee9-4be8-adf7-edb1e8543a9c) | ![Screenshot 2025-03-24 at 15-58-01 CMMS](https://github.com/user-attachments/assets/c41dbaae-5388-469d-bd89-f6dd7981d5eb) |
|---|---|---|
| ![Screenshot 2025-03-24 at 15-57-54 CMMS](https://github.com/user-attachments/assets/0f1b14fd-dc98-451f-8ac6-9db93dfeaef9) | ![Screenshot 2025-03-24 at 15-57-48 CMMS](https://github.com/user-attachments/assets/91cc5ee5-719f-4a55-a6a4-5d92e12e7f0c) | ![Screenshot 2025-03-24 at 15-57-41 CMMS](https://github.com/user-attachments/assets/ec4d9885-d5e6-47c0-8fc9-044e4e301894) |
| ![Screenshot 2025-03-24 at 15-57-31 CMMS](https://github.com/user-attachments/assets/76e15510-2236-46d2-a745-a4f2cd662321) | ![Screenshot 2025-03-24 at 15-57-08 CMMS](https://github.com/user-attachments/assets/2818765c-777c-4255-b8e7-7287bf13bdd9) | ![Screenshot 2025-03-24 at 15-56-59 CMMS](https://github.com/user-attachments/assets/4900d222-f54d-461f-b759-8de863e896d8) |
| ![Screenshot 2025-03-24 at 15-56-36 CMMS](https://github.com/user-attachments/assets/4779ee02-2351-4fa1-a1fd-2098fa68b132) | ![Screenshot 2025-03-24 at 15-55-31 CMMS](https://github.com/user-attachments/assets/d9d9eeff-f71d-4adb-8048-2c539c657b9e) | ![Screenshot 2025-03-24 at 15-55-18 CMMS](https://github.com/user-attachments/assets/8768644b-e2e8-4c1a-8fb7-79202a6b8608) |
| ![Screenshot 2025-03-24 at 15-54-39 CMMS](https://github.com/user-attachments/assets/8e47f3b3-a4d7-41c0-b7f8-55f05930a31d) |  |  |

---

## 🏆 My Role  

I was responsible for both **frontend and backend development**. This repository contains the **frontend** part of the project, built with **React + TypeScript**. Backend part (available [here](https://github.com/Usagi5677/cmms-prototype-backend)).

Key contributions:
- Implemented UI components and state management
- Integrated **Apollo GraphQL** for API calls
- Developed **real-time notifications** using **GraphQL subscriptions & Redis**
- Designed and implemented **role-based access control**
- Built dashboard features and filtering functionality

---

## 📌 Notes

The backend is required for full functionality.
Redis is needed for real-time notifications.
If you are using a different API URL, update the .env file accordingly.

---

## 📄 License

This project is for portfolio purposes. Do not use it for commercial projects without permission.


## 🚀 Setup & Installation


```sh
# Clone the repository
git clone https://github.com/Usagi5677/cmms-prototype-frontend.git
cd cmms-prototype-frontend

# Install dependencies
npm install

# Create a .env file in the root directory with the following:
echo "REACT_APP_API_URL=http://localhost:4000/graphql
REACT_APP_WEBSOCKET_URL=ws://localhost:4000/graphql
REACT_APP_RETURN_URL=http://localhost:3002
REACT_APP_APP_ID=
PORT=3002" > .env

# Start the development server
npm run dev
