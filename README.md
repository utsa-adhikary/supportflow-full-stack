[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/SdRLyGD_)
# COPS Summer of Code — Web Track — Week 2
## Problem Statement: Complaint Ticketing System (Backend + MongoDB)

## Overview

In Week 1, you built a fully functional SPA backed entirely by the browser's `localStorage`. This week, you will **replace that with a real backend server and a MongoDB database**, transforming your prototype into a production-style full-stack application.

Your Week 1 frontend remains the UI layer — but every read and write that previously talked to `localStorage` will now go through **HTTP API calls** to your own backend server. The navbar role-toggle is replaced with **proper user authentication** using JWT tokens.

You are free to implement the backend in any of the following languages and frameworks:

| Language | Framework |
|---|---|
| **Node.js** | Express.js |
| **Python** | FastAPI or Flask |
| **Go** | Gin or Fiber |
| **Java** | Spring Boot |

Pick the one you are most comfortable with — or the one you most want to learn. The **API contract (routes, request/response shapes) is identical** regardless of language choice. The backend language is an implementation detail; the spec is the spec.

---

## Learning Resources

- **REST API Design:** [https://www.youtube.com/watch?v=cJAyEOZQUQY](https://www.youtube.com/watch?v=cJAyEOZQUQY)
- **MongoDB:** [https://www.youtube.com/watch?v=M1dKYQ7GsTg](https://www.youtube.com/watch?v=M1dKYQ7GsTg)
- **JWT Explained:** [https://www.youtube.com/watch?v=QzntvHz23tw](https://www.youtube.com/watch?v=QzntvHz23tw)
- **HTTP Status Codes Reference:** [MDN HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- **CORS Explained:** [https://www.youtube.com/watch?v=WWnR4xptSRk](https://www.youtube.com/watch?v=WWnR4xptSRk)

- **Node.js:** [https://www.youtube.com/watch?v=_7UQPve99r4](https://www.youtube.com/watch?v=_7UQPve99r4)
- **Python (Flask):** [https://www.youtube.com/watch?v=Z1RJmh_OqeA](https://www.youtube.com/watch?v=Z1RJmh_OqeA)
- **Go (Gin):** [https://www.youtube.com/watch?v=ERZadn9artM](https://www.youtube.com/watch?v=ERZadn9artM)
- **JAVA (Spring Boot):** [https://www.youtube.com/watch?v=FYoBDj4s99E](https://www.youtube.com/watch?v=FYoBDj4s99E)

---

## Architecture

```
┌─────────────────────────────────┐
│   Browser (React SPA)           │
│   localhost:5173                │
│                                 │
│  ┌───────────────────────────┐  │
│  │  fetch() / axios          │  │
│  │  Authorization: Bearer    │  │
│  └──────────┬────────────────┘  │
└─────────────┼───────────────────┘
              │  HTTP  (REST)
              ▼
┌─────────────────────────────────┐
│   Backend Server                │
│   localhost:8000                │
│                                 │
│   Express / FastAPI / Gin /     │
│   Spring Boot                   │
└──────────────┬──────────────────┘
               │  MongoDB Driver
               ▼
┌─────────────────────────────────┐
│   MongoDB                       │
│   (local or Atlas)              │
│                                 │
│   collections:                  │
│     users · tickets · messages  │
└─────────────────────────────────┘
```

- The React frontend runs on `http://localhost:5173` (Vite default).
- The backend runs on `http://localhost:8000` (or any port — just be consistent).
- All API routes are prefixed with `/api`.
- CORS **must** be configured to allow requests from the frontend's origin.

---

## Authentication Model

Replace the navbar role toggle with real user accounts. Two account types exist in the system:

| Role | Capabilities |
|---|---|
| `customer` | Submit tickets, view own tickets, send messages on own tickets |
| `admin` | View all tickets, change ticket status/category/priority, reply on any ticket, access dashboard stats |

### How It Works

1. The user submits their credentials to `POST /api/auth/login`.
2. The backend validates the password against the stored bcrypt hash, then generates a **signed JWT**.
3. The frontend stores the token in `localStorage` under the key `auth_token` and the user object in `AuthContext`.
4. Every subsequent request attaches the token as `Authorization: Bearer <token>`.
5. Protected route middleware on the backend validates the token and injects the decoded user payload (`userId`, `role`) into the request context for downstream handlers.
6. If the token is missing, expired, or invalid, the backend responds `401 Unauthorized`.
7. If the token is valid but the role is insufficient, the backend responds `403 Forbidden`.

**Seed at least one admin account** so the Admin Dashboard is accessible from day one (see Seed Data section).

**JWT Payload shape:**
```json
{
  "userId": "64f3a1b2c3d4e5f6a7b8c9d0",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1748650000,
  "exp": 1749254800
}
```

---

## MongoDB Collections & Schema

### Collection: `users`

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string — unique, indexed",
  "passwordHash": "string — bcrypt hashed, never stored in plaintext",
  "role": "customer | admin",
  "createdAt": "Date"
}
```

### Collection: `tickets`

```json
{
  "_id": "ObjectId",
  "ticketNumber": "string — e.g. TKT-001, unique, auto-generated on server",
  "title": "string",
  "category": "Hardware | Software | Billing | Network | Other",
  "priority": "Low | Medium | High",
  "description": "string",
  "status": "Open | In Progress | Resolved",
  "createdBy": "ObjectId — ref: users",
  "createdAt": "Date",
  "resolvedAt": "Date | null — set automatically when status becomes Resolved",
  "updatedAt": "Date"
}
```

> **On `ticketNumber` generation:** Query the total count of existing tickets and increment. Store a separate `counters` collection (`{ _id: "ticketNumber", seq: 42 }`) and use an atomic `findOneAndUpdate` with `$inc` for race-condition safety, or use any equivalent atomic counter strategy in your chosen language.

### Collection: `messages`

Messages are stored in a **separate collection** (not embedded inside the ticket document). This keeps the `tickets` document small and makes the polling query efficient at scale.

```json
{
  "_id": "ObjectId",
  "ticketId": "ObjectId — ref: tickets, indexed",
  "senderId": "ObjectId — ref: users",
  "senderRole": "customer | admin",
  "text": "string",
  "timestamp": "Date"
}
```

> **Required index:** Create a compound index on `{ ticketId: 1, timestamp: 1 }` in the `messages` collection. This makes the `?since=` polling query fast regardless of message volume.

---

## API Routes Reference

All routes are prefixed with `/api`. Tables mark each route's protection level and role restriction.

**Legend:**
- 🔒 — Requires valid JWT in `Authorization: Bearer` header
- 👤 — Customer only
- 🛡️ — Admin only

---

### Auth Routes

---

#### `POST /api/auth/register`

Create a new customer account. Passwords must be hashed with bcrypt (minimum 10 salt rounds) before storage. Never store plaintext passwords.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response `201 Created`:**
```json
{
  "token": "<signed_jwt_string>",
  "user": {
    "id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

**Error Responses:**

| Status | Condition |
|---|---|
| `400` | Missing or invalid fields |
| `409` | Email already registered |

---

#### `POST /api/auth/login`

Authenticate an existing user. On success, return a signed JWT with the payload shape described above.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response `200 OK`:**
```json
{
  "token": "<signed_jwt_string>",
  "user": {
    "id": "64f3a1b2c3d4e5f6a7b8c9d0",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

**Error Responses:**

| Status | Condition |
|---|---|
| `400` | Missing fields |
| `401` | Email not found or password mismatch — respond with the same generic message for both to avoid user enumeration |

---

#### `GET /api/auth/me` — 🔒

Returns the profile of the currently authenticated user. The frontend calls this on app load to validate a stored token and hydrate `AuthContext`.

**Response `200 OK`:**
```json
{
  "id": "64f3a1b2c3d4e5f6a7b8c9d0",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "customer",
  "createdAt": "2026-05-23T10:00:00Z"
}
```

---

### Ticket Routes

---

#### `GET /api/tickets` — 🔒

- **Customer:** returns only tickets where `createdBy === authenticated user`.
- **Admin:** returns all tickets in the system.

**Query Parameters (all optional):**

| Param | Type | Description |
|---|---|---|
| `status` | string | `Open` / `In Progress` / `Resolved` |
| `priority` | string | `Low` / `Medium` / `High` |
| `category` | string | Any valid category value |
| `search` | string | Case-insensitive partial match on ticket `title` |
| `page` | integer | Page number, default `1` |
| `limit` | integer | Results per page, default `20`, max `100` |

**Response `200 OK`:**
```json
{
  "tickets": [
    {
      "id": "64f3...",
      "ticketNumber": "TKT-007",
      "title": "My laptop screen flickers",
      "category": "Hardware",
      "priority": "High",
      "status": "Open",
      "createdBy": { "id": "...", "name": "Jane Doe" },
      "createdAt": "2026-05-23T10:30:00Z",
      "updatedAt": "2026-05-23T10:30:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

---

#### `POST /api/tickets` — 🔒 👤

Creates a new ticket. `createdBy` is derived from the JWT — the client does **not** pass a user ID in the body. `status` defaults to `"Open"`. `ticketNumber` is auto-generated on the server.

**Request Body:**
```json
{
  "title": "My laptop screen flickers",
  "category": "Hardware",
  "priority": "High",
  "description": "The screen flickers every 10 seconds when plugged in to power."
}
```

**Validation:**

| Field | Rule |
|---|---|
| `title` | Required, minimum 5 characters |
| `category` | Required, must be one of the allowed enum values |
| `priority` | Required, must be one of the allowed enum values |
| `description` | Required, minimum 20 characters |

**Response `201 Created`:**
```json
{
  "ticket": {
    "id": "64f3...",
    "ticketNumber": "TKT-008",
    "title": "My laptop screen flickers",
    "category": "Hardware",
    "priority": "High",
    "description": "...",
    "status": "Open",
    "createdBy": { "id": "...", "name": "Jane Doe" },
    "createdAt": "2026-05-31T10:30:00Z",
    "resolvedAt": null,
    "updatedAt": "2026-05-31T10:30:00Z"
  }
}
```

---

#### `GET /api/tickets/:id` — 🔒

- **Customer:** may only fetch tickets they created. Return `403` if the authenticated user is not the ticket owner.
- **Admin:** may fetch any ticket.

**Response `200 OK`:**
```json
{
  "ticket": {
    "id": "64f3...",
    "ticketNumber": "TKT-007",
    "title": "My laptop screen flickers",
    "category": "Hardware",
    "priority": "High",
    "description": "The screen flickers every 10 seconds...",
    "status": "In Progress",
    "createdBy": { "id": "...", "name": "Jane Doe" },
    "createdAt": "2026-05-23T10:30:00Z",
    "resolvedAt": null,
    "updatedAt": "2026-05-24T09:15:00Z"
  }
}
```

**Error Responses:**

| Status | Condition |
|---|---|
| `403` | Authenticated customer does not own this ticket |
| `404` | No ticket with this ID exists |

---

#### `PATCH /api/tickets/:id` — 🔒

Partially updates a ticket. Only fields present in the request body are modified. Allowed fields differ by role:

| Field | Customer | Admin |
|---|---|---|
| `status` | Can only set to `"Resolved"` | All values: `Open`, `In Progress`, `Resolved` |
| `category` | ❌ Not allowed | ✅ Any valid category |
| `priority` | ❌ Not allowed | ✅ `Low`, `Medium`, `High` |

**Additional server-side logic:**
- When `status` is set to `"Resolved"`, the backend **must** set `resolvedAt` to the current timestamp automatically. The client does not send this field.
- When `status` changes away from `"Resolved"`, `resolvedAt` must be set back to `null`.
- `updatedAt` is refreshed on every successful PATCH.
- A customer attempting to change `category` or `priority` should receive `403`.

**Request Body (example — admin changing status):**
```json
{
  "status": "In Progress"
}
```

**Response `200 OK`:**
```json
{
  "ticket": { /* full updated ticket object */ }
}
```

---

#### `DELETE /api/tickets/:id` — 🔒

- **Customer:** may only delete tickets they own.
- **Admin:** may delete any ticket.

On deletion, **all messages associated with this `ticketId` must also be deleted** in the same operation (cascading delete).

**Response `200 OK`:**
```json
{
  "message": "Ticket TKT-007 and all associated messages deleted successfully."
}
```

**Error Responses:**

| Status | Condition |
|---|---|
| `403` | Customer does not own this ticket |
| `404` | Ticket not found |

---

### Message Routes

---

#### `GET /api/tickets/:id/messages` — 🔒

Returns messages for the given ticket ordered by `timestamp` ascending.

**Authorization:**
- Customer may only access messages on tickets they own.
- Admin may access messages on any ticket.

This endpoint is **the core of the polling-based chat**. The frontend calls it repeatedly on a timer while the ticket detail view is open.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `since` | ISO 8601 string | If provided, returns only messages where `timestamp > since`. This lets the frontend request only new messages on each poll cycle, keeping payloads minimal. |

**Response `200 OK`:**
```json
{
  "messages": [
    {
      "id": "64f5...",
      "ticketId": "64f3...",
      "sender": {
        "id": "64f1...",
        "name": "Jane Doe",
        "role": "customer"
      },
      "text": "Has anyone looked at this issue yet?",
      "timestamp": "2026-05-23T11:00:00Z"
    },
    {
      "id": "64f6...",
      "ticketId": "64f3...",
      "sender": {
        "id": "64f2...",
        "name": "Support Agent",
        "role": "admin"
      },
      "text": "Yes, we're investigating now. We'll update you shortly.",
      "timestamp": "2026-05-23T11:15:00Z"
    }
  ]
}
```

If no messages exist (or none after the `since` timestamp), return an empty array — not a `404`.

```json
{ "messages": [] }
```

---

#### `POST /api/tickets/:id/messages` — 🔒

Sends a message in a ticket's thread. `senderId` and `senderRole` are derived from the JWT — the client sends only the message text.

**Authorization:**
- Customer may only message on tickets they own.
- Admin may message on any ticket.

**Request Body:**
```json
{
  "text": "We have identified the issue and will deploy a fix by EOD."
}
```

**Validation:**

| Field | Rule |
|---|---|
| `text` | Required, non-empty, max 2000 characters |

**Response `201 Created`:**
```json
{
  "message": {
    "id": "64f7...",
    "ticketId": "64f3...",
    "sender": {
      "id": "64f2...",
      "name": "Support Agent",
      "role": "admin"
    },
    "text": "We have identified the issue and will deploy a fix by EOD.",
    "timestamp": "2026-05-31T14:22:00Z"
  }
}
```

---

### Admin Routes

All routes in this section are **strictly admin-only**. A valid customer JWT hitting any of these routes must receive `403 Forbidden`.

---

#### `GET /api/admin/stats` — 🔒 🛡️

Returns pre-aggregated statistics for the Admin Dashboard KPI cards and both charts. **All aggregations must be computed server-side** using MongoDB aggregation pipelines (or your ORM's equivalent). Do not ship raw ticket arrays to the frontend and compute stats in JavaScript.

**Response `200 OK`:**
```json
{
  "totalTickets": 42,
  "openTickets": 18,
  "inProgressTickets": 10,
  "resolvedToday": 4,
  "ticketsByCategory": {
    "Hardware": 12,
    "Software": 15,
    "Billing": 7,
    "Network": 5,
    "Other": 3
  },
  "ticketsByStatus": {
    "Open": 18,
    "In Progress": 10,
    "Resolved": 14
  },
  "ticketsOverTime": [
    { "date": "2026-05-25", "count": 3 },
    { "date": "2026-05-26", "count": 5 },
    { "date": "2026-05-27", "count": 2 },
    { "date": "2026-05-28", "count": 8 },
    { "date": "2026-05-29", "count": 4 },
    { "date": "2026-05-30", "count": 6 },
    { "date": "2026-05-31", "count": 14 }
  ]
}
```

`ticketsOverTime` should cover the **last 7 calendar days**, derived by grouping tickets on their `createdAt` date. Days with zero tickets must still appear in the array with `"count": 0` so the line chart renders without gaps.

`resolvedToday` counts tickets where `resolvedAt` falls within the current calendar day in UTC.

## Polling-Based Chat

Since there is no persistent connection between client and server (no WebSocket in the base requirement), the chat thread is kept live using **short-poll requests** from the frontend.

## Frontend Migration Guide

The following changes are required to adapt your Week 1 React app to the new backend. You are **not expected to redesign the UI** — the Week 1 layout and components are largely preserved.

### 1. Create an API Utility Module

Create a central module (e.g., `src/lib/api.js`) that wraps all `fetch()` calls. Every function in this module should:
- Prepend `VITE_API_BASE_URL` to the path.
- Attach the stored JWT as the `Authorization: Bearer` header automatically.
- Parse the response body as JSON.
- Throw a structured error if the response status is not `2xx`.

Do **not** scatter raw `fetch()` calls across components.

### 2. Replace localStorage Reads/Writes with API Calls

Every place in Week 1 that called `localStorage.getItem('support_tickets')` or `localStorage.setItem(...)` must be replaced with a call to the appropriate API function from your utility module. A rough mapping:

| Week 1 localStorage Operation | Week 2 API Call |
|---|---|
| Load all tickets on mount | `GET /api/tickets` |
| Save new ticket | `POST /api/tickets` |
| Load single ticket | `GET /api/tickets/:id` |
| Update ticket status | `PATCH /api/tickets/:id` |
| Delete ticket | `DELETE /api/tickets/:id` |
| Load messages | `GET /api/tickets/:id/messages` (via polling) |
| Send message | `POST /api/tickets/:id/messages` |
| Admin stats | `GET /api/admin/stats` |

### 3. Add an Auth Context

Replace (or extend) the `TicketContext` with an `AuthContext` that stores:
- The current user object (`id`, `name`, `email`, `role`)
- A `login(email, password)` function
- A `logout()` function (clears the token from `localStorage` and resets state)
- A `register(name, email, password)` function
- An `isAuthenticated` boolean
- An `isLoading` boolean (true while the initial `GET /api/auth/me` call is in flight)

On app boot, read the token from `localStorage`, then call `GET /api/auth/me` to validate it and hydrate the user object. If the call fails or no token exists, treat the user as unauthenticated.

### 4. New Views to Add

| Path | View | Notes |
|---|---|---|
| `/login` | Login Form | Email + password fields, link to register |
| `/register` | Registration Form | Name + email + password fields, link to login |

After a successful login or registration, redirect to `/` (customer) or `/admin` (admin) based on the role returned in the response.

The existing role toggle in the navbar is **removed**. Role is now determined by the authenticated user's account and reflected automatically.

### 5. Protected Route Wrapper

Wrap every authenticated route with a `ProtectedRoute` component that:
- Shows a loading spinner while the initial auth check is in progress.
- Redirects to `/login` if the user is not authenticated.
- For `/admin`, additionally redirects to `/` if the authenticated user's role is `"customer"`.

### 6. Add Loading and Error States

Every component that fetches data must handle three explicit states:
- **Loading** — show a skeleton UI or spinner while the request is in flight.
- **Error** — show a user-friendly inline error message if the request fails. Never let a rejected promise crash the component silently.
- **Success** — render the data normally.

---

## Environment Configuration

### Backend `.env`

Store all secrets in a `.env` file at the project root. **Never commit this file to version control.** Provide a `.env.example` with placeholder values in your submission.

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Port the server listens on | `8000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ticketing_dev` |
| `JWT_SECRET` | Secret key for signing tokens — use a long random string | `super_secret_key_change_me` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS | `http://localhost:5173` |

### Frontend `.env`

Add to the root of your React project:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` |

---

## Standard Error Response Shape

All error responses across every route must follow a consistent shape so the frontend can handle them uniformly:

```json
{
  "error": "A human-readable description of what went wrong."
}
```

| HTTP Status | When to Use |
|---|---|
| `400 Bad Request` | Missing required fields, validation failure, malformed body |
| `401 Unauthorized` | Missing, expired, or invalid JWT |
| `403 Forbidden` | Valid JWT but insufficient role permissions |
| `404 Not Found` | Ticket, user, or message with this ID does not exist |
| `409 Conflict` | Email is already registered |
| `500 Internal Server Error` | Unhandled exceptions — log the full error server-side, but return only a generic message to the client |

---

## Seed Data Requirement

On server startup, if the `users` collection is empty, automatically insert the following seed data. This ensures the Admin Dashboard charts are non-trivial from the very first launch.

### Seed Users

| Name | Email | Password | Role |
|---|---|---|---|
| Admin User | `admin@support.com` | `admin123` | `admin` |
| Alice Johnson | `alice@example.com` | `password123` | `customer` |
| Bob Smith | `bob@example.com` | `password123` | `customer` |

### Seed Tickets

Insert at least **7 tickets** with the following constraints:
- `createdAt` values spread across the last 7 calendar days (one or two per day).
- All three `status` values represented (`Open`, `In Progress`, `Resolved`).
- All five `category` values represented.
- All three `priority` values represented.
- `resolvedAt` set appropriately for `Resolved` tickets.
- At least **3 tickets with pre-populated messages** — include a back-and-forth exchange between a customer sender and an admin sender so the chat view has visible content on first load.

---

## Bonus Features (Extra Credit)

### 1. WebSocket-Based Live Chat

Replace polling with a **persistent WebSocket connection** for true real-time bidirectional messaging.

**How it works:**
- When the Ticket Detail view mounts, the client opens a connection to `ws://localhost:8000/ws/tickets/:id`.
- When the user sends a message via `POST /api/tickets/:id/messages`, the server persists it to MongoDB and then **broadcasts it to all WebSocket clients currently subscribed to that ticket channel**.
- The receiving client appends the new message to state without any polling.
- The connection is closed when the user navigates away.

The REST endpoint for sending messages (`POST /api/tickets/:id/messages`) must remain functional — WebSocket is purely a delivery mechanism layered on top of the existing persistence logic.

### 2. Rate Limiting

Add a rate limiter to `POST /api/tickets` and `POST /api/tickets/:id/messages` to prevent spam. A reasonable limit is **10 requests per minute per IP**. Requests exceeding the limit should receive `429 Too Many Requests`.

### 3. Pagination on the Global Ticket Table

Implement server-side pagination on `GET /api/tickets`. The frontend renders page controls (Previous / Next or numbered pages) and sends `page` and `limit` query params. The total number of pages is derived from the `pages` field in the response.

---

## Deliverables & Submission

| File | Content |
|---|---|
| `info.txt` | Your Name, Roll No, Institute Mail ID, Phone No, Discord Username |
| `demo.txt` | A shareable link to a screen recording showing the full workflow |
| `README.md` | Language and framework chosen, steps to install dependencies, steps to run the server, steps to run the frontend, how to access the seed admin account, any bonus features implemented |

Your screen recording must demonstrate:

1. Registering a new customer account and logging in.
2. Creating a new ticket and seeing it appear in the customer's dashboard.
3. Sending a message on the ticket as a customer.
4. Logging out and logging in as the seed admin account (`admin@support.com`).
5. Viewing the Admin Dashboard with live KPI cards and charts populated from MongoDB data.
6. Filtering the global ticket table by status and seeing the rows update reactively.
7. Opening a ticket as admin, changing its status to `"In Progress"`, and sending a reply in the chat thread.
8. **Refreshing the page** and confirming that all data is intact — this is the key proof that MongoDB is the source of truth and `localStorage` is no longer used for ticket data.

---

## What Success Looks Like

A complete Week 2 submission is an application where:

- **All ticket data lives in MongoDB.** Clearing the browser's `localStorage` and refreshing the page loses nothing. The data survives.
- **JWT authentication gates every API call.** Opening the browser console and manually calling a protected route without a token returns `401`.
- **Role is enforced on the server.** A customer account cannot hit `/api/admin/stats` even via a manual `fetch()` from the DevTools console — it returns `403`.
- **Chat polling keeps the thread live.** Opening the same ticket in two browser tabs and sending a message from one will appear in the other within ~4 seconds, without either tab doing a full page reload.
- **Admin Dashboard stats are server-computed.** The KPI values and chart data come from MongoDB aggregation results, not from JavaScript array operations on the frontend.
- **The app is resilient.** A slow API response, an empty database, a failed poll request, or an expired token does not cause an unhandled crash or a blank white screen.
- **The README is complete.** A reviewer with no prior context can clone the repository, follow the README, and have the full-stack app running locally within five minutes.
