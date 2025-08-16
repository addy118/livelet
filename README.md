# Livelet

A collaborative code editor & executor with real-time presence and access control.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://livelet.adityakirti.tech)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge)](https://github.com/addy118/livelet)

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Core Concepts](#architecture--core-concepts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Challenges Faced](#challenges-faced)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)

## The Problem

Online collaboration for code editing often lacks a web-based, lightweight, and real-time platform that provides granular access-level control for developers working in teams or in mentorship settings.

## The Solution

Livelet offers a seamless, real-time collaborative editor with integrated code execution and robust access management. It provides a dedicated, room-based environment for developers to code together effectively.

## Key Features

- **Real-time Collaborative Editing**: Built with Liveblocks and CodeMirror to provide a smooth, concurrent editing experience.
- **Multi-Language Code Execution**: Supports 5 major programming languages using the Judge0 API.
- **Robust Authentication**: Secure user authentication with social sign-ons (Google, GitHub) and email OTP verification for sensitive actions.
- **Access Level Control**: Room-based collaboration with user-specific permissions (e.g., read-only, edit).
- **Scalable Collaboration**: Capable of handling 10+ concurrent users per room without performance degradation.

## Tech Stack

| Frontend     | Backend    | Database   | Realtime   | Other   |
| :----------- | :--------- | :--------- | :--------- | :------ |
| Next.js      | Next.js    | PostgreSQL | Liveblocks | Auth.js |
| CodeMirror   | TypeScript | Prisma     | Yjs        | Resend  |
| ShadCN UI    |            |            |            | Vercel  |
| Tailwind CSS |            |            |            |         |
| TypeScript   |            |            |            |         |

## Architecture & Core Concepts

The application is built on a modern, serverless architecture designed for real-time performance and scalability.

- **High-Level Architecture**: An overview of the system's components and data flow.
  ![High Level Architecture](https://cdn.jsdelivr.net/gh/addy118/portfolio@master/public/seq-diagrams/livelet/llt-high-arch.svg)
- **Database Schema**: The ERD designed with Prisma for the PostgreSQL database.
  ![Database Schema](https://cdn.jsdelivr.net/gh/addy118/portfolio@master/public/schemas/livelet-erd.svg)

For a deeper dive into the core logic, explore these diagrams in the project repository:

- How the editor works in real-time?
- User authentication using Auth.js
- Collaborative room creation for coding
- Room access authorization using Liveblocks API

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- **Node.js** (v16 or newer)
- **npm** or **Yarn**
- **PostgreSQL** database

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/addy118/livelet.git
    cd livelet
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory and populate it with your credentials. Use the `env.example` file as a guide.

    ```env
    # General
    NODE_ENV="development"

    # Prisma / Database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Auth.js
    AUTH_SECRET="your_auth_secret" # Generate with: npx auth secret

    # OAuth Providers
    GITHUB_CLIENT_ID="your_gh_client_id"
    GITHUB_CLIENT_SECRET="your_gh_client_secret"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"

    # Email Service for OTP
    RESEND_API_KEY="your_resend_api_key"

    # Code Execution API
    NEXT_PUBLIC_JUDGE_API="your_judge0_api_key"
    ```

4.  **Run database migrations**:
    This command will sync your database schema.

    ```bash
    npx prisma generate --no-engine
    ```

5.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Challenges Faced

- Syncing the code document in real-time with live cursors for multiple users.
- Handling dynamic, per-room user roles with Liveblocks' authentication system.
- Maintaining a clean and performant UI for the code editor, including a dark mode.

## Future Scope

- **Voice Collaboration**: Add support for real-time voice chat within rooms.
- **Integrated Chat**: Implement a text-based chat section for room members.
- **AI Code Suggestions**: Integrate AI-powered code completion and suggestions.
- **Coding Competitions**: Add features for hosting and participating in coding contests.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major updates, please open an issue first to discuss the proposed change.
