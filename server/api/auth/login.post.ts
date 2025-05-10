import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  const authUsername = process.env.AUTH_USERNAME;
  const authPassword = process.env.AUTH_PASSWORD;

  if (!authUsername || !authPassword) {
    throw createError({
      statusCode: 500,
      message: 'Authentication not properly configured'
    });
  }

  if (username === authUsername && password === authPassword) {
    // Set a session cookie
    setCookie(event, 'auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { success: true };
  }

  throw createError({
    statusCode: 401,
    message: 'Invalid credentials'
  });
});