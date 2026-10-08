# Stock Portfolio Platform

A web-based stock portfolio management platform built with **Node.js, Express.js, EJS, and MySQL**.

The application allows users to create accounts, securely verify their identity through OTP-based email verification, manage their portfolio, and maintain portfolio-related data through a structured web application.

## Features

- User registration and login
- OTP-based email verification
- Session-based authentication
- MySQL-backed session management
- Stock portfolio management
- Structured MVC-style backend architecture
- Server-side rendering using EJS
- REST-style routes using Express.js
- Persistent data storage with MySQL

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | EJS, HTML, CSS, JavaScript |
| Database | MySQL |
| Authentication | Session-based authentication + OTP verification |
| Email | Nodemailer |
| Development | npm, Git, GitHub |

## Project Structure

```text
Stock-Portfolio/
├── config/
├── controllers/
├── middleware/
├── models/
├── public/
├── routes/
├── views/
├── app.js
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rishigupta-cyber/Stock-Portfolio.git
cd Stock-Portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MySQL

Make sure MySQL is running locally.

The application automatically creates the required database and tables when it starts.

### 4. Configure environment variables

Create a `.env` file based on `.env.example` and configure the required database, session, and email settings.

Do not commit your `.env` file or any credentials to GitHub.

### 5. Start the application

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

### 6. Open the application

Visit:

```text
http://localhost:3000
```

## Authentication

New users are required to verify their email address using an OTP before their account is created.

The application uses Nodemailer for sending verification emails and stores authenticated sessions in MySQL.

## Security

- Environment variables are used for sensitive configuration.
- Email verification is required during registration.
- Session data is stored server-side.
- Database credentials should remain outside the source code.

## Future Development

Planned improvements may include:

- Portfolio analytics and visualizations
- Improved stock data integration
- AI-assisted portfolio insights
- Risk and diversification analysis
- Production deployment
- Improved responsive user interface

## Author

**Rishi Gupta**

GitHub: https://github.com/rishigupta-cyber