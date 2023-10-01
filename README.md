# Video Upload and Transcription API

This API allows users to upload videos, store them in disk and store the filepaths to a database, transcribe the videos, and retrieve video and transcription data.


## Deployed Host

**url:** `https://chrome-extension-backend-w4r6.onrender.com`
## Endpoints

### Upload a Video

- **Endpoint:** `POST /extension/`
- **Description:** Upload a video file to the server.
- **Request Body:** A video file with the name "video." and file type "type."
- **Response:** Returns a JSON object with a success message if the upload and transcription are successful, or an error message if any step fails.

### Get All Videos

- **Endpoint:** `GET /extension/`
- **Description:** Retrieve a list of all uploaded video names from the database.
- **Response:** Returns a JSON object containing an array of video names.

### Get a Specific Video

- **Endpoint:** `GET /extension/:filename`
- **Description:** Retrieve a specific video file by its filename.
- **Parameters:**
  - `filename` (string): The name of the video file to retrieve.
- **Response:** Streams the requested video file to the client if found. Returns an error if the file does not exist.

### Get Transcription of a Video

- **Endpoint:** `GET /extension/transcript/:filename`
- **Description:** Retrieve the transcription of a specific video from the Supabase database.
- **Parameters:**
  - `filename` (string): The name of the video file to retrieve the transcription for.
- **Response:** Returns a JSON object containing the transcription data if available.

## Usage

1. Start the server.
2. Use appropriate HTTP client (e.g., Postman or cURL) to interact with the API endpoints.

## Dependencies

- Express.js: Web application framework.
- Multer: Middleware for handling file uploads.
- Supabase: Database service for storing video metadata and transcriptions.
- Deepgram: A service or library for video transcription (not provided in this code).

## Configuration

Before running the API, make sure to configure your Supabase database credentials and the transcription service. You may need to set environment variables or provide configuration details as needed.

## Error Handling

The API provides error responses with detailed error messages for various scenarios. Be sure to handle these errors in your client applications.

