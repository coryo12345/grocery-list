# Grocery App

A grocery app that shares lists across a household.

## Setup

Make sure to install the dependencies:

```bash
bun install
```

## Env

Create a `.env` file based on the `.env_example` file.

## Migrate DB

Run DB migrations:

```bash
bun run db:migrate
```

This will create a local sqlite.db file.

## Create a household

You need to create a household to login. This is what you use to login.

```bash
bun run scripts/addHousehold <username> <password>
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```
