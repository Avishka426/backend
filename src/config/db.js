import {neon} from "@neondatabase/serverless";
import "dotenv/config";

// backend/config/db.js
// This file sets up the database connection using Neon
export const sql = neon(process.env.DATABASE_URL);

export async function connectToDatabase() {
    try{

        await sql`DROP TABLE IF EXISTS users CASCADE`;
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

    await sql`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`

    await sql`CREATE TABLE IF NOT EXISTS test(
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT Null
    )`
        console.log("Database initialized.....")
    } catch (error) {
        console.error("Error initializing database", error);
        process.exit(1);
    }
}
