export default defineEventHandler(async (event) => {
  if (
    event.path === '/login' ||
    event.path === '/api/auth/login' ||
    event.path === '/api/auth/logout' ||
    event.path === '/api/_auth/session'
  ) {
    return;
  }
  const session = await getUserSession(event);
  if (session?.user) {
    return;
  }
  if (event.path === '/') {
    return sendRedirect(event, '/login');
  }
  throw createError({
    statusCode: 401,
    message: 'Unauthorized'
  });
});