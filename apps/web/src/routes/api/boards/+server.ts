import { db } from '$lib/server/db';
import { boards } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const projectId = url.searchParams.get('projectId');

  const result = projectId
    ? await db.select().from(boards).where(eq(boards.projectId, projectId)).orderBy(boards.createdAt)
    : await db.select().from(boards).orderBy(boards.createdAt);

  return json(result);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const { name, projectId } = await request.json();

  const [board] = await db.insert(boards).values({ name, projectId }).returning();

  return json(board, { status: 201 });
};
