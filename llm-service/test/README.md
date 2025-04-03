# Song Recommendation API

A FastAPI application that generates song recommendations based on user prompts using Google's Gemini AI.

## Features

- Stream 10 song recommendations related to a user's text prompt
- Uses Google's Gemini AI model for intelligent recommendations
- Returns simplified data with just song title and artist
- Streaming response format for real-time feedback

## Project Structure

```
song-recommendation-api/
├── app/                    # Main application package
│   ├── api/                # API routes and endpoints
│   ├── core/               # Core functionality and configuration
│   ├── models/             # Pydantic data models
│   ├── prompts/            # LLM prompt templates
│   ├── services/           # Business logic and services
│   └── utils/              # Utility functions and helpers
├── main.py                 # Application entry point
└── requirements.txt        # Project dependencies
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python main.py
   ```

## API Endpoints

### GET /health
Health check endpoint.

### GET /docs
Access the Swagger UI documentation.

### POST /generate/
Stream song recommendations based on a text prompt.

**Request Body:**
```json
{
  "message": "I'm feeling nostalgic about my childhood in the 90s"
}
```

**Streaming Response:**
```json
{
  "songs": [
    {
      "title": "Smells Like Teen Spirit",
      "artist": "Nirvana"
    },
    {
      "title": "Wonderwall",
      "artist": "Oasis"
    },
    ...
  ]
}
```

## Environment Variables

The application uses the following environment variable:
- `GOOGLE_API_KEY`: Google API key for accessing Gemini AI (default value set in config) 