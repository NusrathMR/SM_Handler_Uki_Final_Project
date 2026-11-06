# Socialynk

**Create. Improve. Brand. Publish.**

Socialynk is an AI-powered social media content creation and management web app. It puts the whole workflow in one place: write a post, improve it with AI, add images, schedule it or publish it now, and see the result.

> **Project status:** academic MVP. Publishing to social networks is **simulated** (see [Known limitations](#known-limitations)).

- Live frontend: `TODO: https://your-site.vercel.app`
- Live backend: `TODO: https://your-backend.onrender.com`
- Repository: `TODO: https://github.com/your-name/your-repo`

---

## Table of contents

1. [About the project](#about-the-project)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Getting started](#getting-started)
6. [Environment variables](#environment-variables)
7. [API overview](#api-overview)
8. [Roles and access](#roles-and-access)
9. [Security](#security)
10. [Deployment](#deployment)
11. [Feature status and roadmap](#feature-status-and-roadmap)
12. [Known limitations](#known-limitations)
13. [Design](#design)
14. [Author](#author)

---

## About the project

### The problem

Creators, freelancers, digital marketers, small businesses and small agencies often use several separate tools to write captions, edit images, schedule posts and publish them. Socialynk combines these steps into one simple workspace.

### The idea

One workflow:

**Create content → Improve it with AI → Add images → Preview → Publish now or schedule**

### Target users

- Individual creators
- Freelancers
- Digital marketers
- Small businesses
- Small agencies

### Background

A small survey of 18 people was used for preliminary validation only: 16 of 18 found multi-platform publishing difficult, and 13 of 18 rated an AI assistant as useful. These numbers are too small to describe the whole market.

---

## Features

### Accounts and security
- Sign up and log in with email and password
- Passwords hashed with bcrypt
- JWT authentication (token sent in the `Authorization: Bearer` header)
- Protected pages and a protected API (`protect` middleware)
- Email verification with a one-time link (token method, sent with Resend)
- Roles: `user` and `admin`
- Profile menu with Settings, Pricing and Log out

### Create page
- Content types: Social Post, Image, Video, Carousel, Reel
- Caption editor with a 2,200 character counter
- **Autosave** about 1.5 seconds after typing stops
- Recent drafts panel
- **AI Assistant** chat popup (Gemini) with quick actions, copy, and "Use in Editor"
- Image upload (Cloudinary), image preview and image removal
- Step bar: Create Content → Add Image → Add Branding → Preview → Publish / Schedule

### Schedule and Publish
- Schedule popup: choose channels, publish now or schedule for later, date and time
- Publish page with tabs: **Schedule**, **Drafts**, **Sent**
- Real post list with post preview and read-only platform list
- Schedule, unschedule, edit, reschedule and delete (a post that is being published cannot be deleted)
- Background **scheduler** (runs every minute, retries up to 3 times, recovers stuck posts)
- **Simulated publisher** (no real social network is called)

### Dashboard
- Cards with real numbers from the user's own data (scheduled posts, drafts, pending posts)
- Pending post preview with working Edit and Reschedule buttons
- "Steps to post" guide

### Admin area (admin role only)
- Admin Dashboard
- **Manage Users**: search, filter by role, plan and status, pagination, change role, activate or deactivate
- **Admin Settings**: platform name, support email, sign-up rules, default plan, AI limits, media rules, maintenance mode
- Other admin pages show "Coming soon"

---

## Tech stack

### Frontend

| Technology | Use |
|---|---|
| React | User interface |
| Vite | Build tool and dev server |
| React Router (`react-router-dom`) | Page routing and protected routes |
| React Context | Login state (`AuthContext`) |
| Plain CSS | All styling (no Tailwind or Bootstrap) |
| Fetch API | Calls to the backend (`src/api/api.js`) |

### Backend

| Technology | Use |
|---|---|
| Node.js | Runtime (ES modules) |
| Express | Web server and API routes |
| MongoDB and Mongoose | Database and data models |
| JSON Web Token (`jsonwebtoken`) | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment variables |
| body-parser / `express.json()` | Reading request bodies |
| cors | Allowing the frontend to call the API |
| multer | Reading uploaded image files |
| node-cron | Scheduler for scheduled posts |

### External services

| Service | Use |
|---|---|
| Google Gemini API (`@google/genai`) | AI caption generation, with backup models |
| Cloudinary | Image storage |
| Resend | Verification emails (HTTPS API) |
| MongoDB Atlas | Hosted database |
| Render | Backend hosting |
| Vercel | Frontend hosting |

### Tools

- VS Code with AI coding assistants
- Postman for API testing
- Git and GitHub
- Stitch and Figma for the design prototype

---

## Project structure

> `TODO`: adjust folder names to match your repository.

```text
Code/
├── Back-End/
│   ├── index.js                 # Server start, middleware, routes, scheduler start
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary setup
│   ├── models/
│   │   ├── userModel.js
│   │   ├── postModel.js
│   │   ├── mediaModel.js
│   │   └── systemSettingsModel.js
│   ├── controller/
│   │   ├── userController.js    # Sign up, login, current user
│   │   ├── postController.js    # Drafts, schedule, publish now
│   │   ├── mediaController.js   # Image upload and delete
│   │   ├── aiController.js      # AI caption endpoint
│   │   ├── emailVerificationController.js
│   │   ├── adminUserController.js
│   │   └── adminSettingsController.js
│   ├── route/                   # One route file per feature
│   ├── middleware/
│   │   ├── authprotect.js       # Checks the JWT
│   │   ├── adminOnly.js         # Checks role === "admin"
│   │   └── uploadMiddleware.js  # multer image upload
│   ├── services/
│   │   ├── geminiService.js     # Gemini calls with model fallback
│   │   ├── publisherService.js  # Simulated publisher
│   │   ├── schedulerService.js  # node-cron job
│   │   └── emailService.js      # Resend email sending
│   └── utils/
│       └── verificationToken.js
│
└── Front-End/
    ├── vercel.json              # Rewrite for React Router on Vercel
    └── src/
        ├── main.jsx             # Routes
        ├── api/api.js           # All backend calls
        ├── context/             # AuthContext
        ├── utils/               # Small helper functions
        └── components/
            ├── dashBoard/
            ├── createPage/
            ├── publishPage/
            ├── sidebar/         # Shared Sidebar and TopBar
            ├── aiAssistant/
            ├── scheduleModel/
            ├── forgetPassword/
            └── admin/           # Admin dashboard, users, settings
```

---

## Getting started

### Requirements

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- Accounts and keys for: Google AI Studio (Gemini), Cloudinary, and Resend (optional for local testing)

### 1. Clone the project

```bash
git clone TODO_YOUR_REPOSITORY_URL
cd TODO_PROJECT_FOLDER
```

### 2. Start the backend

```bash
cd Code/Back-End
npm install
```

Create a `.env` file (see [Environment variables](#environment-variables)), then start the server:

```bash
npm run dev     # or: npm start (use the script defined in package.json)
```

The API runs on `http://localhost:3000`.

### 3. Start the frontend

```bash
cd Code/Front-End
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Then run:

```bash
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`).

### 4. Create an admin user

Sign up normally, then open the user in MongoDB and change `role` to `"admin"`. Log in again and an **Admin** link appears in the sidebar.

### Testing without a real email service

If `RESEND_API_KEY` is not set, the backend prints the verification link in the terminal as `DEV verification link`. Copy it into the browser to verify the account. Use this for local development only.

---

## Environment variables

### Backend (`Back-End/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string        # use the same name as in config/db.js

JWT_SECRET_TOKEN=a_long_random_secret
JWT_EXPIRE_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_key
GEMINI_MODELS=gemini-3.8-flash,gemini-3.5-flash,gemini-3.5-flash-lite
GEMINI_TIMEOUT_MS=8000

RESEND_API_KEY=your_resend_key
EMAIL_FROM=Socialynk <onboarding@resend.dev>
FRONTEND_URL=http://localhost:5173
```

### Frontend (`Front-End/.env`)

```env
VITE_API_URL=http://localhost:3000
```

**Never commit `.env` files.** Make sure `.env` is listed in `.gitignore`.

---

## API overview

> `TODO`: check the route prefixes against your route files and `index.js`. All routes except sign up, login and email verification need `Authorization: Bearer <token>`.

### Auth and user

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account and send the verification email |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/verify-email` | Verify an email with the token from the link |
| POST | `/api/auth/resend-verification` | Send a new verification email (60 second cooldown) |
| GET | `/api/user/me` | Current user |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/posts` | Create a draft |
| GET | `/api/posts` | List my posts (filter by status, sort) |
| GET | `/api/posts/:id` | Get one post |
| PUT / PATCH | `/api/posts/:id` | Update a post (autosave) |
| DELETE | `/api/posts/:id` | Delete a post |
| PATCH | `/api/posts/:id/schedule` | Schedule a post |
| PATCH | `/api/posts/:id/unschedule` | Move a scheduled post back to draft |
| POST | `/api/posts/:id/publish-now` | Publish immediately (simulated) |

### Media and AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/media/upload` | Upload an image (form-data field `image`) |
| GET | `/api/media` | List my images |
| DELETE | `/api/media/:id` | Delete an image |
| POST | `/api/ai/generate-caption` | Generate a caption from `{ "prompt": "..." }` |

### Admin (admin role only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | List users (search, role, plan, status, sort, pagination) |
| PATCH | `/api/admin/users/:id/role` | Change a user's role |
| PATCH | `/api/admin/users/:id/status` | Activate or deactivate a user |
| GET | `/api/admin/settings` | Read platform settings |
| PUT | `/api/admin/settings` | Save platform settings |

### Post statuses

`draft` → `scheduled` → `publishing` → `published` (or `failed`, which can be retried)

---

## Roles and access

| Role | Access |
|---|---|
| `user` | Dashboard, Create, Publish, Settings |
| `admin` | Everything above, plus the Admin area |

Each user can only see and change their own posts and images. Admin routes use `protect` first, then `adminOnly`. Hiding the Admin link in the frontend is only for convenience, the backend enforces the real check.

---

## Security

- Passwords are hashed with bcrypt and never returned by the API
- JWT is checked on every protected route
- Email verification tokens are random (32 bytes), only their **hash** is stored in the database, they expire after 24 hours, and each link works once
- The verification login check runs after the password check, so strangers cannot find out which emails have accounts
- Admin settings and user changes are validated on the backend, and only allowed fields are copied from the request body
- Secrets are kept in environment variables, never in the code
- Uploads accept only JPG, PNG and WebP, with a 25 MB limit

---

## Deployment

| Part | Service | Notes |
|---|---|---|
| Frontend | Vercel | `vercel.json` rewrites every path to `index.html`, so React Router pages like `/login` open directly |
| Backend | Render | Add all backend environment variables in Render's Environment tab |
| Database | MongoDB Atlas | Allow network access from Render |

Notes:

- Set `VITE_API_URL` on Vercel to the Render address, and redeploy (Vite reads it at build time).
- Set `FRONTEND_URL` on Render to the Vercel address (no trailing slash).
- Allow your Vercel domain in the backend CORS settings.
- Render's free plan sleeps when idle, so the first request can take 30 to 60 seconds.
- Render's free plan blocks outbound SMTP ports, so emails are sent through the Resend HTTPS API.

---

## Feature status and roadmap

| Feature | Status |
|---|---|
| Sign up, login, JWT, protected routes | Done |
| Current user (`/me`), profile menu, log out | Done |
| Drafts with autosave | Done |
| Schedule, unschedule, publish now (simulated) | Done |
| Scheduler job with retries | Done |
| Schedule popup and Publish page | Done |
| AI Assistant with Gemini and backup models | Done |
| Image upload and removal (Cloudinary) | Done |
| Admin: Manage Users (connected to the backend) | Done |
| Admin Settings (backend built, page connection) | In progress |
| Email verification with Resend | In progress |
| Dashboard with real data | In progress |
| Admin Dashboard with real data | In progress |
| Social media simulator page | In progress |
| Forgot password (popup UI exists, email reset not built) | Planned |
| Image tools: watermark, footer, enhance | Planned |
| Explore AI tools information page | Planned |
| Connect channels (real OAuth) | Planned |
| Real publishing to Facebook Pages and Instagram (Meta APIs) | Planned |
| Subscription plans and payments | Planned |
| LinkedIn and TikTok publishing | Later |
| Analytics, approvals and team workspaces | Later |

> `TODO`: update this table to match the final state of your project before you submit it.

### Planned subscription plans (assumptions, not final)

| Plan | Price (LKR / month) |
|---|---|
| Free | 0 |
| Starter | 999 |
| Pro | 2,499 |
| Business | 5,999 |
| Enterprise | Custom |

---

## Known limitations

- **Publishing is simulated.** Posts are marked as published by a test publisher, and nothing is sent to Facebook, Instagram or any other network. Real publishing needs approved Meta apps and OAuth.
- **Email delivery:** with Resend's test sender (`onboarding@resend.dev`), emails reach only the owner of the Resend account. To email other users, verify a domain in Resend, or turn off `requireEmailVerification` in Admin Settings.
- **AI availability:** Gemini models can be busy or retired. The app tries the models listed in `GEMINI_MODELS` in order, so keep that list up to date.
- **Token storage:** the JWT is stored in `localStorage`, which is simple but weaker against XSS than an httpOnly cookie.
- **Some admin settings are saved but not enforced yet** (for example the daily AI request limit).
- **Cold starts:** the Render free plan needs time to wake up.

---

## Design

- Clean, minimal SaaS look: dark charcoal sidebar, white workspace, light gray surfaces, black buttons, rounded corners
- Font: Inter
- Plain CSS with a class prefix for each area (`db-` dashboard and sidebar, `cr-` create, `pb-` publish, `ai-` assistant, `sc-` schedule, `su-` sign up, `fp-` forgot password, `ad-` admin), so styles do not clash

### Screenshots

> `TODO`: add screenshots, for example `![Dashboard](docs/dashboard.png)`

---

## Author

**M. R. Nusrat Ahmed**
Full stack developer

- `TODO`: institution, course, email or LinkedIn

## License

`TODO`: choose a license (for example MIT), or write "All rights reserved" for an academic project.