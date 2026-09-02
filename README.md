# GCC Talent Marketplace — Frontend

## Overview

GCC Talent Marketplace is a freelance marketplace platform designed to connect clients with freelancers across the GCC region.

This repository contains the **frontend application** for GCC Talent Marketplace. It provides the user interface for clients and freelancers to register, manage their profiles, browse and manage jobs, submit and review proposals, manage contracts, and interact with the marketplace.

The application communicates with a separate Node.js/Express backend through a REST API.

---

## Project Purpose

The goal of GCC Talent Marketplace is to provide a platform where:

- Clients can create and manage freelance jobs.
- Freelancers can browse available jobs and submit proposals.
- Clients can review, shortlist, decline, and accept proposals.
- Freelancers can create professional profiles and portfolios.
- Users can view public freelancer and client profiles.
- Contracts and milestones can be managed after a proposal is accepted.
- Clients and freelancers can review each other after completing a contract.
- Administrators can manage users, categories, skills, and platform activity.

This repository is responsible only for the **React frontend** of the system.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- HTML5
- CSS3
- Fetch API
- JWT Authentication
- ESLint

### Backend Integration

The frontend communicates with the GCC Talent Marketplace backend using REST API requests.

Authentication is handled using JWT access tokens. The access token is stored on the client and included in authenticated API requests.

---

## Features

### Authentication

- User registration
- User login
- Client and freelancer account roles
- JWT-based authentication
- Persistent authenticated session using local storage
- Role-aware navigation and dashboard

### Landing & Dashboard

- Public landing page
- Role-aware dashboard after login
- Navigation based on authentication state

### Jobs

- Browse available jobs
- View job details
- Create jobs as a client
- Edit existing jobs
- View a client's own jobs
- Job status management
- View proposals submitted to a job

### Proposals

- Freelancers can submit proposals
- View personal proposal history
- View proposal status
- Clients can review proposals submitted to their jobs
- Proposal management integrates with the job workflow

### Freelancer Profiles

- Create and edit freelancer profile
- Headline and biography
- Skills
- Languages
- Hourly rate
- Availability
- Portfolio projects
- Profile image support
- Public freelancer profiles
- Freelancer ratings and reviews

### Client Profiles

- Create and edit client profiles
- Company or individual client information
- Description
- Website
- Public hiring information
- Client ratings and reviews

### Reviews

- Review form components
- Review listing components
- 1–5 star ratings
- Review comments
- Reviews displayed on user profiles
- Integration with completed contracts

### File Uploads

- Frontend support for uploading profile and portfolio files
- Upload requests are handled through the backend API

---

## Application Structure

```text
GCC-Talent-Marketplace-frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Nav.jsx
│   │   ├── RequireAuth.jsx
│   │   ├── ReviewForm.jsx
│   │   └── ReviewsList.jsx
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── SignInForm.jsx
│   │   ├── SignUpForm.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobDetails.jsx
│   │   ├── CreateJob.jsx
│   │   ├── EditJob.jsx
│   │   ├── MyJobs.jsx
│   │   ├── JobProposals.jsx
│   │   ├── ProposalForm.jsx
│   │   ├── MyProposals.jsx
│   │   ├── FreelancerProfile.jsx
│   │   ├── PublicFreelancerProfile.jsx
│   │   └── ClientProfile.jsx
│   │
│   ├── services/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── proposal.js
│   │   ├── freelancerProfiles.js
│   │   ├── clientProfiles.js
│   │   ├── categories.js
│   │   ├── skills.js
│   │   ├── uploads.js
│   │   └── user.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Frontend Architecture

The frontend follows a simple separation of concerns:

### Pages

The `pages` directory contains route-level React components.

Examples:

- `Jobs.jsx`
- `JobDetails.jsx`
- `Dashboard.jsx`
- `FreelancerProfile.jsx`
- `MyProposals.jsx`

### Components

The `components` directory contains reusable interface components shared across pages.

Examples:

- Navigation
- Authentication route protection
- Review forms
- Review lists

### Services

The `services` directory handles communication with the backend API.

For example:

```text
React Page
    ↓
Service Function
    ↓
Fetch Request
    ↓
Express REST API
    ↓
MongoDB
```

Keeping API requests inside service files prevents backend communication logic from being duplicated throughout React components.

---

## Main Routes

| Route | Description |
|---|---|
| `/` | Landing page or authenticated dashboard |
| `/sign-up` | Register a new account |
| `/sign-in` | Log into an existing account |
| `/jobs` | Browse jobs |
| `/jobs/:jobId` | View job details |
| `/client/jobs` | View jobs created by the logged-in client |
| `/client/jobs/new` | Create a new job |
| `/client/jobs/:jobId/edit` | Edit a job |
| `/client/jobs/:jobId/proposals` | Review proposals for a job |
| `/client/profile` | Manage client profile |
| `/freelancer/profile` | Manage freelancer profile |
| `/freelancers/:userId` | View public freelancer profile |
| `/proposals/mine` | View freelancer's submitted proposals |

Additional routes will be connected as the contracts, wallet, reviews, and admin sections are completed.

---

## Authentication Flow

Authentication is handled using JWT access tokens.

### Registration / Login

```text
User enters credentials
        ↓
