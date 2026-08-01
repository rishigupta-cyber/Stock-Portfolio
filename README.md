# Stock Portfolio

Simple portfolio tracker built with Node, Express, EJS and MySQL.

## Setup

1. Install dependencies

   npm install

2. Make sure MySQL is running locally (XAMPP, MySQL Workbench, `mysqld`, whatever you normally use). You don't need to create the database or tables yourself — the app creates `stockportfolio` and all its tables automatically the first time it starts.

3. Open .env and set DB_USER / DB_PASSWORD to match your local MySQL login (default XAMPP setup is usually user `root` with an empty password, which is what's in there now).

4. Fill in the rest of .env (session secret, gmail address + app password for sending OTP emails).

5. Start the server

   npm start

   or for auto-reload while developing:

   npm run dev

6. Visit http://localhost:3000

## Notes

- OTP emails are sent through nodemailer using a Gmail app password, not your normal Gmail password. Generate one from your Google account security settings.
- Signup requires a verified OTP before the account is actually created — nothing is written to the DB until the code matches.
- Sessions are stored in MySQL too (a `sessions` table gets created automatically), so logins survive server restarts.
