import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.path === '/login') {
    return;
  }
  const session = await getUserSession(event);
  const isAuthenticated = Boolean(session?.user);
  if (!isAuthenticated) {
    return sendRedirect(event, '/login');
  }
});