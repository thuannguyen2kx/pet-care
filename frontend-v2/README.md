# 🧱 Frontend Architecture & Project Structure

This document explains **how the frontend is structured**, **why certain architectural decisions were made**, and **how the project was approached and implemented**.
The goal is to demonstrate not only _what_ was built, but _how I think_ when building a real-world frontend application.

---

## 🎯 Architectural Goals

Before writing code, I defined several goals for the frontend architecture:

- **Scalable**: Easy to add new features without breaking existing ones
- **Readable**: A new developer can understand the structure quickly
- **Feature-oriented**: Business logic grouped by domain, not by file type
- **UI–logic separation**: Clear boundaries between UI, state, and business rules

This project was designed as a **product-style frontend**, not a demo or toy app.

---

## 📁 High-level Folder Structure

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

---

## 🧠 Why Feature-based Architecture?

Instead of organizing by file type (`components`, `hooks`, `api`), each **feature owns its full logic**:

- UI components
- State management
- API interaction
- Business rules

This makes the codebase:

- Easier to reason about
- Easier to refactor
- Easier to scale with new requirements

---

## 🧩 Features Module Breakdown

```
features/
├── auth/
├── availability/
├── booking/
│   ├── admin-app/
│   ├── customer-app/
│   ├── employee-app/
│   ├── api/
│   ├── domain/
│   └── config/
```

Each feature is split based on **business responsibility**, not technical concerns.

---

## 📌 Booking Feature – A Real-world Example

The **Booking** feature is the most complex part of the system and best represents the architectural approach.

### Structure

```
booking/
├── create-booking/
│   ├── application/
│   │   ├── use-create-booking-controller.ts
│   │   ├── use-create-booking-state.ts
│   │   └── use-create-booking-summary.ts
│   └── ui/
│       ├── steps/
│       ├── booking-navigation.tsx
│       ├── booking-progress.tsx
│       ├── booking-summary.tsx
│       └── create-booking-view.tsx
│
├── api/            # Booking-related API calls
├── domain/         # Business rules & data models
├── config/         # Constants & booking configs
├── admin-app/      # Admin-specific booking UI
├── employee-app/   # Employee-specific booking UI
└── customer-app/   # Customer-specific booking UI
```

---

## 🔍 Separation of Concerns (How Logic Flows)

### 1️⃣ UI Layer (`ui/`)

- Contains **pure presentation components**
- No direct business logic
- Focused on layout, interaction, and accessibility

### 2️⃣ Application Layer (`application/`)

- Acts as the **bridge between UI and domain**
- Manages:
  - Local state
  - Form flow
  - Side effects

This layer is implemented using **custom hooks** to keep components clean.

### 3️⃣ Domain Layer (`domain/`)

- Contains **business rules** and core concepts
- Independent from UI
- Reflects real-world booking logic (duration, time validation, status rules)

➡️ This separation allows UI to change without breaking business logic.

---

## 🧭 Role-based Feature Design

Instead of scattering `if (role === ...)` across components:

- Each role has its **own sub-module**
- Shared logic lives in `domain` and `api`
- UI differences are isolated per role

This mirrors how real products scale when roles grow more complex.

---

## 🧠 How I Approached the Project

### Step 1: Understand the Business

- How does a pet clinic / spa operate?
- How do booking, employees, and customers interact?

### Step 2: Design the Data & Workflow

- Booking lifecycle
- Employee availability
- Role permissions

### Step 3: Design the Frontend Architecture

- Feature boundaries
- Data flow
- State ownership

### Step 4: Implement Incrementally

- Build core flows first (auth, booking)
- Refactor when patterns emerge
- Improve structure as complexity grows

---

## 🌱 What This Architecture Enables

- Easy addition of new booking flows
- Safer refactoring
- Clear ownership of code
- Better collaboration in a team environment

This structure reflects how I approach frontend development:
**think in systems, not just screens.**

---

## 📌 Final Note

This architecture is intentionally designed to be:

- Junior-friendly
- Production-inspired
- Easy to review and reason about

It represents my current thinking as a frontend developer and is the foundation I plan to continue improving as I grow.
