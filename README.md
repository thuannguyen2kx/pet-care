# 🐾 PetCare – Pet Care & Booking Management System

**PetCare** is a full‑stack web application that simulates a real‑world **pet care service platform** (pet spa / pet clinic).

This project is built as a **portfolio project for Junior Frontend / Full‑stack Developer roles**, with a strong focus on:

- Building complete end‑to‑end features
- Applying React & TypeScript in a real product context
- Understanding and implementing real business workflows

---

## 🎯 Project Goals

- Apply **React / TypeScript / API integration** in a real‑world system
- Practice **state management, data fetching, authentication**
- Organize code using a **feature‑based architecture**
- Demonstrate product thinking, not just isolated UI components

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

- Login / logout with JWT
- Role‑based access control:
  - Admin
  - Employee
  - Customer

- Protected routes and role‑based UI rendering

### 🐶 Pet Management

- Customers can manage multiple pets
- Store pet information:
  - Breed, weight, gender
  - Date of birth

- Track care history and vaccinations

### 🛎️ Booking System

- Customers can book services based on:
  - Pet
  - Service
  - Employee

- Booking status workflow:
  - Pending
  - Confirmed
  - Completed
  - Cancelled

- Service snapshot stored at booking time (price & duration)
- Customer reviews after service completion

### 👨‍⚕️ Employee & Schedule

- Employee profile management
- Daily and weekly working schedules
- Designed to support availability validation and future expansion

### 🌐 Social Features

- Users can create posts about their pets
- Comment and reaction system
- Engagement statistics

### 🛠️ Admin Dashboard

- User management
- Service management
- Booking overview
- Social content moderation

---

## 🧱 Tech Stack

### Frontend

- React 19
- React Router
- TypeScript
- Tailwind CSS
- React Query

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication

---

## 🗂️ Frontend Structure

```
src/
├── app/            # App bootstrap & global providers
├── features/       # Core business features (domain-driven)
├── routes/         # Route definitions & access control
├── services/       # API services & external integrations
├── shared/         # Reusable UI, hooks, utilities
├── stores/         # Global state management
├── styles/         # Global styles & theme config
├── resources/      # Static configs, constants, enums
└── main.tsx        # Application entry point
```

This structure follows a **feature-first (domain-driven)** approach rather than a traditional layer-based one.

This structure helps:

- Keep the codebase scalable and readable
- Make team collaboration easier
- Frontend Architecture: see `frontend/README.md`

---

## 🌱 Seed Data

The project includes a **seed script** to generate demo data:

- Users with multiple roles
- Pets
- Services
- Bookings
- Social posts

```bash
npm run seed:dev
```

---

## ⏱️ How to Review This Project

1️⃣ **Check the booking flow**

- Create and manage bookings
- Observe booking status transitions

2️⃣ **Review frontend architecture**

- Feature‑based folder structure
- Clear separation between UI, logic, and API layers

3️⃣ **Inspect state & data handling**

- Zustand for global state
- React Query for server state
- Loading and error handling

---

## 🧪 Project Status

- ✅ ~80–90% core features completed
- 🔧 Potential future enhancements:
  - Online payment flow
  - Realtime notifications
  - Improved UI/UX

---

## 📘 What I Learned From This Project

While building **PetCare**, I focused not only on making features work, but also on understanding how a **real product** is structured and maintained.

### 🧠 Frontend Development

- Organizing a React project using **feature‑based architecture**
- Managing complex state with **Controller Hook Pattern** and **React Query**
- Handling common UI states:
  - loading / empty / error

- Using **TypeScript** and **Zod** to:
  - Define clear data contracts with APIs
  - Reduce bugs during refactoring
  - Improve confidence when working with a larger codebase

### 🔐 Authentication & Authorization

- Implementing JWT authentication flows
- Building role‑based access control (Admin / Employee / Customer)
- Protecting routes and UI elements based on permissions

### 🧩 Working With Real Business Logic

- Designing a **booking workflow** with multiple states
- Using service snapshots to prevent price or duration inconsistencies
- Synchronizing frontend logic with backend validation

### 🗄️ Backend & API Awareness

- Working with structured REST APIs
- Designing MongoDB schemas based on business needs
- Writing seed data to simulate a production‑like environment

### 🧪 Development Mindset

- Debugging real issues (validation errors, edge cases, data mismatch)
- Reading logs and tracing problems step by step
- Understanding that clean structure matters as much as features

### 🚀 Personal Takeaways

- Gained confidence working with a larger codebase
- Better understanding of full product development flow
- Stronger foundation for deeper frontend architecture learning

---

## 🧩 Challenges & How I Solved Them

### 🗓️ Employee Schedule Management

**Challenge**

Employee scheduling is one of the most complex parts of real booking systems such as clinics or salons. The system must handle:

- Weekly recurring working schedules
- Date‑specific overrides (leave days, special shifts)
- Different UI representations (calendar view vs table/grid view)

**How I solved it**

I designed the schedule system using a **two‑layer business model**:

- **Base weekly schedule** (by day of week)
- **Date‑specific overrides** (by exact date)

Priority rules were applied:

> Date override → Weekly schedule → Not available

This approach allows the frontend to:

- Accurately render availability in different views
- Reuse the same business logic for booking validation
- Reflect how real clinics and service businesses manage staff schedules

---

### ⏰ Booking Time Validation

**Challenge**

- Booking time depends on start time, service duration, and end time
- Time is stored as `HH:mm` strings but must follow strict logic rules
- Edge cases like invalid end times or overlapping ranges

**How I solved it**

- Normalized time calculations by converting everything to **minutes**
- Added validation at the **backend schema level**
- Frontend always calculates end time based on service duration snapshot

➡️ This reinforced the importance of validating business rules at multiple layers.

---

### 🔐 Role‑Based UI & Permission Handling

**Challenge**

- Different roles require different UI and actions
- Hard‑coding role checks easily leads to messy logic

**How I solved it**

- Implemented permission‑based UI rendering
- Separated role logic from presentational components
- Enforced permissions on the backend for security

➡️ Helped me understand how frontend and backend work together to ensure proper access control.

---

## 🔮 Next Improvements (If I Had More Time)

### 🚀 Frontend

- Refactor large features into clearer custom hooks
- Add skeleton loading and micro‑interactions
- Increase test coverage for critical flows (booking, auth)

### ⚙️ System & Features

- Automatic employee availability checks during booking
- Realtime booking notifications (WebSocket)
- Complete online payment flow with webhook handling

### 🧠 Code Quality

- Standardize error handling and messaging
- Improve type sharing between frontend and backend

➡️ These are improvements I would focus on to bring the project closer to a production‑ready system.

---

## 👨‍💻 Author

**Nguyễn Thành Thuận**
Junior Frontend / Full‑stack Developer

**Core Skills:**
React • Next.js • TypeScript • Node.js

---

Thank you for reviewing my project 🚀
