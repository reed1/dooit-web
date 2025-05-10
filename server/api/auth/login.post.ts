import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';

const bodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = bodySchema.parse(body);

  const authUsername = process.env.AUTH_USERNAME;
  const authPassword = process.env.AUTH_PASSWORD;

  if (!authUsername || !authPassword) {
    throw createError({
      statusCode: 500,
      message: 'Authentication not properly configured'
    });
  }

  if (username === authUsername && password === authPassword) {
    await setUserSession(event, {
      user: { id: '1', username: authUsername },
    });
    return { success: true };
  }

  throw createError({
    statusCode: 401,
    message: 'Invalid credentials'
  });
});