import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
  if (event.path === '/login') {
    return;
  }
  const isAuthenticated = getCookie(event, 'auth') === 'true';
  if (!isAuthenticated) {
    return sendRedirect(event, '/login');
  }
});