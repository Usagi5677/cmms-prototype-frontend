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
_(Screenshots will be added here)_

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
