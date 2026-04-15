import { github, lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  avatar_url: string;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('github_oauth_state');

  if (!code || !state || !storedState || state !== storedState) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();

    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails: GitHubEmail[] = await emailsResponse.json();
      email = emails.find((e) => e.primary && e.verified)?.email ?? null;
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.githubId, String(githubUser.id)),
    });

    const userId = existingUser
      ? existingUser.id
      : (
          await db
            .insert(users)
            .values({
              githubId: String(githubUser.id),
              username: githubUser.login,
              email,
              avatarUrl: githubUser.avatar_url,
            })
            .returning({ id: users.id })
        )[0].id;

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response('OAuth error', { status: 400 });
    }
    console.error(e);
    return new Response('Internal server error', { status: 500 });
  }

  return redirect(302, '/dashboard');
};
