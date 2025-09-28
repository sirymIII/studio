# TourNaija - Your AI-Powered Guide to Nigeria

Welcome to TourNaija, an intelligent web application designed to make exploring the rich cultural and natural landscape of Nigeria easier than ever. Built with a modern tech stack including Next.js, Firebase, and Google's Genkit, this platform provides users with personalized travel recommendations, smart route planning, and seamless booking experiences.

![TourNaija Screenshot](https://storage.googleapis.com/studioprod-52636.appspot.com/project-wBHiVj5r2b2D49gXgC1j/screen-shots/tournaija-screenshot.png)

## ✨ Key Features

- **Destination Discovery**: Browse a curated list of Nigeria's most beautiful destinations.
- **AI-Powered Recommendations**: Get personalized travel suggestions based on your budget, interests, and origin city.
- **Smart Itinerary Planner**: Automatically generate detailed day-by-day travel plans for any destination.
- **Intelligent Route Finder**: Find the best multi-modal routes, with fare estimates and schedule data.
- **AI Chatbot**: Get instant answers to your travel questions with a context-aware AI assistant.
- **Hotel Search & Booking**: Find and book hotels with an AI-powered booking agent.
- **Admin Dashboard**: A comprehensive interface for managing destinations, hotels, and other site data.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/tournaija.git
cd tournaija
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Configure Environment Variables

This project requires a connection to Firebase for its backend services, including Authentication and Firestore.

1.  Create a `.env.local` file in the root of the project.
2.  Add your Firebase project's configuration keys to this file.

For detailed instructions on where to find these keys, see the [Configuration Guide](./docs/CONFIGURATION.md).

```env
# .env.local

# Firebase Public Client-Side Config
# Found in your Firebase project settings
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."

# Genkit/Google AI Config
# Found in Google AI Studio or GCP
GEMINI_API_KEY="..."

# Firebase Admin Server-Side Config (for seeding and server actions)
# A base64-encoded JSON service account key
FIREBASE_SERVICE_ACCOUNT_KEY="..."
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Architecture & Code Structure

Our project is built on a robust and scalable architecture. For a deep dive into the folder structure, component design, and AI integration, please see our [Architecture Documentation](./docs/ARCHITECTURE.md).

## 🤖 AI Flows

The core of TourNaija's intelligence lies in its Genkit-powered AI flows. To understand how they work, their inputs, and their outputs, read the [AI Flows Documentation](./docs/AI_FLOWS.md).

## 🤝 Contributing

We welcome contributions! If you'd like to help improve TourNaija, please read our [Contribution Guide](./CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
