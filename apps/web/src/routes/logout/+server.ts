import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (!locals.session) {
    return redirect(302, '/');
  }

  await lucia.invalidateSession(locals.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies.set(sessionCookie.name, sessionCookie.value, {
    path: '.',
    ...sessionCookie.attributes,
  });

  return redirect(302, '/');
};
