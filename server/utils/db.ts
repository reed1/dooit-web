import pgPromise from 'pg-promise';

const db = pgPromise()({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function rawQuery(text: string, params?: any[]): Promise<any[]> {
  try {
    const res = await db.query(text, params);
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

export { db }