React form
        ↓
auth service
        ↓
Backend authentication API
        ↓
JWT returned
        ↓
Token stored in localStorage
        ↓
User information extracted from JWT
        ↓
Authenticated dashboard
```

The token is then included in protected API requests using the authorization header.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

The GCC Talent Marketplace backend must also be running for API-dependent functionality to work.

---

## Installation

### 1. Clone the frontend repository

```bash
git clone <frontend-repository-url>
```

### 2. Enter the project directory

```bash
cd GCC-Talent-Marketplace-frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root of the frontend project.

```env
VITE_BACK_END_SERVER_URL=<backend-base-url>
```

The value should point to the running GCC Talent Marketplace backend server.

Do not include `/api/v1` at the end unless the service implementation specifically requires it, because the frontend service files construct the API endpoint paths.

### 5. Start the development server

```bash
npm run dev
```

Vite will display the local frontend address in the terminal.

---

## Available Scripts

### Start development server

```bash
npm run dev
```

### Build the application

```bash
npm run build
```

### Run ESLint

```bash
npm run lint
```

### Preview the production build

```bash
npm run preview
```

---

## Backend Dependency

This repository contains only the frontend.

A running instance of the GCC Talent Marketplace backend is required for:

- Authentication
- User data
- Freelancer profiles
- Client profiles
- Jobs
- Proposals
- Categories
- Skills
- File uploads
- Contracts
- Reviews
- Wallet and escrow functionality
- Administration functionality

The frontend communicates with the backend through REST API requests.

---

## User Roles

### Guest

Guests can access public sections of the platform such as:

- Landing page
- Job listings
- Job details
- Public profiles
- Registration
- Login

### Freelancer

Freelancers can:

- Manage their freelancer profile
- Add portfolio information
- Browse jobs
- View job details
- Submit proposals
- View their proposals
- Participate in contracts
- Deliver work
- Receive ratings and reviews

### Client

Clients can:

- Manage their client profile
- Create jobs
- Edit jobs
- Manage their own jobs
- Review freelancer proposals
- Accept or decline proposals
- Participate in contracts
- Fund milestones
- Approve completed work
- Leave reviews

### Admin

The completed platform includes an administrator interface for:

- Platform statistics
- User management
- Category management
- Skills management
- Platform moderation

---

## Marketplace Workflow

The primary GCC Talent workflow is:

```text
Client registers
      ↓
Client creates a job
      ↓
Freelancer browses jobs
      ↓
Freelancer submits a proposal
      ↓
Client reviews proposals
      ↓
Client accepts a freelancer
      ↓
Contract is created
      ↓
Milestones are funded
      ↓
Freelancer delivers work
      ↓
Client approves delivery
      ↓
Payment is released
      ↓
Client and freelancer leave reviews
```

---

## Current Development Status

The frontend is being developed incrementally around the project's required marketplace flow.

Core frontend work includes:

- Authentication
- Landing page
- Role-aware dashboard
- Freelancer profiles
- Client profiles
- Job browsing
- Job details
- Job creation and editing
- Client job management
- Proposal submission
- Proposal management
- Public profile functionality
- Reviews

Additional integration and polishing includes:

- Contracts and milestones
- Wallet and escrow
- Notifications
- Administration
- Protected role routes
- Responsive design
- Loading and error states
- Final end-to-end testing

---

## Design

The interface follows the GCC Talent branding defined for the project.

The intended visual direction uses:

- Deep teal as the primary brand colour
- Warm cream backgrounds
- Clean marketplace cards
- Clear typography
- Responsive layouts
- Consistent forms and navigation
- Accessible and understandable user flows

---

## Security Considerations

The frontend does not make authorization decisions by itself.

Protected actions are enforced by the backend.

Frontend security-related behavior includes:

- JWT authentication
- Authorization headers for protected API requests
- Role-aware interface rendering
- Protected route components
- No backend secrets stored in frontend source code
- Environment variables used for backend configuration

Server-side authorization remains the source of truth.

---

## Future Improvements

Planned or remaining frontend improvements include:

- Complete contract workspace integration
- Milestone management
- Wallet interface
- Mock payment interface
- Escrow visualization
- Admin dashboard
- Admin user management
- Category and skill management
- Notification interface
- Improved loading, empty and error states
- Responsive mobile layouts
- Additional route protection
- Frontend testing
- Accessibility improvements

---

## Team Project

GCC Talent Marketplace was developed as a full-stack MERN capstone project.

The complete application is separated into:

```text
Frontend
React + Vite
        ↓
REST API
        ↓
Backend
Node.js + Express
        ↓
MongoDB
```

This repository represents the **frontend React application**.

---

## Contributors

Add the project team members here.

```text
Team Member 1
Team Member 2
Team Member 3
Team Member 4
```

---

## License

This project was created for educational purposes as part of a software engineering capstone project.