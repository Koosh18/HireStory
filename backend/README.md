# Hire Story Backend (Express + MongoDB)

## Setup

1. Copy `.env.example` to `.env` and fill values:

```
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

2. Install dependencies and run dev server:

```
npm install
npm run dev
```

## API Endpoints

- POST `/auth/signup`
- POST `/auth/login`
- POST `/experiences` (auth)
- GET `/experiences?company=...&role=...`
- GET `/experiences/:id`


