# Configuration & Environment Variables

Proper configuration is essential for connecting the TourNaija application to its required backend services, primarily Firebase and Google AI. This guide explains the necessary environment variables.

## Environment File

You should create a file named `.env.local` in the root directory of the project. This file is ignored by Git and is the correct place to store secret keys and project-specific identifiers.

**Do not commit `.env.local` to version control.**

## Required Variables

Below is a template for your `.env.local` file. Each variable is explained in the sections that follow.

```env
# .env.local

# Firebase Public Client-Side Config
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""

# Genkit/Google AI Config
GEMINI_API_KEY=""

# Firebase Admin Server-Side Config
# This is a base64-encoded JSON service account key
FIREBASE_SERVICE_ACCOUNT_KEY=""
```

### 1. Firebase Client-Side Configuration

These variables are prefixed with `NEXT_PUBLIC_` because they are needed on the client-side and are safely exposed to the browser. They allow the Firebase client SDK to connect to your project.

-   **Finding Your Firebase Config:**
    1.  Go to the [Firebase Console](https://console.firebase.google.com/).
    2.  Select your project.
    3.  Click the gear icon next to "Project Overview" and select **Project settings**.
    4.  In the "Your apps" card, select your web app.
    5.  Under "Firebase SDK snippet," choose the **Config** option.
    6.  You will find an object with keys like `apiKey`, `authDomain`, `projectId`, and `appId`. Copy these values into your `.env.local` file.

### 2. Google AI (Gemini) API Key

This key is required for Genkit to make calls to the Google Gemini models, which power all the AI features.

-   `GEMINI_API_KEY`: Your API key for the Google AI platform.
    -   **Finding Your Gemini API Key:**
        1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
        2.  Click "**Create API key**" to generate a new key.
        3.  Copy the generated key and paste it as the value for `GEMINI_API_KEY`.

### 3. Firebase Admin Server-Side Configuration

This variable is used by the Firebase Admin SDK for privileged server-side operations, such as managing users or seeding data. It should **never** be exposed to the client.

-   `FIREBASE_SERVICE_ACCOUNT_KEY`: A **base64-encoded** JSON string containing your service account credentials.

    -   **Generating the Service Account Key:**
        1.  In the Firebase Console, go to **Project settings**.
        2.  Navigate to the **Service accounts** tab.
        3.  Click "**Generate new private key**."
        4.  A JSON file will be downloaded to your computer.

    -   **Encoding and Adding to `.env.local`:**
        1.  Open the downloaded JSON file.
        2.  Copy the entire content of the file.
        3.  You need to encode this JSON content into a single-line base64 string. You can use an online tool or a command-line utility:

            ```bash
            # On macOS
            cat /path/to/your-service-account-file.json | base64

            # On Linux
            cat /path/to/your-service-account-file.json | base64 -w 0
            ```

        4.  Copy the resulting base64 string and paste it as the value for `FIREBASE_SERVICE_ACCOUNT_KEY` in your `.env.local` file.
