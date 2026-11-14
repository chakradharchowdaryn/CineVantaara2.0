# CineVantaara — REST & WebSocket API Specification

Base URL: `http://localhost:8080/api`  
AI Recommendation Microservice Base URL: `http://localhost:8000`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new film creator profile with multiple selected roles.
- **Request Body:**
```json
{
  "name": "Christopher Nolan",
  "email": "nolan@syncopy.com",
  "password": "Password123!",
  "activeRole": "DIRECTOR",
  "roles": ["DIRECTOR", "WRITER"],
  "headline": "Auteur Filmmaker & Narrative Architect",
  "location": "London & Los Angeles",
  "experienceYears": 22,
  "skills": ["IMAX 70mm", "Nonlinear Storytelling", "Practical Effects"]
}
```
- **Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "7c9e6679-7425-40de-944b...",
  "tokenType": "Bearer",
  "userId": "user-director-1",
  "name": "Christopher Nolan",
  "email": "nolan@syncopy.com",
  "activeRole": "DIRECTOR",
  "roles": ["DIRECTOR", "WRITER"]
}
```

### `POST /api/auth/login`
Authenticates creator via email and password, issuing access & refresh tokens.

### `POST /api/auth/verify-otp`
Validates 6-digit email OTP for two-factor verification.

---

## 2. Talent Discovery Endpoints (`/api/talent`)

### `GET /api/talent`
Search and filter across all film disciplines.
- **Query Parameters:**
  - `search`: Full-text query on name, headline, location, or skills
  - `role`: Filter by profession (e.g. `ACTOR`, `CINEMATOGRAPHER`, `EDITOR`)
- **Response (200 OK):** Array of User objects with verified badges and ratings.

### `GET /api/talent/{id}`
Returns full public talent profile, verified film credits, awards, and gear list.

---

## 3. Opportunities & Recruitment (`/api/opportunities`)

### `GET /api/opportunities`
Fetches all open film opportunities, castings, and crew calls.

### `POST /api/opportunities`
*Authorized roles: Producer, Director*  
Publishes a new casting or crew requisition.

### `POST /api/opportunities/{id}/apply`
Submits an audition tape, pitch note, and verified profile credentials for an open role.

### `PATCH /api/opportunities/applications/{applicationId}/status?status=SHORTLISTED`
Advances applicant along the casting pipeline: `PENDING` -> `UNDER_REVIEW` -> `SHORTLISTED` -> `ACCEPTED` -> `REJECTED`.

---

## 4. Creative Collaborations (`/api/collaborations`)

### `POST /api/collaborations`
Direct project invitation to a specific film artist.

### `PATCH /api/collaborations/{id}/status?status=ACCEPTED`
Accepts or declines a creative collaboration offer.

---

## 5. AI Recommendation Microservice (FastAPI on Port 8000)

### `POST /recommend/talent`
Calculates real mathematical compatibility scores against project requirements.
- **Request:**
```json
{
  "requiredRole": "ACTOR",
  "requiredSkills": ["Method Acting", "Emotional Recall"],
  "minExperienceYears": 5,
  "requiredLanguages": ["English"],
  "projectLocation": "London",
  "isRemoteAllowed": false,
  "candidates": [...]
}
```
- **Response:** Ranked list with exact match percentage, matched skills, missing skills, and 5-factor breakdown.

---

## 6. Real-Time WebSockets (`/ws`)
- **Protocol:** STOMP over SockJS
- **Destination:** `/topic/messages/{conversationId}`
- **WebRTC Signaling:** `/topic/webrtc/signal/{room}` for SDP offers, answers, and ICE candidate exchanges.
