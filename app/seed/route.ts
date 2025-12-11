import postgres from 'postgres';
import { customers, invoices, revenue, users } from '@/app/lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        image_url TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        customer_id TEXT REFERENCES customers(id),
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        date DATE NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month TEXT PRIMARY KEY,
        revenue INTEGER NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      );
    `;

    // Insert customers
    for (const c of customers) {
      await sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Insert invoices
    for (const inv of invoices) {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${inv.customer_id}, ${inv.amount}, ${inv.status}, ${inv.date});
      `;
    }

    // Insert revenue
    for (const r of revenue) {
      await sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${r.month}, ${r.revenue})
        ON CONFLICT (month) DO NOTHING;
      `;
    }

    // Insert users
    for (const u of users) {
      await sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${u.id}, ${u.name}, ${u.email}, ${u.password})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}