# Architecture & Code Structure

This document provides a high-level overview of the TourNaija project's architecture, directory structure, and key design principles. Our goal is to maintain a codebase that is scalable, maintainable, and easy for new contributors to understand.

## 1. Core Technologies

- **Framework**: [Next.js (App Router)](https://nextjs.org/docs/app) - For server-side rendering, routing, and a hybrid component model.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) - For a utility-first CSS framework and a set of beautifully designed, accessible components.
- **AI Integration**: [Google's Genkit](https://firebase.google.com/docs/genkit) - For orchestrating interactions with Large Language Models (LLMs) to power our intelligent features.
- **Backend & Database**: [Firebase](https://firebase.google.com/) - Provides Authentication, Firestore (NoSQL database), and serverless infrastructure for our AI flows.

## 2. Directory Structure

The project follows a standard Next.js App Router structure, with logical separation for different concerns.

```
/
├── src/
│   ├── app/                # Main application routes and pages
│   │   ├── (public)/       # Route group for public-facing pages
│   │   ├── admin/          # Routes for the admin dashboard
│   │   ├── api/            # API routes (if any)
│   │   └── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   │
│   ├── ai/                 # All Genkit AI-related code
│   │   ├── flows/          # Individual AI flows (e.g., recommendations, itinerary)
│   │   └── genkit.ts       # Genkit initialization and configuration
│   │
│   ├── components/         # Reusable React components
│   │   ├── ui/             # ShadCN UI components (Button, Card, etc.)
│   │   ├── admin/          # Components specific to the admin dashboard
│   │   └── header.tsx      # Site-wide header
│   │
│   ├── firebase/           # Firebase configuration and hooks
│   │   ├── client.ts       # Client-side Firebase initialization
│   │   ├── server.ts       # Server-side Firebase Admin SDK initialization
│   │   └── provider.tsx    # React context provider for Firebase services
│   │
│   ├── hooks/              # Custom React hooks
│   │
│   ├── lib/                # Shared utilities, types, and constants
│   │   ├── types.ts        # Core TypeScript types and Zod schemas
│   │   └── utils.ts        # Utility functions (e.g., `cn` for classnames)
│   │
│   └── services/           # Data fetching and business logic
│       ├── firestore.ts    # Hooks for interacting with Firestore (`useDestinations`)
│       └── booking.ts      # Simulated booking functions
│
├── public/                 # Static assets (images, fonts)
│
├── docs/                   # Project documentation
│
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 3. Architectural Patterns

### React Server Components (RSC) by Default

We leverage Next.js's App Router, which uses Server Components by default. This improves performance by reducing the amount of JavaScript sent to the client. Client-side interactivity is explicitly enabled with the `'use client';` directive.

- **Server Components**: Used for fetching data, accessing backend resources, and rendering static content (e.g., `src/app/destinations/[id]/page.tsx`).
- **Client Components**: Used for handling user interactions, state management, and lifecycle effects (e.g., forms, interactive AI chatbots).

### Genkit for AI Features

All AI-powered functionality is encapsulated within **Genkit flows**, located in `src/ai/flows/`.

- **Flows**: A flow is a server-side function that orchestrates one or more steps, including calls to an LLM. For example, `personalizedDestinationRecommendations` is a flow that takes user preferences and returns a list of destinations.
- **Input/Output Schemas**: Each flow uses Zod to define strongly-typed input and output schemas. This ensures data consistency and allows Genkit to generate structured JSON output from the LLM.
- **Prompts**: Prompts are defined using Handlebars syntax, making it easy to inject dynamic data into the instructions sent to the LLM.

### Firebase Integration

Firebase serves as the project's backend-as-a-service.

- **Authentication**: Firebase Auth handles user sign-up, sign-in, and session management. An admin role is managed via a custom claim or a separate Firestore collection.
- **Firestore**: Our NoSQL database stores all persistent data, such as destinations, hotels, and user profiles. The data structure is defined in `docs/backend.json`.
- **Client vs. Server**: We maintain separate initialization files for the client-side SDK (`firebase/client.ts`) and the server-side Admin SDK (`firebase/server.ts`) to ensure security and proper access control.

## 4. Data Flow Example: AI Destination Recommendation

To illustrate how these pieces fit together, here is the data flow for a user requesting a destination recommendation:

1.  **UI Interaction (`src/app/recommendations/page.tsx`)**: The user fills out a form (a Client Component) with their city, budget, and interests.
2.  **Server Action Call**: On submission, the form calls the `personalizedDestinationRecommendations` server action.
3.  **Genkit Flow Execution (`src/ai/flows/personalized-destination-recommendations.ts`)**:
    a. The server action invokes the Genkit flow with the user's input.
    b. The flow formats the input into a detailed prompt for the Gemini model.
    c. It calls the LLM, requesting a structured JSON output that matches the `PersonalizedDestinationRecommendationsOutputSchema`.
4.  **Response to UI**: The structured data is returned from the flow to the Client Component.
5.  **Render Results**: The component updates its state, rendering the `RecommendationResults` component with the AI-generated suggestions.
