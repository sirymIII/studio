# AI Flows (Genkit) Documentation

The intelligent features in TourNaija are powered by **Genkit**, Google's framework for building production-ready AI applications. This document details each of the AI flows defined in the `src/ai/flows/` directory.

## What is a Genkit Flow?

A Genkit flow is a server-side function that orchestrates steps in an AI-powered workflow. This often involves:
1.  Receiving input from the client.
2.  Constructing a detailed prompt for a Large Language Model (LLM) like Gemini.
3.  Calling the LLM and requesting a structured (JSON) response.
4.  Returning the structured data to the client.

All flows use **Zod** to define strict input and output schemas, ensuring type safety and reliable data structures.

---

### 1. Personalized Destination Recommendations

-   **File**: `src/ai/flows/personalized-destination-recommendations.ts`
-   **Function**: `personalizedDestinationRecommendations()`
-   **Purpose**: Provides personalized travel destination suggestions based on user preferences.

#### Input (`PersonalizedDestinationRecommendationsInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `city` | `string` | The user's city of origin. |
| `budget` | `string` | The user's budget (`low`, `medium`, `high`). |
| `preferences` | `string[]` | (Optional) A list of interests (e.g., "history", "nature"). |

#### Output (`PersonalizedDestinationRecommendationsOutput`)
Returns an object containing:
- `recommendations`: An array of destination objects, each with `destinationName`, `state`, `description`, `cityTown`, location coordinates, and `popularityRank`.
- `recommendationSummary`: A friendly, one-sentence summary of the results.

---

### 2. AI Itinerary Planner

-   **File**: `src/ai/flows/ai-itinerary-planner.ts`
-   **Function**: `aiItineraryPlanner()`
-   **Purpose**: Creates a detailed, day-by-day travel itinerary for a given destination.

#### Input (`AIItineraryPlannerInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `destination` | `string` | The city or region the user wants an itinerary for. |
| `durationDays` | `number` | The length of the trip in days. |
| `interests` | `string[]` | A list of interests to tailor the plan. |

#### Output (`AIItineraryPlannerOutput`)
Returns an object containing:
- `itineraryTitle`: A catchy title for the plan.
- `dailyPlans`: An array of objects, where each object represents a day with a `theme` and a list of `activities` (including time, name, and description).
- `summary`: A brief, encouraging summary of the trip.

---

### 3. Smart Route Planning

-   **File**: `src/ai/flows/ai-route-planning.ts`
-   **Function**: `aiRoutePlanning()`
-   **Purpose**: Finds the best transportation routes between an origin and a destination.

#### Input (`AIRoutePlanningInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `origin` | `string` | The starting point of the journey. |
| `destination` | `string` | The end point of the journey. |
| `budget` | `number` | (Optional) The maximum budget in Naira. |
| `transportModes`| `string[]` | (Optional) Preferred modes (e.g., "bus", "flight"). |

#### Output (`AIRoutePlanningOutput`)
Returns an object containing:
- `routes`: An array of route objects. Each route includes `mode`, `provider`, `durationMinutes`, `priceEstimate`, `schedule`, and contact details.

---

### 4. Interactive AI Travel Chatbot

-   **File**: `src/ai/flows/interactive-ai-travel-chatbot.ts`
-   **Function**: `interactiveAITravelChatbot()`
-   **Purpose**: Provides answers to user questions about tourism in Nigeria.

#### Input (`InteractiveAITravelChatbotInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `query` | `string` | The user's question. |
| `destinationContext` | `string` | (Optional) The name of the destination the user is currently viewing, to provide context-aware answers. |

#### Output (`InteractiveAITravelChatbotOutput`)
Returns an object containing:
- `response`: A string with the chatbot's answer.

---

### 5. Hotel Search

-   **File**: `src/ai/flows/hotel-search.ts`
-   **Function**: `searchHotelsFlow()`
-   **Purpose**: Suggests hotels based on a user's natural language query.

#### Input (`HotelSearchInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `query` | `string` | The user's query (e.g., "Find hotels in Lagos"). |

#### Output (`HotelSearchOutput`)
Returns an object containing:
- `hotels`: An array of hotel objects, each with `hotelName`, `location`, and a `description`.
- `searchSummary`: A one-sentence summary of the results.

---

### 6. Hotel Booking Agent

-   **File**: `src/ai/flows/hotel-booking.ts`
-   **Function**: `hotelBookingAgent()`
-   **Purpose**: An agent that assists users in booking a hotel room by collecting necessary details and calling a booking tool.

#### Input (`HotelBookingInput`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `hotelName` | `string` | The name of the hotel to be booked. |
| `query` | `string` | The user's latest message. |
| `chatHistory` | `string` | (Optional) The conversation history so far. |

#### Output (`HotelBookingOutput`)
Returns an object containing:
- `responseText`: The agent's response, which could be a request for more information (e.g., name/email) or a summary of the booking status.
- `bookingConfirmation`: (Optional) An object with booking details (`success`, `confirmationId`) if the booking was completed.

This flow is a great example of **tool use** in Genkit, where the LLM can decide to call the `bookHotel` tool once it has gathered enough information from the user.
