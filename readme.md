# Zon API

**Zon API** is a Node.js Express project designed to manage REST APIs for the assessment. It leverages Prisma ORM to interact with a PostgreSQL database.

## Technical Details

This project is built primarily using TypeScript, Node.js, Prisma, and PostgreSQL.

## Project Structure

At the root level, you'll find two main folders: "Prisma" and "src". 
- In the "prisma/schema.prisma" file, you'll discover all the defined database models. Additionally, we maintain migration records for any structural changes to the database.
- Within the "src" folder, you'll find subfolders for routes, controllers, and models. These components serve the Express routes. The model class acts as middleware, handling HTTP errors.

## Requirements

1. Configure a PostgreSQL database using Docker and `docker-compose.yml`, along with Prisma. Run `docker-compose up` in the terminal.
2. When modifying the Prisma model, execute `npx prisma migrate dev` to maintain migration records for database changes.

## Getting Started

To get started:

1. Clone the Zon API repository.
2. Run `npm install`.
3. Create a `.env` file and add the database URL:

```
DATABASE_URL="postgresql://postgres@localhost:5432/Zon"
```

**Database user:** postgres  
**Database name:** Zon

4. Execute `npm run dev` to run the Node.js Express server on port 3999.
