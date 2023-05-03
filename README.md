# Honeycrisp

An application to split bills between friends.

## Running locally

### Backend

Create your own `.env.local` file like the provided `.env.local.example` file.

```bash
# Install dependencies
npm install

# (optional) Seed the database
npm run seed

# Run the server
npm run dev
```

Server should be live on `localhost:3001`.

### Frontend

Create your own `.env` file like the provided `.env.example` file.

When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site and the `BASE_URL` environment variable to the URL of the backend server.

```bash
# Install dependencies
npm install

# Run the server
npm run dev
```

Server should be live on `localhost:3000`.
