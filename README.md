CollabBoard

A real-time collaborative project management platform inspired by Trello and Discord, built with a modern TypeScript-first stack. CollabBoard enables teams to organize work using Kanban boards while communicating through integrated real-time messaging. The application is designed around scalable event-driven architecture, optimistic UI updates, and WebSocket synchronization.

⸻

Features

Real-Time Collaboration

* Live board collaboration using WebSockets
* Real-time Kanban updates across connected clients
* Instant card creation, editing, deletion, and movement
* Live column management
* Real-time board invitations
* Live friend requests and notifications
* Presence-aware board subscriptions

Kanban Board Management

* Create and manage multiple boards
* Drag-and-drop workflow using dnd-kit
* Custom board columns
* Rich task cards
* Task descriptions
* Due dates
* Task assignment
* Progress tracking
* Board member management

Messaging

* Direct messaging
* Group conversations linked to boards
* Real-time message delivery
* Message reactions
* File attachments
* Read receipts
* Conversation search

Authentication & Security

* JWT authentication
* Refresh token rotation
* Secure HTTP-only cookies
* Token blacklist on logout
* Protected routes
* Automatic session restoration

Activity Centre

* Friend requests
* Board invitations
* Live activity updates
* Accept/decline workflows

⸻

System Architecture

The application follows a client-server architecture with real-time event synchronization.

                    ┌──────────────────────┐
                    │      React App       │
                    │                      │
                    │ React Router         │
                    │ Zustand              │
                    │ Mantine UI           │
                    └──────────┬───────────┘
                               │
                 REST API       │       WebSocket
                               │
         ┌─────────────────────▼────────────────────┐
         │             Express Backend              │
         │                                          │
         │ Authentication                           │
         │ Prisma ORM                              │
         │ REST Controllers                         │
         │ WebSocket Event Handlers                 │
         └──────────────┬───────────────┬───────────┘
                        │               │
                  PostgreSQL        Redis
                        │               │
                        │         Pub/Sub
                        │         Presence
                        │
                   Persistent Data

⸻

Technology Stack

Frontend

* React
* TypeScript
* React Router v7
* Zustand
* Mantine UI
* dnd-kit
* react-use-websocket

Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Redis
* WebSocket API

⸻

Real-Time Architecture

CollabBoard separates persistence from real-time communication.

1. Client performs an action.
2. REST endpoint validates the request.
3. Database is updated through Prisma.
4. Server publishes an event.
5. Redis distributes the event across all application instances.
6. Each instance forwards the event only to clients currently subscribed to that board.
7. Clients update their local Zustand store.

This design allows multiple backend instances to remain synchronized while minimizing unnecessary WebSocket traffic.

⸻

Optimistic Updates

Board interactions use optimistic UI updates.

The client immediately updates local application state before waiting for the server response, creating a responsive user experience. Once the server confirms the operation, WebSocket events reconcile every connected client with the authoritative server state.

⸻

Presence System

Users automatically join and leave board rooms as they navigate the application.

Each backend instance maintains in-memory board subscriptions for connected WebSocket clients while Redis coordinates presence information across multiple servers. This ensures that only users actively viewing a board receive its updates.

⸻

State Management

Global application state is managed with Zustand.

Stores include:

* Authentication
* Boards
* Columns
* Messages
* Conversations
* Activity Centre

This enables instant synchronization between WebSocket events and the user interface without excessive prop drilling.

⸻

Project Structure

frontend/
│
├── api/
├── components/
├── context/
├── hooks/
├── loaders/
├── actions/
├── routes/
├── types/
├── utilities/
└── zustand/
backend/
│
├── controllers/
├── middleware/
├── prisma/
├── redis/
├── routes/
├── websocket/
├── utilities/
└── generated/

⸻

Database

The application uses PostgreSQL with Prisma ORM.

Primary entities include:

* Users
* Friends
* Boards
* Board Members
* Columns
* Cards
* Conversations
* Messages
* Attachments
* Notifications

Relationships are enforced through Prisma schema definitions with transactional updates where consistency is required.

⸻

Highlights

* Event-driven real-time architecture
* Optimistic UI updates
* Redis Pub/Sub synchronization
* Scalable WebSocket design
* JWT authentication with refresh tokens
* Transactional database operations using Prisma
* Type-safe frontend and backend
* Responsive UI built with Mantine
* Drag-and-drop Kanban workflow
* Integrated messaging platform
* Activity notification centre

⸻

Future Improvements

* Board comments
* Rich text editor for cards
* Message threading
* Offline support
* Push notifications
* Board templates
* Audit history
* Search indexing
* Role-based permissions
* Docker and Kubernetes deployment

⸻

Getting Started

Clone the repository

git clone <repository-url>
cd collabboard

Backend

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev

Frontend

cd frontend
npm install
npm run dev

⸻

Environment Variables

Backend

DATABASE_URL=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
REDIS_URL=
PORT=
CLIENT_URL=

Frontend

VITE_BASE_URL=
VITE_WS_URL=

⸻

License

This project is intended for educational and portfolio purposes.
