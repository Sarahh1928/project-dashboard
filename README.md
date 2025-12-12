A **React + Next.js (LTS) Project Dashboard** application with role-based access, task management, and advanced project filtering. This is a feature-rich frontend prototype, designed for educational and assessment purposes.

> **Note:** The project uses mock data for authentication, projects, and tasks. JWT and roles are simulated on the frontend. Real-time task
updates are mocked using setTimeout to simulate WebSocket events.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Features](#features)
3. [Directory Structure](#directory-structure)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Role-Based Access](#role-based-access)
7. [Future / Optional Features](#future--optional-features)
8. [License](#license)

---

## Tech Stack

* **React (Latest) + Next.js (LTS)**
* **TypeScript**
* **TailwindCSS / ShadCN UI** for UI components
* **Redux Toolkit** for global state (auth)
* **SWR** for data fetching and caching
* **react-hook-form + Zod** for form validation

---

## Features

* **Authentication & Role Management** (mocked)

  * Login using email & password from `mockData.ts`
  * Roles: `Admin`, `ProjectManager`, `Developer`
  * JWT token stored in localStorage (mock)
* **Dashboard Page**

  * Project list with pagination, sorting, and filtering
  * Columns: Name, Status, Start Date, End Date, Progress, Budget
  * Inline edit for authorized roles (`Admin` & `ProjectManager`)
* **Project Details Page**

  * View project info
  * Task list with search, filter, and bulk update
  * Add, edit, delete tasks
  * Role-based access: Developers can edit tasks only
* **UI Enhancements**

  * Fully responsive
  * Skeleton loaders for async data
  * Optimistic updates with SWR
* **Mock Data & Services**

  * `mockData.ts` for users, projects, tasks
  * `projectService.ts` and `taskService.ts` for CRUD operations
  * `authService.ts` for login/logout

---

## Directory Structure

```
src/
│
├─ app/
│  ├─ api/projects/route.ts        
│  ├─ dashboard/page.tsx           # Dashboard page
│  ├─ login/page.tsx               # Login page
│  ├─ projects/[id]/page.tsx       # Project details page
│  ├─ public/                      
│  ├─ layout.tsx
│  └─ providers.tsx
│
├─ components/
│  ├─ dashboard/
│  │  ├─ ProjectFilters.tsx
│  │  ├─ ProjectTable.tsx
│  │  └─ EditProjectModal.tsx
│  ├─ projects/
│  │  ├─ EditProjectModal.tsx
│  │  └─ EditTaskModal.tsx
│  │  └─ ProgressChart.tsx
│  ├─ layout/
│  │  ├─ Navbar.tsx
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ card.tsx
│  │  ├─ checkbox.tsx
│  │  ├─ dialog.tsx
│  │  ├─ input.tsx
│  │  ├─ select.tsx
│  │  └─ table.tsx
│  ├─ AccessDenied.tsx
│  └─ RoleGuard.tsx
│
├─ lib/
│  ├─ utils.ts
│  └─ zod-schemas.ts
│
├─ redux/
│  ├─ authSlice.ts
│  └─ store.ts
│
└─ services/
   ├─ authService.ts
   ├─ mockData.ts
   ├─ projectService.ts
   └─ taskService.ts
```

---

## Getting Started

### Prerequisites

* Node.js >= 20.x
* npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/Sarahh1928/project-dashboard.git
cd project-dashboard

# Install dependencies
npm install
# or
yarn install
```

### Run Locally

```bash
# Start Next.js dev server
npm run dev
# or
yarn dev
```

The app should be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Login**

   * Use the credentials defined in `src/services/mockData.ts`. Example:

     ```ts
     { id: "u1", name: "Sarah", email: "admin@example.com", password: "admin123", role: "Admin" },
     { id: "u2", name: "Ahmed", email: "pm@example.com", password: "pmanager123", role: "ProjectManager" },
     { id: "u3", name: "Omar", email: "dev@example.com", password: "developer123", role: "Developer" }
     ```

2. **Dashboard Page**

   * Filter and search projects by name, status, priority, and assigned user
   * Sort columns by clicking headers

3. **Project Details Page**

   * View project details
   * Manage tasks (add/edit/delete) depending on role
   * Developers can edit tasks only
   * Bulk update task status

---

## Role-Based Access

| Role               | Projects    | Tasks      |
| ------------------ | ----------- | ---------- |
| **Admin**          | Edit/Delete | Manage all |
| **ProjectManager** | Edit        | Manage all |
| **Developer**      | View only   | Edit only  |

---

## Future / Optional Features

* Real-time WebSocket updates (not implemented)
* PWA support with offline caching
* Charts for project progress visualization

---

## License

MIT License © [Sarah Mohamed]

---

