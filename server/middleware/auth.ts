import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.path === '/login' || event.path === '/api/auth/login') {
    return;
  }
  const session = await getUserSession(event);
  const isAuthenticated = Boolean(session?.user);
  if (!isAuthenticated) {
    return sendRedirect(event, '/login');
  }
});