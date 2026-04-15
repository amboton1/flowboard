import { db } from '$lib/server/db';
import { tickets } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const columnId = url.searchParams.get('columnId');

  const result = columnId
    ? await db.select().from(tickets).where(eq(tickets.columnId, columnId)).orderBy(tickets.position)
    : await db.select().from(tickets).orderBy(tickets.position);

  return json(result);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const { title, description, priority, status, position, columnId, assigneeId } =
    await request.json();

  const [ticket] = await db
    .insert(tickets)
    .values({ title, description, priority, status, position, columnId, assigneeId })
    .returning();

  return json(ticket, { status: 201 });
};
