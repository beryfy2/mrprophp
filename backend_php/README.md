# PHP Backend for Beryfy

This is the PHP version of the backend API, replacing the Node.js version.

## Prerequisites

- PHP 8.0 or higher
- MySQL Database
- Composer (optional, for dependencies if needed later, but currently pure PHP)

## Setup

1. **Database Setup**
   - Create a MySQL database (e.g., `mrpro`).
   - Import `database.sql` to create the tables.
   - Update `config/db.php` with your database credentials (or use `.env` if we added env loading, check `lib/env_loader.php`).

2. **Environment Variables**
   - Copy `.env.example` to `.env` (if exists) or create `.env` in `backend_php` root.
   - Set `MONGODB_URI` is not needed anymore.
   - Set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` for MySQL.
   - Set `JWT_SECRET`, `ADMIN_EMAIL`, `SMTP_HOST` etc.

3. **Running the Server**
   - You can use the built-in PHP server for development.
   - Run `run_server.bat` (Windows) or:
     ```bash
     php -S localhost:8000 api/index.php
     ```

## API Structure

- `api/index.php`: Main router entry point.
- `api/*.php`: Controllers for different resources.
- `config/`: Configuration files.
- `lib/`: Helper libraries (Auth, Env).
- `uploads/`: Directory for file uploads.

## Frontend Integration

The frontend and admin panels are configured to point to `http://localhost:8000/api`.
Ensure this server is running on port 8000.
