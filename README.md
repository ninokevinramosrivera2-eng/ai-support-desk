# 🎫 AI Support Desk

AI Support Desk is an AI-powered customer support backend built with **Python, FastAPI, SQLAlchemy, JWT authentication, and OpenAI**.

The application allows authenticated users to create and manage support tickets and uses AI to automatically analyze customer issues, classify them, estimate urgency and sentiment, summarize the problem, and generate a suggested support response.

## 🚀 Features

- User registration
- JWT authentication
- Protected API endpoints
- User profile endpoint
- Create support tickets
- List user tickets
- Retrieve individual tickets
- Update tickets
- Delete tickets
- Ticket ownership protection
- AI-generated customer support responses
- AI ticket classification
- AI urgency detection
- AI sentiment analysis
- AI ticket summarization
- Interactive Swagger API documentation

## 🤖 AI Ticket Analysis

AI Support Desk can analyze a support ticket and return structured information such as:

```json
{
  "ticket_id": 1,
  "category": "account_access",
  "urgency": "high",
  "summary": "The customer cannot access their account.",
  "sentiment": "frustrated",
  "suggested_response": "Hello, we're sorry you're having trouble accessing your account..."
}
```

This allows a support team to quickly understand incoming requests and prepare appropriate responses.

## 🛠 Tech Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

**Authentication**
- JWT
- Password hashing
- Protected routes

**Artificial Intelligence**
- OpenAI API

**Database**
- SQLite for local development
- SQLAlchemy ORM

**API Documentation**
- Swagger UI / OpenAPI

## 📁 Project Structure

```text
backend/
│
├── app/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── services/
│
├── .env.example
├── .gitignore
├── main.py
├── requirements.txt
└── README.md
```

## 🔐 Environment Variables

Create an environment variable named:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Never commit your real API key to GitHub.

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd ai-support-desk
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your OpenAI API key and start the development server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

## 📡 Main API Endpoints

### Authentication

```text
POST /users/register
POST /auth/login
GET  /users/me
```

### Tickets

```text
GET    /tickets
POST   /tickets
GET    /tickets/{ticket_id}
PATCH  /tickets/{ticket_id}
DELETE /tickets/{ticket_id}
```

### AI

```text
POST /tickets/{ticket_id}/ai-response
POST /tickets/{ticket_id}/ai-analyze
```

## 🔒 Security

Protected routes require JWT authentication.

Users can only access tickets associated with their own account.

Sensitive configuration such as the OpenAI API key is excluded from version control.

## 💡 Example Use Case

A customer submits:

> I can't access my account. Every time I try to log in, I receive an error.

AI Support Desk can automatically identify the issue category, determine its urgency, summarize the request, detect customer sentiment, and generate a suggested response for a support agent.

## 🗺 Roadmap

- React dashboard
- Ticket management interface
- AI analysis panel
- PostgreSQL production database
- Automated tests
- Docker support
- Cloud deployment

## 👨‍💻 Author

**Kevin Rivera**

Backend & AI project developed as part of a software engineering portfolio focused on Python, APIs, backend development, and artificial intelligence.