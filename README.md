# Interest Tracker

A SvelteKit application for tracking interests with a Turso database backend.

## Setup Instructions

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Turso account at [https://turso.tech](https://turso.tech)

3. Create a database:
   ```bash
   turso db create your-database-name
   ```

4. Get your database credentials:
   ```bash
   turso db show your-database-name --url
   turso db show your-database-name --auth-token
   ```

5. Create a `.env` file in the root directory with your Turso credentials:
   ```
   TURSO_DATABASE_URL=your-database-url
   TURSO_AUTH_TOKEN=your-auth-token
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:
```
TURSO_DATABASE_URL=your_turso_database_url_here
TURSO_AUTH_TOKEN=your_turso_auth_token_here
```

You can use the `.env.example` file as a template.

### Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Create a new project in Vercel and connect it to your repository

3. In your Vercel project settings, add the following environment variables:
   - `TURSO_DATABASE_URL` - Your Turso database URL
   - `TURSO_AUTH_TOKEN` - Your Turso authentication token

4. Deploy your project

## Database Schema

The application uses a single table called `interests` with the following schema:

```sql
CREATE TABLE IF NOT EXISTS interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  textbox1 TEXT,
  textbox2 TEXT,
  textbox3 REAL,
  textbox4 REAL,
  textbox5 TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

- `GET /api/interests` - Get all interests with summary data
- `POST /api/interests` - Create a new interest
- `GET /api/interests/[id]` - Get a specific interest by ID
- `PUT /api/interests/[id]` - Update a specific interest by ID
- `DELETE /api/interests/[id]` - Delete a specific interest by ID

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify your `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables are set correctly
2. Ensure your Turso database is active and accessible
3. Check that your auth token has not expired
4. Make sure you're using the correct database URL format (should start with `libsql://`)

### Common Error Messages

- `LibsqlError: SERVER_ERROR: Server returned HTTP status 401` - Invalid authentication token
- `LibsqlError: SERVER_ERROR: Server returned HTTP status 404` - Database not found

### Production Data Not Showing

If data is not showing in production:

1. Ensure you have set the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables in your Vercel project settings
2. Check the Vercel deployment logs for any database connection errors
3. Verify that your Turso database is accessible from the Vercel environment
