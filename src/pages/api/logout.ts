import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth', { path: '/' });
  cookies.delete('email', { path: '/' });
  cookies.delete('username', { path: '/' });
  cookies.delete('userId', { path: '/' });
  cookies.delete('isAdmin', { path: '/' });
  return redirect('/');
};
